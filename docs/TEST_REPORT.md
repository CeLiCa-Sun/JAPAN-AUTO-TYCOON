# TEST REPORT — 2026-10-11
## Reviewed
- GitHub main prior head cd7c6be5de51575a4f4cbf3af308baa9f1a45239 and existing EY20D measured-point fixture.
- Combined commit statuses: []; PR-only workflow run lookup: []. Neither establishes any main push Actions result.
## Added source and tests
- src/domains/engine/holdout.ts: least-squares single-scale fit to predicted shaft power on training measurements, separate holdout evaluation with MAPE, RMSE kW and signed bias. Strict nonoverlap of train and holdout RPMs.
- tests/robin-holdout.test.ts: 3 published Robin EY20D table points for training (1000,2000,4000 RPM), 2 for validation (1500,2500 RPM). 3000 and 3500 RPM published inconsistencies still excluded without silently altering them.
## Execution evidence
- TypeScript/Vite build: NOT EXECUTED.
- Vitest: NOT EXECUTED.
- Playwright E2E: NOT EXECUTED on Chromium desktop/mobile, Firefox, WebKit.
- Save 3-generation, corruption, legacy, quota, abort, read failure, production restoration tests: source tests present but browser execution NOT VERIFIED.
## Limitations
- No actual numeric fit outputs or measured errors reported because test was not executed.
- The fitted factor only scales the existing uncalibrated predicted power; it is not a calibrated physical fuel/thermal/friction model and is not validated across independent engine datasets.
## Stage 0
NOT PASSED. Requires actual green build/Vitest/all Playwright projects tied to a commit SHA and job logs.
