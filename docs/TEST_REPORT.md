# TEST REPORT — 2026-10-11

## Verified CI run
- URL: https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38109615764/job/114382280133
- Job: 114382280133. Run: 38109615764. Tested SHA: caa42d531139eaf0b344cda3c1d9d323dda9d9e3.
- TypeScript + Vite build: **PASS**.
- Vitest: **PASS** (refer to job logs).
- Playwright: **FAIL** — 16 passed, 40 failed across Chromium desktop/mobile, Firefox, WebKit.
- Observed common error: Playwright strict locator getByRole('status') resolved to 2 elements: application save status and factory demo status.
- User impact: the global save status was no longer unambiguous. Tests could not assert storage recovery correctly; these 40 failures do not establish underlying save correctness or failure.
- Fix committed: src/app/FactoryPanel.tsx factory message now aria-live='polite' rather than role='status', retaining announcements but avoiding a second status landmark. Fix commit f2bea1e2bdfd90955eff372778e050c83ada9e74. **No rerun of this new SHA yet.**

## Save QA requirements still open
- Actual browser PASS of 3-generation restore, corruption, legacy backup, quota injection, transaction abort, read failure, factory production restore required.
- Previously run browser cases are inconclusive where blocked by strict status selector.
- Simulated quota injection is not real operating-system disk quota exhaustion; keep distinction.

## Engineering and security
- EY20D training/validation power-scale and MAPE/RMSE reproducible by independent Python only; TypeScript numeric output not separately recorded.
- Published torque/power inconsistent rows remain flagged, and physical coefficients uncalibrated.
- npm install reported 1 moderate and 2 critical advisories. Exact package identifiers require npm audit output; avoid blind --force changes.

## Stage 0
**NOT PASSED** until the new committed SHA passes build, Vitest and the complete Playwright matrix in real Actions logs.

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
