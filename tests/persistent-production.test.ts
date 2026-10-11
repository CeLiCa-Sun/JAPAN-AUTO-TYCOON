import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {manufactureEngines} from "../src/domains/engine/persistentProduction";
import {validateGameState} from "../src/core/validation";
import {financialSnapshot} from "../src/domains/finance/reports";
const program={id:"engine-v1",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"block",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"piston",unitsPerEngine:4,unitCostYen:3000}];
function funded(){const base=initialState();const s=dispatch(base,{kind:"PostJournal",id:"fund",journal:{id:"fund-j",companyId:"player",month:"1950-01",description:"capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]}}).state;return {...s,production:{materials:[{partId:"block",quantity:5},{partId:"piston",quantity:20}],completedOrders:[]}};}
describe("Persistent engine work order",()=>{
 it("records inventory quantities, production result and balanced inventory/cash journal",()=>{
  const base=funded();const next=manufactureEngines(base,program,"factory-1",2,bom,2,1000,98);
  validateGameState(next);
  expect(next.production?.materials).toEqual([{partId:"block",quantity:3},{partId:"piston",quantity:12}]);
  expect(next.production?.completedOrders[0].accepted).toBe(2);
  expect(financialSnapshot(next.journals,"player").balanced).toBe(true);
  expect(base.production?.completedOrders).toHaveLength(0);
  expect(()=>manufactureEngines(next,program,"factory-1",2,bom,2,1000,98)).toThrow();
 });
 it("rejects shortage without mutating state",()=>{const base=funded();expect(()=>manufactureEngines(base,program,"x",6,bom,6,1000,98)).toThrow();expect(base.production?.materials[0].quantity).toBe(5);});
 it("refuses untracked procured materials instead of duplicating inventory value",()=>{
  const base=funded();
  const purchased={...base,journals:[...base.journals,{id:"purchase:po-1",companyId:"player",month:"1950-01" as const,description:"Received parts",entries:[{account:"inventory" as const,debit:3000,credit:0},{account:"payable" as const,debit:0,credit:3000}]}]};
  expect(()=>manufactureEngines(purchased,program,"unsafe",1,bom,1,1000,98)).toThrow(/inventory provenance/);
  expect(purchased.production?.completedOrders).toHaveLength(0);
 });
 it("preserves legacy states without production property",()=>expect(()=>validateGameState(initialState())).not.toThrow());
});
