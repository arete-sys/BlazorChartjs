# BCJS — session handoff (resume here)

_Last updated: 2026-06-02. Branch: `bcjs-rewrite` (not merged to `master`, not pushed)._

_Decision/rationale history (why things are the way they are): [DECISIONS.md](DECISIONS.md)._

> **2026-06-02 — visual verification CONFIRMED.** Against a guaranteed-fresh single
> `dotnet run` server (no orphaned processes, no stale builds), the Puppeteer harness
> rendered all 7 routes with `paintedPixels > 0` on every canvas and **zero console/page
> errors**: line 174 823, bar 207 549, pie+doughnut 68 681/53 331, radar 46 887, mixed
> 219 831, zoom 33 526, datalabels 205 695. Screenshots in `artifacts-shots/` were
> eyeballed: line (2 datasets, fill, points), datalabels (plugin draws values atop each
> bar), zoom (clean sine, zoom plugin loaded, no `hammerjs` crash). The current setup
> (single bundle + `?v=1.0.0` import-map bypass) works in dev. The open issue below is
> **resolved** — the root cause was the orphaned-process / stale-build confusion, not a
> fundamental fingerprint/import-map defect.

## Where things stand

**Phases A–E are complete and committed.** The library builds and all unit tests pass:

- `dotnet build BCJS.slnx -c Release` → green (0 warnings).
- `dotnet test BCJS.slnx -c Release` → **15/15 green** (serialization + bUnit lifecycle).
- `dotnet pack BCJS.RCL` → `BCJS.1.0.0.nupkg` (net10 lib + static assets + README/LICENSE, id `BCJS`).

A prior session added the **zoom + data-labels plugins** and attempted browser visual verification;
**that verification is now confirmed** (see the dated note above).

## What changed this session (committed as WIP)

1. **Vendored zoom + data-labels plugins** (both MIT, v2.2.0) with their bare `chart.js`/`chart.js/helpers`
   specifiers rewritten to the vendored Chart.js; zoom's `hammerjs` import stubbed to `null`
   (wheel/drag zoom work; touch pinch/pan needs a real Hammer build).
2. **Found and fixed a real bug**: Chart.js's ESM imports the bare specifier `@kurkle/color`, which was
   NOT vendored originally (the unit tests can't catch this — they don't execute the JS). Vendored
   `@kurkle/color` 0.3.4 and rewrote the three importing files.
3. **Restructured the JS to a single bundle**: moved the vendored ESM graph from `BCJS.RCL/wwwroot/lib/`
   to **`BCJS.RCL/js/lib/`** (build source, not served) and the interop source to
   **`BCJS.RCL/js/chart-interop.src.js`**. esbuild bundles it into a single served module
   **`BCJS.RCL/wwwroot/chart-interop.js`** (~496 KB, no nested imports). Plugin imports are now static
   (registered conditionally in `ensurePlugins`).
   - Regenerate the bundle after editing the source:
     ```
     npx esbuild BCJS.RCL/js/chart-interop.src.js --bundle --format=esm --platform=browser --outfile=BCJS.RCL/wwwroot/chart-interop.js
     ```
4. **`ChartInterop.cs`**: module import path is now `./_content/BCJS/chart-interop.js?v=1.0.0` — the
   version query keeps it out of the net10 fingerprint **import map** (which rewrote the URL to a
   fingerprinted name the dev server 404'd). *This is a defensive mitigation; see caveat below.*
5. Sample: added **ZoomPage** (`/zoom`) and **DataLabelsPage** (`/datalabels`) demos + nav links.
   (Pages are named `*Page` so the class names don't shadow the `Zoom`/`DataLabels` config types.)
6. Docs (README/CHANGELOG/THIRD-PARTY-NOTICES) updated; plugins are now "implemented", not "not yet ported".

## ✅ Resolved — visual verification confirmed (2026-06-02)

_The text below is kept for the historical chase; the rendering is confirmed working — see the dated note at the top._


We could not get a clean browser screenshot of the charts rendering. The chase went deep into net10
**static-asset fingerprinting + import map**, where fingerprinted RCL `_content` URLs 404 under
`dotnet run`. **But the most likely real cause was discovered last: orphaned `dotnet run` processes**
from repeated background restarts were still bound to port **5137**, serving *stale builds* — so the
browser was loading an import map and assets from different build passes (the failure even hit the
framework's own `dotnet.js`). The port was cleaned at end of session (0 listeners, 0 dotnet processes).

**So the rendering may already work** — we never tested against a guaranteed-fresh single server.

### Resume plan (do this first, in order)
1. **Guarantee a clean server**: `Get-Process dotnet | Stop-Process -Force`; confirm no listener on 5137
   (`Get-NetTCPConnection -LocalPort 5137`). Then start **one** `dotnet run --project BCJS.Sample -c Release
   --launch-profile http` and **wait for `Application started`** in the log before testing.
2. **Re-test rendering** with the existing Puppeteer harness (uses the installed Chrome):
   - Scripts live in `a local scratch dir (outside the repo)\` — `shot.js` (screenshots + painted-pixel
     check → `artifacts-shots/`), `diag.js` / `diag2.js` (import/4xx diagnostics).
   - Run via PowerShell from that dir: `node shot.js`. Success = `paintedPixels` > 0 per canvas, no errors.
   - (Puppeteer installed there via `npm i puppeteer-core`.)
3. **If it renders cleanly:** consider whether the `?v=1.0.0` import-map bypass and the single-bundle are
   actually necessary, or whether the multi-file vendored graph also works once the server is fresh.
   Keep whichever is simplest+robust; the single bundle is fine to keep regardless (fewer requests).
4. **If it still fails:** the fingerprint/import-map interaction is real. Options to evaluate:
   - Keep the `?v=` bypass (works in dev + prod + dumb static hosts).
   - Or find the correct MSBuild opt-out (note: `StaticWebAssetFingerprintingEnabled=false` and
     `WriteImportMapToHtml=false` did **not** take effect in this session; removing the
     `<script type="importmap">` placeholder broke Blazor's own framework module loading).
5. Once verified, update `README`/`docs/PARITY-AND-ARCHITECTURE.md` "visual verification" status and
   remove this caveat.

## Other follow-ups (not blocking)
- Decide whether to add an MSBuild target that runs esbuild at build time (currently the bundle is a
  committed artifact; regenerate manually with the command above).
- Consider an `AddBcjs()` DI extension (optional; not required today).
- Merge `bcjs-rewrite` → `master` only on explicit request (per the user's instruction; no co-author line).

## Key paths
- RCL: `BCJS.RCL/` (Components, Interop, Configuration, Serialization, `js/` build-source, `wwwroot/chart-interop.js`).
- Sample: `BCJS.Sample/` (Blazor WASM, net10). Dev URL `http://localhost:5137`.
- Tests: `BCJS.Tests/`. Parity spec: `docs/PARITY-AND-ARCHITECTURE.md`.
