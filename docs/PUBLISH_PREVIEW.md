# JAPAN AUTO TYCOON — public playable preview release

**最新の確認済み CI:** [run 38116832464](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38116832464)（コミット `defb4969def8606094a66f30009cfab3789f4ca4`）でビルド成功、Vitest 86/86、4ブラウザE2E 76/76、npm監査0件、Pages用アセット確認2件、公開後テスト2件の検出が成功。今回追加したリリースSHA照合処理のCIは別途実行中で、結果未確定。Pagesの手動公開実行は確認できず、公開サイトのプレイ・セーブ復元も未検証。

**2026-10-11 最新確認:** GitHub repo visibility は **Public**。最新の検証済みソースSHA `1752e25245f9a65da3985504c78097394c5e9a44` / [CI 38115779069](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38115779069) は build・Vitest 86/86・4ブラウザE2E 76/76・npm audit 0件・Pagesビルド検査および公開後E2Eの検出に合格。**公開Pagesと公開サイト上のセーブ検証は未確認**。GitHub管理者は [Settings → Pages](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/settings/pages) で Source=GitHub Actions を設定後、[Actions](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions) の Publish playable preview を手動実行。実サイトのHTML/JS・PC/スマホ相当のブラウザ操作と保存復元が完了するまでURLを配布しない。今回 `.github/workflows/publish-preview.yml` に事前ゲート失敗のSHA別ステータス記録を追加（コミット `defb4969def8606094a66f30009cfab3789f4ca4`）。最新コード変更のCIは未確認。詳細は `docs/OWNER_PAGES_ACTIONS.md`。


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

## Stage boundary — Pages release and live gameplay acceptance (2026-10-11)
- Starting baseline: GitHub main commit `d68a7133ff86b9fa595d9cedba635e6532640ad1`. Repository remains **private**. Previous Pages run `38114576750` tested the Pages-mode bundle and 4-browser E2E successfully, but **publish FAILED** in `actions/configure-pages` with HTTP **404** because the Pages site was not enabled/configured. No public gameplay URL verified.
- Existing successful full source verification: CI [38114679080](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114679080) at SHA `344bf28f1b18503685b1b900b5dea9e9773260f1`, Vitest **86/86 PASS**, Playwright **76/76 PASS** (Chromium desktop/mobile, Firefox, WebKit), build PASS, npm audit **0 vulnerabilities**. This is prior validated evidence, not current HEAD verification.
- **Newly committed** `playwright.live.config.ts` and `tests-live/pages-playable.spec.ts`: release-only tests using the actual deployed URL; two Chromium device configurations (desktop Chrome and Pixel 7 emulation), HTTPS, game UI visibility, capital funding, procurement, manufacturing, modeled sales, payable settlement, IndexedDB restoration on reload, monthly progression and save/load durability. Browser emulation is **not physical-device testing**. Live tests are intentionally not included in ordinary local `playwright.config.ts`, since no public URL is currently available.
- Updated `.github/workflows/publish-preview.yml`: AFTER GitHub Pages publication and existing network HTML/JavaScript checks, installs the locked npm dependencies and Chromium, runs live browser gameplay tests on the **actual** `steps.deployment.outputs.page_url`, uploads diagnostics on failure, and only then publishes a success deployment status. Entire release remains **manual-only**. No Pages job rerun or actual live test was performed in this stage due to Pages settings and absent workflow dispatch capability.
- User/admin action: `Settings > Pages > Build and deployment > Source: GitHub Actions`. Confirm plan permits Pages from a private repository, then `Actions > Publish playable preview > Run workflow`. Do not change repository visibility or claim a live URL before the real site works.
- CI rerun: new code push will normally enter the standard CI workflow (build, 86+ cases, browser matrix, audit), but the **new HEAD's status is unknown until matching SHA-specific status/logs confirm results**. A past CI PASS must not be reused for the new release-only files and changed workflow.
- Outstanding live acceptance: publication configuration, manually triggered Pages workflow, real deployment URL, live desktop/mobile (emulated) gameplay/reload PASS and optional physical-device manual verification.

### Live verification workflow correction
- After adding post-deployment Playwright tests, the separate `publish` runner needed its own checkout and Node 22 setup (jobs do not share workspace). Commit `ea57e9b37fbe0098839d83c7661cf465077d4447` adds `contents:read`, `actions/checkout@v4`, and `actions/setup-node@v4` to `publish` before the existing Pages and live-test steps. The new workflow and hosted tests are **not verified by a completed release run**; Pages configuration still blocks actual deployment.


## 2026-10-11 — Pages release readiness follow-up
- GitHub repository `CeLiCa-Sun/JAPAN-AUTO-TYCOON` is **private**. No verified hosted game URL. The canonical Pages candidate was not accessible from the available public page checker; no public live site assertions were made.
- **Latest relevant GitHub CI verified by real job logs:** commit `05e5ca4311aef04db7ec07c95a81e28f1a8f997b`, run [38115475758](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38115475758), job `114399408134`: TypeScript/Vite build PASS, Vitest **86/86 PASS** in 28 suites, Playwright **76/76 PASS** across four browser projects, npm audit **0 reported vulnerabilities**. This validates the live-release workflow change *prior to later publish-job and docs commits*, not the final SHA's new release-only checks or any deployed website.
- The Pages publish failure on [38114576750](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114576750) remains: `actions/configure-pages` returned HTTP **404 Not Found** for the unconfigured Pages site. Nothing indicates a successful later Pages deployment; the site has no confirmed URL.
- CI enhanced in `.github/workflows/ci.yml` (commit `1752e25245f9a65da3985504c78097394c5e9a44`) to build **Pages mode** with `/JAPAN-AUTO-TYCOON/` base, validate that its built JS and CSS assets exist, and discover the **two release-only Playwright cases** using a non-network placeholder URL. Actual public-site gameplay and IndexedDB persistence are *not* run by this discovery step.
- These additional quality steps and subsequent docs edits are **not yet verified by new full CI logs**. Keep historic green SHA separate; the next matching SHA-bound status must show SUCCESS before treating the new gate as passed.
- **User action required:** Open [Settings > Pages](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/settings/pages); if eligible on the private repository, select `Build and deployment > Source: GitHub Actions` and save. Then open [Actions](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions), choose `Publish playable preview`, select `Run workflow` on `main`. Do **not** change repository privacy, create privileged tokens, or bypass the security gate automatically. The currently connected GitHub actions do not expose Pages administration or workflow dispatch.
- On a confirmed successful publish run, verify the workflow's live HTTP HTML/JS smoke and both hosted desktop/mobile Chromium emulation tests for capital, procurement, manufacture, sales, settlement, reload and save. Only then disclose the actual `page_url`; physical-device verification remains a separate user test.

## 2026-10-11 — latest Pages readiness verification
- Latest code-changing commit under review: `1752e25245f9a65da3985504c78097394c5e9a44`. Directly inspected **real** GitHub Actions run [38115779069](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38115779069), job `114400272095`: Vite/TypeScript PASS, **Vitest 86/86**, **Playwright 76/76 across 4 projects**, npm audit **0 vulnerabilities**; Pages-mode bundle validated local JavaScript/CSS assets (2), and release-only desktop/mobile browser test *discovery* passed (2 tests in one file). This validates code/test detection but **not hosted game execution**.
- GitHub repo is **private**. Previous actual Pages publishing job [38114576750](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114576750) failed `actions/configure-pages@v5` with **404** because Pages not enabled. No verified shareable URL; public web reachability check also failed.
- Current GitHub integration has no Pages admin/edit or workflow dispatch action. Do not pretend to enable Pages or run the manual release without it. Owner: **Settings → Pages → Source: GitHub Actions** (must have an eligible private-repo plan); then **Actions → Publish playable preview → Run workflow (main)**. Private repo privacy must not change without express authorization.
- Upon actual deployment the workflow should check hosted HTML/JavaScript and Chromium desktop/mobile gameplay & IndexedDB save/reload; not run yet. Browser emulation != real device.
- New owner checklist: `docs/OWNER_PAGES_ACTIONS.md`. The Actions run URL after manual publication must be inspected to confirm release status before providing a playable link.
- Docs-only commits are ignored by push CI; lack of commit status on a docs-only SHA is expected and **does not invalidate** the green code-changing SHA.


## 2026-10-11 — exact-release Pages gate and current publish status
- GitHub repo `CeLiCa-Sun/JAPAN-AUTO-TYCOON` is **public**. A direct site access test was not successful; **no actual Pages site/playing URL is verified**. GitHub Actions runs collection returned **no new `Publish playable preview` dispatch** after previous failing `38114576750`, whose `actions/configure-pages` step failed HTTP 404: Pages not configured.
- Current owner-required action: `Settings > Pages > Build and deployment > Source: GitHub Actions`, then manually `Actions > Publish playable preview > Run workflow (main)`. The connected GitHub connector can read runs but cannot change Pages settings or initiate workflow_dispatch.
- Release gating improvement in this stage: `scripts/stamp-pages-release.mjs` injects full 40-character `GITHUB_SHA` as HTML meta `jat-release-sha` only after Pages-mode build. CI validates the locally built stamp, Pages publish validates the same stamp on the **actual hosted HTML** before treating the release as fresh, and `tests-live/pages-playable.spec.ts` verifies the live version matches `PLAYWRIGHT_LIVE_SHA` before PC/mobile emulated gameplay and save/reload.
- Other existing browser E2E: Chromium desktop/mobile + Firefox + WebKit via CI; Vitest + npm audit moderate+ blocking. The latest exact new code SHA must have its own passing CI to qualify. **Stamped release + live gameplay tests have NOT been executed on a public site**.
- GitHub Actions latest inspected collection initially showed new build runs pending for `24762091`, `679a52a4`, `7706ff47`, `8ff9cfc`, with the last confirmed prior run `38116832464` for `defb4969` reporting success. Do not mark pending runs passed until their job conclusions and logs are verified.
- Status contract: report old successful CI at its SHA separately from new SHA tests; do not share any guessed Pages URL.

## 2026-10-11 — verified stamped-Pages build (new evidence)
- Latest verified green run: [38117046702](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117046702), tested SHA **7706ff470b481db4cf3a6e87750f28f2b88e5cd7**. Build PASS, 28 Vitest suites **86/86 PASS**, 4-browser Playwright **76/76 PASS**, npm audit **0 vulnerabilities**, Pages-mode asset check and `Pages HTML stamped for commit 7706...` PASS, two live-only tests discovered (not run against a real site).
- `tests-live/pages-playable.spec.ts` received an additional exact-SHA live assertion in SHA **8ff9cfcbe64fd7dc9ba3d3f1aad14827f747a773**. Its CI run **38117054703** was still in progress at the latest check. Treat it as UNVERIFIED pending a complete run; do not transfer 7706 PASS to it.
- Actions run collection showed **no new manual Pages publication** after old Pages failed run **38114576750**. A publicly playable URL and actual desktop/mobile save/reload results remain unverified.
