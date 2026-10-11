# Phase 2 — accessibility, automatic saves and 125-year test checkpoint

**現行の最新公開判定（2026-10-11）：** GitHub Pages [プレイURL](https://celica-sun.github.io/JAPAN-AUTO-TYCOON/) は Phase 2 を **SHA `4cffad1e30bf5f478e40f7d7f7f89487e07cee71`** で公開済み。 [Pages run 38119727017](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119727017) の `verify-and-build` と `publish` が両方 SUCCESS、Vitest **88/88**、4ブラウザE2E **85合格・3スキップ・0失敗**、npm audit **0件**、公開HTML/JSとSHA検証、および公開サイトのChromium PC/スマホ相当（Pixel 7エミュレーション）ライブテスト **2/2合格**。自動復元・月次自動保存・モバイル価格候補もライブで確認。後続の [CI 38120046383](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38120046383) もSUCCESSだが**再公開を意味しない**。公開ワークフローは一時push起動から **`workflow_dispatch` 手動専用に戻した**。物理iPhone/Android/PCでの手動試験、およびNPC競争・本格18工程・経済の長期バランス検証は未実施・未完成。以前の「未公開」「CI実行中」「SHA fcdb05a」は履歴であり現行状態ではない。根拠： [docs/RELEASE_VERIFICATION.md](RELEASE_VERIFICATION.md)。

Date: 2026-10-11

## Source vs deployed release
- **Still live:** https://celica-sun.github.io/JAPAN-AUTO-TYCOON/
- **Deployed source SHA:** `fcdb05a39479184cbb7687d970ed18a9ce78059f`. Verified manual Pages run [38117402371](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117402371): 86 unit tests, 76 local browser E2E, zero audited npm vulnerabilities and 2/2 real-site Chromium desktop/mobile-emulated gameplay and restore.
- Phase 2 development SHA has **not** been deployed. Main branch changes do not auto-publish. A new manual Pages workflow run is needed after complete green CI.

## Implemented Phase 2 changes
1. Startup of the default `slot-1` now automatically recovers the latest intact IndexedDB record (or previous valid generation). It waits before enabling the game UI and reports recovery results. Other slots still require manual loading.
2. Advancing 1, 3, 6 or 12 months now writes with `saveAtomic` before React commits the next state. Failed saves leave the displayed month unchanged, prevent rapid double-advancement, and show the storage error.
3. Responsive mobile controls: clear navigation to the playable cycle/save manager, full-width gameplay region, >=44px touch-friendly buttons, quantity/price numeric keyboard hints, 350k/420k/900k yen price presets, and a five-stage progress indicator.
4. Added `tests/long-term-endurance.test.ts` to exercise 1,500 months (125-year deterministic calendar/save replay) and a separate 1,200 months (100-year accounting invariant). This is a **calendar/save/accounting endurance check**, not an 18-stage factory or economy-balance simulation.
5. Added `e2e/auto-resume-mobile.spec.ts`; rewrote `e2e/multi-tab-save.spec.ts` for auto-saved months and Web Locks checks. Updated `e2e/generations.spec.ts`, `e2e/storage.spec.ts`, `e2e/smoke.spec.ts`, and `e2e/quota.spec.ts` to reflect the new persistence contract.

## Test provenance, do not overstate
- Initial Phase 2 code CI attempts failed TypeScript compilation due to an unclosed React.StrictMode tag. Fixed in `1351d3371a077271fabec8c15ac88874973f2580`.
- That version's [CI 38118971035](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38118971035) passed TypeScript/Vite, Vitest **88/88**, Pages-mode build/discovery and audit **0 vulnerabilities**, but failed **17** old Playwright assertions across generations, storage, smoke, and one quota test (68 passed, 3 skipped). They assumed month movement did not autosave, an obsolete behavior after Phase 2. This is a **real CI failure**, not a release pass.
- Four affected E2E files were corrected at commits `38d50c4e`, `677e17d1`, `b221ac06`, `c9e5a443`; replacement quota test injects a save failure during month advancement and checks that the displayed month remains unchanged.
- [Follow-up CI 38119188065](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119188065) tests latest code SHA `c9e5a443598331e110f5e039a7a9a66d1dd56d91`. **PENDING until complete job logs prove a full four-browser E2E pass**. Build, Vitest, Pages-mode build and release-test discovery steps had passed at the last inspection.
- No new public release, no live physical device verification and no long-term business-economy balance proof.

## Release requirements
- Exact code-changing SHA has a successful real GitHub Actions CI with build + **all** unit tests + complete Chromium desktop/mobile, Firefox, WebKit E2E and npm moderate-or-higher audit gate.
- Owner manually triggers `Publish playable preview` on `main`.
- Job must validate deployed HTML release SHA and pass the real HTTPS Playwright desktop/mobile tests for business operations and save/reload.
- Actual physical iPhone/Android testing is an additional separate check.

## Subsequent Firefox race regression (verified, after the above checkpoint)
- Run [38119188065](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119188065), code SHA `c9e5a443598331e110f5e039a7a9a66d1dd56d91`: build, Vitest **88/88**, Pages build/test-discovery and npm audit 0 **PASS**. Browser E2E **83 passed, 2 FAILED, 3 skipped**; the only failures were `e2e/generations.spec.ts` and `e2e/storage.spec.ts`, both in Firefox.
- The race arose when tests used a previous `自動保存済み` message as evidence a later month operation had finished, and when a manual Save could fire before the in-progress month save committed. The first could overwrite corrupted test fixtures after injection; the second produced an expected stale-revision conflict rather than the test's expected successful save.
- Code fix `86fc73aaa04e82c55775997f0aec2a77c934ca8b`: display `月次進行を保存中…` and temporarily disable Save/Load/Backup/Import while a month advance is saving. Test fixes `6212de654752979c84501b7ede7dbb89bf6485f0` and `d09bf6c4a35d7b975d2ff66b77b5d4addff3aaf3`: await the actual month rendering before backup corruption and manual Save.
- New matching CI run [38119375890](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119375890) is **pending** at checkpoint. Do NOT claim full browser E2E success or redeploy based on the failed earlier run.

## Verified correction checkpoint (2026-10-11)
- [CI run 38119361817](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119361817) at code SHA `86fc73aaa04e82c55775997f0aec2a77c934ca8b`: real Actions logs confirm **build PASS, Vitest 88/88 PASS, desktop/mobile Chromium + Firefox + WebKit E2E 85 passed / 3 skipped / 0 failed, npm audit 0 vulnerabilities**. This verifies the actual save-in-progress UI conflict fix.
- Follow-on [CI run 38119373199](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119373199) at `6212de654752979c84501b7ede7dbb89bf6485f0`: **completed successfully** with the extra generation-test synchronization change.
- Last code-changing SHA `d09bf6c4a35d7b975d2ff66b77b5d4addff3aaf3` changes the storage-recovery test to wait for the committed month. Matching [CI run 38119375890](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119375890) was **still running** at this checkpoint; report separately until completion.
- Deployed preview remains the earlier SHA `fcdb05a...`, even after these verified green code commits. It must be manually released and live-tested before stating new auto-resume features are publicly available.
