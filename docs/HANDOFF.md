# HANDOFF — 2026-10-11
Repository: CeLiCa-Sun/JAPAN-AUTO-TYCOON / main.
New files:
- src/domains/engine/calibration.ts — errors against provided measured RPM-power curve.
- tests/calibration.test.ts — arithmetic checks on synthetic reference.
- docs/ENGINE_CALIBRATION.md — evidence requirements.
- e2e/quota.spec.ts — deterministic simulated quota error in browser.
Existing generation/migration/corruption E2E tests preserved.
No Actions push run/job log available via the connected PR-filtered workflow interface; don't claim CI success or invent a failed error log.
Next:
1. View GitHub Actions push workflow for main and collect job ID + actual logs, run and fix build/unit/e2e.
2. Confirm quota failure test restores prototype override and inspect transaction atomicity.
3. Extend browser coverage Firefox and WebKit after Chromium passes.
4. Obtain documented real dyno curves for one engine including RPM/power and measurement conditions; analyze with calibration harness before calling model calibrated.
5. Preserve prior specifications and existing save compatibility.
