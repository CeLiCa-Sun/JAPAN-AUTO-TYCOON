import {describe,it,expect} from "vitest";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {planEngineProduction,inspectWorkOrder,commitProduction,validatePrototypeForProduction} from "../src/domains/engine/manufacturing";
const program={id:"p",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"block",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"piston",unitsPerEngine:4,unitCostYen:3000}];
const stock=[{partId:"block",quantity:5},{partId:"piston",quantity:20}];
describe("prototype manufacturing workflow",()=>{
 it("consumes exactly ordered BOM after inspection",()=>{
  validatePrototypeForProduction(program,1000,98);
  const plan=planEngineProduction(program,"order-1",2,bom,stock);
  expect(plan.required).toEqual([{partId:"block",quantity:2},{partId:"piston",quantity:8}]);
  const done=commitProduction(plan,stock,inspectWorkOrder(plan,2,[]));
  expect(done.stock).toEqual([{partId:"block",quantity:3},{partId:"piston",quantity:12}]);
  expect(done.accepted).toBe(2);expect(stock[0].quantity).toBe(5);
 });
 it("rejects shortages before changing inventory",()=>expect(()=>planEngineProduction(program,"x",6,bom,stock)).toThrow());
 it("rejects invalid inspection",()=>{const plan=planEngineProduction(program,"x",1,bom,stock);expect(()=>inspectWorkOrder(plan,2,[])).toThrow();});
});
