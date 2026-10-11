# TEST REPORT — 2026-10-11
## Verified GitHub operations
- Reviewed main branch source and latest commits.
- Committed e2e/migration-and-abort.spec.ts (legacy save migration and transaction abort test cases).
- Updated .github/workflows/ci.yml: workflow_dispatch, named build/unit/E2E steps and on-failure Playwright diagnostics.
## CI execution evidence
- Prior main commit 62202fbb: combined GitHub commit statuses returned [].
- PR-only workflow run lookup returned []; this does NOT query push workflow runs.
- Actual GitHub Actions push run IDs and job logs were unavailable using these lookups.
- Build, Vitest, desktop/mobile Chromium Playwright, recovery tests: **not verified as executed**. No pass claim.
## Test coverage status
- Added browser scenarios: tampered hash fallback, reload persistence, legacy V1 save read / format 2 rewrite, transaction abort retains prior record.
- Browser tests must still be executed on Actions or local runner.
- 1200-month test remains only a calendar determinism smoke check, not a 100-year economy simulation.
## Required
Collect exact run/job IDs and logs from Actions, fix any failures, and update this report with test counts, runtime and commit SHA before promoting quality gates.
