import type {GameState,JournalTransaction} from "../../core/types";
import {yearMonth} from "../../core/types";
import {dispatch} from "../../core/reducer";
import {validateGameState} from "../../core/validation";
import {financialSnapshot} from "../finance/reports";
import type {EngineProgram} from "./program";
import {planEngineProduction,inspectWorkOrder,commitProduction,validatePrototypeForProduction,type PartSpec,type MaterialStock} from "./manufacturing";
/** Returns one immutable snapshot for inventory and journal; buyer-supplied raw materials must already be acquired. */
export function manufactureEngines(state:GameState,program:EngineProgram,commandId:string,quantity:number,bom:readonly PartSpec[],accepted:number,coolingKw:number,octane:number):GameState {
 validateGameState(state);
 if(!commandId.trim()||state.completedCommandIds.includes(commandId)||state.production?.completedOrders.some(o=>o.orderId===commandId))throw new Error("Duplicate/invalid production command");
 validatePrototypeForProduction(program,coolingKw,octane);
 const stock:MaterialStock[]=state.production?.materials??[];
 const plan=planEngineProduction(program,commandId,quantity,bom,stock);
 const inspection=inspectWorkOrder(plan,accepted,[]);
 const produced=commitProduction(plan,stock,inspection);
 const procured=state.journals.some(j=>j.id.startsWith("purchase:"));
 let result:GameState;
 if(procured){
  // Do not silently use free legacy stock as if purchased. FIFO based on verified receipts.
  if(!state.production?.costLots?.length)throw new Error("Procurement-to-production cost transfer requires inventory provenance");
  if(inspection.accepted===0)throw new Error("Rejected-only order requires scrap expense accounting");
  const lots=state.production.costLots.map(l=>({...l}));
  let materialValue=0;
  for(const req of plan.required){
   let remaining=req.quantity;
   for(const lot of lots){
    if(lot.partId!==req.partId||remaining===0)continue;
    const consumed=Math.min(lot.quantity,remaining);
    lot.quantity-=consumed;remaining-=consumed;
    materialValue+=consumed*lot.unitCostYen;
    if(!Number.isSafeInteger(materialValue))throw new RangeError("Material value overflow");
   }
   if(remaining!==0)throw new Error("Missing cost lot provenance: "+req.partId);
  }
  const overhead=plan.estimatedOverheadYen;
  const cost=materialValue+overhead;
  if(!Number.isSafeInteger(cost))throw new RangeError("Production cost overflow");
  if(financialSnapshot(state.journals,"player").cash<overhead)throw new Error("Insufficient cash");
  const journal:JournalTransaction={id:"factory:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Tracked engine production "+commandId,entries:[
   {account:"workInProgress",debit:materialValue,credit:0},
   {account:"inventory",debit:0,credit:materialValue},
   {account:"finishedGoods",debit:cost,credit:0},
   {account:"workInProgress",debit:0,credit:materialValue},
   {account:"cash",debit:0,credit:overhead}
  ]};
  const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
  result={...posted,production:{materials:produced.stock,costLots:lots,completedOrders:[...(state.production?.completedOrders??[]),{orderId:commandId,programId:program.id,accepted:inspection.accepted,rejected:inspection.rejected,totalCostYen:cost}]}};
 }else{
  // Legacy demo stock was never paid for via procurement; preserve its existing accounting.
  const cashExpense=produced.costYen;
  if(financialSnapshot(state.journals,"player").cash<cashExpense)throw new Error("Insufficient cash");
  const journal:JournalTransaction={id:"factory:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Engine work order "+commandId,entries:[{account:"inventory",debit:cashExpense,credit:0},{account:"cash",debit:0,credit:cashExpense}]};
  const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
  result={...posted,production:{materials:produced.stock,completedOrders:[...(state.production?.completedOrders??[]),{orderId:commandId,programId:program.id,accepted:inspection.accepted,rejected:inspection.rejected,totalCostYen:produced.costYen}]}};
 }
 validateGameState(result);
 return result;
}
