import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {createPurchaseOrder,placePurchaseOrder,receivePurchasedParts,paySupplier} from "../src/domains/procurement/purchasing";
import {manufactureEngines} from "../src/domains/engine/persistentProduction";
import {sellFinishedEngines} from "../src/domains/finance/finishedGoods";
import {financialSnapshot} from "../src/domains/finance/reports";
import {validateGameState} from "../src/core/validation";
const program={id:"market-demo-engine",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"block",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"piston",unitsPerEngine:4,unitCostYen:3000}];
describe("playable cycle economics",()=>{
 it("runs from initial funding to profit via orders, manufacturing, sales and supplier settlement",()=>{
  let s=dispatch(initialState(),{id:"fund-demo",kind:"PostJournal",journal:{id:"fund-j",companyId:"player",month:"1950-01",description:"capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]}}).state;
  for(const [id,price,qty] of [["block",18000,2],["piston",2500,8]] as const){
   const order=createPurchaseOrder("order-"+id,{supplierId:"supplier",partId:id,unitPriceYen:price,leadMonths:0,minimumOrderQuantity:1},qty,1950,1);
   s=placePurchaseOrder(s,order,"place-"+id);
   s=receivePurchasedParts(s,order,qty,"receive-"+id);
  }
  expect(financialSnapshot(s.journals,"player").payable).toBe(56000);
  s=manufactureEngines(s,program,"work-1",2,bom,2,1000,98);
  expect(s.production?.finishedLots?.[0].remainingQuantity).toBe(2);
  s=sellFinishedEngines(s,"work-1",2,420000,"sale-1");
  s=paySupplier(s,56000,"pay-1");
  const f=financialSnapshot(s.journals,"player");
  validateGameState(s);
  expect(f.balanced).toBe(true);
  expect(f.payable).toBe(0);
  expect(f.inventory).toBe(0);
  expect(f.revenue).toBe(840000);
  expect(f.netIncome).toBeGreaterThan(0);
  expect(s.production?.finishedLots?.[0].remainingCostYen).toBe(0);
  expect(s.production?.finishedLots?.[0].remainingQuantity).toBe(0);
  expect(()=>sellFinishedEngines(s,"work-1",1,420000,"sale-2")).toThrow(/Insufficient/);
 });
});
