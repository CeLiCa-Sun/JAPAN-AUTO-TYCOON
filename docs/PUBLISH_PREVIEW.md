# JAPAN AUTO TYCOON — public playable preview release

**Status (2026-10-11):** Tests/build/audit passed, but actual Pages publication **FAILED** in Actions run `38114576750` when `actions/configure-pages` received HTTP 404: no Pages site configured. There is **no verified live URL**. An administrator must first set `Settings > Pages > Source: GitHub Actions`; current workflow is **manual-only** with an early Pages preflight.

## Verified release prerequisites

- Repository is private. Pages eligibility and source settings are account-dependent. Publishing a Pages site normally exposes static JS/CSS even while its source repository is private. Do not change repository visibility without explicit user approval.
- CI run https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114198670 tested 1b961344: build PASS, Vitest **86/86**, four-browser E2E **76/76**, npm audit **0 vulnerabilities**.
- CI run https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114258320 tested b6538e2b: all test, install and audit gates SUCCESS; the job committed actual tested `package-lock.json` (commit **237f3400fd4f3b8f4da84b4f93d154c2768679a3**) on `main`. Lockfile version 3, 149 packages, Vite 7.3.7, Vitest 4.1.11.
- This evidence is for the exact source SHAs above; newer docs/workflow commits still require their own CI record.

## How publication works

1. `.github/workflows/publish-preview.yml` is **manual-only** (`workflow_dispatch`) after the unsuccessful one-time release. The owner must deliberately invoke `Actions > Publish playable preview > Run workflow` once Pages is configured. Ordinary pushes do not publish.
2. The release job requires **committed** `package-lock.json` and runs `npm ci`, blocking `npm audit --audit-level=moderate`, Pages-mode Vite build, Vitest, four-browser Playwright, and `dist` assertions.
3. The Pages deployment step requires GitHub Pages configuration in **Settings > Pages > Build and deployment > Source: GitHub Actions**, and a plan eligible to host Pages from a private repository. The owner must enable these settings if not already configured.
4. After deployment, Actions checks the live HTML title and fetches the live JavaScript asset. Its `JAPAN AUTO TYCOON / Pages` SHA status links to the actual published URL **only if deployment and those live network checks succeed**. Otherwise it reports failure and links to the Actions run.
5. This is a network smoke test, not a physical PC/mobile device test of the published URL. The local-build E2E matrix covers Chromium desktop/mobile, Firefox and WebKit. Direct live site gameplay/save/reload still needs verification before calling the release fully checked.

## If publishing fails
- A missing private-repository Pages entitlement or missing Pages source setting must be resolved by the repository owner, without changing repository visibility automatically.
- Check the exact `Publish playable preview` run and the `JAPAN AUTO TYCOON / Pages` commit status. Do not infer availability from a successful build alone.
- Keep npm audit at the moderate threshold and do not bypass CI checks to publish.
- There is **no valid shareable game URL** until the site and primary asset are actually reachable.

## Local play
```bash
npm ci
npm run dev
```
See `docs/PLAYABLE_PROTOTYPE.md` for gameplay controls and known limitations.


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
