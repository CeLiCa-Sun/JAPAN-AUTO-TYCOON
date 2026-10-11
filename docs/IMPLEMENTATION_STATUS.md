# Implementation status — 2026-10-11
Status categories: 未着手 / 設計済み / 実装中 / 仮実装 / 実装済み・未検証 / テスト失敗 / 検証済み.

## Stage 0 / baseline
- React/Vite/TS, deterministic RNG, calendar commands: 実装済み・未検証.
- Accounting transactions: 仮実装. Loan liability and fixed-asset/depreciation accounts added; chart-of-accounts checks extended.
- Financial reports: 仮実装. Snapshot, P/L, B/S skeleton and cumulative cash value; formal cash flow classification NOT implemented, depreciation periods and interest posting NOT automated.
- Storage: 仮実装. Legacy slot loader intact; 3-generation rolling backup added and connected to UI. Multi-key writes are not atomic; checksum and automatic migration still missing.
- Time: 10 monthly phase scheduler is unconnected to UI domain actions; 1200-month deterministic calendar smoke test added, but not yet executed.
- Tooling: GitHub CI defined for build/unit/Chromium desktop+mobile; no successful execution confirmed.

## Stage 1
- Engine geometry and simplified physics: 仮実装. Bore, stroke, cylinders, compression ratio and intake/exhaust controls, RPM curve and editor UI committed. Curve and airflow response are uncalibrated estimates; compression ratio is currently a validated input but does not change the predicted torque/power. Real engine accuracy not claimed.

## Stages 2–11
未着手。All original scope retained. Stage 0 and Stage 1 quality gates have NOT passed.
