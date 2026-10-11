# IMPLEMENTATION STATUS — 2026-10-11

- Stage 0: **NOT PASSED**.
- GitHub Actions run 38109615764, job 114382280133, tested caa42d53: build PASS, Vitest PASS, Playwright 16 PASS / 40 FAIL.
- Common E2E failure: ambiguous getByRole('status') matched main save status and factory status. Factory now uses aria-live='polite' without role='status'; fix committed f2bea1e2, awaiting rerun.
- Save QA: no verified complete four-browser pass until this failure is resolved and tests rerun.
- EY20D comparison: real published 5-point subset and train/validation scalar power correction test exist, but not a calibrated physical engine model.
- Security: npm reported three dependency advisories, identities/severity details not verified by npm audit.

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

## 2026-10-11 — A/B/C playable quality checkpoint
- Baseline HEAD at start: c86ac39685fa06ed7c4a70e72a6ca147a66b7121. GitHub repository visibility is **private**. No verified public playable URL/deployment was discovered; do not publish a guessed link. Local development instructions remain in docs/PLAYABLE_PROTOTYPE.md.
- C (implemented): BusinessCyclePanel now explicitly explains no remaining monthly demand and suggests adjusting unit price or advancing a month; displays how many engines already sold that month. Its next-action prompt no longer recommends an impossible sale with zero remaining demand.
- C (implemented): Financial dashboard cash history changed from repeated array copies to a bounded 12-entry chronological traversal, reducing growth of render-side work for long journals.
- A (authored test): e2e/business-cycle.spec.ts verifies exhausted demand, new-month inventory sales, and preservation of sold buyer quota across refresh plus Load. New tests/playable-save-roundtrip.test.ts verifies JSON import/export of monthly market sales, supplier purchase orders, valued raw and finished inventory, plus backward compatibility with Stage 0 saves. **Tests not actually executed**.
- B (unresolved): Repo currently has package.json semver ranges, but package-lock.json is not present in GitHub. The CI workflow installs dependencies via npm install, writes an npm audit JSON report, and uploads `npm-audit-details`; without a concrete current artifact/log, actual vulnerable packages/fixed versions cannot be established. No package versions modified and **no CVEs marked fixed**.
- A (evidence): GitHub combined status exposed no check statuses, and connector run lookup exposed no PR-scoped workflow runs for the reviewed code SHA. These do not establish that push-triggered Actions jobs have not executed. No exact newest test job/log was retrievable to confirm build, Vitest, or four-browser Playwright success/failure. Latest stage is **UNVERIFIED**, and historic green run 38110349471 with 56 Playwright passes applies only to older Stage 0 code.
- Deployment: Private GitHub source does not inherently provide a public browser URL. Hosting/deployment is a separate future task, contingent on validating the prototype.
- Next stage boundary: inspect the latest Github Actions test job for the final HEAD, fix any verified build/Unit/E2E failures, read the uploaded package-level npm audit and select compatible dependency versions, then rerun one complete post-fix CI. Do not claim green or vulnerability remediation without logs.

## Public playable preview and CI checkpoint — 2026-10-11

- Baseline commit entering this milestone: `52d65ee4e09dba2ce8db58a2f657012ac0e25ab9`. Repo metadata reports `visibility: private`. No confirmed GitHub Pages or other public gameplay deployment URL. **Do not invent a live URL.**
- Deployment preparation committed:
  - `vite.config.ts`: only `--mode pages` uses project base `/JAPAN-AUTO-TYCOON/`; local dev/test still use `/`.
  - `.github/workflows/publish-preview.yml`: `workflow_dispatch` only (NO automatic publication), runs npm install, blocks `npm audit --audit-level=high` vulnerabilities, builds Pages Vite target, executes Vitest and complete desktop/mobile Chromium+Firefox+WebKit Playwright, checks output, uploads `dist/`, and deploys to Pages if all gates succeed. GitHub Pages still requires repository Settings→Pages→Source GitHub Actions, eligible plan for a private repository, and an explicit manual workflow run. GitHub Pages content is generally publicly available even from a private source repository; review distributed JS and assets.
  - `docs/PUBLISH_PREVIEW.md`: full deployment and exposure checklist; `README.md` corrected to state Stage 0 historically passed and minimal prototype is implemented but new SHA unverified.
- Regression tests authored: `tests/playable-save-roundtrip.test.ts` verifies JSON import/export of monthly market sales, purchased material lots, purchase orders and completed-engine valuation while keeping Stage 0 input compatible. `e2e/business-cycle.spec.ts` now verifies sold monthly demand is preserved on reload. **Neither new test was executed.**
- CI evidence: from known job `114384424640`, historical run `38110349471` passed build, Vitest, 56 Playwright cases and npm install showed **3 vulnerabilities (1 moderate, 2 critical)**. This is historical, package names are not identified, and does not prove the current resolved dependency graph remains vulnerable in the same way. The current GitHub connector has no general list/dispatch of push-triggered runs; commit combined status and PR-only associated-run lookup returned empty results. Thus **latest SHA CI and npm audit are NOT VERIFIED**. Do not conflate unavailable logs with a failing test or successful test.
- Local reproduction attempt: Node 22.16, npm 10.9; direct npm registry metadata request failed `EAI_AGAIN registry.npmjs.org`. No reliable current audit package names or dependency resolution available. **No vulnerable package updated or CVE marked fixed.**
- The manual Pages publish workflow is deliberately blocked if current audit detects high or critical vulnerabilities. It will remain unpublished until CI/security checks pass, the user's Pages settings and plan allow publication, and they explicitly run it.
- Next step at the stage boundary: inspect the SHA-specific `test` Actions job and uploaded `npm-audit-details`, remediate exact packages without forced incompatible upgrades, rerun whole CI, and only then manually enable GitHub Pages and verify a real live URL. Keep the user's final summary concise with 5 headings and multi-select checkboxes+textarea.

## 2026-10-11 — security floors, SHA CI visibility, manual deployment

### Implemented and committed
- `package.json` now requires `vite ^7.3.7` and `vitest ^4.1.11`. These version floors were selected after inspecting published 2026 Vite and Vitest advisories, including Vitest `GHSA-82fw-gwwq-j7x9` (no 3.x patched release) and Vite high-severity 7.x filesystem issues. This is **a range update, not proof of an audited installed graph or CVE-free build**.
- `.github/workflows/ci.yml` now shows `npm ls vite vitest @vitest/mocker`, saves package-level audit results, FAILS the job at the end when `npm audit --audit-level=moderate` reports vulnerabilities, and publishes `JAPAN AUTO TYCOON / CI` commit status on push as a best-effort way to query future results. Full build, Vitest and 4 Playwright projects remain part of the same run.
- `.github/workflows/publish-preview.yml` retains **manual-only** Pages publication and now checks `npm audit --audit-level=moderate` before build, Vitest, 4-browser E2E and deploy. No workflow dispatch or actual Pages deployment was carried out. GitHub repository remains **private** and site settings/plan eligibility are unknown.
- `docs/SECURITY_AUDIT.md` logs public advisory links, changed ranges and missing evidence. `docs/PUBLISH_PREVIEW.md` updated release gate and owner checklist.
- Prior test files cover sale/reload, 4-browser E2E, market and save compatibility; this phase added a blocking security CI test and release validation, **not a new verified test run**.

### Evidence and blockers
- Historic Stage 0 run `38110349471` job `114384424640` is the only inspected successful full baseline (Vitest PASS, Playwright 56/56 PASS). Its npm install printed **3 vulnerabilities: 1 moderate, 2 critical**. Their specific package names were not in that captured install output.
- The current repository has no committed `package-lock.json`; local npm registry DNS unavailable, so effective resolved package versions, `npm audit`, full build, latest Vitest and latest cross-browser E2E were **NOT executed in this session**.
- GitHub connector combined status returned `statuses: []` for the latest observed head, and available SHA workflow lookup is PR-triggered-only. This does NOT prove a pushed Actions workflow passed or failed. Never mark latest SHA green until a real current job log and audit artifact are inspected.
- GitHub Pages has **no verified publicly live game URL**; private repo Pages requires appropriate account plan and enabled Pages settings per GitHub Docs. Do not link guessed Pages URL.
- Next action: obtain a real CI job log for the final SHA, inspect npm audit details, fix any advisory/transitive version or new Vitest-4 compatibility failures, create a true npm lockfile from resolved packages, rerun all test gates, then **owner explicitly triggers** manual Pages release and checks deployed game in browser.

## 2026-10-11 — CI failure investigation and lockfile workflow correction
- **Verified failing CI #38113809619**, test job 114394595059, SHA `c884276739265796c453bf38958ef815e706de23`: npm install crashes with `Cannot read properties of null (reading 'edgesOut')` while npm audit separately fails with `ENOLOCK`. Build, Vitest and all Playwright tests were SKIPPED in that run.
- **Verified later CI #38114083557**, test job 114395385918, SHA `846c70f0506136cca999f121569d7a2f74c2f04d`: `npm install --package-lock-only`, `npm ci`, npm dependency list and TypeScript/Vite build PASSED; resolved versions Vite 7.3.7, Vitest 4.1.11, @vitejs/plugin-react 5.2.0. `npm audit` returned **0** info/low/moderate/high/critical advisories in that resolved graph, including the blocking moderate-level gate.
- Vitest in #38114083557: **83/85 PASS, 2 FAIL**. Both are `AssertionError: expected -0 to be +0` in tests/playable-economy-cycle.test.ts and tests/procurement-manufacturing-integrated.test.ts. Four-browser E2E was SKIPPED because Vitest failed. Fixed credit-normal account normalization in `src/domains/finance/reports.ts`, and added a regression test `tests/finance-zero-normalization.test.ts`. **Fix NOT yet CI-verified** when recorded.
- The successful dependency-resolution job uploaded genuine `package-lock.json` artifact **11692647302** (lockfileVersion 3, 149 package records, Vite 7.3.7 and Vitest 4.1.11), and audit JSON artifact **11692547525**. It is **not** a committed lockfile yet. The later CI workflow now commits the real generated lockfile via github-actions[bot] only **after complete build, Vitest, E2E and audit SUCCESS on main**, instead of fabricating a lockfile. The workflow token requires contents:write and branch rules may reject the push; do not claim lockfile committed until GitHub file exists.
- Added `.npmrc` with `legacy-peer-deps=true` to avoid the npm Arborist peer graph crash consistently in lock resolution and `npm ci`; **this is a compatibility workaround, not permission to ignore audit warnings**. Release workflow now REQUIRES a committed lockfile and will not bootstrap one just for publication.
- GitHub Pages manual workflow is PREPARED, not triggered; repository remains PRIVATE, site eligibility and settings unknown; no verified public URL. Deployment blocked until full CI/audit passes, committed lockfile exists and owner's manual release succeeds.
- Maintain one stage-boundary verification for the final SHA. Different SHAs cannot inherit #38114083557's partial success. Final stage CI status is unknown until its actual Actions run/log is inspected.

## 2026-10-11 — Actual green full CI, lockfile race and final release gate

- Real GitHub Actions **run 38114198670 / job 114395715180**, tested SHA **1b9613442b803f20d0bceb56e9a489012160a020**, **SUCCESS**: Node 22 npm lockfile bootstrap and `npm ci` PASS, TypeScript/Vite build PASS, Vitest **86/86 PASS across 28 files**, Playwright **76/76 PASS** across Chromium desktop/mobile, Firefox and WebKit, and `npm audit --audit-level=moderate` **0 vulnerabilities**. The audit JSON log reported 0 info/low/moderate/high/critical. Resolved package versions Vite 7.3.7, Vitest 4.1.11 and plugin-react 5.2.0.
- This is distinct from earlier Stage 0 green run 38110349471 with 56/56 E2E and from intermediate failed run 38114083557 (83/85 unit, 2 negative-zero failures; E2E skipped). Zero normalization was fixed in source and a regression test added.
- A later **run 38114212468 / job 114395752378**, tested SHA 936a0fbc6781ebe00c1bdd60604a637d3ae8a1b7, also PASSED dependency resolution/build/86 unit/76 E2E/audit, but job **FAILED at the post-test lockfile push** (`! [rejected] HEAD -> main (fetch first)`) because main had advanced during the run. A full matrix pass on the same run does NOT make the overall CI job green. The fix is to refresh remote main, compare exact `package.json` SHA-256 against the tested manifest, place the actual CI-generated lockfile on the newest main, and retry non-force pushes at most 3 times. This code is in `.github/workflows/ci.yml` after 33c45f6e; a new run is required to verify the revised publishing step.
- Genuine npm lockfile generated in GitHub Actions artifact **11692647302**, 75,677 bytes, lockfileVersion 3, 149 package records; it has **not yet** been verified committed as `package-lock.json` at time of writing. The CI bot will commit it **only after** all tests and the audit pass. Do not fabricate integrity hashes, force-push, claim lockfile committed without fetching the file, or declare a final SHA green without logs.
- Manual Pages publishing remains intentionally disabled until a **committed** lockfile exists, full test matrix and moderate-level audit pass, eligible GitHub Pages settings are configured for the private repo, and a manual publication run succeeds. No live gameplay URL is available.
- The current stage's latest SHA may differ from these verified SHAs. Record and check the actual final SHA status, lockfile file presence, npm audit and tests before closing.

## 2026-10-11 — Verified tested dependency lock committed
- CI run **38114258320**, test job **114395887178**, testing source SHA **b6538e2be1ba7fb1e7abc8de20ea66539162b713**, completed **SUCCESS** for dependency resolution/npm ci, TypeScript/Vite build, Vitest, the four-browser Playwright matrix, moderate-level npm audit gate, and the post-validation lockfile commit. Refer to https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114258320
- Separate earlier green full test log **38114198670 / job 114395715180** explicitly recorded **86/86 Vitest**, **76/76 Playwright**, and **0 npm vulnerabilities** after the negative-zero fix. The later run also marks all corresponding steps successful.
- The CI bot committed genuine reproducible `package-lock.json` on `main`: **237f3400fd4f3b8f4da84b4f93d154c2768679a3**. File inspected through GitHub Contents: lockfileVersion 3, 149 package entries, Vite 7.3.7, Vitest 4.1.11. No synthetic integrity values. CI uses `npm ci` from the committed lock on subsequent runs; new lock bootstrap is only for a missing lock.
- This closes the prior npm Arborist `edgesOut` / `ENOLOCK` blockers and provides a verified clean 0-advisory dependency graph **for the audited tested run**. It is not a permanent guarantee against future vulnerabilities.
- The GitHub Pages manual-only release workflow `.github/workflows/publish-preview.yml` requires this committed lock, moderate-level audit PASS, full build, Vitest and E2E. **No Pages deployment has been triggered, no confirmed live URL exists**. The repository is private; verify plan entitlement and Settings > Pages > source GitHub Actions before the owner explicitly runs the workflow.
- User-facing release gate: browser URL can be provided **only after** a successful manual Pages deploy and actual live gameplay/saving smoke test. For now use local `npm ci && npm run dev` per docs/PLAYABLE_PROTOTYPE.md.
- Note: later doc-only commits may have no SHA-specific CI status yet. The last verified successful test SHA and actual lockfile commit are recorded separately; do not conflate them.


## Release gate verification and Pages blocker — 2026-10-11 (authoritative checkpoint)

### Real CI evidence
- **Verified successful**: GitHub Actions run [38114679080](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114679080), test job **114397110245**, exact tested SHA **344bf28f1b18503685b1b900b5dea9e9773260f1**. Inspected job steps and decoded logs directly.
- Result: Node 22 `npm ci` PASS; TypeScript/Vite build PASS; Vitest **28 test files, 86/86 cases PASS**; Playwright **76/76 PASS** across Chromium desktop/mobile, Firefox and WebKit; `npm audit --audit-level=moderate`: **0 vulnerabilities** (info, low, moderate, high, critical all zero). JSON audit artifact ID `11692967041`; lock artifact ID `11693431142`.
- Resolved `package-lock.json` is **committed** on main, npm lockfile v3; `vite ^7.3.7`, `vitest ^4.1.11` pinned to verified resolved versions in the lock. The 0-advisory statement applies to that exact lockfile and time, not future dependencies.
- Prior failure run [38113809619](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38113809619) failed npm install with `Cannot read properties of null (reading 'edgesOut')`; npm audit reported `ENOLOCK`. Those failures preceded the committed, verified lockfile; the successful run fixes the dependency gate for the tested SHA.

### Actual Pages publication failure
- Run [38114576750](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114576750): `verify-and-build` job **114397170950** succeeded on lockfile install, audit, Pages-mode build, Vitest, 4-browser E2E, asset assertions and Pages artifact upload.
- `publish` job **114397708593** FAILED at `actions/configure-pages@v5` because GET Pages site returned HTTP **404 Not Found**: the repository has **no configured GitHub Pages site**. Actual `deploy-pages` step and live HTML/JavaScript smoke tests were skipped. The SHA-scoped `JAPAN AUTO TYCOON / Pages` status is FAILURE for commit **7908cc9711de3c0580041ca9da96c795064f08a9**.
- `actions/configure-pages@v5`'s `enablement: true` requires a non-default token with elevated repo administration and Pages scopes; do **not** bypass repository configuration, create a PAT, or change private repo visibility. Account plan eligibility to publish Pages from a private repo remains unverified.
- Correct owner action: open **Settings > Pages > Build and deployment > Source: GitHub Actions** and confirm private repository Pages entitlement. Then manually run **Publish playable preview** in the Actions tab. Only disclose a playable URL after success status **and real hosted HTML/JS smoke**.

### Fixes committed after the verified SHA — unverified in CI until their own new run
- `.github/workflows/publish-preview.yml`: reverted to **workflow_dispatch only** (no unexpected automatic public release); added fail-fast Github Pages site existence/build_type workflow preflight with actionable Settings instruction.
- `.github/workflows/ci.yml`: now requires the **committed** `package-lock.json` and `npm ci` instead of generating/auto-committing packages; reduced `contents` from write to **read**, keeps `statuses: write` for SHA-scoped CI status.
- These workflow changes and accompanying docs are **not** verified by the earlier run 38114679080. No new release triggered and **no live public game URL confirmed**.

### Next
- Check the automatic CI run specifically for the new workflow SHA before declaring new HEAD green.
- Owner enables Pages + selects Actions as source; only then initiate **one manual** gated release and verify actual web URL.
- Recheck npm audit on future package changes; treat `0` as the verified 2026-10-11 dependency snapshot only.

## Stage boundary — Pages release and live gameplay acceptance (2026-10-11)
- Starting baseline: GitHub main commit `d68a7133ff86b9fa595d9cedba635e6532640ad1`. Repository remains **private**. Previous Pages run `38114576750` tested the Pages-mode bundle and 4-browser E2E successfully, but **publish FAILED** in `actions/configure-pages` with HTTP **404** because the Pages site was not enabled/configured. No public gameplay URL verified.
- Existing successful full source verification: CI [38114679080](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114679080) at SHA `344bf28f1b18503685b1b900b5dea9e9773260f1`, Vitest **86/86 PASS**, Playwright **76/76 PASS** (Chromium desktop/mobile, Firefox, WebKit), build PASS, npm audit **0 vulnerabilities**. This is prior validated evidence, not current HEAD verification.
- **Newly committed** `playwright.live.config.ts` and `tests-live/pages-playable.spec.ts`: release-only tests using the actual deployed URL; two Chromium device configurations (desktop Chrome and Pixel 7 emulation), HTTPS, game UI visibility, capital funding, procurement, manufacturing, modeled sales, payable settlement, IndexedDB restoration on reload, monthly progression and save/load durability. Browser emulation is **not physical-device testing**. Live tests are intentionally not included in ordinary local `playwright.config.ts`, since no public URL is currently available.
- Updated `.github/workflows/publish-preview.yml`: AFTER GitHub Pages publication and existing network HTML/JavaScript checks, installs the locked npm dependencies and Chromium, runs live browser gameplay tests on the **actual** `steps.deployment.outputs.page_url`, uploads diagnostics on failure, and only then publishes a success deployment status. Entire release remains **manual-only**. No Pages job rerun or actual live test was performed in this stage due to Pages settings and absent workflow dispatch capability.
- User/admin action: `Settings > Pages > Build and deployment > Source: GitHub Actions`. Confirm plan permits Pages from a private repository, then `Actions > Publish playable preview > Run workflow`. Do not change repository visibility or claim a live URL before the real site works.
- CI rerun: new code push will normally enter the standard CI workflow (build, 86+ cases, browser matrix, audit), but the **new HEAD's status is unknown until matching SHA-specific status/logs confirm results**. A past CI PASS must not be reused for the new release-only files and changed workflow.
- Outstanding live acceptance: publication configuration, manually triggered Pages workflow, real deployment URL, live desktop/mobile (emulated) gameplay/reload PASS and optional physical-device manual verification.

### Live verification workflow correction
- After adding post-deployment Playwright tests, the separate `publish` runner needed its own checkout and Node 22 setup (jobs do not share workspace). Commit `ea57e9b37fbe0098839d83c7661cf465077d4447` adds `contents:read`, `actions/checkout@v4`, and `actions/setup-node@v4` to `publish` before the existing Pages and live-test steps. The new workflow and hosted tests are **not verified by a completed release run**; Pages configuration still blocks actual deployment.


## 2026-10-11 — Pages release readiness follow-up
- GitHub repository `CeLiCa-Sun/JAPAN-AUTO-TYCOON` is **private**. No verified hosted game URL. The canonical Pages candidate was not accessible from the available public page checker; no public live site assertions were made.
- **Latest relevant GitHub CI verified by real job logs:** commit `05e5ca4311aef04db7ec07c95a81e28f1a8f997b`, run [38115475758](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38115475758), job `114399408134`: TypeScript/Vite build PASS, Vitest **86/86 PASS** in 28 suites, Playwright **76/76 PASS** across four browser projects, npm audit **0 reported vulnerabilities**. This validates the live-release workflow change *prior to later publish-job and docs commits*, not the final SHA's new release-only checks or any deployed website.
- The Pages publish failure on [38114576750](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114576750) remains: `actions/configure-pages` returned HTTP **404 Not Found** for the unconfigured Pages site. Nothing indicates a successful later Pages deployment; the site has no confirmed URL.
- CI enhanced in `.github/workflows/ci.yml` (commit `1752e25245f9a65da3985504c78097394c5e9a44`) to build **Pages mode** with `/JAPAN-AUTO-TYCOON/` base, validate that its built JS and CSS assets exist, and discover the **two release-only Playwright cases** using a non-network placeholder URL. Actual public-site gameplay and IndexedDB persistence are *not* run by this discovery step.
- These additional quality steps and subsequent docs edits are **not yet verified by new full CI logs**. Keep historic green SHA separate; the next matching SHA-bound status must show SUCCESS before treating the new gate as passed.
- **User action required:** Open [Settings > Pages](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/settings/pages); if eligible on the private repository, select `Build and deployment > Source: GitHub Actions` and save. Then open [Actions](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions), choose `Publish playable preview`, select `Run workflow` on `main`. Do **not** change repository privacy, create privileged tokens, or bypass the security gate automatically. The currently connected GitHub actions do not expose Pages administration or workflow dispatch.
- On a confirmed successful publish run, verify the workflow's live HTTP HTML/JS smoke and both hosted desktop/mobile Chromium emulation tests for capital, procurement, manufacture, sales, settlement, reload and save. Only then disclose the actual `page_url`; physical-device verification remains a separate user test.
