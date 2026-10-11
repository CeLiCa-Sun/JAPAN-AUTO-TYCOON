# TEST REPORT — 2026-10-11
## Verified writes / inspection
- Previous main head 84489b5f342f533b9ffa9467ea1a137b8c9c425b inspected.
- GitHub combined status [] and PR-only workflow lookup [] (neither confirms push CI).
- Source-verified Robin EY20D gasoline engine geometry and published dynamometer Table 4 measurements recorded in docs/DYNO_ROBIN_EY20D.md.
- tests/robin-ey20d.test.ts added; 3000/3500 RPM table lines have >5% torque/power inconsistency and are excluded from valid subset.
## Execution evidence
- npm run build: NOT executed.
- npm test: NOT executed.
- npm run test:e2e: NOT executed. No Chromium desktop/mobile, Firefox, WebKit pass evidence.
- All save 3-generation, corruption, legacy migration, quota, abort, read error and factory restore scenarios NOT browser verified.
## Calibration
- Research has a source-attributed published RPM curve (1-cyl 67 x 52 mm, CR 6.3), but no conditions-matched VE/thermal efficiency, environmental correction or measurement error estimates. Mathematical comparison test authored but NOT EXECUTED; no actual fit or held-out validation, no claim of calibrated model.
## Stage 0
NOT PASSED. Require actual CI job logs and verified successful build/Vitest/all Playwright projects tied to exact tested commit SHA.
