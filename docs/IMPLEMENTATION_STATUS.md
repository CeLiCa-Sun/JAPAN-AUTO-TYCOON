# Implementation status — 2026-10-11
Statuses: 未着手 / 設計済み / 実装中 / 仮実装 / 実装済み・未検証 / テスト失敗 / 検証済み.

## Stage 0
- React/Vite scaffold: 実装済み・未検証
- Calendar/commands/RNG: 仮実装。月次進行は現状カレンダー中心。
- Month phase engine: 仮実装。10 phase order exists; business domain phase handlers not connected; interruption semantics not production-ready.
- Journal validation and balances: 仮実装。残高/売掛・買掛/回収・支払の最小モデル。期間締め・税務・包括的会計基準なし。
- IndexedDB: 仮実装。単一世代の直前バックアップと復元、JSON import/export。暗号学的チェックサム・アトミックな二重保存・複数世代・スキーマ移行なし。
- State validation: 実装済み・未検証。
- Vitest and Playwright tests: コード作成済み・未実行。
- GitHub Actions: compile/unit/E2E workflow updated; success未確認。
- Finance/engine dashboard: 仮実装。PC/mobile browser validation not done。

## Stage 1 preview
- Inline engine geometry, theoretical piston speed, estimated constant-efficiency four-stroke performance and fuel flow: 仮実装、未検証。
- RPM curves, materials, advanced knock/heat/friction, bench testing, engine editor: 未着手。

## Later stages
- Stages 2–11: 未着手。47 prefectures, finite-resource NPCs, plant operations and motorsport remain required by specification.
