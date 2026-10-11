# JAPAN AUTO TYCOON — 最新公開版の検証記録

**確認日:** 2026-10-11
**状態:** Phase 2 プレイ試作版を公開済み・GitHub Actionsによる公開サイト受入テスト合格（正式完成版ではありません）

## 公開URL・正確な公開ソース

- **プレイ:** https://celica-sun.github.io/JAPAN-AUTO-TYCOON/
- **配布済みの完全SHA:** `4cffad1e30bf5f478e40f7d7f7f89487e07cee71`
- **Pagesデプロイ実行:** https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119727017
- **実行イベント:** `push`（Phase 2 を一度だけ公開するための一時的トリガー）。実行成功後、公開ワークフローは `workflow_dispatch` **手動専用へ復元**。
- **根拠:** 公開対象のSHA `4cffad1e…` に付いた `JAPAN AUTO TYCOON / Pages = success` ステータスの公開URL、および実際のActionsジョブログ。

## 公開ビルドのテスト証拠

### verify-and-build — job 114411780252 / PASS
- GitHub Pages設定チェック・Node 22の`npm ci`・TypeScript/Vite Pages-mode ビルド：合格
- `npm audit --audit-level=moderate`：**0件**
- Vitest：**29ファイル、88/88件合格**
- Playwright：**85件合格、3件スキップ、0件失敗**（Chromiumデスクトップ、Chromiumスマホ相当、Firefox、WebKit）
- `dist/index.html` 内の `jat-release-sha` が完全公開SHAと一致。Pagesアップロード成功。

### publish — job 114414636964 / PASS
- `actions/configure-pages`、`actions/deploy-pages`：成功
- **実際の公開HTTPS URL**のHTMLを`curl --fail`で取得し、HTMLの完全SHAを照合：成功
- 実際の公開サイトが読み込むJavaScriptアセットを取得：成功
- 公開サイトに対するPlaywright **2/2件合格**：
  - Chromium Desktop
  - Pixel 7相当のChromiumモバイルエミュレーション
- 公開サイトでの操作：ゲーム起動→資本金投入→部品発注・納品→製造→販売→買掛金支払い→ページ再読込による**自動**復元→手動読込→月次進行の**自動**保存→再読込・復元。モバイルでは350,000円の価格候補と横スクロールの有無も検査。
- `JAPAN AUTO TYCOON / Pages` ステータス：**success**、公開URLへリンク。

### 後続CI（サイト公開版とは別）
- ソースCI [38119727011](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38119727011) ：公開対象SHAのCI成功。
- 手動専用公開トリガーへの復元コミット `16e7c289031e1577031262c7ba665138c55f9f09` の [CI 38120046383](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38120046383) も **成功**：Vitest88/88、E2E85件合格・3件スキップ、npm監査0件。**これはPagesの再公開ではありません**。
- `main` の後続ドキュメントコミットはサイトの公開SHAではありません。

## 実際に利用可能になったPhase 2機能
- デフォルト`slot-1`保存データの起動時自動復元、破損データ時のバックアップ世代への復元
- 月次進行のアトミック自動保存。保存失敗時に年月を確定しない。保存中の競合操作は抑止
- スマホ向けショートカット・大型ボタン・価格プリセット・5段階経営進捗ガイド
- 125年間／1,500か月のモデル暦・保存不変条件と100年間／1,200か月の会計不変条件の単体テスト

## 限界と注意
- 実サイトのブラウザ試験は**GitHubホストのChromium**によるPC/スマホ相当の自動操作。**物理iPhone/Android/実機PC**での手動確認ではありません。
- 公開サイトは静的アプリで、セーブは端末・ブラウザのIndexedDB内。クラウド同期はありません。バックアップ用にJSON出力を推奨。
- 125年テストは暦・コマンド再現性・会計不変条件の確認であり、完成版のNPC競争・工場18工程・需要経済の長期バランスを証明しません。
- 別のウェブ閲覧クライアントからはページ取得に失敗しましたが、上記GitHub Actionsの**実公開HTTPSリクエストとデプロイ後2件の受入試験**は成功しています。現在時点のすべてのネットワーク・端末に対する可用性を保証するものではありません。
- 次回のゲームコード再公開は、CI合格後にリポジトリ管理者が **Actions → Publish playable preview → Run workflow** を手動で実行してください。

## 旧公開版（履歴）
- 以前の配布SHA：`fcdb05a39479184cbb7687d970ed18a9ce78059f`
- [旧Pages実行 38117402371](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117402371) は88件ではなくVitest86件、ブラウザ76件、ライブ2件合格でした。現在の公開ソースの根拠ではありません。
