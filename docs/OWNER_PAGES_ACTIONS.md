# JAPAN AUTO TYCOON — GitHub Pages 公開に必要な操作

**確認日:** 2026-10-11
**公開状況:** 未公開。非公開リポジトリ `CeLiCa-Sun/JAPAN-AUTO-TYCOON` で Pages が未設定。前回の公開ジョブ `38114576750` は `actions/configure-pages@v5` の HTTP 404 で失敗。設定を変更する外部権限は現在の GitHub 接続にないため、管理者の操作が必要。

## ユーザーの必須操作（GitHub）
1. [リポジトリの Pages 設定](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/settings/pages) を開く。
2. **Build and deployment → Source → GitHub Actions** を選択して設定する（既に設定済みならそのまま）。Pages項目自体が利用できない場合、GitHubの契約プランを確認する。GitHub FreeのプライベートリポジトリからはPagesを公開できず、GitHub Pro／Team／Enterprise等が必要。リポジトリは勝手に公開状態へ変更しない。
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
GitHub Pagesで公開すると、元のリポジトリがプライベートでも、通常は公開したウェブコンテンツがインターネットから閲覧可能。公開操作は自分の意思で実施する。パス、URL、CI成功表示を推測だけで共有しない。
