# Implementation status — 2026-10-11
Categories: 未着手 / 設計済み / 実装中 / 仮実装 / 実装済み・未検証 / テスト失敗 / 検証済み.
- A CI/build/E2E: test scaffolds committed; no successful build or runtime verified.
- B Engine Stage 1: compression gain, friction and heuristic knock/pumping modifier added to preview power. 未較正・仮実装. Combustion heat dynamics, real knock detection and durability not yet implemented.
- C Finance: loan repayment (interest vs principal), asset capital purchase, exact-total scheduled depreciation and related tests. 仮実装. Period close, actual cash-flow statement and ledger-backed loan registry remain unimplemented.
- D Saves: SHA-256 envelope and 3-generation rotation written in one IDB transaction; UI now uses it. 既存のschemaVersion=1のprimary saveをread-only legacy pathで読み込める。自動移行は次回保存時のみ。未検証。Legacy generations and corrupted envelope test coverage incomplete.
- Long-run: only 1200-month calendar test committed; real economy simulation unavailable.
- Stages 2–11: 未着手. Quality gates have NOT passed.
