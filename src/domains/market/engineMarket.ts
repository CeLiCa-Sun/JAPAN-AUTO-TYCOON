import type {GameState} from "../../core/types";
import {yearMonth} from "../../core/types";

/** Stylized fictional engine market; not historical sales forecasts. */
export interface MarketEstimate {
 available:number;
 maxBuyers:number;
 soldThisMonth:number;
 remainingBuyers:number;
 rivalPriceYen:number;
 referencePriceYen:number;
 priceIndex:number;
 sellable:number;
 unsold:number;
 estimatedRevenueYen:number;
 status:"fictional-preview";
}
export const REFERENCE_PRICE_YEN=450000;

/** Demand falls with higher player price and with greater simulated competition. */
export function estimateEngineMarket(state:GameState,unitPriceYen:number,available:number):MarketEstimate{
 if(!Number.isSafeInteger(unitPriceYen)||unitPriceYen<1||!Number.isSafeInteger(available)||available<0)throw new RangeError("Invalid market input");
 const rivalPriceYen=REFERENCE_PRICE_YEN;
 const referencePriceYen=REFERENCE_PRICE_YEN;
 const yearFactor=Math.max(0.5,Math.min(3,(state.calendar.year-1950)/40+1));
 const priceIndex=unitPriceYen/referencePriceYen;
 const buyersAtReference=Math.floor(4*yearFactor);
 const maxBuyers=Math.max(0,Math.floor(buyersAtReference*Math.pow(referencePriceYen/unitPriceYen,1.5)));
 const soldThisMonth=state.marketSales?.find(s=>s.month===yearMonth(state.calendar))?.quantity??0;
 const remainingBuyers=Math.max(0,maxBuyers-soldThisMonth);
 const sellable=Math.min(available,remainingBuyers);
 const estimatedRevenueYen=sellable*unitPriceYen;
 if(!Number.isSafeInteger(estimatedRevenueYen))throw new RangeError("Market revenue overflow");
 return {available,maxBuyers,soldThisMonth,remainingBuyers,rivalPriceYen,referencePriceYen,priceIndex,sellable,unsold:available-sellable,estimatedRevenueYen,status:"fictional-preview"};
}
