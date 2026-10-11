# JAPAN AUTO TYCOON — プレイ試作ガイド (2026-10-11)

> **Phase 2公開済みのプレイ試作版:** https://celica-sun.github.io/JAPAN-AUTO-TYCOON/ （公開SHA `4cffad1e30bf5f478e40f7d7f7f89487e07cee71`）。[Pages実行 38119727017](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119727017) でVitest **88/88**、4ブラウザE2E **85件合格・3件スキップ**、npm監査 **0件**、実公開サイトのChromium PC/スマホ相当のセーブ復元・経営操作テスト **2/2合格**。スマホはエミュレーションであり実機ではありません。完成版ではありません。

## Start locally
1. Install Node.js 22 and use `npm ci` (lockfile committed and audited).
2. Run `npm run dev`; open the URL printed by Vite in your browser.
3. With a fresh save state, find **経営サイクル（プレイ試作）** and press **1. 新規経営デモ開始**.
4. Choose 1–10 engines, press **2. 部品を発注・納入**, then **3. エンジン製造**.
5. Set the price in yen, inspect fictional demand, press **4. 完成品を販売**, and **5. 仕入代金を支払う**.
6. The default `slot-1` automatically restores on reopening or refresh; you no longer need to press **読み込み** for that slot. Month progression and successful business-cycle operations are automatically saved. Use **読み込み** for other slots.
7. When changing to another slot or resolving conflicts between tabs, use **読み込み** to refresh the active state. Outdated competing writes are rejected in supported cases.

## Current playable scope
- Phase 2: startup auto-restore for slot-1; atomic month autosaves, mobile shortcut navigation, touch-friendly controls, price presets, five-stage progress guide.
- Initial demo equity 10,000,000 yen; suppliers instant deliver at fixed preview prices; stored supplier purchase orders and liability postings.
- Input BOM: 1 engine block + 4 pistons per engine; FIFO material costs, WIP and finished goods; production overhead credited to cash.
- Fictional demand responds to player unit price; rival benchmark is 450,000 yen/unit and same-month sales consume finite modeled buyer capacity.
- Unsold finished goods remain in inventory; selling posts revenue and cost of goods sold; supplier settlement reduces payable and cash.
- Cash history is derived from actual existing journal entries, not fabricated transactions.
- Saves support legacy data formats, validation, backup generations, Web Locks best-effort cross-tab coordination and stale-revision conflict errors.

## Known limitations / not yet implemented
- No simulated individual buyers, contract negotiations, actual competing manufacturers, macroeconomic demand forecast, credit scoring or stock market.
- Production executes immediately; the separate 18-step capacity planner does not yet schedule real work orders or factory events.
- Fixed supplier prices and immediate delivery in UI (although the procurement domain supports due dates and registered partial receipt).
- No comprehensive taxes, accounting periods, warranty reserves, external product demand datasets, depreciation journal integration, durable crash recovery guarantees or fully calibrated engine physics.
- Prices and demand are scenario parameters, not real historical car sales or economy estimates.
- Existing `FactoryPanel` is an independent legacy demo. Its seeded inventory cannot be mixed into the new procured-cost flow.

## 公開試作版の検証記録（2026-10-11）
- [x] Pages公開SHA `4cffad1e30bf5f478e40f7d7f7f89487e07cee71`、配布HTMLのSHAとJSを実確認
- [x] Vitest 88/88
- [x] ローカル4ブラウザE2E：85合格・3スキップ
- [x] npm audit 0件
- [x] 公開URLでPC/スマホ相当Chromium 2/2：新UI、経営サイクル、起動時自動復元、月次自動保存・再読込、価格候補
- [ ] 物理PC・iPhone・Androidでの手動確認
- [ ] 長期実経済バランス、NPC経営、実際の18工程の完全実装・検証

[最新版公開証拠](RELEASE_VERIFICATION.md)。GitHub `main` の後続文書コミットは公開ソースSHAと区別します。

## Latest verified CI milestone
- [38114198670](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114198670): build PASS, 86/86 unit PASS, 76/76 desktop/mobile E2E PASS, npm audit 0 findings.
- Lockfile committed to main in `237f3400fd4f3b8f4da84b4f93d154c2768679a3`, verified in repository.
- Pages one-time release attempt was configured; use `JAPAN AUTO TYCOON / Pages` commit status and `docs/PUBLISH_PREVIEW.md` to confirm actual publication. Do not infer a public URL from a workflow configuration alone.
