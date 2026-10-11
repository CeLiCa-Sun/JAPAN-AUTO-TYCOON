# TEST REPORT — 2026-10-11
## GitHub evidence
- Inspected prior main head 6b5330d35bdcbf646b01f5b465161adb181640c4 and source.
- Updated engine research wording so model-derived power is estimatedPowerKw (not measured).
- Added input integrity validation for RPM domain (500–9000), torque/power arithmetic consistency (5% tolerance) and calibration regression tests.
## Execution evidence
- Actual GitHub Actions push job logs: NOT obtained. Available run-by-commit lookup is PR-only, and job log retrieval requires a known job ID.
- TypeScript/Vite build: NOT executed or verified.
- Vitest: NOT executed or verified.
- Playwright Chromium desktop/mobile, Firefox, WebKit: NOT executed or verified.
- IndexedDB 3-generation, corruption, capacity simulation, legacy import, transaction abort, factory restore: source tests exist but NO verified runs.
## Gate decision
Stage 0 remains NOT PASSED. Never infer CI success from committed test cases.
## Engineering warning
The measurement integrity checks enforce internal algebra only and DO NOT validate sensor data, engine assumptions or real dyno calibration.
