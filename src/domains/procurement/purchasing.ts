import type {GameState,JournalTransaction} from "../../core/types";
import {yearMonth} from "../../core/types";
import {validateGameState} from "../../core/validation";
import {dispatch} from "../../core/reducer";
export interface SupplierQuote {supplierId:string;partId:string;unitPriceYen:number;leadMonths:number;minimumOrderQuantity:number}
export interface PurchaseOrder {id:string;supplierId:string;partId:string;quantity:number;unitPriceYen:number;orderedYear:number;orderedMonth:number;dueYear:number;dueMonth:number}
const positive=(x:number)=>Number.isSafeInteger(x)&&x>0;
export function createPurchaseOrder(id:string,quote:SupplierQuote,quantity:number,year:number,month:number):PurchaseOrder{
 if(!id.trim()||!quote.supplierId.trim()||!quote.partId.trim()||!positive(quote.unitPriceYen)||!positive(quantity)||!positive(quote.minimumOrderQuantity)||quantity<quote.minimumOrderQuantity||!Number.isSafeInteger(quote.leadMonths)||quote.leadMonths<0||!Number.isSafeInteger(year)||year<1||!Number.isInteger(month)||month<1||month>12||!Number.isSafeInteger(quantity*quote.unitPriceYen))throw new RangeError("Invalid purchase order");
 const zero=year*12+(month-1)+quote.leadMonths;
 return {id,supplierId:quote.supplierId,partId:quote.partId,quantity,unitPriceYen:quote.unitPriceYen,orderedYear:year,orderedMonth:month,dueYear:Math.floor(zero/12),dueMonth:zero%12+1};
}
/** Receive physically inspected items on credit. Purchase orders are caller-managed and not persisted yet. */
export function receivePurchasedParts(state:GameState,order:PurchaseOrder,received:number,commandId:string):GameState{
 validateGameState(state);
 if(!commandId.trim()||state.completedCommandIds.includes(commandId)||state.journals.some(j=>j.id==="purchase:"+order.id))throw new Error("Duplicate receipt");
 if(!positive(received)||received!==order.quantity||!positive(order.unitPriceYen)||!Number.isSafeInteger(received*order.unitPriceYen))throw new RangeError("Invalid received quantity or cost");
 const current=state.calendar.year*12+state.calendar.month;
 const due=order.dueYear*12+order.dueMonth;
 if(current<due)throw new Error("Supplier delivery not yet due");
 const total=received*order.unitPriceYen;
 const journal:JournalTransaction={id:"purchase:"+order.id,companyId:"player",month:yearMonth(state.calendar),description:"Received inspected parts from "+order.supplierId,entries:[{account:"inventory",debit:total,credit:0},{account:"payable",debit:0,credit:total}]};
 const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
 const previous=posted.production?.materials??[];
 const old=previous.find(m=>m.partId===order.partId);
 const totalQuantity=(old?.quantity??0)+received;
 if(!Number.isSafeInteger(totalQuantity))throw new RangeError("Stock overflow");
 const materials=old?previous.map(m=>m.partId===order.partId?{...m,quantity:totalQuantity}:m):[...previous,{partId:order.partId,quantity:received}];
 const result:GameState={...posted,production:{materials,completedOrders:posted.production?.completedOrders??[]}};
 validateGameState(result);return result;
}
