# JAPAN AUTO TYCOON

日本を舞台に1950年から100年以上の経営を目指す自動車メーカー経営シミュレーション。

> **Phase 2プレイ試作版（公開・ライブ動作確認済み）**。GitHub Pagesの公開ジョブ [38119727017](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119727017) でVitest **88/88**、4ブラウザE2E **85件合格・3件スキップ**、npm監査 **0件**、実公開サイトのPC・スマホ相当Playwright **2/2** に合格。正式な完成版ではありません。

## 起動

Node.js 22+ を使用。

```bash
npm ci
npm run dev
npm run build
npm test
```

Reactアプリの「経営サイクル（プレイ試作）」から資金投入→部品発注→製造→需要に応じた販売→仕入先支払を操作できます。単一HTML試作版 `prototypes/index.html` は独立した旧デモです。

**今すぐプレイ： [GitHub Pages 公開試作版](https://celica-sun.github.io/JAPAN-AUTO-TYCOON/)**（公開済みコミット：`4cffad1e30bf5f478e40f7d7f7f89487e07cee71`）。公開テストと制約は `docs/RELEASE_VERIFICATION.md`。今後の再公開手順は `docs/PUBLISH_PREVIEW.md` を参照。

## Phase 2で公開済みの改善

- 初回起動・再読込時に `slot-1` の整合性確認済みセーブを自動復元します。バックアップ世代が使われたときは復元元を表示します。
- 月次進行は保存成功後にゲーム状態へ反映。保存競合では画面を進めずエラーを表示します。
- スマホ向けに経営サイクルへのショートカット、大きな操作ボタン、価格候補・進捗ガイドを追加しています。
- 125年間の月次計算と100年間の会計残高の不変条件を自動検査するテストを追加しています。これは**経済バランスや全18製造工程の耐久検証ではありません**。

これらの変更は **Pagesの公開版 `4cffad1e...` に反映済み**です。通常のpushでは再公開されません。次回のゲーム変更後はCI合格を確認し、Actionsから `Publish playable preview` を手動実行します。公開テスト証拠：[`docs/RELEASE_VERIFICATION.md`](docs/RELEASE_VERIFICATION.md)。

## 実装状況

- React/Vite/TypeScript画面、月次進行、複式仕訳、世代バックアップ付きIndexedDBセーブ：実装済み（CI検証済みの試作版）
- エンジン設計・BOM・原価ロット・仕掛品・完成品・簡易価格需要：試作実装済み（CI検証済みの試作版）
- 本格的な工場18工程、NPC市場、レース、税務、長期経営検証：未完成

詳細は `docs/ROADMAP.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/HANDOFF.md` を参照。

## 原則

ゲーム計算はUI非依存。取引は二重計上禁止。進行は再現可能であること。未実装や未検証の機能を完成扱いしないこと。
