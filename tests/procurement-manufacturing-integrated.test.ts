import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {createPurchaseOrder,placePurchaseOrder,receivePurchasedParts,paySupplier} from "../src/domains/procurement/purchasing";
import {sellFinishedEngines} from "../src/domains/finance/finishedGoods";
import {manufactureEngines} from "../src/domains/engine/persistentProduction";
import {financialSnapshot} from "../src/domains/finance/reports";
import {validateGameState} from "../src/core/validation";
const program={id:"p",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"block",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"piston",unitsPerEngine:4,unitCostYen:3000}];
function funded(){
 return dispatch(initialState(),{kind:"PostJournal",id:"capital",journal:{id:"capital-j",companyId:"player",month:"1950-01",description:"capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]}}).state;
}
describe("procure to finished goods with FIFO valuation",()=>{
 it("does not recognize materials twice and consumes exact cost lots",()=>{
  let state=funded();
  for(const [id,part,unitPrice,qty] of [["a","block",18000,2],["b","piston",2500,8]] as const){
   const po=createPurchaseOrder(id,{supplierId:"s",partId:part,unitPriceYen:unitPrice,leadMonths:0,minimumOrderQuantity:1},qty,1950,1);
   state=receivePurchasedParts(state,po,qty,"recv-"+id);
  }
  const initial=financialSnapshot(state.journals,"player");
  expect(initial.inventory).toBe(56000);
  expect(initial.payable).toBe(56000);
  const produced=manufactureEngines(state,program,"job-1",1,bom,1,1000,98);
  validateGameState(produced);
  const after=financialSnapshot(produced.journals,"player");
  expect(after.inventory).toBe(28000);
  expect(after.payable).toBe(56000);
  expect(after.balanced).toBe(true);
  expect(produced.production?.costLots?.find(l=>l.partId==="block")?.quantity).toBe(1);
  expect(produced.production?.costLots?.find(l=>l.partId==="piston")?.quantity).toBe(4);
  const work=produced.journals.find(j=>j.id==="factory:job-1");
  expect(work?.entries.some(e=>e.account==="workInProgress")).toBe(true);
  expect(work?.entries.some(e=>e.account==="finishedGoods")).toBe(true);
  expect(()=>manufactureEngines(produced,program,"job-1",1,bom,1,1000,98)).toThrow();
 });
 it("refuses manufacturing untracked stock even if aggregate stock has enough units",()=>{
  const base=funded();
  const po=createPurchaseOrder("only-block",{supplierId:"s",partId:"block",unitPriceYen:18000,leadMonths:0,minimumOrderQuantity:1},1,1950,1);
  const got=receivePurchasedParts(base,po,1,"receive-block");
  expect(()=>manufactureEngines({...got,production:{...got.production!,materials:[...got.production!.materials,{partId:"piston",quantity:4}]}},program,"untracked",1,bom,1,1000,98)).toThrow(/provenance/);
 });
 it("persists a purchase order, receives partial lots, and pays once without creating an expense",()=>{
  const order=createPurchaseOrder("persisted",{supplierId:"s",partId:"block",unitPriceYen:20000,leadMonths:0,minimumOrderQuantity:1},2,1950,1);
  let s=placePurchaseOrder(funded(),order,"place-persisted");
  expect(s.production?.purchaseOrders?.[0].receivedQuantity).toBe(0);
  s=receivePurchasedParts(s,order,1,"batch-1");
  expect(s.production?.purchaseOrders?.[0].receivedQuantity).toBe(1);
  s=receivePurchasedParts(s,order,1,"batch-2");
  expect(s.production?.purchaseOrders?.[0].receivedQuantity).toBe(2);
  expect(s.production?.costLots?.length).toBe(2);
  expect(()=>receivePurchasedParts(s,order,1,"batch-3")).toThrow(/Invalid received/);
  expect(financialSnapshot(s.journals,"player").payable).toBe(40000);
  s=paySupplier(s,40000,"pay-1");
  expect(financialSnapshot(s.journals,"player").payable).toBe(0);
  expect(financialSnapshot(s.journals,"player").expenses).toBe(0);
  expect(()=>paySupplier(s,40000,"pay-2")).toThrow(/Insufficient/);
  validateGameState(s);
 });
 it("balances raw materials, WIP, completed goods, scrap and cost of goods sold",()=>{
  let s=funded();
  for(const [id,part,unitPrice,qty] of [["sale-block","block",18000,2],["sale-piston","piston",2500,8]] as const){
   const order=createPurchaseOrder(id,{supplierId:"supplier",partId:part,unitPriceYen:unitPrice,leadMonths:0,minimumOrderQuantity:1},qty,1950,1);
   s=receivePurchasedParts(s,order,qty,"receive-"+id);
  }
  s=manufactureEngines(s,program,"make-two",2,bom,1,1000,98);
  const afterManufacturing=financialSnapshot(s.journals,"player");
  const finished=s.production?.finishedLots?.find(l=>l.orderId==="make-two");
  expect(finished?.remainingQuantity).toBe(1);
  expect(afterManufacturing.balanced).toBe(true);
  expect(s.journals.find(j=>j.id==="factory:make-two")?.entries.filter(e=>e.account==="workInProgress").reduce((sum,e)=>sum+e.debit-e.credit,0)).toBe(0);
  expect(afterManufacturing.expenses).toBeGreaterThan(0); // rejected unit is scrap
  const acceptedValue=finished!.remainingCostYen;
  s=sellFinishedEngines(s,"make-two",1,80000,"sale-1");
  const final=financialSnapshot(s.journals,"player");
  expect(final.balanced).toBe(true);
  expect(final.revenue).toBe(80000);
  expect(s.production?.finishedLots?.find(l=>l.orderId==="make-two")?.remainingCostYen).toBe(0);
  expect(s.journals.find(j=>j.id==="sale:sale-1")?.entries.find(e=>e.account==="costOfGoodsSold")?.debit).toBe(acceptedValue);
  expect(()=>sellFinishedEngines(s,"make-two",1,80000,"sale-2")).toThrow(/Insufficient/);
 });
 it("expenses a completely rejected tracked production batch without creating finished goods",()=>{
  let s=funded();
  for(const [id,part,unitPrice,qty] of [["reject-block","block",18000,1],["reject-piston","piston",2500,4]] as const){
   const o=createPurchaseOrder(id,{supplierId:"s",partId:part,unitPriceYen:unitPrice,leadMonths:0,minimumOrderQuantity:1},qty,1950,1);
   s=receivePurchasedParts(s,o,qty,"receive-"+id);
  }
  s=manufactureEngines(s,program,"reject-batch",1,bom,0,1000,98);
  expect(financialSnapshot(s.journals,"player").balanced).toBe(true);
  expect(s.production?.finishedLots?.some(l=>l.orderId==="reject-batch")).toBe(false);
  expect(financialSnapshot(s.journals,"player").expenses).toBeGreaterThan(0);
 });

});
