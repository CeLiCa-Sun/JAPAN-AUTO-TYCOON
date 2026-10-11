import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {createPurchaseOrder,receivePurchasedParts} from "../src/domains/procurement/purchasing";
import {manufactureEngines} from "../src/domains/engine/persistentProduction";
import {estimateEngineMarket} from "../src/domains/market/engineMarket";
import {sellEnginesIntoMarket} from "../src/domains/market/marketSales";
import {validateGameState} from "../src/core/validation";
const p={id:"eng",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"block",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"piston",unitsPerEngine:4,unitCostYen:3000}];
describe("persisted monthly market demand",()=>{
 it("limits repeated high-priced sales within a month and resets next month",()=>{
  let s=dispatch(initialState(),{id:"capital",kind:"PostJournal",journal:{id:"cap",companyId:"player",month:"1950-01",description:"Capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]}}).state;
  for(const [id,price,quantity] of [["block",18000,5],["piston",2500,20]] as const){
   const o=createPurchaseOrder("po-"+id,{supplierId:"s",partId:id,unitPriceYen:price,leadMonths:0,minimumOrderQuantity:1},quantity,1950,1);
   s=receivePurchasedParts(s,o,quantity,"recv-"+id);
  }
  s=manufactureEngines(s,p,"work",5,bom,5,1000,98);
  expect(estimateEngineMarket(s,900000,5).sellable).toBe(1);
  s=sellEnginesIntoMarket(s,"work",900000,"sale-1");
  expect(s.marketSales).toEqual([{month:"1950-01",quantity:1}]);
  expect(estimateEngineMarket(s,900000,4).sellable).toBe(0);
  expect(()=>sellEnginesIntoMarket(s,"work",900000,"sale-2")).toThrow(/No remaining market demand/);
  s=dispatch(s,{id:"advance",kind:"AdvanceMonth"}).state;
  expect(estimateEngineMarket(s,900000,4).sellable).toBe(1);
  s=sellEnginesIntoMarket(s,"work",900000,"sale-2");
  expect(s.marketSales).toHaveLength(2);
  expect(s.production?.finishedLots?.[0].remainingQuantity).toBe(3);
  validateGameState(s);
 });
});
