# Dependency security review — 2026-10-11

## Status
**Verified for the locked CI dependency snapshot.** GitHub Actions run `38114679080` (tested SHA `344bf28f`, job `114397110245`) passed `npm ci`, build, 86 Vitest, 76 Playwright and reported `npm audit`: **0 vulnerabilities**. The npm lockfile is committed to `main`. Historic uncertainty below is preserved for context; future dependency changes must be reaudited.

## What changed
- `vite`: `^7.1.0` -> `^7.3.7` (stay on Vite major 7, which continues to receive security fixes).
- `vitest`: `^3.2.0` -> `^4.1.11` (cross-major update, must be verified for test/runtime compatibility).
- `.github/workflows/ci.yml`: after a report-only JSON audit artifact and test matrix, a **failing** `npm audit --audit-level=moderate` gate checks the entire installed tree. `npm ls vite vitest @vitest/mocker` logs effective package choices.
- `.github/workflows/publish-preview.yml`: manual publishing requires `npm audit --audit-level=moderate` to pass, then build, unit and E2E. This is stronger than the previous high-or-critical gate. The manual workflow must be deliberately started by the repository owner.

## Relevant independently published advisories (not repo-specific audit findings)
1. Vite `GHSA-p9ff-h696-f583` affected Vite 7.0–7.3.1, patched from 7.3.2; `GHSA-fx2h-pf6j-xcff` affected Vite before 7.3.5. Source: https://github.com/vitejs/vite/security/advisories and https://advisories.gitlab.com/npm/vite/CVE-2026-53571/
2. Vite October 2026 `GHSA-rq7h-c2jc-7f22`, `GHSA-vfpm-58rq-9qcg` require current maintained patches. Chosen lower bound 7.3.7 (published October 2026). Source: https://github.com/vitejs/vite/security/advisories
3. Vitest `GHSA-5xrq-8626-4rwp` affects older 3.x and `GHSA-82fw-gwwq-j7x9` affects versions below 4.1.11. The latter has no official 3.x patch. Source: https://github.com/advisories/GHSA-5xrq-8626-4rwp and https://github.com/advisories/GHSA-82fw-gwwq-j7x9
4. The historic verified Stage 0 Actions job `114384424640` reported **3 vulnerabilities: 1 moderate and 2 critical**, but those exact dependency names were **NOT captured**. This count is not evidence the same issues remain with the new package ranges.

## Missing quality steps
- [ ] Run npm install on Node 22 with registry access; resolve peer dependencies.
- [ ] Generate and commit an audited `package-lock.json` from the actual resolved graph, then replace npm install with npm ci.
- [ ] Read `npm-audit-details` from the new Actions job, verify exact names/severity/fixAvailable, and address residual advisories.
- [ ] Run TypeScript/Vite build, full Vitest, four Playwright browser configurations and manual game smoke.
- [ ] Report actual pass counts and release SHA, *then* consider the manually gated Pages deployment.

No deployment has been triggered, and no live URL is verified.

## Verified resolution checkpoint (2026-10-11)
- Real GitHub Actions CI run [38114198670](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114198670): Vite 7.3.7, Vitest 4.1.11, build PASS, Vitest 86/86 PASS, Playwright 76/76 PASS, npm audit 0 vulnerabilities including the moderate-or-higher gate.
- Real CI run [38114258320](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114258320): entire pipeline and committed lockfile step PASS. GitHub bot committed actual npm `package-lock.json` via commit `237f3400fd4f3b8f4da84b4f93d154c2768679a3`; file verified on main (lockfile v3, 149 packages).
- This supersedes the earlier *unverified* warnings above only for the stated CI-run dependency graph. Recheck audit on later updates. From now on install with `npm ci` rather than resolving new versions in each job.
- Public deployment remains unverified until a Pages success status and live asset smoke check is observed.


## Release gate verification and Pages blocker — 2026-10-11 (authoritative checkpoint)

### Real CI evidence
- **Verified successful**: GitHub Actions run [38114679080](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114679080), test job **114397110245**, exact tested SHA **344bf28f1b18503685b1b900b5dea9e9773260f1**. Inspected job steps and decoded logs directly.
- Result: Node 22 `npm ci` PASS; TypeScript/Vite build PASS; Vitest **28 test files, 86/86 cases PASS**; Playwright **76/76 PASS** across Chromium desktop/mobile, Firefox and WebKit; `npm audit --audit-level=moderate`: **0 vulnerabilities** (info, low, moderate, high, critical all zero). JSON audit artifact ID `11692967041`; lock artifact ID `11693431142`.
- Resolved `package-lock.json` is **committed** on main, npm lockfile v3; `vite ^7.3.7`, `vitest ^4.1.11` pinned to verified resolved versions in the lock. The 0-advisory statement applies to that exact lockfile and time, not future dependencies.
- Prior failure run [38113809619](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38113809619) failed npm install with `Cannot read properties of null (reading 'edgesOut')`; npm audit reported `ENOLOCK`. Those failures preceded the committed, verified lockfile; the successful run fixes the dependency gate for the tested SHA.

### Actual Pages publication failure
- Run [38114576750](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114576750): `verify-and-build` job **114397170950** succeeded on lockfile install, audit, Pages-mode build, Vitest, 4-browser E2E, asset assertions and Pages artifact upload.
- `publish` job **114397708593** FAILED at `actions/configure-pages@v5` because GET Pages site returned HTTP **404 Not Found**: the repository has **no configured GitHub Pages site**. Actual `deploy-pages` step and live HTML/JavaScript smoke tests were skipped. The SHA-scoped `JAPAN AUTO TYCOON / Pages` status is FAILURE for commit **7908cc9711de3c0580041ca9da96c795064f08a9**.
- `actions/configure-pages@v5`'s `enablement: true` requires a non-default token with elevated repo administration and Pages scopes; do **not** bypass repository configuration, create a PAT, or change private repo visibility. Account plan eligibility to publish Pages from a private repo remains unverified.
- Correct owner action: open **Settings > Pages > Build and deployment > Source: GitHub Actions** and confirm private repository Pages entitlement. Then manually run **Publish playable preview** in the Actions tab. Only disclose a playable URL after success status **and real hosted HTML/JS smoke**.

### Fixes committed after the verified SHA — unverified in CI until their own new run
- `.github/workflows/publish-preview.yml`: reverted to **workflow_dispatch only** (no unexpected automatic public release); added fail-fast Github Pages site existence/build_type workflow preflight with actionable Settings instruction.
- `.github/workflows/ci.yml`: now requires the **committed** `package-lock.json` and `npm ci` instead of generating/auto-committing packages; reduced `contents` from write to **read**, keeps `statuses: write` for SHA-scoped CI status.
- These workflow changes and accompanying docs are **not** verified by the earlier run 38114679080. No new release triggered and **no live public game URL confirmed**.

### Next
- Check the automatic CI run specifically for the new workflow SHA before declaring new HEAD green.
- Owner enables Pages + selects Actions as source; only then initiate **one manual** gated release and verify actual web URL.
- Recheck npm audit on future package changes; treat `0` as the verified 2026-10-11 dependency snapshot only.
