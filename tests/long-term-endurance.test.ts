import {describe,it,expect} from "vitest";
import {initialState,yearMonth} from "../src/core/types";
import {advanceMonths,dispatch} from "../src/core/reducer";
import {validateGameState} from "../src/core/validation";
import {exportSave,importSave} from "../src/storage/backup";
import {financialSnapshot} from "../src/domains/finance/reports";

describe("125-year deterministic economy calendar endurance",()=>{
 it("advances 1500 months, keeps valid saves and rejects duplicate replay",()=>{
  let state=initialState();
  for(let year=1950;year<2075;year++){
   state=advanceMonths(state,12,`endurance:${year}`).state;
   if(year%25===0)validateGameState(state);
  }
  expect(yearMonth(state.calendar)).toBe("2075-01");
  expect(state.revision).toBe(1500);
  expect(state.completedCommandIds).toHaveLength(1500);
  const restored=importSave(exportSave(state));
  expect(restored).toEqual(state);
  const duplicate=dispatch(restored,{kind:"AdvanceMonth",id:"endurance:2074:11"});
  expect(duplicate.events).toHaveLength(0);
  expect(duplicate.state).toEqual(restored);
 });
 it("does not inflate player cash or journal entries across 100 years",()=>{
  const seeded=dispatch(initialState(),{id:"capital",kind:"PostJournal",journal:{
   id:"j:capital",companyId:"player",month:"1950-01",description:"opening capital",
   entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]
  }}).state;
  let state=seeded;
  for(let year=1950;year<2050;year++)state=advanceMonths(state,12,`finance:${year}`).state;
  validateGameState(state);
  expect(yearMonth(state.calendar)).toBe("2050-01");
  expect(state.journals).toHaveLength(1);
  const cash=financialSnapshot(state.journals,"player");
  expect(cash.cash).toBe(10000000);
  expect(cash.balanced).toBe(true);
  expect(importSave(exportSave(state)).revision).toBe(1201);
 });
});
