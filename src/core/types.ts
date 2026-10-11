export type ID = string;
export type YearMonth = `${number}-${number}`;
export type Account = "cash" | "equity" | "revenue" | "expense" | "inventory" | "receivable" | "payable" | "loan" | "fixedAsset" | "accumulatedDepreciation";
export interface LedgerEntry { account: Account; debit: number; credit: number }
export interface JournalTransaction { id: ID; companyId: ID; month: YearMonth; description: string; entries: LedgerEntry[] }
export interface Company { id: ID; name: string; founded: YearMonth }
export interface GameCalendar { year: number; month: number }
export interface GameState { schemaVersion: 1; calendar: GameCalendar; seed: number; companies: Company[]; journals: JournalTransaction[]; completedCommandIds: ID[]; revision: number }
export interface DomainEvent { id: ID; kind: "MonthAdvanced" | "JournalPosted"; commandId: ID; month: YearMonth; payload: Record<string, unknown> }
export type GameCommand =
  | { id: ID; kind: "AdvanceMonth" }
  | { id: ID; kind: "PostJournal"; journal: JournalTransaction };
export function yearMonth(c: GameCalendar): YearMonth { return `${c.year}-${String(c.month).padStart(2,"0")}`; }
export function initialState(name = "日本自動車工業"): GameState { return { schemaVersion: 1, calendar: {year:1950,month:1}, seed:195001, companies:[{id:"player",name,founded:"1950-01"}], journals:[], completedCommandIds:[], revision:0 }; }
