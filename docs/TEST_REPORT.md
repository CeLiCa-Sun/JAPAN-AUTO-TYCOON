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
