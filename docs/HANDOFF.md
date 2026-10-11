# HANDOFF — 2026-10-11
Repository CeLiCa-Sun/JAPAN-AUTO-TYCOON, branch main.
Recent commits:
- engine/calculation.ts: heuristic compression, friction, pumping and knock modifiers.
- finance/lifecycle.ts and tests/lifecycle.test.ts: loan installments, capital purchases, integer depreciation.
- storage/atomic.ts: SHA-256 save envelope; atomic IDB rotation across three entries; detects corrupt envelope, reads legacy primary slot.
- main.tsx: connects UI save and load to atomic storage.
Critical next:
1. Obtain push CI logs and run npm build/Vitest/Playwright; repair any failure before calling any stage verified.
2. Save recovery tests in browser: primary corrupt/missing, generation valid, interruption/abort, old schema v1.
3. Add real structured account period and cash-flow journal, enforce business invariants at command boundary; avoid confusing standalone finance helper calls with posted transactions.
4. Calibrate engine predictions to dyno samples and implement thermal/knock/durability estimation with model version and uncertainty envelope.
5. Replace calendar-only 1200-month smoke with economy/market/production/NPC simulations.
No quality gate should be marked passed without test evidence.
