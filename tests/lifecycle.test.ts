import {describe,it,expect} from "vitest";
import {repayment,acquireAsset,depreciateAsset} from "../src/domains/finance/lifecycle";
import {validateJournal} from "../src/domains/finance/ledger";
describe("Finance lifecycle invariants",()=>{
 it("separates loan principal and interest",()=>{const x=repayment({id:"l",principalYen:120000,annualRate:.12,remainingMonths:12},10000,"j","player","1950-01",20000);validateJournal(x.journal);expect(x.remaining.principalYen).toBe(110000);expect(x.journal.entries.find(e=>e.account==="cash")?.credit).toBe(11200);});
 it("rejects repayment without cash",()=>expect(()=>repayment({id:"l",principalYen:120000,annualRate:.12,remainingMonths:12},10000,"j","player","1950-01",10)).toThrow());
 it("capitalizes purchases",()=>expect(()=>validateJournal(acquireAsset("a","player","1950-01",1000,2000))).not.toThrow());
 it("depreciates entire asset without rounding leaks",()=>{let a={id:"a",costYen:100,lifeMonths:3,depreciatedMonths:0};let sum=0;for(let i=0;i<3;i++){const x=depreciateAsset(a,"j"+i,"player","1950-01");a=x.asset;sum+=x.journal?.entries[0].debit??0;}expect(sum).toBe(100);});
});
