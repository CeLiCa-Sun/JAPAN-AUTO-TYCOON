# HANDOFF — 2026-10-11

Repo CeLiCa-Sun/JAPAN-AUTO-TYCOON main.
New real CI: run 38109615764 / job 114382280133 tested commit caa42d531139eaf0b344cda3c1d9d323dda9d9e3. Build and Vitest PASS; Playwright 16 PASS, 40 FAIL. Logs show shared root cause: status role returned 2 matches, global save message and factory demo status.
Fix: src/app/FactoryPanel.tsx replaced factory <p role='status'> with <p aria-live='polite' aria-label='工場操作結果'> while keeping main global status unique. Committed f2bea1e2bdfd90955eff372778e050c83ada9e74. Must obtain a NEW CI run/job ID and verify all 4 projects; do not mark Stage 0 passed yet.
Next investigate additional genuine E2E failures (if any) once locator ambiguity cleared; verify generation, corruption, old format, quota injection, abort, read error and factory restore.
Other: report power-scale calibration limitations; npm audit needed for package-specific moderate/critical vulnerabilities.
Continue to show multi-select checkboxes and additional-request textarea.

## CI run 38109958842 (2026-10-11)
- Job 114383289587 tested 57eefe6081e95273bd64bf853e8979f08dbff368.
- Build PASS; Vitest PASS; Playwright 50 PASS / 6 FAIL (56 total).
- Legacy migration timed out on 2 Chromium projects because test inspected IndexedDB without waiting for the save completion.
- Deliberate IndexedDB transaction abort threw page.evaluate:null across 4 browsers because the test rejected the expected abort error event.
- Fix to e2e/migration-and-abort.spec.ts committed as b2aa24f4c154c9833433b9ea837a207689f90d4a. No post-fix CI pass verified.
- Stage 0 NOT PASSED; a new run for the corrected SHA is necessary.
- npm install previously noted 1 moderate and 2 critical advisories; package identification requires npm audit, not yet obtained.
- Robin EY20D still uses single-scalar preview calibration, not validated physical coefficients.

## Verified Stage 0 CI PASS — 2026-10-11
- CI run: https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38110349471/job/114384424640
- Job 114384424640: Build TypeScript + Vite SUCCESS; Vitest SUCCESS; Playwright SUCCESS — 56/56 across Chromium desktop/mobile, Firefox and WebKit. All steps verified from real Actions job logs.
- Stage 0 required CI gate: PASSED for this tested revision. This does not prove physical device quota exhaustion, production-grade security, or an empirically calibrated engine.
- npm dependency audit remains OPEN: installation warning indicates 1 moderate and 2 critical vulnerabilities, but no package-level npm audit output has been captured. Do not claim remediated.
- Robin EY20D fitted scalar is a preview and separate source condition assessment remains OPEN.

## 2026-10-11 — post-Stage-0 development
- Baseline verified CI run 38110349471 / job 114384424640: TypeScript/Vite PASS, Vitest PASS, Playwright 56/56 PASS. Historical Stage 0 gate retained.
- Commit c285c969: `src/storage/atomic.ts` serializes overlapping `saveAtomic` calls for the same slot **inside a single browser tab**. This does not provide cross-tab locking; multi-tab coordination and crash/power-loss guarantees still require additional mechanisms/tests.
- Commit 1c05fd6c: CI includes a report-only `npm audit --audit-level=moderate` step with `continue-on-error: true` to identify vulnerable packages on the next execution. Security remediation NOT DONE and the audit is not a passing security gate.
- Both changes are post-baseline and **have not yet been executed in GitHub Actions**. Do not claim CI green for the new SHA. Run full build, Vitest, four-browser Playwright matrix again.
- Engineering EY20D scale and heat/friction/knock/lifetime remain uncalibrated previews; manufactureEngines already posts balanced inventory/cash journals and stock updates, so duplication was avoided. Full procurement and real BOM accounting remain OPEN.

## Phase 1 storage cross-tab coordination — 2026-10-11
- User preference: **Run CI at completion of each development stage, NOT after every individual commit.** Do not repeatedly request Actions job URLs between incremental commits.
- Existing main head at start: 085d2bcac2b8911c3517ed0c42b8757e3062bee3. Stage 0 baseline passed on run 38110349471 (build, Vitest, 56 E2E).
- src/storage/atomic.ts now uses same-origin Web Locks by slot where supported, in addition to prior same-tab save queue. This is best-effort cross-tab coordination, NOT universal coverage or crash durability.
- e2e/multi-tab-save.spec.ts tests two browser tabs saving different months concurrently and asserts the two save generations survive; test is AUTHORED but NOT EXECUTED.
- Engine and factory inspected: existing manufactureEngines already updates BOM stock and journal inventory debit/cash credit; no redundant workflow added. Robin EY20D heat and lifetime equations remain uncalibrated estimates.
- Security: report-only npm audit step is already present; no detailed new audit log, no package-specific remediation or version change performed.
- Current phase changes are NOT confirmed by CI. Arrange a single CI verification at phase boundary; keep older Stage 0 pass separate from latest unverified commits.

## Phase 1 procurement extension, 2026-10-11
- Added src/domains/procurement/purchasing.ts: supplier quote/lead-month calculation, minimum order quantity, full-quantity inspected receiving, material stock increase, a balanced inventory debit/payable credit journal, duplicate receipt rejection and nonmutating GameState.
- Added tests/procurement.test.ts: positive receipt, balanced payable/inventory, duplicate rejection, lead date, short delivery rejection. AUTHORED BUT NOT EXECUTED.
- IMPORTANT ACCOUNTING LIMITATION: existing manufactureEngines currently debits inventory and credits cash for the *entire production cost* even if procurement has already recognized raw-material inventory and payable; these workflows must not yet be combined as a finalized material-to-WIP-to-finished-goods ledger. Avoid double-counting claims.
- Purchase order records are not persisted as part of GameState, and no factory capacity, partial delivery, supplier payment or UI integration is present. These are remaining required Phase 1 work.
- Stage boundary CI policy remains: no per-commit requests; run one consolidated build/Vitest/Playwright/npm-audit verification after a completed phase. Current post-Stage-0 changes have NOT been CI verified.

## Phase 1 cost-integrity guard (2026-10-11)
- Repo baseline head inspected 1b8d26e96394bb86ac8af9baf2c3c889cc04672a.
- src/domains/engine/persistentProduction.ts now explicitly rejects a manufacturing order if journals contain `purchase:` receipts. Rationale: GameState has no per-part procurement cost lot tracking and only one aggregated inventory ledger account; blindly integrating procurement and manufacture would double-count or misvalue raw materials. This is a fail-closed safeguard, NOT full raw→WIP→finished-goods accounting integration.
- Added tests/persistent-production.test.ts regression ensuring procured materials are rejected rather than duplicating inventory, with no state mutation. NOT EXECUTED yet.
- Existing manufacturing demo continues for non-procurement seeded materials.
- Open work: persist purchase orders and suppliers; implement lot-level quantities/values, raw/WIP/finished-goods subledger and balanced transfer journal, partial receipt, capacity, depreciation, payment, source-matched engine calibration, and npm audit remediation.
- Stage 0 historically PASS (CI run 38110349471, Playwright 56/56). Current head UNVERIFIED. User CI cadence: check only at phase completion, not each commit.

## Phase 1 integrated material costing — 2026-10-11
- Historical Stage 0 CI PASS is run 38110349471 (build, Vitest, 56 E2E). Current revisions following that baseline have NOT been verified by CI; user specifies one CI run at completed stage boundary, not per commit.
- Added Account entries workInProgress, finishedGoods, preserving original inventory as raw materials in the tracked path; ProductionState optional costLots carry receipt-id, part-id, quantity, purchase unit cost. Legacy save objects without costLots remain accepted.
- Procurement receipt now adds a cost lot and posts raw inventory debit / payable credit. Tracked production consumes actual receipt cost FIFO per BOM requirement, credits raw inventory, debits WIP, credits WIP, debits finishedGoods; pays only incremental manufacturing overhead from cash. The journal is balanced without recognizing purchased raw cost twice. Legacy demo inventory/expense remains on its earlier standalone path.
- Added tests/procurement-manufacturing-integrated.test.ts for end-to-end cost balance, remaining lot quantities, duplicate manufacturing and missing provenance. Tests authored, NOT EXECUTED, no new passing build evidence.
- Current implementation is a narrow preview: purchase orders are not fully persisted; partial deliveries, supplier payment, facility capacity, salvage/waste accounting, detailed WIP timeline and finished-goods sale/cost-of-goods-sold require further work. Rejected-only tracked orders are blocked pending scrap expense logic. Browser save compatibility of new optional costLots must be tested.
- Security: npm audit report-only CI step exists; package-level findings and remediation pending. EY20D physical engine model remains uncalibrated.

## Stage 1 development checkpoint — 2026-10-11 (current turn)
- **Reference CI:** run 38110349471 / job 114384424640 passed build, Vitest, 56 Playwright cases on an **earlier revision**. Changes below do **not** inherit that pass status.
- **A — Cost/ledger:** Repaired a literal escaped newline in src/core/types.ts which would prevent parsing. Reconciled account types, validateJournal whitelist and reports for workInProgress, finishedGoods, costOfGoodsSold. Fixed the previously **unbalanced** tracked-production journal: raw inventory → WIP; overhead cash → WIP; WIP → finished goods and scrap expense, with integer-yen allocation; kept independently seeded demo path. Finished goods are now tracked by valued lots; new sale routine posts cash/revenue and COGS/finished-goods double entries. Accounting tests added; **not executed**.
- **B — Purchasing:** Optional, save-compatible purchaseOrders record in ProductionState; placePurchaseOrder stores open quantity; registered orders allow inspected partial deliveries with separate receipt cost lots; paySupplier posts payable debit/cash credit. Unregistered legacy purchase API remains full-delivery-only; supplier-specific debt aging and contracts are not implemented. Code and tests added; **not executed**.
- **C — Factory:** New pure 18-stage equipment planner reports bottleneck, estimated monthly capacity, sequential lead minutes, expected yield and monthly book depreciation. This is planning only, not work-order execution or 18-stage event simulation. Tests authored; **not executed**.
- **D — Save concurrency:** Per-slot Web Locks and same-tab queue remain; added stale-revision / equal-revision divergent state detection before backup rotation, and cross-tab Playwright cases for latest state and stale rejection. Non-Web-Locks browsers do not have a complete cross-tab transaction guarantee; real crash recovery still requires testing. **Unverified**.
- **E — Engineering:** Added fixed numeric Robin EY20D fit regression checks, covering scale about 0.847631, training MAPE about 9.8979%, validation MAPE about 16.0890%, train/validation RMSE about 0.08368/0.37563 kW. Values derive from independent numerical recreation of the existing model; tests authored not run and are NOT physical parameter calibration. Thermal/friction/knock/lifetime coefficients remain uncalibrated.
- **F — Security:** The existing CI workflow already runs report-only npm audit; the actual package-level audit output is unavailable here. No packages upgraded, and **0 vulnerabilities remediated are claimed**.
- **G — Quality gate:** Phase-wide build, Vitest, Chromium desktop/mobile, Firefox, WebKit E2E, and audit are **NOT YET VERIFIED for the new head**. No local cloned dependency installation/test execution was possible in this session. Preserve Stage 0 baseline separately. User wants a consolidated CI check at development-stage boundaries, not requests after each individual commit.
- **Known limitations:** Production account balances and unit cost must be confirmed in real CI; old data missing optional purchase/finished lots should remain readable. The current purchase-to-factory UI is not yet wired; no supplier aging, precise equipment depreciation postings, physical quota exhaustion, calibrated engine model, or long-haul economic simulation.
- **Next verification:** Run one full workflow on the final stage SHA, inspect the exact npm audit advisory names and fixes, adjust failing tests/TypeScript/e2e, and record the job URL and real pass counts. Keep the gate unpassed for this revision until logs prove otherwise.

### Reconciliation hardening (latest amendment)
- Manufacturing on the tracked-cost path now verifies that **all** aggregated physical material quantities equal their per-part purchased cost-lot balances before any FIFO issue. Mixed legacy free stock and purchased stock is rejected, including orphan cost lots (commit 0c723ab55d8b3bce1bd10031846a3da3590565dc).
- This invariant addresses a potential valuation escape where unpriced physical stock could be consumed while some purchase lots exist. Existing integrated tests include an untracked-stock rejection case.
- This amendment is also **not CI-verified**. Stage 0 green historical baseline still references run 38110349471; only a new SHA-bound Actions log can attest to this stage passing.

## Playable prototype milestone — 2026-10-11
- User asked: "How far to a playable version?" Current main had a React browser preview supporting monthly advance, a legacy factory demo, save/load and finance view but no visible, connected purchase → build → sale loop.
- Added src/app/BusinessCyclePanel.tsx and mounted it from src/main.tsx. It offers five on-screen steps: fund a fresh company with 10M yen; order and immediately receive demo supplier parts with persistent purchase records and cost lots; manufacture selected quantities with verified WIP/finished-goods double entries; sell valued engines at user-set yen/unit; settle outstanding supplier payable. Every completed action calls saveAtomic and restores via the existing Load button after refresh. Finance, payable and available finished engines are visible. Existing factory demo was retained.
- Added e2e/business-cycle.spec.ts for page-driven funding → procurement → manufacture → sale → settlement → load, and tests/playable-economy-cycle.test.ts for the same business loop with balanced trial balance, no outstanding raw/finished inventory, payable settlement and profit. These are **AUTHORED, NOT EXECUTED**. The UI is a playable preview, not certified working on all four browsers yet.
- Prior Stage 0 baseline: run 38110349471 job 114384424640 built and passed existing unit and 56 Playwright cases. This evidence applies only to that historical SHA. Latest stage is **UNVERIFIED** until a new build, Vitest, Chromium desktop/mobile, Firefox and WebKit CI run confirms it.
- The exact named npm vulnerability advisories are still NOT KNOWN. Report-only npm audit was added earlier; no audit log from the current SHA has been obtained; no package update/remediation is claimed.
- Playability scope excludes supplier markets, contracts and due-date aging, demand simulation, factory 18-stage actual time progression, competition, taxes, credit limits, price discovery and engineering fidelity. Current supplier demo is instant delivery and selling accepts a user-selected price; no demand or buyer AI.
- Remaining minimum playable-acceptance work: prove install/build pass; investigate any test failures; verify UI loop and persistence in all four browser configurations, including collision behavior; ensure the old factory demo and storage tests regressions remain passing. Do not equate authored tests with successful runtime execution.
- User CI preference: run/review CI once at phase boundary, not after every commit. The changes in this group are the phase boundary, so next step is one actual GitHub Actions run tied to final commit.

## Minimal playable loop: UX + fictional demand milestone (2026-10-11)

### GitHub changes (current stage, not yet verified by CI)
- src/domains/market/engineMarket.ts: deterministic **fictional** price-sensitive demand, static competitor reference price, available units, monthly remaining buyers, sellable quantity, unsold units and estimated revenue.
- src/domains/market/marketSales.ts and optional GameState.marketSales: market sales decrement that month's remaining buyer quota. A subsequent month gets a fresh fictional buyer pool. Domain sale always calls the existing balanced revenue/COGS transaction and validates persisted state. Old saves without marketSales still validate.
- src/app/BusinessCyclePanel.tsx: onboarding play guidance, suggested next action, revenue/profit metrics, demand/unsold forecast, sale limited to simulated demand. Existing manual price setter and business-cycle actions preserved.
- src/app/Dashboard.tsx: cash history from the last 12 actual journal transactions, not fabricated financial records.
- src/main.tsx: accurately labels the market preview and unimplemented NPC/real economy features.
- New tests: tests/market-demand.test.ts (price sensitivity/bounds), tests/market-monthly-sales.test.ts (monthly demand consumption and month rollover). Expanded e2e/business-cycle.spec.ts to assert guide, cash history and expensive-price unsold inventory.
- docs/PLAYABLE_PROTOTYPE.md: browser play instructions, boundaries, acceptance checklist.
- .github/workflows/ci.yml: `npm audit --json` emits per-package name/severity/range/fixAvailable to logs and uploads the npm-audit-details JSON artifact even when vulnerabilities exist. This step is intentionally report-only. **Package names are not yet observed, dependencies have not been upgraded, remediation unverified.**

### Test evidence (do not confuse historical and latest)
- Historical Stage 0 Actions run 38110349471 / job 114384424640: build PASS, Vitest PASS, 56/56 Playwright PASS on an **earlier SHA**.
- Current phase: no SHA-specific Actions job log available to this session. Unit/E2E tests are authored but not executed or verified. GH connector returned no workflow runs for newest commit (its workflow search only covers PR-triggered runs) and combined status returned no checks. This is **unknown**, not PASS and not confirmed FAIL.
- Stage boundary requires a **single** complete verification: TypeScript + Vite build, Vitest, Chromium desktop/mobile, Firefox, WebKit E2E, and npm audit detail. Do not repeatedly ask for CI after each individual commit.
- Outstanding: real current CI failures if any; package-level npm advisories and compatible dependency fixes; demand balancing, competitor companies and real buyers, actual timed 18-step production, macroeconomics and extensive long-duration simulation. Market numbers are scenario assumptions, not empirical calibration.

### Next actions
1. Inspect one GitHub Actions test job for the final stage commit and fix **observed** build/Vitest/E2E failures, if any.
2. Use the npm-audit-details artifact to identify exact advisory dependencies and safe semver-compatible updates; rerun all gates after an upgrade.
3. Extend demand with independent NPC competitor balance and monthly accounting/aging, then test a full year of playable business cycles.

### Playability E2E locator review
- Test review identified an ambiguous Playwright getByText(/買掛金/) locator after reload in e2e/business-cycle.spec.ts, which could match multiple elements (metric and explanation). It was replaced with getByText("買掛金",{exact:true}) in commit c6a845ddaf60f239acf5352b63d92fd878aa9e2b. This is a code-review fix, **not an observed CI failure**. The latest commit still requires real CI verification.

## Stage 1 playable minimum — 2026-10-11 (CI boundary review)
- Latest inspected baseline before edits: commit 37e1ee2d64efb21f47aab9e98f42ef34a2532f0d. This was **not** itself verified green. Historical Stage 0 run 38110349471/job 114384424640 passed build, Vitest and 56 E2E only at the earlier tested SHA.
- CI evidence for this checkpoint: get_commit_combined_status returned **zero statuses**, and fetch_commit_workflow_runs returned **zero PR-triggered runs** for new head. This retrieval cannot exclude push-triggered runs. No fresh build/Vitest/Chromium desktop/mobile/Firefox/WebKit logs or npm-audit artifact were accessible. New changes are **NOT VERIFIED PASS**, nor are they confirmed failed.
- Scope A: Reviewed latest business-cycle, month-demand, storage and Playwright tests; identified the exhausted-month UX issue and optimized cash-history recomputation. Added deterministic browser regression to verify high-price sold-out state, disable-sale hint, and sale enabled next month. No executable CI runs observed.
- Scope B: src/app/BusinessCyclePanel.tsx now suggests changing sale price or advancing to next month if no demand remains, displays cumulative monthly sold count, and preserves manually priced sales and saves. src/app/Dashboard.tsx cash history now uses a bounded 12-entry journal walk rather than repeatedly copying full arrays on every journal item, improving longer games. e2e/business-cycle.spec.ts covers a high-price demand-exhaustion and next-month resume scenario.
- Scope E: Current package.json remains semver ranged and no package-lock.json is present in GitHub. Workflow already writes npm-audit.json, logs advisories' name/severity/range/fixAvailable and uploads the npm-audit-details artifact. But actual exact package advisories were NOT retrieved; no speculative dependency upgrades or claims of fixes made. Need the next stage CI audit artifact before safe upgrades and compatibility/regression tests.
- Next: obtain one Actions test job URL for the final milestone SHA, inspect real build/unit/cross-browser/audit output, repair real failures, choose specific safe upgrades, rerun a complete checkpoint, and only then classify the current playable minimum as verified.
- User's response contract: final <=1000 Japanese chars where practical, headings 実装済み/未実装・失敗/テスト結果/コミットID/次回作業, plus multi-select checkboxes and other-request textarea.
