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
