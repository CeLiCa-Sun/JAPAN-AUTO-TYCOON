# JAPAN AUTO TYCOON

日本を舞台に1950年から100年以上の経営を目指す自動車メーカー経営シミュレーション。

> **最小プレイ試作版（最新版CI未検証）**。過去のStage 0はActions run 38110349471で合格済みですが、その後の変更は最新版CIの全件合格を確認する必要があります。完成版ではありません。

## 起動

Node.js 22+ を使用。

```bash
npm install
npm run dev
npm run build
npm test
```

Reactアプリの「経営サイクル（プレイ試作）」から資金投入→部品発注→製造→需要に応じた販売→仕入先支払を操作できます。単一HTML試作版 `prototypes/index.html` は独立した旧デモです。

**公開URLはまだ確認されていません。** GitHub Pagesの手動デプロイ準備については `docs/PUBLISH_PREVIEW.md` を参照してください。

## 実装状況

- React/Vite/TypeScript画面、月次進行、複式仕訳、世代バックアップ付きIndexedDBセーブ：実装済み（最新版未検証）
- エンジン設計・BOM・原価ロット・仕掛品・完成品・簡易価格需要：試作実装済み（最新版未検証）
- 本格的な工場18工程、NPC市場、レース、税務、長期経営検証：未完成

詳細は `docs/ROADMAP.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/HANDOFF.md` を参照。

## 原則

ゲーム計算はUI非依存。取引は二重計上禁止。進行は再現可能であること。未実装や未検証の機能を完成扱いしないこと。
