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
  // Every physical unit must have a matching valued receipt; never mix free demo stock.
  for(const item of stock){
   const valued=state.production.costLots.filter(l=>l.partId===item.partId).reduce((n,l)=>n+l.quantity,0);
   if(!Number.isSafeInteger(valued)||valued!==item.quantity)throw new Error("Untracked material inventory provenance: "+item.partId);
  }
  for(const lot of state.production.costLots){
   if(!stock.some(item=>item.partId===lot.partId))throw new Error("Orphan material cost lot: "+lot.partId);
  }
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
  // Cost is first accumulated in WIP, then allocated to accepted engines or scrap.
  // Integer-yen rounding assigns the remainder to finished goods.
  const scrapValue=Math.floor(cost*inspection.rejected/quantity);
  const finishedValue=cost-scrapValue;
  if(!Number.isSafeInteger(scrapValue)||!Number.isSafeInteger(finishedValue))throw new RangeError("Production valuation overflow");
  const entries:JournalTransaction["entries"]=[
   {account:"workInProgress",debit:materialValue,credit:0},
   {account:"inventory",debit:0,credit:materialValue},
   ...(overhead>0?[{account:"workInProgress" as const,debit:overhead,credit:0},{account:"cash" as const,debit:0,credit:overhead}]:[]),
   ...(finishedValue>0?[{account:"finishedGoods" as const,debit:finishedValue,credit:0}]:[]),
   ...(scrapValue>0?[{account:"expense" as const,debit:scrapValue,credit:0}]:[]),
   {account:"workInProgress",debit:0,credit:cost}
  ];
  const journal:JournalTransaction={id:"factory:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Tracked engine production "+commandId,entries};
  const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
  const finishedLots=[...(state.production?.finishedLots??[]),...(inspection.accepted>0?[{orderId:commandId,programId:program.id,remainingQuantity:inspection.accepted,remainingCostYen:finishedValue}]:[])];
  result={...posted,production:{...state.production,materials:produced.stock,costLots:lots,finishedLots,completedOrders:[...(state.production?.completedOrders??[]),{orderId:commandId,programId:program.id,accepted:inspection.accepted,rejected:inspection.rejected,totalCostYen:cost}]}};
 }else{
  // Legacy demo stock was never paid for via procurement; preserve its existing accounting.
  const cashExpense=produced.costYen;
  if(financialSnapshot(state.journals,"player").cash<cashExpense)throw new Error("Insufficient cash");
  const journal:JournalTransaction={id:"factory:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Engine work order "+commandId,entries:[{account:"inventory",debit:cashExpense,credit:0},{account:"cash",debit:0,credit:cashExpense}]};
  const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
  result={...posted,production:{...state.production,materials:produced.stock,completedOrders:[...(state.production?.completedOrders??[]),{orderId:commandId,programId:program.id,accepted:inspection.accepted,rejected:inspection.rejected,totalCostYen:produced.costYen}]}};
 }
 validateGameState(result);
 return result;
}
