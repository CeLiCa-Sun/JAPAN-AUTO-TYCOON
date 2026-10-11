# Stage 0: operator runbook

## Start or locate a CI run
1. Open https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions
2. In the left sidebar choose **CI**.
3. Select **Run workflow** (if visible), branch **main**, and run. This repository's ci.yml enables workflow_dispatch. If no run button appears, confirm the workflow is enabled and your GitHub account has write access.
4. Open the run. Copy the URL in the form https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/<RUN_ID>.
5. Open the **test** job. Copy its URL ending /job/<JOB_ID> and the SHA shown on the run.

## Gate requirements
- Build TypeScript and Vite: SUCCESS
- Unit tests (Vitest): SUCCESS
- Browser E2E: SUCCESS for Chromium desktop, Chromium mobile, Firefox desktop, WebKit desktop
- Storage recovery tests: all expected cases executed, including three generations, corrupt primary, legacy backup, quota, aborted transaction, read error, production snapshot reload
- Results must refer to the exact main commit SHA. Record job ID, tested SHA, date, actual test counts and logs in docs/TEST_REPORT.md.

If the run fails, inspect the FIRST failed step and its detailed log, then fix and rerun. Do not mark Stage 0 passed from workflow source files alone.

## Recommended message to the assistant
`CI run: https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/<RUN_ID> ; test job: https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/<RUN_ID>/job/<JOB_ID> ; commit: <SHA>`

The linked GitHub connector can read job logs given a real job ID. Private job URLs are best provided in the conversation, not pasted into the repository documents.

## Calibration constraints
Robin EY20D Table 4 five usable RPM samples (1000,1500,2000,2500,4000) are referenced by docs/DYNO_ROBIN_EY20D.md and tests/robin-holdout.test.ts. Fitting is a one-parameter power scale, not a physical combustion/friction coefficient identification. Training samples: 1000,2000,4000 RPM; validation samples: 1500,2500 RPM. The 3000 and 3500 RPM rows are flagged as internally inconsistent. Do not report numerical validation errors until code was actually run, and do not use the validation data for refitting.
