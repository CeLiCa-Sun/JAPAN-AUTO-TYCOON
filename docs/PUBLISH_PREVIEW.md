# JAPAN AUTO TYCOON — public playable preview release

**Status (2026-10-11):** Pages publication attempt prepared and triggered by a workflow change; **no verified live URL until the Pages status and public asset smoke pass**. Never guess a URL.

## Verified release prerequisites

- Repository is private. Pages eligibility and source settings are account-dependent. Publishing a Pages site normally exposes static JS/CSS even while its source repository is private. Do not change repository visibility without explicit user approval.
- CI run https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114198670 tested 1b961344: build PASS, Vitest **86/86**, four-browser E2E **76/76**, npm audit **0 vulnerabilities**.
- CI run https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114258320 tested b6538e2b: all test, install and audit gates SUCCESS; the job committed actual tested `package-lock.json` (commit **237f3400fd4f3b8f4da84b4f93d154c2768679a3**) on `main`. Lockfile version 3, 149 packages, Vite 7.3.7, Vitest 4.1.11.
- This evidence is for the exact source SHAs above; newer docs/workflow commits still require their own CI record.

## How publication works

1. `.github/workflows/publish-preview.yml` runs once when that workflow file changes on main (explicit release attempt), and may also be invoked manually with `Actions > Publish playable preview > Run workflow`. Ordinary source or documentation commits **do not** deploy automatically.
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
