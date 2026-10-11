# Public playable preview — controlled GitHub Pages release

Status: **Prepared, not deployed.** No validated public playable URL as of 2026-10-11.

## Eligibility and exposure
- Repository `CeLiCa-Sun/JAPAN-AUTO-TYCOON` is **private** at the latest inspection.
- GitHub Pages support for private repositories depends on the repository owner's GitHub plan (Pro/Team/Enterprise support private repositories; GitHub Free generally requires a public repository). Do **not** change repository visibility without an explicit decision.
- Pages sites may be publicly visible even when their source repository is private. A static web game includes its client-side JavaScript in the public assets. Review assets for private information and secrets before release.
- The deployment workflow is **manual-only**, with no automatic deployment on GitHub push or PR.

## Preparation
1. In GitHub repository `Settings > Pages > Build and deployment`, select `GitHub Actions` as the source. Make sure the account is eligible to publish Pages from this private repository.
2. Finish the current milestone's CI: TypeScript/Vite, Vitest, Chromium desktop/mobile, Firefox, WebKit.
3. Examine the full `npm-audit-details` artifact from the test workflow. Remediate vulnerabilities before first public release.
4. The release workflow `.github/workflows/publish-preview.yml` intentionally blocks deployment on **high or critical** npm advisories. Moderate issues still require manual review and sign-off; absence of a high advisory is not a blanket security guarantee.
5. From the GitHub `Actions` tab, select **Publish playable preview (manual)**, then explicitly use **Run workflow** on `main`. Verify that both `verify-and-build` and `publish` jobs succeed.
6. Obtain the real website link **from the `publish` job's `github-pages` deployment URL** or from `Settings > Pages > Visit site`. Do not guess a link or call the site live before this succeeds.

## Build details
- `vite.config.ts` uses `base: "/JAPAN-AUTO-TYCOON/"` in **pages** mode only; development, CI and local tests use `base: "/"`.
- Release workflow installs Node 22 dependencies, runs blocking `npm audit --audit-level=high`, builds via `npm run build -- --mode pages`, executes all unit tests and the four-project Playwright suite, checks `dist`, uploads only the `dist` artifact, and deploys with least-privilege Pages permissions.
- The existing CI workflow still captures complete audit JSON and logs severity/range/fix availability without declaring vulnerabilities fixed.
- `package-lock.json` is **not currently committed**. A reviewed, reproducible lockfile and `npm ci` conversion are recommended as a subsequent dependency-quality checkpoint, but do not invent dependency resolutions.

## Acceptance
- [ ] Newest commit's CI reports real build, Vitest and complete four-project E2E PASS.
- [ ] npm advisories inspected and remediated as required for release.
- [ ] Pages repository settings and owner plan confirm eligibility.
- [ ] Manual Pages workflow succeeds on the intended commit.
- [ ] Live browser smoke test verifies script loading, gameplay operations and save/reload.
- [ ] Only then share the published URL.

References: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site and https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
