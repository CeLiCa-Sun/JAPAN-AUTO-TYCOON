import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {exportSave,importSave} from "../src/storage/backup";
import {validateGameState} from "../src/core/validation";

describe("playable economy save compatibility",()=>{
 it("retains recorded monthly demand and procurement/finished goods in JSON export and import",()=>{
  const s={...initialState(),revision:3,
   marketSales:[{month:"1950-01" as const,quantity:1}],
   production:{
    materials:[{partId:"block",quantity:1}],
    costLots:[{receiptId:"r1",partId:"block",quantity:1,unitCostYen:18000}],
    purchaseOrders:[{id:"po1",supplierId:"supplier",partId:"block",quantity:2,receivedQuantity:2,unitPriceYen:18000,orderedYear:1950,orderedMonth:1,dueYear:1950,dueMonth:1}],
    finishedLots:[{orderId:"work1",programId:"engine",remainingQuantity:1,remainingCostYen:125000}],
    completedOrders:[{orderId:"work1",programId:"engine",accepted:2,rejected:0,totalCostYen:250000}]
   }
  };
  validateGameState(s);
  const recovered=importSave(exportSave(s));
  expect(recovered).toEqual(s);
  expect(recovered.marketSales?.[0].quantity).toBe(1);
  expect(recovered.production?.purchaseOrders?.[0].receivedQuantity).toBe(2);
 });
 it("continues to accept Stage 0 saves without Stage 1 fields",()=>{
  const old=initialState();
  expect(importSave(exportSave(old))).toEqual(old);
 });
});
