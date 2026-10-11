# JAPAN AUTO TYCOON

日本を舞台に1950年から100年以上の経営を目指す自動車メーカー経営シミュレーション。

> **最小プレイ試作版（動作コードのCI検証済み、公開は未完了）**。Actions run `38114679080` でビルド・Vitest 86件・4ブラウザE2E 76件・npm監査0件を確認。GitHub Pagesは未設定のため公開に失敗しました。完成版ではありません。

## 起動

Node.js 22+ を使用。

```bash
npm ci
npm run dev
npm run build
npm test
```

Reactアプリの「経営サイクル（プレイ試作）」から資金投入→部品発注→製造→需要に応じた販売→仕入先支払を操作できます。単一HTML試作版 `prototypes/index.html` は独立した旧デモです。

**公開URLはまだ確認されていません。** GitHub Pagesの手動デプロイ準備については `docs/PUBLISH_PREVIEW.md` を参照してください。

## 実装状況

- React/Vite/TypeScript画面、月次進行、複式仕訳、世代バックアップ付きIndexedDBセーブ：実装済み（CI検証済みの試作版）
- エンジン設計・BOM・原価ロット・仕掛品・完成品・簡易価格需要：試作実装済み（CI検証済みの試作版）
- 本格的な工場18工程、NPC市場、レース、税務、長期経営検証：未完成

詳細は `docs/ROADMAP.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/HANDOFF.md` を参照。

## 原則

ゲーム計算はUI非依存。取引は二重計上禁止。進行は再現可能であること。未実装や未検証の機能を完成扱いしないこと。
