# Dependency security review — 2026-10-11

## Status
**Partially remediated in package ranges; NOT independently verified by a fresh npm audit or current Actions log.** Never represent this as zero advisories. The real dependency graph has no committed `package-lock.json` and the development environment cannot resolve `registry.npmjs.org` (DNS error), so resolved package versions and exact remaining advisories are presently unknown.

## What changed
- `vite`: `^7.1.0` -> `^7.3.7` (stay on Vite major 7, which continues to receive security fixes).
- `vitest`: `^3.2.0` -> `^4.1.11` (cross-major update, must be verified for test/runtime compatibility).
- `.github/workflows/ci.yml`: after a report-only JSON audit artifact and test matrix, a **failing** `npm audit --audit-level=moderate` gate checks the entire installed tree. `npm ls vite vitest @vitest/mocker` logs effective package choices.
- `.github/workflows/publish-preview.yml`: manual publishing requires `npm audit --audit-level=moderate` to pass, then build, unit and E2E. This is stronger than the previous high-or-critical gate. The manual workflow must be deliberately started by the repository owner.

## Relevant independently published advisories (not repo-specific audit findings)
1. Vite `GHSA-p9ff-h696-f583` affected Vite 7.0–7.3.1, patched from 7.3.2; `GHSA-fx2h-pf6j-xcff` affected Vite before 7.3.5. Source: https://github.com/vitejs/vite/security/advisories and https://advisories.gitlab.com/npm/vite/CVE-2026-53571/
2. Vite October 2026 `GHSA-rq7h-c2jc-7f22`, `GHSA-vfpm-58rq-9qcg` require current maintained patches. Chosen lower bound 7.3.7 (published October 2026). Source: https://github.com/vitejs/vite/security/advisories
3. Vitest `GHSA-5xrq-8626-4rwp` affects older 3.x and `GHSA-82fw-gwwq-j7x9` affects versions below 4.1.11. The latter has no official 3.x patch. Source: https://github.com/advisories/GHSA-5xrq-8626-4rwp and https://github.com/advisories/GHSA-82fw-gwwq-j7x9
4. The historic verified Stage 0 Actions job `114384424640` reported **3 vulnerabilities: 1 moderate and 2 critical**, but those exact dependency names were **NOT captured**. This count is not evidence the same issues remain with the new package ranges.

## Missing quality steps
- [ ] Run npm install on Node 22 with registry access; resolve peer dependencies.
- [ ] Generate and commit an audited `package-lock.json` from the actual resolved graph, then replace npm install with npm ci.
- [ ] Read `npm-audit-details` from the new Actions job, verify exact names/severity/fixAvailable, and address residual advisories.
- [ ] Run TypeScript/Vite build, full Vitest, four Playwright browser configurations and manual game smoke.
- [ ] Report actual pass counts and release SHA, *then* consider the manually gated Pages deployment.

No deployment has been triggered, and no live URL is verified.

## Verified resolution checkpoint (2026-10-11)
- Real GitHub Actions CI run [38114198670](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114198670): Vite 7.3.7, Vitest 4.1.11, build PASS, Vitest 86/86 PASS, Playwright 76/76 PASS, npm audit 0 vulnerabilities including the moderate-or-higher gate.
- Real CI run [38114258320](https://github.com/CeLiCa-Sun/JAPAN-AUTO-TYCOON/actions/runs/38114258320): entire pipeline and committed lockfile step PASS. GitHub bot committed actual npm `package-lock.json` via commit `237f3400fd4f3b8f4da84b4f93d154c2768679a3`; file verified on main (lockfile v3, 149 packages).
- This supersedes the earlier *unverified* warnings above only for the stated CI-run dependency graph. Recheck audit on later updates. From now on install with `npm ci` rather than resolving new versions in each job.
- Public deployment remains unverified until a Pages success status and live asset smoke check is observed.
