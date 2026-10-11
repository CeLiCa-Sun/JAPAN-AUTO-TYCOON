import type { JournalTransaction } from "../../core/types";
function safeYen(n: number): boolean { return Number.isSafeInteger(n) && n >= 0; }
export function validateJournal(j: JournalTransaction): void {
  if (!j || typeof j.id !== "string" || !j.id || typeof j.companyId !== "string" || !j.companyId || typeof j.description !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(j.month) || !Array.isArray(j.entries) || j.entries.length < 2) throw new Error("Invalid journal metadata");
  const accounts = new Set(["cash","equity","revenue","expense","inventory","receivable","payable"]);
  if (j.entries.some(e => !e || !accounts.has(e.account) || !safeYen(e.debit) || !safeYen(e.credit) || (e.debit > 0 && e.credit > 0) || (e.debit === 0 && e.credit === 0))) throw new Error("Invalid journal entry");
  const debits = j.entries.reduce((a,e)=>a+e.debit,0);
  const credits = j.entries.reduce((a,e)=>a+e.credit,0);
  if (!Number.isSafeInteger(debits) || debits !== credits) throw new Error("Unbalanced journal");
}
export function balance(journals: JournalTransaction[], account: string): number {
  return journals.flatMap(j=>j.entries).filter(e=>e.account===account).reduce((n,e)=>n+e.debit-e.credit,0);
}
