import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {settleEnginePrototype} from "../src/domains/engine/settlement";
import {financialSnapshot} from "../src/domains/finance/reports";
const program={id:"p",technologyLevel:3,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
describe("engine prototype to accounting bridge",()=>{
 it("posts cash expense exactly once and rejects duplicate commands",()=>{
  const base=initialState();
  const funded=dispatch(base,{id:"capital",kind:"PostJournal",journal:{id:"cap",companyId:"player",month:"1950-01",description:"capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]}}).state;
  const result=settleEnginePrototype(funded,program,2,"eng-1",1000,98);
  expect(financialSnapshot(result.state.journals,"player").cash).toBe(10000000-result.totalCostYen);
  expect(()=>settleEnginePrototype(result.state,program,2,"eng-1",1000,98)).toThrow();
 });
 it("rejects unfunded production without mutating input",()=>{
  const s=initialState();expect(()=>settleEnginePrototype(s,program,2,"eng-1",1000,98)).toThrow();
  expect(s.journals).toHaveLength(0);
 });
});
