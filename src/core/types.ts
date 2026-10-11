export type ID = string;
export type YearMonth = `${number}-${number}`;
export type Account = "cash" | "equity" | "revenue" | "expense" | "costOfGoodsSold" | "inventory" | "workInProgress" | "finishedGoods" | "receivable" | "payable" | "loan" | "fixedAsset" | "accumulatedDepreciation";
export interface LedgerEntry { account: Account; debit: number; credit: number }
export interface JournalTransaction { id: ID; companyId: ID; month: YearMonth; description: string; entries: LedgerEntry[] }
export interface Company { id: ID; name: string; founded: YearMonth }
export interface GameCalendar { year: number; month: number }
export interface ProductionInventory {partId:string;quantity:number}
export interface ProducedEngine {orderId:string;programId:string;accepted:number;rejected:number;totalCostYen:number}
export interface MaterialCostLot {receiptId:string;partId:string;quantity:number;unitCostYen:number}
export interface PurchaseOrderRecord {id:string;supplierId:string;partId:string;quantity:number;receivedQuantity:number;unitPriceYen:number;orderedYear:number;orderedMonth:number;dueYear:number;dueMonth:number}
export interface FinishedEngineLot {orderId:string;programId:string;remainingQuantity:number;remainingCostYen:number}
export interface ProductionState {materials:ProductionInventory[];completedOrders:ProducedEngine[];costLots?:MaterialCostLot[];purchaseOrders?:PurchaseOrderRecord[];finishedLots?:FinishedEngineLot[]}
export interface GameState { schemaVersion: 1; calendar: GameCalendar; seed: number; companies: Company[]; journals: JournalTransaction[]; completedCommandIds: ID[]; revision: number; production?: ProductionState; marketSales?: {month:YearMonth;quantity:number}[] }
export interface DomainEvent { id: ID; kind: "MonthAdvanced" | "JournalPosted"; commandId: ID; month: YearMonth; payload: Record<string, unknown> }
export type GameCommand =
  | { id: ID; kind: "AdvanceMonth" }
  | { id: ID; kind: "PostJournal"; journal: JournalTransaction };
export function yearMonth(c: GameCalendar): YearMonth { return `${c.year}-${String(c.month).padStart(2,"0")}` as YearMonth; }
export function initialState(name = "日本自動車工業"): GameState { return { schemaVersion: 1, calendar: {year:1950,month:1}, seed:195001, companies:[{id:"player",name,founded:"1950-01"}], journals:[], completedCommandIds:[], revision:0 }; }
