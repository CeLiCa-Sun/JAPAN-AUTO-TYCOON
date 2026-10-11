import type {GameState,JournalTransaction} from "../../core/types";
import {yearMonth} from "../../core/types";
import {validateGameState} from "../../core/validation";
import {dispatch} from "../../core/reducer";

/** Sell accepted, valued engines; historical demo orders without a finished lot cannot be sold. */
export function sellFinishedEngines(state:GameState,orderId:string,quantity:number,unitPriceYen:number,commandId:string):GameState{
 validateGameState(state);
 if(!commandId.trim()||state.completedCommandIds.includes(commandId))throw new Error("Duplicate sale command");
 if(!orderId.trim()||!Number.isSafeInteger(quantity)||quantity<1||!Number.isSafeInteger(unitPriceYen)||unitPriceYen<1)throw new RangeError("Invalid sale");
 const lot=state.production?.finishedLots?.find(l=>l.orderId===orderId);
 if(!lot||lot.remainingQuantity<quantity)throw new Error("Insufficient valued finished goods");
 const revenue=quantity*unitPriceYen;
 const cost=quantity===lot.remainingQuantity?lot.remainingCostYen:Math.floor(lot.remainingCostYen*quantity/lot.remainingQuantity);
 if(!Number.isSafeInteger(revenue)||!Number.isSafeInteger(cost)||cost<=0)throw new RangeError("Invalid sale valuation");
 const journal:JournalTransaction={id:"sale:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Sold finished engines from "+orderId,entries:[
  {account:"cash",debit:revenue,credit:0},
  {account:"revenue",debit:0,credit:revenue},
  {account:"costOfGoodsSold",debit:cost,credit:0},
  {account:"finishedGoods",debit:0,credit:cost}
 ]};
 const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
 const finishedLots=state.production!.finishedLots!.map(l=>l.orderId===orderId?{...l,remainingQuantity:l.remainingQuantity-quantity,remainingCostYen:l.remainingCostYen-cost}:l);
 const result:GameState={...posted,production:{...state.production!,finishedLots}};
 validateGameState(result);return result;
}
