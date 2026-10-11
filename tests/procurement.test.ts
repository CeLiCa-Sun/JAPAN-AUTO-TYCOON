import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {createPurchaseOrder,receivePurchasedParts} from "../src/domains/procurement/purchasing";
import {financialSnapshot} from "../src/domains/finance/reports";
describe("supplier purchasing preview",()=>{
 const quote={supplierId:"supplier-a",partId:"piston",unitPriceYen:3000,leadMonths:0,minimumOrderQuantity:4};
 it("receives inspected parts with one balanced payable journal and rejects duplicate receipt",()=>{
  const order=createPurchaseOrder("po-1",quote,8,1950,1);
  const initial=initialState();
  const result=receivePurchasedParts(initial,order,8,"receive-1");
  expect(result.production?.materials).toEqual([{partId:"piston",quantity:8}]);
  const finance=financialSnapshot(result.journals,"player");
  expect(finance.inventory).toBe(24000);
  expect(finance.payable).toBe(24000);
  expect(finance.balanced).toBe(true);
  expect(initial.production).toBeUndefined();
  expect(()=>receivePurchasedParts(result,order,8,"receive-2")).toThrow(/Duplicate/);
 });
 it("does not receive before the supplier due month",()=>{
  const order=createPurchaseOrder("po-later",{...quote,leadMonths:2},4,1950,1);
  expect(order.dueMonth).toBe(3);
  expect(()=>receivePurchasedParts(initialState(),order,4,"receive-later")).toThrow(/not yet due/);
 });
 it("rejects short deliveries pending explicit partial-receipt model",()=>{
  const order=createPurchaseOrder("po-2",quote,8,1950,1);
  expect(()=>receivePurchasedParts(initialState(),order,7,"receive-short")).toThrow(/Invalid received/);
 });
});
