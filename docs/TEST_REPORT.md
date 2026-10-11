# TEST REPORT — 2026-10-11

## Observed via GitHub API
- File creation and updates on main succeeded.
- Previous Stage 0 files fetched before edits.
- New unit tests: finance invoice/collection invariants, engine geometry and power-torque consistency, month phase sequence, save import validation.
- New browser smoke tests: desktop and mobile Chromium profiles, save/load, month advance.
- New CI workflow runs build, Vitest and Playwright when GitHub Actions is available.

## NOT verified
- No locally executed npm install / tsc / Vitest / Playwright result in this chat.
- No passing GitHub Actions run has been obtained or independently verified.
- Cross-browser Firefox/WebKit and hardware-device testing not performed.
- Long-run 1,200+ months and finance/manufacturing integration not performed.

## Engineering model limitations
- Engine displacement & piston speed: mathematical geometry.
- Estimated output and fuel: fixed air density, 4-stroke cycle, constant VE and thermal efficiency, idealized fueling; not calibrated against real engines. Validated application bounds enforced but prediction error not established.

Do not mark any test passed without executable evidence.
