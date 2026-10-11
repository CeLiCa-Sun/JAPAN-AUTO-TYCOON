import {describe,it,expect} from "vitest";
import {financialSnapshot,businessJournal} from "../src/domains/finance/reports";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
import {DEFAULT_ENGINE,calculateEngine} from "../src/domains/engine/calculation";
import {runMonth,MONTHLY_PHASES} from "../src/core/monthly";
describe("Finance preview",()=>{
 it("records a receivable and later collection without duplicate revenue",()=>{
  let s=initialState();const zero=financialSnapshot(s.journals,"player");
  const capital=businessJournal({kind:"capital",id:"capital",companyId:"player",month:"1950-01",amount:1000},zero);
  s=dispatch(s,{kind:"PostJournal",id:"c",journal:capital}).state;
  const invoice=businessJournal({kind:"invoice",id:"inv",companyId:"player",month:"1950-01",amount:300},financialSnapshot(s.journals,"player"));
  s=dispatch(s,{kind:"PostJournal",id:"i",journal:invoice}).state;
  const collected=businessJournal({kind:"collection",id:"collect",companyId:"player",month:"1950-01",amount:300},financialSnapshot(s.journals,"player"));
  s=dispatch(s,{kind:"PostJournal",id:"p",journal:collected}).state;
  const f=financialSnapshot(s.journals,"player");expect(f).toMatchObject({cash:1300,receivable:0,revenue:300,balanced:true});
 });
 it("rejects collecting more than invoiced",()=>expect(()=>businessJournal({kind:"collection",id:"1",companyId:"player",month:"1950-01",amount:1},financialSnapshot([],"player"))).toThrow());
});
describe("Engine preview",()=>{
 it("matches geometry of a 4-cylinder 70mm square engine",()=>expect(calculateEngine(DEFAULT_ENGINE).displacementCc).toBeCloseTo(Math.PI/4*70*70*70*4/1000,6));
 it("keeps power and torque consistent",()=>{const e=calculateEngine(DEFAULT_ENGINE);expect(e.powerKw*1000).toBeCloseTo(e.torqueNm*2*Math.PI*DEFAULT_ENGINE.rpm/60,6);});
 it("rejects impossible inputs",()=>expect(()=>calculateEngine({...DEFAULT_ENGINE,rpm:0})).toThrow());
});
describe("Month scheduler preview",()=>{
 it("runs phases in defined order",()=>expect(runMonth(initialState(),"tick").executedPhases).toEqual(MONTHLY_PHASES));
 it("does not commit a month if a phase throws",()=>{const s=initialState();expect(()=>runMonth(s,"tick",{finance:()=>{throw new Error("failed");}})).toThrow();expect(s.calendar).toEqual({year:1950,month:1});});
});
