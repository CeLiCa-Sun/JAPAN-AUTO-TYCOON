# TEST REPORT — 2026-10-11
## Confirmed
- Inspected main prior commit 1958e03a9c65dbca64bc2a94efa0f458dd73ac7a and research/save implementations.
- GitHub commit status lookup returned []; PR-filtered workflow lookup returned []. Public Actions page fetch failed. These do not prove passing/failing CI.
- Added provisional thermal/friction/estimated failure risk research metrics plus engine-risk unit tests, committed to GitHub.
## Actual execution
- TypeScript/Vite build: NOT EXECUTED.
- Vitest: NOT EXECUTED.
- Playwright Chromium desktop/mobile, Firefox, WebKit: NOT EXECUTED.
- IndexedDB 3-generation, corrupt primary, historical legacy, quota, abort, read-failure and factory restore: test cases exist; NOT EXECUTED.
## Engineering validity
- Failure probability is a simple exponential exposure model based on heuristic estimated life; NOT empirically fitted.
- Coolant heat is assumed 30% of fuel energy not converted into shaft output. It is NOT a validated radiator demand.
- No matched real engine dynamometer curve was obtained/used; no calibration claims.
## Stage 0 quality gate
NOT PASSED. Requires observed successful build, Vitest and all Playwright browser projects tied to exact commit SHA.
