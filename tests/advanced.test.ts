import {describe,it,expect} from "vitest";
import {calculateEngine,DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {engineCurve,DEFAULT_TUNING} from "../src/domains/engine/curve";
import {monthlyInterest,loanOrigination,depreciationJournal} from "../src/domains/finance/advanced";
import {validateJournal} from "../src/domains/finance/ledger";
describe("Engine and accounting extensions",()=>{
 it("generates sensible positive RPM curve",()=>{const curve=engineCurve(DEFAULT_ENGINE,DEFAULT_TUNING);expect(curve.length).toBeGreaterThan(20);expect(curve.every(p=>p.powerKw>0&&p.torqueNm>0)).toBe(true);});
 it("changes displacement by bore",()=>expect(calculateEngine({...DEFAULT_ENGINE,boreMm:80}).displacementCc).toBeGreaterThan(calculateEngine(DEFAULT_ENGINE).displacementCc));
 it("records loan and depreciation with balanced entries",()=>{expect(()=>validateJournal(loanOrigination("l","player","1950-01",100000))).not.toThrow();expect(()=>validateJournal(depreciationJournal("d","player","1950-01",120000,120))).not.toThrow();});
 it("calculates rounded nominal interest",()=>expect(monthlyInterest({id:"a",principalYen:120000,annualRate:.12,remainingMonths:12})).toBe(1200));
});
