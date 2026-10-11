# JAPAN AUTO TYCOON — verified playable preview release

**Release date:** 2026-10-11
**Status:** PUBLIC PREVIEW DEPLOYED AND VERIFIED IN CI. Not a completed game.

## Playable URL
https://celica-sun.github.io/JAPAN-AUTO-TYCOON/

**Deployed commit:** `fcdb05a39479184cbb7687d970ed18a9ce78059f`
**Release workflow run:** https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117402371
**Verified GitHub Pages status:** `JAPAN AUTO TYCOON / Pages` = `success` on deployed commit, target URL as above.

## Independently inspected GitHub Actions evidence

### verify-and-build job `114404945279`
- GitHub Pages setting/API preflight: SUCCESS (previous missing-site 404 has been resolved).
- Locked Node 22 `npm ci`: SUCCESS.
- `npm audit --audit-level=moderate`: **0 vulnerabilities** at release time.
- Vite build in Pages mode: SUCCESS.
- Injected HTML `jat-release-sha` marker for **fcdb05a...**, matches release SHA.
- Vitest: 28 files, **86/86 tests passed**.
- Local Playwright E2E: **76/76 passed**, Chromium desktop, Chromium mobile emulation, Firefox, WebKit.
- Pages artifact upload: SUCCESS, ID `11694471218`.

### publish job `114405308261`
- `actions/configure-pages`: SUCCESS.
- `actions/deploy-pages`: SUCCESS.
- Real hosted HTML fetched via `curl --fail`: SUCCESS.
- HTML release SHA matches the deployed commit: SUCCESS.
- Hosted primary JavaScript asset fetched: SUCCESS.
- Playwright **2/2 passed** on the actual HTTPS Pages URL:
  - Desktop Chromium
  - Pixel 7-style mobile Chromium emulation
- Live test covers site load, start capital, supplier purchase, manufacture, market sale, payable settlement, refresh, IndexedDB save load, month advancement, manual save, and refresh/restore.
- Pages SHA-specific status was recorded as **success** and linked to the deployed URL.
- The browser-based acceptance is **device emulation**, not physical iPhone/Android or a user-operated PC test. The live site was additionally reachable to GitHub-hosted test runners. A separate web-inspection client was unable to retrieve the page; this is not evidence of an outage after the successful live runner tests.

## Scope and known limitations
- Playable **small accounting/manufacturing loop**, not the full long-term Japanese auto manufacturing simulation.
- Demand is fictional and suppliers are demo fixtures. NPC manufacturer AI, true factory 18-step execution, taxation, finance realism, product physics calibration and long-haul balance are incomplete.
- On first visit choose **新規経営デモ開始** → **部品を発注・納入** → **エンジン製造** → **完成品を販売** → **仕入代金を支払う**. Reload requires the save section's **読み込み** action; the browser stores IndexedDB data on the current browser/origin.
- A GitHub Pages release only serves static code. The game does not have a server-side shared save cloud. Browser storage can be cleared; use **JSON出力** for personal backup.

## Release policy and follow-up
- Current deployed game commit is **fcdb05a...** even if the repo main branch gains docs-only commits after release. Never treat the main branch's later commit as deployed until its own release and live SHA check succeeds.
- New code changes require new build/unit/E2E/security CI and another **manual** `Publish playable preview` run to update Pages.
- For real-device verification, test opening the URL on physical PC and phone and verify a full cycle plus refresh/save load. Report browser/device and any issue for further fixes.
- If the release URL stops working, inspect the current Pages status and GitHub Actions logs, and verify the hosted release marker against the intended release SHA.
