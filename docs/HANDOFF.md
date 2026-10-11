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
