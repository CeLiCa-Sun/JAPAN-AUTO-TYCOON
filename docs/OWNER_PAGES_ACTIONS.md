# JAPAN AUTO TYCOON — GitHub Pages 公開に必要な操作

**RELEASE VERIFIED — 2026-10-11:** [公開プレイ版](https://celica-sun.github.io/JAPAN-AUTO-TYCOON/) は GitHub Pages 手動実行 [38117402371](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38117402371) で公開済み。**公開対象SHAは `fcdb05a39479184cbb7687d970ed18a9ce78059f`**。`verify-and-build` (job `114404945279`): npm audit 0件、Vitest 86/86、4ブラウザE2E 76/76、Pagesビルド合格。`publish` (job `114405308261`): Pages設定・デプロイ成功、実URLのHTML/JS取得とSHA照合成功、**実サイト上のPC/スマホ相当のChromium Playwright 2/2合格**（経営サイクル・IndexedDBセーブ/リロード）。スマホはエミュレーションであり実機ではない。旧記述の「未公開・Pages 404・実テスト未実施」は**過去の段階の履歴**であり現状を表さない。証拠の詳細: [`docs/RELEASE_VERIFICATION.md`](RELEASE_VERIFICATION.md)。後続のドキュメントのみのコミットは新たなゲーム公開を意味しない。

**現在、ユーザーによるPages設定・手動公開の再操作は不要です。** 新しいコードを再デプロイする場合だけ、Actionsから Publish playable preview を実行してください。既存の公開手順は次回リリース用の参照として残しています。


**確認日:** 2026-10-11
**公開状況:** リポジトリは **Public（公開）** と確認済み。ただし Pages のサイト公開は未確認。前回の公開ジョブ `38114576750` は `actions/configure-pages@v5` の HTTP 404 で失敗。現在の接続から Pages 設定変更・手動ワークフロー実行はできないため管理者操作が必要。

## ユーザーの必須操作（GitHub）
1. [リポジトリの Pages 設定](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/settings/pages) を開く。
2. **Build and deployment → Source → GitHub Actions** を選択して設定する（既に設定済みならそのまま）。現在のリポジトリは Public なので、通常は GitHub Free でも Pages を利用できる。設定項目が見当たらない場合はリポジトリの管理権限とサイト公開設定を確認する。公開済みであることと Pages サイトが稼働していることは別。
3. [Actions](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions) で **Publish playable preview** を選び、**Run workflow → main → Run workflow** を実行する。
4. `verify-and-build` と `publish` の両ジョブが成功したことを確認。GitHub設定の `Pages → Visit site` かジョブ `deployment.outputs.page_url` から初めて共有用URLを取得する。
5. 失敗した場合は、**失敗した Actions の実行URL**を次回の依頼に貼る。未設定／権限問題は無理にCIの制限を迂回しない。

## 現在確認済みの品質基準
- [成功したCI](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38115779069) — commit `1752e25245f9a65da3985504c78097394c5e9a44`: TypeScript/Vite、Vitest 86/86、Chromium desktop/mobile + Firefox + WebKit E2E 76/76、`npm audit` 0件、Pages-modeアセット存在確認（2件）、公開後テストの検出（2件）がすべて成功。
- 上記CIは、**Pagesサイトで実際に遊べることを証明するものではない**。公開サイトの実接続と保存・復元テストは未実行。
- 公開ジョブは **公開後** にHTTPS HTML/JavaScript到達確認、デスクトップ／スマホ相当のChromiumによるゲーム開始→部品発注→製造→販売→仕入代金支払→再読込→保存復元まで検査する。シミュレータは実機テストではない。
- [GitHub公式 Pages 設定手順](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub公式 プラン要件](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## 注意
リポジトリは既に Public。Pagesで公開するとサイトの静的アセットも一般に閲覧可能になる。公開操作は自分の意思で実施する。パス、URL、CI成功表示を推測だけで共有しない。

## 2026-10-11 追加状況
- GitHub連携の `get_repo` が `visibility: public` を返したことを確認。公開URLは現在も実稼働未確認。
- `.github/workflows/publish-preview.yml` の事前検証で落ちた場合も、コミットの `JAPAN AUTO TYCOON / Pages` に失敗ステータスと実行URLを残す改善を追加。公開ワークフローは `workflow_dispatch` のみ。
- Pages設定後に **Publish playable preview** を手動実行し、公開済みのHTMLとJavaScript、PC・スマホ相当のChromiumで経営サイクルとIndexedDBセーブの復元を確認する。
