# HANDOFF — 2026-10-11
Repo: CeLiCa-Sun/JAPAN-AUTO-TYCOON / main.
Input specification: JAPAN AUTO TYCOON Ver.1.0 (user upload).
## Committed this turn
- src/domains/engine/curve.ts: heuristic breathing curve.
- src/app/EngineDesigner.tsx: editable engine preview/RPM SVG graph.
- src/domains/finance/advanced.ts: loan origination, monthly interest estimate, depreciation journal, simplified P/L-B/S.
- src/core/types.ts and finance/ledger.ts, finance/reports.ts: extend supported accounts.
- src/storage/generations.ts: three generation rolling read/write scheme.
- src/main.tsx and src/style.css: new UI and storage connection.
- tests/advanced.test.ts and tests/longrun.test.ts: engineering/accounting and 1200-month calendar smoke.
## Do next, in order
1. Run npm install, npm run build, npm test and npm run test:e2e in actual runner; fix compiler/runtime errors. Only then mark gates verified.
2. Strengthen backup with atomic generation writes, checksum envelopes, corruption tests and version migrations.
3. Finance complete loan repayment/interest settlement, depreciation schedules, fixed asset purchase, genuine three-statement accounting and actual cash flow classification.
4. Calibrate RPM performance against measured reference engines; model compression ratio, thermal/friction/knock/heat and give uncertainty bounds.
5. Convert calendar-only 1200 month smoke to production simulation with actual factories/NPCs/markets.
Avoid presenting existing placeholder UI as finished game; maintain prior save format support.
