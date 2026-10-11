# TEST REPORT — 2026-10-11
## Verified source/commit operations
- Reviewed previous main head 016a2a866405b9e52484fffbc62df009894de265.
- Added duplicate RPM rejection and calibration RMSE (kW) plus signed mean bias (kW).
- Added tests/calibration-metrics.test.ts with synthetic zero-error, biased-reference and duplicate-RPM cases.
## CI execution evidence
- Combined commit statuses returned [].
- GitHub connector run lookup returned [] but only lists PR-triggered runs; this DOES NOT indicate main push CI outcome.
- Public GitHub Actions page could not be retrieved.
- npm run build: NOT executed.
- npm test: NOT executed.
- npm run test:e2e: NOT executed.
- Chromium desktop/mobile, Firefox and WebKit save scenarios: NOT executed.
## Calibration
- Added mathematical error reporting only. No source-verified matching engine/dyno RPM curve used; no empirical coefficients fitted. Synthetic test inputs are not measured evidence.
## Stage 0 quality gate
NOT PASSED. Requires verified successful build, Vitest and all Playwright projects tied to the exact tested commit SHA.
