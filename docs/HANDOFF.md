# HANDOFF — 2026-10-11
Repo CeLiCa-Sun/JAPAN-AUTO-TYCOON / main.
Latest previously inspected head 6b5330d3.
Changes:
- src/domains/engine/research.ts: renamed measuredPowerKw to estimatedPowerKw to avoid false measured provenance.
- src/domains/engine/calibration.ts: enforce supported RPM input and optional power/torque measurement consistency.
- tests/calibration-integrity.test.ts: new RPM, inconsistent measured power/torque, synthetic positive-case unit tests.
WARNING: if other source refers to measuredPowerKw, update those callers before claiming build success; TypeScript build not executed.
CI Stage 0 must remain NOT PASSED until actual npm build, Vitest and cross-browser E2E results are observed. Current connector's commit-run lookup only finds PR-triggered runs and cannot discover push run/job IDs. Get actual run and job ID from GitHub Actions, then fetch job logs and repair failures.
Save QA unchanged and browser execution still outstanding. Preserve required end-of-turn multiple-select checkboxes and other-request textarea.
