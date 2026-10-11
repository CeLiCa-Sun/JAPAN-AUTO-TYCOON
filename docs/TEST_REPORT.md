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
