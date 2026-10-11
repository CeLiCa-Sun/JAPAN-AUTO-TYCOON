import type { DomainEvent, GameCommand, GameState } from "./types";
import { yearMonth } from "./types";
import { validateJournal } from "../domains/finance/ledger";
import { nextRandom } from "./random";
export interface DispatchResult { state: GameState; events: DomainEvent[] }
export function dispatch(state: GameState, cmd: GameCommand): DispatchResult {
  if (!cmd.id) throw new Error("Missing command id");
  if (state.completedCommandIds.includes(cmd.id)) return { state, events: [] };
  const month = yearMonth(state.calendar);
  let updated: GameState;
  let event: DomainEvent;
  if (cmd.kind === "AdvanceMonth") {
    const { year, month: m } = state.calendar;
    const calendar = m === 12 ? {year:year+1,month:1} : {year,month:m+1};
    updated = { ...state, calendar, seed: nextRandom(state.seed).seed };
    event = { id:`event:${cmd.id}`, kind:"MonthAdvanced", commandId:cmd.id, month, payload:{to:yearMonth(calendar)} };
  } else {
    validateJournal(cmd.journal);
    if (!state.companies.some(c=>c.id===cmd.journal.companyId)) throw new Error("Unknown company");
    if (cmd.journal.month !== month) throw new Error("Journal month must match current month");
    if (state.journals.some(j=>j.id===cmd.journal.id)) throw new Error("Duplicate transaction");
    updated = {...state, journals:[...state.journals, cmd.journal]};
    event = { id:`event:${cmd.id}`, kind:"JournalPosted", commandId:cmd.id, month, payload:{journalId:cmd.journal.id} };
  }
  updated = {...updated, revision:state.revision+1, completedCommandIds:[...state.completedCommandIds,cmd.id]};
  return {state:updated,events:[event]};
}
export function advanceMonths(state: GameState, count: 3|6|12, prefix: string): DispatchResult {
  let current = state; const events: DomainEvent[] = [];
  for(let i=0;i<count;i++){ const result=dispatch(current,{kind:"AdvanceMonth",id:`${prefix}:${i}`});current=result.state;events.push(...result.events); }
  return {state:current,events};
}
