import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {createPurchaseOrder,receivePurchasedParts} from "../src/domains/procurement/purchasing";
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
});
