import type {GameState} from "../../core/types";
import {yearMonth} from "../../core/types";
import {validateGameState} from "../../core/validation";
import {sellFinishedEngines} from "../finance/finishedGoods";
import {estimateEngineMarket} from "./engineMarket";

/** Finalize a sale against the remaining fictional demand for the calendar month. */
export function sellEnginesIntoMarket(state:GameState,orderId:string,unitPriceYen:number,commandId:string):GameState{
 validateGameState(state);
 const lot=state.production?.finishedLots?.find(l=>l.orderId===orderId);
 if(!lot||lot.remainingQuantity<=0)throw new Error("Insufficient valued finished goods");
 const estimate=estimateEngineMarket(state,unitPriceYen,lot.remainingQuantity);
 if(estimate.sellable<=0)throw new Error("No remaining market demand at this price this month");
 const sold=sellFinishedEngines(state,orderId,estimate.sellable,unitPriceYen,commandId);
 const month=yearMonth(state.calendar);
 const current=state.marketSales??[];
 const previous=current.find(s=>s.month===month);
 const marketSales=previous?current.map(s=>s.month===month?{...s,quantity:s.quantity+estimate.sellable}:s):[...current,{month,quantity:estimate.sellable}];
 const result:GameState={...sold,marketSales};
 validateGameState(result);
 return result;
}
