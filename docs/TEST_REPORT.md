# TEST REPORT — 2026-10-11
## GitHub evidence
- Source inspection of main and latest commit 8ac160295b9fcf3c32d98716872d28d8884e6a9b succeeded.
- Commit statuses for that commit: empty array. PR-only workflow lookup: empty array. Neither result confirms push CI success/failure; no run ID/job logs were available.
- New sources committed: src/domains/engine/reliability.ts, tests/reliability.test.ts, e2e/generations.spec.ts.
## New test definitions (NOT executed)
- 3-generation rotation and manual restore of prior save.
- Corrupt primary AND first backup, recover second backup.
- Comparative engine model assertions for RPM, cooling and invalid input.
## Previously committed test definitions (NOT executed in this turn)
- IndexedDB primary checksum tamper, reload persistence, V1 legacy migration and transaction abort; initial Vitest regression and 1200-month calendar smoke.
## Still not verified
- npm install / npm run build / npm test / npm run test:e2e have not been executed by this chat; no test passes asserted.
- No observed workflow failure log to target a specific CI bug.
- QuotaExceededError / disk full scenario not reproducibly tested. Real browsers and storage partition constraints needed.
- Reliability model is an uncalibrated *relative* estimate with high uncertainty. No measured accuracy or real engine durability guarantee.
## Next gate
Obtain run ID and exact GitHub Actions job logs, repair observed errors and run full CI. Execute the IndexedDB tests on Chromium desktop/mobile; add quota exception injection, Firefox/WebKit and browser storage limit coverage.
