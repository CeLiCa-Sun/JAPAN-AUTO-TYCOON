import type { GameState } from "./types";
import { validateJournal } from "../domains/finance/ledger";
export function validateGameState(value: unknown): asserts value is GameState {
 if (!value || typeof value !== "object") throw new Error("Invalid save root");
 const s = value as Partial<GameState>;
 if (s.schemaVersion !== 1 || !s.calendar || !Number.isSafeInteger(s.calendar.year) || s.calendar.year! < 1 || !Number.isInteger(s.calendar.month) || s.calendar.month! < 1 || s.calendar.month! > 12) throw new Error("Invalid game calendar/schema");
 if (!Number.isSafeInteger(s.revision) || s.revision! < 0 || !Number.isSafeInteger(s.seed) || s.seed! < 0) throw new Error("Invalid revision or RNG seed");
 if (!Array.isArray(s.companies) || !s.companies.length || !Array.isArray(s.journals) || !Array.isArray(s.completedCommandIds)) throw new Error("Invalid collections");
 const companyIds = new Set<string>();
 for (const c of s.companies) { if (!c || typeof c.id !== "string" || !c.id || typeof c.name !== "string" || !c.name || typeof c.founded !== "string" || companyIds.has(c.id)) throw new Error("Invalid company"); companyIds.add(c.id); }
 const journalIds = new Set<string>();
 for (const j of s.journals) { validateJournal(j); if (journalIds.has(j.id) || !companyIds.has(j.companyId)) throw new Error("Invalid journal reference or duplicate"); journalIds.add(j.id); }
 if (s.completedCommandIds.some(id => typeof id !== "string" || !id) || new Set(s.completedCommandIds).size !== s.completedCommandIds.length) throw new Error("Invalid command history");
 if(s.marketSales!==undefined){
  if(!Array.isArray(s.marketSales))throw new Error("Invalid market sales");
  const periods=new Set<string>();
  for(const m of s.marketSales){if(!m||typeof m.month!=="string"||!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(m.month)||periods.has(m.month)||!Number.isSafeInteger(m.quantity)||m.quantity<1)throw new Error("Invalid market sale record");periods.add(m.month);}
 }
 if(s.production!==undefined){
  const p=s.production;
  if(!p||!Array.isArray(p.materials)||!Array.isArray(p.completedOrders))throw new Error("Invalid production state");
  const keys=new Set<string>();
  for(const m of p.materials){if(!m||typeof m.partId!=="string"||!m.partId||!Number.isSafeInteger(m.quantity)||m.quantity<0||keys.has(m.partId))throw new Error("Invalid inventory");keys.add(m.partId);}
  if(p.costLots!==undefined){
   if(!Array.isArray(p.costLots))throw new Error("Invalid cost lots");
   const receiptIds=new Set<string>();
   for(const lot of p.costLots){if(!lot||typeof lot.receiptId!=="string"||!lot.receiptId||receiptIds.has(lot.receiptId)||typeof lot.partId!=="string"||!lot.partId||!Number.isSafeInteger(lot.quantity)||lot.quantity<0||!Number.isSafeInteger(lot.unitCostYen)||lot.unitCostYen<=0||!Number.isSafeInteger(lot.quantity*lot.unitCostYen))throw new Error("Invalid cost lot");receiptIds.add(lot.receiptId);}
  }
  if(p.purchaseOrders!==undefined){
   if(!Array.isArray(p.purchaseOrders))throw new Error("Invalid purchase orders");
   const orderIds=new Set<string>();
   for(const o of p.purchaseOrders){
    if(!o||typeof o.id!=="string"||!o.id||orderIds.has(o.id)||typeof o.supplierId!=="string"||!o.supplierId||typeof o.partId!=="string"||!o.partId||![o.quantity,o.unitPriceYen,o.orderedYear,o.orderedMonth,o.dueYear,o.dueMonth,o.receivedQuantity].every(Number.isSafeInteger)||o.quantity<1||o.unitPriceYen<1||o.receivedQuantity<0||o.receivedQuantity>o.quantity||o.orderedYear<1||o.dueYear<1||o.orderedMonth<1||o.orderedMonth>12||o.dueMonth<1||o.dueMonth>12||!Number.isSafeInteger(o.quantity*o.unitPriceYen))throw new Error("Invalid purchase order");
    orderIds.add(o.id);
   }
  }
  if(p.finishedLots!==undefined){
   if(!Array.isArray(p.finishedLots))throw new Error("Invalid finished lots");
   const finishedIds=new Set<string>();
   for(const l of p.finishedLots){
    if(!l||typeof l.orderId!=="string"||!l.orderId||finishedIds.has(l.orderId)||typeof l.programId!=="string"||!l.programId||!Number.isSafeInteger(l.remainingQuantity)||l.remainingQuantity<0||!Number.isSafeInteger(l.remainingCostYen)||l.remainingCostYen<0||(l.remainingQuantity===0&&l.remainingCostYen!==0))throw new Error("Invalid finished lot");
    finishedIds.add(l.orderId);
   }
  }
  const ids=new Set<string>();
  for(const o of p.completedOrders){if(!o||typeof o.orderId!=="string"||!o.orderId||ids.has(o.orderId)||typeof o.programId!=="string"||!o.programId||![o.accepted,o.rejected,o.totalCostYen].every(x=>Number.isSafeInteger(x)&&x>=0))throw new Error("Invalid production order");ids.add(o.orderId);}
 }
}
