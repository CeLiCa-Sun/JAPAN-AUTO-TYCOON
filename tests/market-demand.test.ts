import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {estimateEngineMarket} from "../src/domains/market/engineMarket";

describe("fictional engine market",()=>{
 it("reduces buyer demand when price rises",()=>{
  const s=initialState();
  const cheap=estimateEngineMarket(s,300000,10);
  const expensive=estimateEngineMarket(s,900000,10);
  expect(cheap.maxBuyers).toBeGreaterThan(expensive.maxBuyers);
  expect(cheap.sellable+cheap.unsold).toBe(10);
  expect(expensive.sellable+expensive.unsold).toBe(10);
  expect(expensive.status).toBe("fictional-preview");
 });
 it("never creates sales beyond valued finished inventory",()=>{
  const quote=estimateEngineMarket(initialState(),420000,2);
  expect(quote.sellable).toBe(2);
  expect(quote.unsold).toBe(0);
  expect(quote.estimatedRevenueYen).toBe(840000);
 });
 it("rejects invalid prices and quantities",()=>{
  expect(()=>estimateEngineMarket(initialState(),0,2)).toThrow();
  expect(()=>estimateEngineMarket(initialState(),300000,-1)).toThrow();
 });
});
