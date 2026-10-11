# JAPAN AUTO TYCOON — プレイ試作ガイド (2026-10-11)

> Status: code committed, **current SHA not yet verified by the full CI matrix**. Historical Stage 0 success does not certify these features.

## Start locally
1. Install Node.js 22 and use `npm install`.
2. Run `npm run dev`; open the URL printed by Vite in your browser.
3. With a fresh save state, find **経営サイクル（プレイ試作）** and press **1. 新規経営デモ開始**.
4. Choose 1–10 engines, press **2. 部品を発注・納入**, then **3. エンジン製造**.
5. Set the price in yen, inspect fictional demand, press **4. 完成品を販売**, and **5. 仕入代金を支払う**.
6. To keep playing after a refresh, press **読み込み** in the save section. Automatic saves occur after each successful business-cycle operation.
7. If starting with old data or another open tab, explicitly load the most recent save. Conflicting writes are rejected in supported cases.

## Current playable scope
- Initial demo equity 10,000,000 yen; suppliers instant deliver at fixed preview prices; stored supplier purchase orders and liability postings.
- Input BOM: 1 engine block + 4 pistons per engine; FIFO material costs, WIP and finished goods; production overhead credited to cash.
- Fictional demand responds to player unit price; rival benchmark is 450,000 yen/unit and same-month sales consume finite modeled buyer capacity.
- Unsold finished goods remain in inventory; selling posts revenue and cost of goods sold; supplier settlement reduces payable and cash.
- Cash history is derived from actual existing journal entries, not fabricated transactions.
- Saves support legacy data formats, validation, backup generations, Web Locks best-effort cross-tab coordination and stale-revision conflict errors.

## Known limitations / not yet implemented
- No simulated individual buyers, contract negotiations, actual competing manufacturers, macroeconomic demand forecast, credit scoring or stock market.
- Production executes immediately; the separate 18-step capacity planner does not yet schedule real work orders or factory events.
- Fixed supplier prices and immediate delivery in UI (although the procurement domain supports due dates and registered partial receipt).
- No comprehensive taxes, accounting periods, warranty reserves, external product demand datasets, depreciation journal integration, durable crash recovery guarantees or fully calibrated engine physics.
- Prices and demand are scenario parameters, not real historical car sales or economy estimates.
- Existing `FactoryPanel` is an independent legacy demo. Its seeded inventory cannot be mixed into the new procured-cost flow.

## Acceptance checklist for the phase boundary
- [ ] `npm run build` passes (TypeScript and Vite).
- [ ] `npm test` passes including `market-demand` and `market-monthly-sales`.
- [ ] `npm run test:e2e` passes on Chromium desktop/mobile, Firefox, and WebKit.
- [ ] `npm audit` package-level findings reviewed; `npm-audit-details` artifact inspected and safe updates tested.
- [ ] All failures from **the exact new commit** repaired and rechecked in GitHub Actions.
- [ ] Stage 0 passed historically on run 38110349471/job 114384424640, but current milestone has no verified pass until a newer run is observed.
