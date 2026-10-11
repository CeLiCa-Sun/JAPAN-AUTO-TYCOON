# HANDOFF — 2026-10-11
Repo CeLiCa-Sun/JAPAN-AUTO-TYCOON main.
Latest scope A/B/C/D:
- src/domains/engine/program.ts engine trial and unit manufacturing cost prototype
- tests/engine-program.test.ts
- docs/ENGINE_REFERENCE_DATA.md candidates and constraints
- playwright.config.ts now includes Chromium desktop/mobile, Firefox desktop, WebKit desktop
- .github/workflows/ci.yml installs three engines
Execution not confirmed. Do not repeat committed changes or assert test passes.
Actions connector currently supplies PR-filtered commit runs; to obtain push job logs, a concrete push workflow run/job ID must be located in GitHub Actions.
Next: inspect actual push CI run logs; fix TS/Vitest/Playwright failures; run storage/recovery suites. Obtain matched dynamometer dataset (known engine geometry and conditions) before fitting models. Integrate engine test costs into journal and factories after validation.
