# JAPAN AUTO TYCOON

日本を舞台に1950年から100年以上の経営を目指す自動車メーカー経営シミュレーション。

> **ブラウザで遊べる最小プレイ試作版（公開・ライブ動作確認済み）**。GitHub Pagesの公開ジョブ `38117402371` でビルド、Vitest **86/86**、4ブラウザE2E **76/76**、npm監査 **0件**、実サイトのPC・スマホ相当のPlaywright **2/2** に合格。正式な完成版ではありません。

## 起動

Node.js 22+ を使用。

```bash
npm ci
npm run dev
npm run build
npm test
```

Reactアプリの「経営サイクル（プレイ試作）」から資金投入→部品発注→製造→需要に応じた販売→仕入先支払を操作できます。単一HTML試作版 `prototypes/index.html` は独立した旧デモです。

**今すぐプレイ： [GitHub Pages 公開試作版](https://celica-sun.github.io/JAPAN-AUTO-TYCOON/)**（公開済みコミット：`fcdb05a39479184cbb7687d970ed18a9ce78059f`）。公開テストと制約は `docs/RELEASE_VERIFICATION.md`。今後の再公開手順は `docs/PUBLISH_PREVIEW.md` を参照。

## 実装状況

- React/Vite/TypeScript画面、月次進行、複式仕訳、世代バックアップ付きIndexedDBセーブ：実装済み（CI検証済みの試作版）
- エンジン設計・BOM・原価ロット・仕掛品・完成品・簡易価格需要：試作実装済み（CI検証済みの試作版）
- 本格的な工場18工程、NPC市場、レース、税務、長期経営検証：未完成

詳細は `docs/ROADMAP.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/HANDOFF.md` を参照。

## 原則

ゲーム計算はUI非依存。取引は二重計上禁止。進行は再現可能であること。未実装や未検証の機能を完成扱いしないこと。
