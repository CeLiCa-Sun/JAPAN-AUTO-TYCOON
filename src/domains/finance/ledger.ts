import type { JournalTransaction } from "../../core/types";
function safeYen(n: number): boolean { return Number.isSafeInteger(n) && n >= 0; }
export function validateJournal(j: JournalTransaction): void {
  if (!j.id || !j.companyId || !/^\d{4}-\d{2}$/.test(j.month) || j.entries.length < 2) throw new Error("Invalid journal metadata");
  if (j.entries.some(e => !safeYen(e.debit) || !safeYen(e.credit) || (e.debit > 0 && e.credit > 0) || (e.debit === 0 && e.credit === 0))) throw new Error("Invalid journal entry");
  const debits = j.entries.reduce((a,e)=>a+e.debit,0);
  const credits = j.entries.reduce((a,e)=>a+e.credit,0);
  if (!Number.isSafeInteger(debits) || debits !== credits) throw new Error("Unbalanced journal");
}
export function balance(journals: JournalTransaction[], account: string): number {
  return journals.flatMap(j=>j.entries).filter(e=>e.account===account).reduce((n,e)=>n+e.debit-e.credit,0);
}
