# TEST REPORT — 2026-10-11 (latest)
## Confirmed writes
- Added src/domains/engine/program.ts, tests/engine-program.test.ts.
- Added docs/ENGINE_REFERENCE_DATA.md with candidate external dyno measurements and explicit mismatch caveat.
- Extended Playwright to Firefox and WebKit desktop; CI browser install now includes Chromium, Firefox and WebKit.
## Execution evidence
- GitHub source inspection succeeded. Actions push run ID and logs NOT retrieved; prior status lookup returned [] and PR-only run lookup [].
- TypeScript build, Vitest, Chromium/Firefox/WebKit Playwright **NOT EXECUTED/VERIFIED** in this chat.
- Storage generational/abort/quota/legacy tests exist but are **NOT EXECUTED**. No result on real device quota.
- Engine program engineering/calibration tests not executed.
## Calibration status
- A published dynamometer table is identified and recorded in ENGINE_REFERENCE_DATA.md.
- No verified matching engine configuration/operating conditions; no parameters fit, no engineering accuracy claimed.
## Release decision
Quality gates NOT passed. Next: collect job/run logs from Actions, execute tests and fix actual errors. Do not mark the repository green.
