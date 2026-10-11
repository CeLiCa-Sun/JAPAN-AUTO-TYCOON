import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch,advanceMonths} from "../src/core/reducer";
import {validateJournal} from "../src/domains/finance/ledger";
import {nextRandom} from "../src/core/random";
describe("Stage 0 invariants",()=>{
it("rolls December into January",()=>{let s=initialState();s={...s,calendar:{year:1950,month:12}};expect(dispatch(s,{id:"a",kind:"AdvanceMonth"}).state.calendar).toEqual({year:1951,month:1});});
it("ignores repeat command IDs",()=>{const s=initialState();const a=dispatch(s,{id:"a",kind:"AdvanceMonth"});expect(dispatch(a.state,{id:"a",kind:"AdvanceMonth"}).state).toEqual(a.state);});
it("steps through 12 months",()=>{expect(advanceMonths(initialState(),12,"a").state.calendar).toEqual({year:1951,month:1});});
it("repeats deterministic random sequence",()=>{expect(nextRandom(123)).toEqual(nextRandom(123));});
it("rejects unbalanced journal",()=>{expect(()=>validateJournal({id:"j",companyId:"player",month:"1950-01",description:"test",entries:[{account:"cash",debit:100,credit:0},{account:"equity",debit:0,credit:99}]})).toThrow();});
it("posts balanced journal only once",()=>{const j={id:"j",companyId:"player",month:"1950-01" as const,description:"capital",entries:[{account:"cash" as const,debit:100,credit:0},{account:"equity" as const,debit:0,credit:100}]};const a=dispatch(initialState(),{id:"post",kind:"PostJournal",journal:j});expect(a.state.journals).toHaveLength(1);expect(dispatch(a.state,{id:"post",kind:"PostJournal",journal:j}).state.journals).toHaveLength(1);});
});
