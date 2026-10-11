import type {GameState,JournalTransaction} from "../../core/types";
import {yearMonth} from "../../core/types";
import {dispatch} from "../../core/reducer";
import {financialSnapshot} from "../finance/reports";
import {type EngineProgram,estimateManufacturingCostYen,runEngineTrial} from "./program";
export interface EngineBatchResult {state:GameState;unitCostYen:number;totalCostYen:number;passed:boolean}
/** Prototype expense settlement, NOT inventory capitalization or full manufacturing accounting. */
export function settleEnginePrototype(state:GameState,program:EngineProgram,quantity:number,id:string,coolingKw:number,octane:number):EngineBatchResult{
 if(!id.trim()||!Number.isSafeInteger(quantity)||quantity<1)throw new RangeError("Invalid production command");
 const trial=runEngineTrial(program,coolingKw,octane);
 if(!trial.passed)throw new Error("Prototype test did not pass");
 const unitCostYen=estimateManufacturingCostYen(program,quantity);
 const totalCostYen=unitCostYen*quantity;
 if(!Number.isSafeInteger(totalCostYen))throw new RangeError("Production cost overflow");
 if(state.completedCommandIds.includes(id))throw new Error("Already settled: "+id);
 if(financialSnapshot(state.journals,"player").cash<totalCostYen)throw new Error("Insufficient cash");
 const month=yearMonth(state.calendar);
 const journal:JournalTransaction={id:"engine:"+id,companyId:"player",month,description:"Engine prototype manufacturing cost",entries:[{account:"expense",debit:totalCostYen,credit:0},{account:"cash",debit:0,credit:totalCostYen}]};
 const result=dispatch(state,{id,kind:"PostJournal",journal});
 return {state:result.state,unitCostYen,totalCostYen,passed:true};
}
