# HANDOFF — 2026-10-11

Repo CeLiCa-Sun/JAPAN-AUTO-TYCOON main.
New real CI: run 38109615764 / job 114382280133 tested commit caa42d531139eaf0b344cda3c1d9d323dda9d9e3. Build and Vitest PASS; Playwright 16 PASS, 40 FAIL. Logs show shared root cause: status role returned 2 matches, global save message and factory demo status.
Fix: src/app/FactoryPanel.tsx replaced factory <p role='status'> with <p aria-live='polite' aria-label='工場操作結果'> while keeping main global status unique. Committed f2bea1e2bdfd90955eff372778e050c83ada9e74. Must obtain a NEW CI run/job ID and verify all 4 projects; do not mark Stage 0 passed yet.
Next investigate additional genuine E2E failures (if any) once locator ambiguity cleared; verify generation, corruption, old format, quota injection, abort, read error and factory restore.
Other: report power-scale calibration limitations; npm audit needed for package-specific moderate/critical vulnerabilities.
Continue to show multi-select checkboxes and additional-request textarea.

## CI run 38109958842 (2026-10-11)
- Job 114383289587 tested 57eefe6081e95273bd64bf853e8979f08dbff368.
- Build PASS; Vitest PASS; Playwright 50 PASS / 6 FAIL (56 total).
- Legacy migration timed out on 2 Chromium projects because test inspected IndexedDB without waiting for the save completion.
- Deliberate IndexedDB transaction abort threw page.evaluate:null across 4 browsers because the test rejected the expected abort error event.
- Fix to e2e/migration-and-abort.spec.ts committed as b2aa24f4c154c9833433b9ea837a207689f90d4a. No post-fix CI pass verified.
- Stage 0 NOT PASSED; a new run for the corrected SHA is necessary.
- npm install previously noted 1 moderate and 2 critical advisories; package identification requires npm audit, not yet obtained.
- Robin EY20D still uses single-scalar preview calibration, not validated physical coefficients.
