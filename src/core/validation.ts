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
}
