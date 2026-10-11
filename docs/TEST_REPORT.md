# TEST REPORT — 2026-10-11

## Verified GitHub Actions run
- Run: https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38109487117
- Job ID: 114381888247
- Tested commit SHA: e2e74360baaa35486d210ef352c5c12ff99941aa
- **Build TypeScript and Vite: PASS** (tsc -b and vite build).
- **Vitest: FAIL** — 65 passed, 1 failed (66 total, 20 test files).
- Failure: tests/robin-holdout.test.ts, 'returns finite train and independent holdout errors', Error: At least three measured points required from src/domains/engine/calibration.ts:5, called by src/domains/engine/holdout.ts:12.
- **Playwright: SKIPPED** by CI after Vitest failure; no evidence of Chromium PC/mobile, Firefox or WebKit pass.
- No all-browser save test outcomes for 3 generations, old formats, corruption, quota, aborted transaction, read failure, production restore.
- npm install reported 1 moderate and 2 critical advisories; no audit root cause verified.

## Corrective commit after the failing run
- src/domains/engine/holdout.ts: validate each holdout point using the existing strict measurement validator combined with two training observations, while preserving the holdout size 2; do not include holdout values in fitting.
- Fix committed as 891cee3e7f382e8bbfe40f46408c792cb3f71cd2, **not verified by a new CI run yet**.
- Independent Python numerical reproduction of power-scale model: scale 0.847631; training MAPE 9.8979%, RMSE 0.08368 kW; validation MAPE 16.0890%, RMSE 0.37563 kW. **Not a TypeScript/Vitest pass**.
- Robin EY20D published measurement assumptions and flagged inconsistent points documented separately.

## Stage 0
**NOT PASSED** until a run on the corrected SHA shows successful build, Vitest and all four Playwright browser projects. Do not mark E2E as passed based on its skipped status.
