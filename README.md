# JAPAN AUTO TYCOON

日本を舞台に1950年から100年以上の経営を目指す自動車メーカー経営シミュレーション。

> **Stage 0 scaffold: 未完成・未検証**。このリポジトリは現段階では遊べる完成版ではありません。

## 起動

Node.js 22+ を使用。

```bash
npm install
npm run dev
npm run build
npm test
```

独立した単一HTML試作版は `prototypes/index.html` をブラウザで開いてください。月次送りと簡易保存のみで、本番実装とは別物です。

## 実装状況

- React/Vite/TypeScript UI骨格、1/3/6/12ヶ月進行、決定的乱数：実装済み・未検証
- 整合性確認付き複式仕訳、簡易IndexedDBセーブ：仮実装・未検証
- エンジン設計、工場、マーケット、NPC、レース、長期テスト：未実装

詳細は `docs/ROADMAP.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/HANDOFF.md` を参照。

## 原則

ゲーム計算はUI非依存。取引は二重計上禁止。進行は再現可能であること。未実装や未検証の機能を完成扱いしないこと。
