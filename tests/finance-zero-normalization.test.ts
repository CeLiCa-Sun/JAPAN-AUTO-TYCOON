import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {financialSnapshot} from "../src/domains/finance/reports";

describe("zero-valued credit balances",()=>{
 it("does not emit negative zero for absent income, supplier debt, or equity",()=>{
  const report=financialSnapshot(initialState().journals,"player");
  for(const n of [report.revenue,report.payable,report.equity,report.netIncome]){
   expect(n).toBe(0);
   expect(Object.is(n,-0)).toBe(false);
  }
 });
});
