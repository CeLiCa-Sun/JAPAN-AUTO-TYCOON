import type {GameState,JournalTransaction,PurchaseOrderRecord} from "../../core/types";
import {yearMonth} from "../../core/types";
import {validateGameState} from "../../core/validation";
import {dispatch} from "../../core/reducer";
import {financialSnapshot} from "../finance/reports";

export interface SupplierQuote {supplierId:string;partId:string;unitPriceYen:number;leadMonths:number;minimumOrderQuantity:number}
export type PurchaseOrder=Omit<PurchaseOrderRecord,"receivedQuantity">;
const positive=(n:number)=>Number.isSafeInteger(n)&&n>0;
const period=(year:number,month:number)=>year*12+month;

export function createPurchaseOrder(id:string,quote:SupplierQuote,quantity:number,year:number,month:number):PurchaseOrder{
 if(!id.trim()||!quote.supplierId.trim()||!quote.partId.trim()||!positive(quote.unitPriceYen)||!positive(quantity)||!positive(quote.minimumOrderQuantity)||quantity<quote.minimumOrderQuantity||!Number.isSafeInteger(quote.leadMonths)||quote.leadMonths<0||!Number.isSafeInteger(year)||year<1||!Number.isInteger(month)||month<1||month>12||!Number.isSafeInteger(quantity*quote.unitPriceYen))throw new RangeError("Invalid purchase order");
 const zero=year*12+(month-1)+quote.leadMonths;
 return {id,supplierId:quote.supplierId,partId:quote.partId,quantity,unitPriceYen:quote.unitPriceYen,orderedYear:year,orderedMonth:month,dueYear:Math.floor(zero/12),dueMonth:zero%12+1};
}

/** Register an unreceived supplier order inside the same versioned GameState saved by the game. */
export function placePurchaseOrder(state:GameState,order:PurchaseOrder,commandId:string):GameState{
 validateGameState(state);
 if(!commandId.trim()||state.completedCommandIds.includes(commandId)||state.production?.purchaseOrders?.some(p=>p.id===order.id))throw new Error("Duplicate/invalid purchase order");
 if(!positive(order.quantity)||!positive(order.unitPriceYen)||!Number.isSafeInteger(order.quantity*order.unitPriceYen)||!order.id.trim()||!order.supplierId.trim()||!order.partId.trim()||!Number.isSafeInteger(order.dueYear)||!Number.isInteger(order.dueMonth)||order.dueMonth<1||order.dueMonth>12)throw new RangeError("Invalid order");
 const result:GameState={...state,revision:state.revision+1,completedCommandIds:[...state.completedCommandIds,commandId],production:{
  materials:state.production?.materials??[],completedOrders:state.production?.completedOrders??[],
  ...state.production,purchaseOrders:[...(state.production?.purchaseOrders??[]),{...order,receivedQuantity:0}]
 }};
 validateGameState(result);return result;
}

/** Registered orders may be received in partial inspected batches; unregistered legacy orders remain full-only. */
export function receivePurchasedParts(state:GameState,order:PurchaseOrder,received:number,commandId:string):GameState{
 validateGameState(state);
 if(!commandId.trim()||state.completedCommandIds.includes(commandId))throw new Error("Duplicate receipt");
 const registered=state.production?.purchaseOrders?.find(p=>p.id===order.id);
 if(registered&&(["supplierId","partId","quantity","unitPriceYen","orderedYear","orderedMonth","dueYear","dueMonth"] as const).some(k=>registered[k]!==order[k]))throw new Error("Purchase order mismatch");
 if(!positive(received)||received>(registered?registered.quantity-registered.receivedQuantity:order.quantity)||(!registered&&received!==order.quantity)||!positive(order.unitPriceYen)||!Number.isSafeInteger(received*order.unitPriceYen))throw new RangeError("Invalid received quantity or cost");
 if(!registered&&state.journals.some(j=>j.id==="purchase:"+order.id))throw new Error("Duplicate receipt");
 if(period(state.calendar.year,state.calendar.month)<period(order.dueYear,order.dueMonth))throw new Error("Supplier delivery not yet due");
 const total=received*order.unitPriceYen;
 const journal:JournalTransaction={id:registered?"purchase:"+order.id+":"+commandId:"purchase:"+order.id,companyId:"player",month:yearMonth(state.calendar),description:"Received inspected parts from "+order.supplierId,entries:[{account:"inventory",debit:total,credit:0},{account:"payable",debit:0,credit:total}]};
 const previous=state.production?.materials??[];
 const old=previous.find(m=>m.partId===order.partId);
 const totalQuantity=(old?.quantity??0)+received;
 if(!Number.isSafeInteger(totalQuantity))throw new RangeError("Stock overflow");
 const posted=dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
 const materials=old?previous.map(m=>m.partId===order.partId?{...m,quantity:totalQuantity}:m):[...previous,{partId:order.partId,quantity:received}];
 const lots=state.production?.costLots??[];
 const newLot={receiptId:registered?order.id+":"+commandId:order.id,partId:order.partId,quantity:received,unitCostYen:order.unitPriceYen};
 const purchaseOrders=registered?state.production!.purchaseOrders!.map(p=>p.id===order.id?{...p,receivedQuantity:p.receivedQuantity+received}:p):state.production?.purchaseOrders;
 const result:GameState={...posted,production:{...state.production,materials,completedOrders:state.production?.completedOrders??[],costLots:[...lots,newLot],...(purchaseOrders?{purchaseOrders}:{})}};
 validateGameState(result);return result;
}

/** Clear an existing supplier payable using cash; no duplicate expense is created. */
export function paySupplier(state:GameState,amount:number,commandId:string):GameState{
 validateGameState(state);
 if(!positive(amount)||!commandId.trim()||state.completedCommandIds.includes(commandId))throw new Error("Invalid supplier payment");
 const balances=financialSnapshot(state.journals,"player");
 if(balances.payable<amount||balances.cash<amount)throw new Error("Insufficient payable or cash");
 const journal:JournalTransaction={id:"pay-supplier:"+commandId,companyId:"player",month:yearMonth(state.calendar),description:"Settle supplier payable",entries:[{account:"payable",debit:amount,credit:0},{account:"cash",debit:0,credit:amount}]};
 return dispatch(state,{id:commandId,kind:"PostJournal",journal}).state;
}
