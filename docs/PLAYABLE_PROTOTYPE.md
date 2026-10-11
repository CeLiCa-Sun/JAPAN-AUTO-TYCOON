# JAPAN AUTO TYCOON — プレイ試作ガイド (2026-10-11)

> **公開済みのプレイ試作版:** https://celica-sun.github.io/JAPAN-AUTO-TYCOON/ （公開SHA `fcdb05a39479184cbb7687d970ed18a9ce78059f`）。[Pages実行 38117402371](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117402371) でビルド、Vitest 86/86、4ブラウザE2E 76/76、npm監査0件、公開先HTML・JS、実サイトでのChromium PC/スマホ相当E2E 2/2合格を確認。スマホはエミュレーションであり実機ではありません。完成版ではありません。

## Start locally
1. Install Node.js 22 and use `npm ci` (lockfile committed and audited).
2. Run `npm run dev`; open the URL printed by Vite in your browser.
3. With a fresh save state, find **経営サイクル（プレイ試作）** and press **1. 新規経営デモ開始**.
4. Choose 1–10 engines, press **2. 部品を発注・納入**, then **3. エンジン製造**.
5. Set the price in yen, inspect fictional demand, press **4. 完成品を販売**, and **5. 仕入代金を支払う**.
6. To keep playing after a refresh, press **読み込み** in the save section. Automatic saves occur after each successful business-cycle operation.
7. If starting with old data or another open tab, explicitly load the most recent save. Conflicting writes are rejected in supported cases.

## Current playable scope
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
- [x] 公開SHA `fcdb05a39479184cbb7687d970ed18a9ce78059f` の TypeScript/Vite Pages ビルド成功
- [x] Vitest **86/86** 成功
- [x] Chromium desktop/mobile、Firefox、WebKitの E2E **76/76** 成功
- [x] `npm audit --audit-level=moderate` で脆弱性 **0件**
- [x] Pages の公開HTML・JavaScript取得、配布コミットSHA照合成功
- [x] 公開HTTPSサイト上のChromium desktop・Pixel 7相当エミュレーションで、仕入→製造→販売→決済→再読込とセーブ復元 **2/2** 成功
- [ ] 物理的なPC・iPhone・Androidでの手動実機確認
- [ ] 正式版の18工程・NPC経営・経済長期バランス検証

最新の裏付けは [RELEASE_VERIFICATION.md](RELEASE_VERIFICATION.md)。`main` の後続コミットは再公開するまで実際の公開版には反映されません。

## Latest verified CI milestone
- [38114198670](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114198670): build PASS, 86/86 unit PASS, 76/76 desktop/mobile E2E PASS, npm audit 0 findings.
- Lockfile committed to main in `237f3400fd4f3b8f4da84b4f93d154c2768679a3`, verified in repository.
- Pages one-time release attempt was configured; use `JAPAN AUTO TYCOON / Pages` commit status and `docs/PUBLISH_PREVIEW.md` to confirm actual publication. Do not infer a public URL from a workflow configuration alone.
