# TEST REPORT — 2026-10-11
## Actual GitHub Actions evidence, first available log
- User-supplied run: https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38109294626/job/114381314656
- Run ID 38109294626, job ID 114381314656, checked out SHA 4e8b29c7e00562cb6e06766b67af049e23b5ba74.
- npm install: SUCCESS (106 packages; npm audit reports 1 moderate, 2 critical vulnerabilities; NOT investigated in this CI repair).
- Build TypeScript and Vite: FAILED (exit code 1).
- TS2322 src/core/types.ts:16:57 template literal number-string mismatch.
- TS2322 src/domains/engine/settlement.ts:16:8 same mismatch.
- Vitest: SKIPPED. Browser install: SKIPPED. Playwright E2E: SKIPPED.
## Fixes committed AFTER the tested SHA
- src/core/types.ts: canonical yearMonth format asserted to YearMonth after padding.
- src/domains/engine/settlement.ts: reuse yearMonth(state.calendar), eliminating duplicated incompatible formatting.
- New commit after prior run; NO re-run verification yet. Stage 0 remains NOT PASSED.
## Browser save quality
- Chromium desktop/mobile, Firefox, WebKit: no actual run yet because prior build failed.
- 3 generations, legacy format, corruption, quota, write abort, read failure and production restoration: test source exists but not validated by that CI run.
## Robin EY20D scale fit
- Existing TypeScript holds separate 3 training RPM (1000/2000/4000) and 2 held-out RPM (1500/2500); two inconsistent published points are excluded.
- Independent Python reproduction of existing formula and fitting method gave scale 0.847631, training MAPE 9.898%, RMSE 0.08368 kW, bias +0.01481 kW; held-out MAPE 16.089%, RMSE 0.37563 kW, bias -0.22670 kW.
- This is an independent *calculation*, NOT execution of the TypeScript implementation or proof that the physical model is calibrated; fuel/efficiency/test conditions are assumed.
## Gate decision
NOT PASSED. Obtain new Actions run/job log for the corrected SHA; require all build/Vitest/Playwright results pass.
