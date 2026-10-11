import type {GameState,JournalTransaction} from "../../core/types";
import {yearMonth} from "../../core/types";
import {dispatch} from "../../core/reducer";
import {validateGameState} from "../../core/validation";
import {financialSnapshot} from "../finance/reports";
import type {EngineProgram} from "./program";
import {planEngineProduction,inspectWorkOrder,commitProduction,validatePrototypeForProduction,type PartSpec,type MaterialStock} from "./manufacturing";
/** Returns all linked updates together; caller must save the returned GameState. */
export function manufactureEngines(state:GameState,program:EngineProgram,commandId:string,quantity:number,bom:readonly PartSpec[],accepted:number,coolingKw:number,octane:number):GameState {
 validateGameState(state);
 if(!commandId.trim()||state.completedCommandIds.includes(commandId)||state.production?.completedOrders.some(o=>o.orderId===commandId))throw new Error("Duplicate/invalid production command");
 validatePrototypeForProduction(program,coolingKw,octane);
 const stock:MaterialStock[]=state.production?.materials??[];
 const plan=planEngineProduction(program,commandId,quantity,bom,stock);
 const inspection=inspectWorkOrder(plan,accepted,[]);
 const produced=commitProduction(plan,stock,inspection);
 if(financialSnapshot(state.journals,"player").cash<produced.costYen)throw new Error("Insufficient cash");
 const journal:JournalTransaction={id:"factory:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Engine work order "+commandId,entries:[{account:"inventory",debit:produced.costYen,credit:0},{account:"cash",debit:0,credit:produced.costYen}]};
 const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
 const result:GameState={...posted,production:{materials:produced.stock,completedOrders:[...(state.production?.completedOrders??[]),{orderId:commandId,programId:program.id,accepted:inspection.accepted,rejected:inspection.rejected,totalCostYen:produced.costYen}]}};
 validateGameState(result);
 return result;
}
