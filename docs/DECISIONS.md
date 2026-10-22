# BCJS — decisions & investigation log

A running record of non-obvious problems we hit, what we decided, and **why**. Newest topics first
within each section. Commit hashes are on the `bcjs-rewrite` branch.

This complements:
- [PARITY-AND-ARCHITECTURE.md](PARITY-AND-ARCHITECTURE.md) — the parity spec and architectural deviations.
- [HANDOFF.md](HANDOFF.md) — point-in-time session handoff / resume notes.

---

## 1. JS module delivery: path, fingerprinting, import maps, and cache busting

This is the cluster of decisions around *how the `chart-interop.js` ES module is loaded* by the
component. It went through several rounds of investigation; the conclusions below supersede earlier
working assumptions (including some comments that were later corrected).

### 1.1 The module is loaded by a hardcoded `_content` path via dynamic `import()`

[ChartInterop.cs](../BCJS.RCL/Interop/ChartInterop.cs) loads the interop module with:

```csharp
private static readonly string ModulePath =
    $"./_content/BCJS/chart-interop.js?v={typeof(ChartInterop).Assembly.GetName().Version}";
// jsRuntime.InvokeAsync<IJSObjectReference>("import", ModulePath)
```

**Decision:** ship the JS as a single bundled, **un-fingerprinted** RCL static asset served at the
stable path `_content/BCJS/chart-interop.js`, loaded lazily via `import()`, with a cache-busting query.

**Why this shape:**
- It's an RCL (`Microsoft.NET.Sdk.Razor`), so `wwwroot/chart-interop.js` is exposed to consumers at
  `_content/BCJS/…`. This is the documented, zero-config convention for RCL static assets.
- The module is loaded lazily from C# (deviation D-4), not via a `<script>` tag, so we never depend on
  the consumer adding anything to their HTML.

### 1.2 Single bundle (not a multi-file vendored ESM graph)

**Decision:** bundle the vendored Chart.js + plugins + interop into one served module
`BCJS.RCL/wwwroot/chart-interop.js` via esbuild; keep the vendored ESM graph as build-source under
`BCJS.RCL/js/` (not served).

**Why:** one request instead of a deep import graph; no nested bare-specifier resolution at runtime
(which is what would otherwise force import-map involvement). Regenerate after editing the source:
```
npx esbuild BCJS.RCL/js/chart-interop.src.js --bundle --format=esm --platform=browser --outfile=BCJS.RCL/wwwroot/chart-interop.js
```
(The bundle is a committed artifact; there is no build-time esbuild target yet — see Open items.)

### 1.3 Fingerprinting: it DOES work in published WASM — it is just off by default for RCL JS

An earlier comment claimed RCL `_content` assets "are not fingerprinted in published output," full
stop. **That was wrong** and was corrected (`b35dae9`).

**What we verified empirically (2026-06-02):**
- **Default config:** on `dotnet publish`, the file stays `chart-interop.js` (plain name), there is **no
  import-map entry** for it, and the plain `import()` path resolves directly. (Interesting wrinkle:
  under `dotnet run` the dev pipeline *does* put a content-fingerprint entry in the import map and serves
  both names — a build-vs-publish difference. Either way the plain path loads.)
- **Opt in with a pattern in the consuming app** (`<StaticWebAssetFingerprintPattern Pattern="*.js">` in
  the *sample*): fingerprints the **app's own** `wwwroot` JS (e.g. `./lib/bootstrap/…`) but **does not**
  reach RCL `_content` assets.
- **Opt in with the same pattern in the RCL:** publish renamed the asset to
  `chart-interop.fkozm7qkbh.js` **and** emitted an import-map entry remapping the bare path. So
  fingerprinting works; the pattern must live in the **RCL**, not the consumer.

**Conclusion:** fingerprinting is real and available, but **opt-in per asset pattern**, and RCL assets
are controlled by the RCL.

### 1.4 Decision: deliberately do NOT fingerprint the interop module

**Why we keep the plain (un-fingerprinted) filename even though fingerprinting works:**

If we fingerprint, the plain `chart-interop.js` **disappears** from disk (only `chart-interop.<hash>.js`
remains). Our hardcoded `import("./_content/BCJS/chart-interop.js")` would then resolve **only** if the
consumer's page emits an import map remapping the bare path to the hashed name. That import map is itself
opt-in and differs per hosting model:

| Host | What the consumer must do for the map to exist | If missing |
| --- | --- | --- |
| Standalone Blazor WASM | `<OverrideHtmlAssetPlaceholders>true</…>` **and** the `<script type="importmap"></script>` placeholder in `index.html` | bare `import()` → **404** |
| Blazor Web App / Server | `<ImportMap />` component in the root component (`App.razor`) | bare `import()` → **404** |

For a **redistributable library** dropped into hosts we don't control, making our own JS load contingent
on the consumer's HTML/project setup is fragile. Keeping the plain filename means the path we import is a
real file on **every** host with **zero** consumer preconditions.

> Note on confidence: the "rename + import-map entry" half is verified. The "absent map → 404" half is a
> logical inference from how import-map resolution of bare specifiers works; it was not separately
> reproduced.

### 1.5 Rejected alternative: resolve the path via `@Assets["…"]`

A suggested way to "avoid import maps" is to resolve the fingerprinted URL in C# with
`ComponentBase.Assets["_content/BCJS/chart-interop.js"]` and pass that to `import()`.

**Rejected — it would break our primary target.** `@Assets` / `ResourceAssetCollection` is a
**server-side** mechanism backed by `app.MapStaticAssets()`. A **standalone Blazor WASM** app has no
backend and no `MapStaticAssets`; the official docs list the standalone-WASM `href` value as the plain
`{PATH}`, while `@Assets["…"]` is scoped to server-side Blazor. Our component must run under **both**
hosting models and our sample **is** standalone WASM, so `@Assets` would work on a Blazor Web App and
**fail on standalone WASM** — the opposite of portable.

### 1.6 Cache busting: the one thing the plain path does NOT give us

"Just use `_content/…` and let .NET handle it" is correct for *resolving and serving* the file, but it
does **not** handle **cross-version cache invalidation** for a hardcoded `import()` path:
- **Server-hosted** Blazor (`MapStaticAssets`): plain assets are served with an **ETag**, so browsers
  revalidate and pick up changes (`304` when unchanged). Cache busting is effectively handled here.
- **Standalone WASM on a dumb static host** (GitHub Pages, S3, CDN with long `max-age`): there may be no
  smart revalidation. A long-cached `chart-interop.js` can stay **stale** after a version upgrade,
  because the URL never changed. Fingerprinting is .NET's built-in answer — but we rejected it (1.4).

**Decision:** add a `?v=<version>` query. It bypasses the import map, is ignored by static file servers
(so it still resolves to the plain file), and busts the cache on version changes across dev,
server-hosted, and dumb-static-host deployments alike.

### 1.7 Decision: derive the `?v=` value from the assembly version (`1750177`)

The query was originally hardcoded `?v=1.0.0`, so it only advanced if someone remembered to edit it each
release — a wart. **Decision:** derive it from `typeof(ChartInterop).Assembly.GetName().Version` so it
advances automatically with `<Version>` bumps, no manual upkeep.

**Net delivery picture:**

| Concern | Plain `_content` path + `?v=<assembly version>` | Handled by |
| --- | --- | --- |
| Resolve & serve the file | ✅ every host, no preconditions | .NET RCL `_content` convention |
| Stale cache, server-hosted | ✅ | ETag revalidation (`MapStaticAssets`) |
| Stale cache, dumb static host | ✅ | the `?v=` query (auto-bumped per release) |
| Depend on consumer import map / `MapStaticAssets` | ❌ none | — (deliberately avoided) |

---

## 2. Visual verification of chart rendering

### 2.1 Problem: charts "wouldn't render"; verification was blocked

A prior session could not get a clean browser screenshot and went deep into net10 fingerprinting /
import-map theories (fingerprinted `_content` URLs 404ing under `dotnet run`).

### 2.2 Finding: the real root cause was orphaned servers / stale builds

Repeated background `dotnet run` restarts left **orphaned processes bound to port 5137 serving stale
builds**, so the browser loaded an import map and assets from *different build passes* (the failure even
hit the framework's own `dotnet.js`). It was **not** a fundamental fingerprint/import-map defect.

### 2.3 Solution & verification (`21b5cd1`)

Method that works and is now the standard check:
1. Ensure no orphaned servers (IDE build-host / MSBuild node processes are fine to leave; only kill stray
   `dotnet run` instances). Confirm port 5137 has no listener.
2. Fresh `dotnet build -c Release`, then **one** `dotnet run --project BCJS.Sample -c Release
   --launch-profile http`; wait for `Application started`.
3. Run the Puppeteer harness (`node shot.js`, a local puppeteer-core script kept outside the repo):
   screenshots + painted-pixel check into `artifacts-shots/`. Success = `paintedPixels > 0` per canvas,
   no errors.

**Result (2026-06-02):** all 7 routes render with zero console/page errors — line 174 823, bar 207 549,
pie+doughnut 68 681/53 331, radar 46 887, mixed 219 831, zoom 33 526, datalabels 205 695. Screenshots
eyeballed (real charts, plugins drawing). Re-confirmed unchanged after the cache-busting change (1.7).

---

## 3. Tests

### 3.1 Problem: two component tests were failing silently

While verifying the delivery change we found the suite was **13/15, not the 15/15** the handoff claimed.

### 3.2 Cause

[ChartComponentTests.cs](../BCJS.Tests/ChartComponentTests.cs) registered the JS module under a **fixed
URL** `./_content/BCJS/chart-interop.js`, but the component imports it with the `?v=<version>` query. So
bUnit treated the import as a **different** module and recorded zero invocations on the registered
handler. The two invocation-asserting tests (`Creates_…`, `Destroys_…`) had been failing since the `?v=`
query was first introduced — the green claim was stale.

### 3.3 Solution (`1750177`)

Use bUnit's **catch-all** `ctx.JSInterop.SetupModule()` (no URL), which matches any module import
regardless of the cache-busting query, and returns a `BunitJSModuleInterop` whose `.Invocations` we
assert on. Suite is now genuinely **15/15**.

**Lesson:** don't couple module-interop tests to the exact import URL; the URL carries a version query by
design.

### 3.4 Real-browser rendering check in C# — `BCJS.VisualTests` (`4f3b3ab`)

**Problem:** bUnit mocks JS interop and never executes Chart.js, so it cannot prove a canvas actually
rendered. The only way to verify rendering is to drive a real browser. That was first done with a local
JS + PowerShell harness (`visual-test/`, git-ignored) — fine for ad-hoc runs, but not a gating test and
on a separate toolchain.

**Decision:** add a C# `BCJS.VisualTests` xUnit project using **Playwright for .NET** with the installed
Chrome (`Channel = "chrome"`, so **no browser download** — same as the JS harness's puppeteer-core).

**Why Playwright + installed Chrome (over PuppeteerSharp / bundled Chromium / Selenium):** first-class
async .NET API; the bundled Node driver ships in the NuGet package (no `playwright install`), and
`Channel="chrome"` reuses the machine's Chrome so there's no ~130 MB Chromium fetch; folds into
`dotnet test` as a real, gating assertion.

**Shape:**
- `SampleServerFixture` (`IAsyncLifetime`) starts **one** `BCJS.Sample` dev server on a free loopback
  port (standalone WASM can't run in-process, so it must be served + booted), waits for HTTP readiness,
  launches Chrome, and disposes the whole process tree on teardown.
- `ChartRenderingTests`: a `[Theory]` per route (`/line`…`/datalabels`) asserting `paintedPixels > 0`
  per canvas and zero console/page errors; also writes screenshots to `artifacts-shots/`.
- Tagged `[Trait("Category", "Visual")]`. Fast unit run stays fast via `BCJS.Tests`; exclude the heavy
  test elsewhere with `dotnet test --solution BCJS.slnx --filter-not-trait "Category=Visual"`. Full suite:
  `dotnet test --solution BCJS.slnx` (MTP mode, set in `global.json`, since the move to xunit v3).

**Kept the JS harness** (`visual-test/`) for quick ad-hoc diagnostics (`diag.js`, `importmap-test.js`)
alongside the C# test, per decision.

Verified: 7/7 pass (~24 s incl. WASM boot), server tree cleaned up, screenshots written.

---

## 4. In-place updates and per-chart data labels (1.2.0)

### 4.1 `update()` mutates the live chart instead of rebuilding it

Through 1.1, the JS `update()` destroyed the chart and built a new one. That redrew correctly but
dropped the transition (the new data animated in from zero) and any instance state. A filter that
switches the same chart between ranges (1 year / 5 years) should animate between the two.

**Decision:** `update()` keeps the instance: it replaces `labels`, merges each new dataset into the
existing dataset object at the same index (removed keys deleted, extra datasets appended, surplus ones
truncated), assigns the new `options` and calls `chart.update()`. Reusing the dataset objects matters:
Chart.js drops a dataset's controller when its object is no longer referenced, which would lose the
animation. It still rebuilds when the chart type changes or the data-labels plugin is toggled (inline
plugins are fixed at construction). `BCJS.VisualTests` checks the canvas's `$chartjs` expando keeps its
identity across updates; against the 1.1 bundle that check fails.

### 4.2 Data labels are attached per chart

`Chart.register(ChartDataLabels)` is global, and the plugin defaults to `display: true`, so after one
chart opted in every chart created later drew value labels (reproduced by navigating `/datalabels` →
`/bar` in the sample). **Decision:** pass it as an inline plugin (`config.plugins`) only for charts with
`registerDataLabels`. Zoom stays globally registered: it is inert unless a chart configures it.

### 4.3 HTML tooltip built into the interop module

The canvas tooltip draws one font per section, so the dashboard widget's one-line "< 5k: **34.83**"
(ported from ApexCharts) is impossible on the canvas. **Decision:** `Tooltip.Html` switches to the
Chart.js `external` tooltip, implemented once in the interop module. A C# delegate cannot be serialized
into Chart.js options, and a .NET round-trip per hover would lag on Blazor Server, so the handler is
BCJS's own JS, configured by data. Choices: ApexCharts-like markup (title row, label/value spans) so
existing CSS habits carry over; text via `textContent` (no HTML injection); default styles under
`:where()` with `--bcjs-tooltip-*` variables so host CSS always wins, while options set explicitly in
C# become inline styles; one element per chart, hidden on leave, removed on destroy and when an
in-place update turns the option off.

### 4.4 Opt-in `eval` for custom tooltip content (`HtmlTooltip.Function`)

Some tooltips need logic the built-in rows can't express (a share of the total, extra lines). ApexCharts'
answer is `tooltip.custom`, a JS function; Blazor-ApexCharts passes it as a C# string and runs it with
`eval`, and Apex inserts the returned HTML with `innerHTML`, unescaped (verified in ApexCharts v5.3.6
and on `main`, `src/modules/tooltip/Labels.js`).

**Decision:** offer the same, deliberately as an exception to D-2 (the config itself is still never
`eval`'d). Constraints that keep the exception small:
- **Opt-in:** indirect `eval` runs only for charts that set `Function`, so other pages work under a CSP
  without `'unsafe-eval'` (verified with a CSP that blocks eval: `/dashboard-pie` runs clean).
- **Fails safe:** a blocked compile, a throw or a bad return value logs one console error and falls back
  to the built-in tooltip (verified: `/custom-tooltip` under that CSP shows the built-in rows).
- **Safer returns than Apex's string:** a DOM element is accepted (as Apex also allows), and an
  `escape` helper is passed in for string results.
- **Documented risk:** the string is code. It must be a developer-written constant, never built from
  data, user input or AI output (apps that build charts from AI output make this a real risk).

---

## 5. Commit map

| Commit | What |
| --- | --- |
| `21b5cd1` | Confirm visual verification of all chart routes (resolved the stale-build issue; updated HANDOFF). |
| `2dc3adc` | First correction of the `?v=` rationale comment. |
| `b35dae9` | Fix the overstated "fingerprinting doesn't work in published WASM" claim (it does; off by default). |
| `1750177` | Derive the `?v=` query from the assembly version; fix the silently-failing bUnit module tests. |
| `4f3b3ab` | Add `BCJS.VisualTests` — C# Playwright real-browser rendering tests (installed Chrome). |

Earlier WIP (prior session): vendored zoom + data-labels plugins, vendored `@kurkle/color`, restructured
to a single esbuild bundle, added `/zoom` and `/datalabels` demos.

---

## 6. Open items (non-blocking)

- Add an MSBuild target to run esbuild at build time (today the bundle is a committed artifact, regen
  manually — see 1.2).
- Optional `AddBcjs()` DI extension.
- Merge `bcjs-rewrite` → `main` only on explicit request (no co-author line on commits, per instruction).
