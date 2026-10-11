# Phase 2: UI・自動復元の公開検証

**記録日:** 2026-10-11
**今回の公開候補SHA:** `4cffad1e30bf5f478e40f7d7f7f89487e07cee71`
**公開実行:** https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119727017

## 機能差分
- IndexedDB `slot-1` の起動時自動復元。復元確認前にユーザー操作を許可しない。
- 月次進行の書き込みを成功させてからUIを進める。書き込み中は手動保存・読込・バックアップ復元・JSON取込を無効化。
- モバイルでの横スクロール抑制、操作ボタン大型化、価格候補・経営ステップ進捗・主要画面へのナビゲーション。
- 125年/1500か月の決定論的進行・セーブ整合性と100年/1200か月の会計仕訳耐久テスト。
- 既存の自動保存前提でなかった世代復元・失敗注入・複数タブ回帰テストを修正。

## 実際に検証したこと
- 過去の公開版: [run 38117402371](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117402371) は別のSHA `fcdb05a...` に対し、Vitest 86、4ブラウザE2E 76、npm audit 0、公開サイト上E2E 2件合格。この合格を新UIへ流用しない。
- 新版の既知の合格: [run 38119361817](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119361817) / SHA `86fc73aa...`: 単体88件、ブラウザ85件合格・3件スキップ、監査0件。後続 [38119373199](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119373199) / SHA `6212de65...` は成功。
- この公開候補は **新規公開ワークフロー `38119727017` の実行結果で最終判定する**。単体・E2E・セキュリティ監査・Pages配布SHA・HTTPSアセット・ライブ自動復元のすべてが揃うまで公開成功と記録しない。

## 今回のリリース操作
GitHub接続が任意の `workflow_dispatch` 実行操作を持たないため、ユーザーの今回の公開依頼に基づいて、`.github/workflows/publish-preview.yml` に **1回限定の明示的な release(phase2): コミットでのみ起動するpushトリガー**を追加した。ワークフローには元々の完全な品質ゲートがあり、すべて成功するまでPages更新ジョブは開始しない。

**実行完了後はpushトリガーを取り除き、元の手動 `workflow_dispatch` 専用へ戻す。** 通常のソース変更で勝手に公開される設定を継続しない。

## 公開後の実サイト受入条件
1. URL: https://celica-sun.github.io/JAPAN-AUTO-TYCOON/
2. ページとJS取得に成功し、`<meta name="jat-release-sha">` が公開候補の完全SHAと一致する。
3. Chromium PCとPixel 7相当モバイルエミュレーションの両方で、資金→仕入→製造→販売→買掛支払、再読込時の**自動**セーブ復元、月次自動保存、セーブ・ロード、スマホ価格候補を確認する。
4. 実機（物理スマホ・PC）での手動確認は別途未実施として扱う。
