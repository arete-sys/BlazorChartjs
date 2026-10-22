# BCJS — Phase A: Parity Checklist & Proposed Architecture

> A clean, modern reimplementation of **PSC.Blazor.Components.Chartjs** (the "original"),
> targeting **net10.0** + **Chart.js 4.5.1**, under the **`BCJS`** namespace / assembly / package id.
> This document is the contract the rewrite must satisfy (or deliberately improve, with each deviation noted).

---

## 1. Public API Surface (the consumer contract)

### 1.1 The `<Chart>` component
The single component consumers touch. Original: `Chart.razor` + `Chart.razor.cs` (`partial class Chart : IDisposable`).

**Parameters**
| Member | Type | Notes |
|---|---|---|
| `Config` | `IChartConfig` | **Required.** The strongly-typed config (Bar/Line/Pie/…). |
| `Height` | `string?` | CSS height, e.g. `"400px"`. |
| `Width` | `string?` | CSS width. |
| `Class` | `string?` | Extra CSS class on the container. |
| `Style` | `string?` | Inline style on the container. |
| `OnChartClick` | `EventCallback<CallbackGenericContext>` | Declared parameter (see deviation D-7). |
| `OnChartOver` | `EventCallback<HoverContext>` | Declared parameter. |
| `OnLegendClick` | `EventCallback<LegendClickContext>` | Declared parameter. |

**Public instance methods** (called via `@ref`)
| Method | Signature | Behavior |
|---|---|---|
| `AddData` | `(List<string?> labels, int datasetIndex, List<decimal?> data)` | Zips labels+data, pushes each into dataset, `chart.update()`. |
| `AddDataset<T>` | `(T dataset) where T : class` | Pushes a new dataset, `chart.update()`. |
| `ClearData` | `()` | Clears labels + every dataset's data, `chart.update()`. |

**`[JSInvokable]` static callbacks** (JS → .NET bridge)
`LegendLabelsFilter`, `OnClickAsync`, `OnHoverAsync`, `OnLegendClickAsync`, `TicksCallback`, `TicksCallbackAsync`, `TitleCallbacks`, `TooltipCallbacksLabel`. Each resolves a delegate stored on the (ignored-in-JSON) options model and invokes it.

**Lifecycle (original behavior to replicate, then modernize):**
`OnAfterRenderAsync` creates a `DotNetObjectReference.Create(Config)`, news up the interop, calls `Setup`. Re-runs when `Config != OldConfig`. (See deviations D-1, D-5.)

### 1.2 Interop facade — `ChartJsInterop`
Wraps `IJSObjectReference` to the ES module. Methods: `Setup`, `AddData`, `AddNewDataset`, `ClearData`. (Rewrite renames/expands — see §B.)

### 1.3 Config entry points (`IChartConfig` implementations)
`BarChartConfig`, `LineChartConfig`, `PieChartConfig`, `DoughnutChartConfig`, `RadarChartConfig`, `PolarChartConfig`, `BubbleChartConfig`, `ScatterChartConfig`. Each exposes `CanvasId` (auto `Guid`), `Type` (string const), `Data`, `Options`.

---

## 2. Supported chart types
`bar` · `line` · `pie` · `doughnut` · `radar` · `polarArea` · `bubble` · `scatter` · **mixed** (per-dataset `type` override on a bar/line config).
Special layouts proven by the demo: horizontal bar (`indexAxis: 'y'`), stacked bar, grouped bar with secondary grouping axis (`groupXAxis`/`groupYAxis`), multi-axis line/scatter (`yAxisID`/`y2AxisID`), stepped line, area (fill), pie gauge, multi-series pie.

---

## 3. Config / options model

**Top-level config** (`IChartConfig`): `{ type, data, options }` + client-only `CanvasId` (`[JsonIgnore]`).

**`Data` / `Data<T>`**: `labels: List<string>`, `datasets: List<T>`. Base `Data` carries `[JsonDerivedType]` discriminators (`barData`,`lineData`,`pieData`,`doughnutData`,`radarData`,`polarData`,`bubbleData`,`scatterData`) used only for the legend-filter round-trip.

**Datasets**: a base `Dataset` (`data: List<decimal?>`, `label`, `order`, `type`, `datalabels`) and a `CustomDataset<T>` (for bubble/scatter object points). Per-type styling props enumerated in the appendix.

**`Options`** (serializes to Chart.js `options`): `responsive`, `maintainAspectRatio`, `indexAxis`, `animation`, `animations`, `interaction`, `elements`, `plugins`, `scales` (`Dictionary<string, Axis>`), `parsing`. Plus **control flags** that exist only to drive the JS shim: `groupXAxis`, `groupYAxis`, `registerDataLabels`, `hasOnHoverAsync`. Plus `[JsonIgnore]` delegate hooks: `OnClickAsync`, `OnHoverAsync`, `OnMouseOutAsync`.

**Plugins**: `legend` (+ `labels` with `filter`), `tooltip` (+ `callbacks` `title`/`label`), `title`, `datalabels`, `zoom` (+ pan/wheel/pinch/drag/limits), `crosshair` (custom, see §4).

**Scales / `Axis`**: `type`, `position`, `display`, `min`/`max`/`suggestedMin`/`suggestedMax`, `beginAtZero`, `stacked`, `grid`, `ticks` (+ `callback`/`callbackAsync`), `title`, `color`. Plus radial scale for radar (`RadarOptionsScalesRadius`) and time axis (`AxesTime` + `AxesTimeFormats`).

**Serialization shape**: every property carries an explicit `[JsonPropertyName("camelCase")]`; nullables use `[JsonIgnore(WhenWritingNull)]`, defaults use `WhenWritingDefault`. **String-enums** use a dual-property pattern: a typed `[JsonIgnore]` enum-like property whose setter writes a paired `…String` property that is what actually serializes.

---

## 4. JS interop boundary (original — exactly what crosses)

- Loading is **hybrid & global**: consumer adds `<script>` tags for `chart.js`, `hammer.js`, `chartjs-plugin-zoom`, `chartjs-plugin-datalabels` (global `window.Chart`, `ChartDataLabels`), **plus** the wrapper `Chart.js` loaded `type="module"` and re-imported by `ChartJsInterop` via `import('./_content/PSC.Blazor.Components.Chartjs/Chart.js')`.
- C# → JS: `chartSetup(id, dotNetRef, jsonConfig)`, `addData`, `addNewDataset`, `clearData`. The config object crosses as a **Blazor-serialized object** (System.Text.Json under the hood).
- JS → C#: `DotNet.invokeMethod[Async]('PSC.Blazor.Components.Chartjs', '<JSInvokable>', dotNetRef, …)` for legend filter, click, hover, legend-click, ticks, tooltip title/label.
- **The shim rewires C# "intent flags" into real JS functions**: `hasFilter`→`legend.labels.filter`, `hasLabel`/`hasCustomTitle`→tooltip callbacks, `hasCallback`/`hasAsyncCallback`→scale tick callbacks, `hasOnHoverAsync`→`onHover`, `groupXAxis`/`groupYAxis`→dual-axis tick callbacks, `crosshair`→a hand-rolled `mousemove` plugin, `registerDataLabels`→`Chart.register/unregister(ChartDataLabels)`. It also unconditionally wires `onClick` and `legend.onClick`.

> ⚠️ **Issues to fix in rewrite** (flagged, not ambiguous): the shim uses **`eval(jsonConfig)`** to materialize the config (D-2), references an out-of-scope `chart` variable inside the tooltip-label closure (latent bug), and pollutes globals.

---

## 5. Static assets (original)
Ships under `wwwroot/`: the wrapper `Chart.js`, plus `wwwroot/lib/**` containing **Chart.js (mixed v3.9.1/v4.4.2 — inconsistent), chartjs-adapter-moment, chartjs-plugin-zoom, chartjs-plugin-datalabels, chartjs-plugin-autocolors, hammer.js**, all as RCL static web assets (`_content/PSC.Blazor.Components.Chartjs/…`). Package icon/logo included.

## 6. Serialization
**System.Text.Json only** (no Newtonsoft, **zero custom converters today**). Explicit `[JsonPropertyName]` everywhere; `[JsonDerivedType]` on `Data`/`Dataset`/`CustomDataset`; computed `has…` bool flags via `[JsonInclude]`. Reflection-based (no source generator today).

## 7. Samples & tests
**Sample**: `ChartjsDemo` (Blazor WASM, net8) — 30+ pages covering every chart type + callbacks, zoom, crosshair, datalabels, animation, grouped, mixed, multi-axis, stacked, stepped, area. Proves render + `AddData`/`AddDataset`/`ClearData`.
**Tests**: **none exist in the original.** The rewrite *adds* the test project required by the brief (serialization + bUnit lifecycle), re-implementing behaviors the demo locks in.

---

## 8. Deliberate deviations from the original (each justified)

| # | Original | BCJS rewrite | Why |
|---|---|---|---|
| D-1 | `IDisposable`, empty `Dispose()`; JS chart never destroyed | `IAsyncDisposable`; interop `destroy(id)` tears down the Chart.js instance & `IJSObjectReference` | Brief requires `IAsyncDisposable` on JS-ref holders; fixes a real leak. |
| D-2 | `eval(jsonConfig)` in JS | Pass a real object across interop; **no `eval`** | Security + correctness. The config is never `eval`'d. Since 1.2.0 the one exception is opt-in: `HtmlTooltip.Function` compiles a developer-written function (see DECISIONS 4.4). |
| D-3 | Reflection STJ | **STJ source generators** (`JsonSerializerContext`, camelCase policy) | Brief; trimming/AOT friendly. |
| D-4 | Global `<script>` tags + globals (`window.Chart`, `ChartDataLabels`, hammer) | **JS isolation**: collocated ES module `import`s Chart.js 4.5.1 + plugins; no global pollution, no jQuery/hammer global | Brief. (Zoom's hammer dependency handled inside the module.) |
| D-5 | `OnAfterRenderAsync` news up interop every config change; no update path | Proper create/update/destroy lifecycle; `Update()` diff instead of recreate | Correctness + the demo's "update" story. |
| D-6 | Mixed/old Chart.js (v3.9.1/v4.4.2) | **Chart.js 4.5.1** pinned; no v2/v3 patterns | Brief. |
| D-7 | `OnChartClick/Over/LegendClick` declared as `[Parameter]` but **never invoked** (dead); real path is the `Options` delegates | Wire the `EventCallback` parameters to actually fire **and** keep the `Options` delegate path | Removes dead API / honors documented surface. |
| D-8 | `async void` public methods (`AddData`, etc.) | `Task`-returning async methods | Correctness (no fire-and-forget). |
| D-9 | String-enum dual-property pattern (typed prop + `…String`) | Keep the typed enum-like API, but serialize via a **`JsonConverter`** so there's one property, not two | Cleaner public surface; same JSON. (Parity-preserving.) |
| D-10 | `decimal`-based data | Keep `decimal?` data API for parity (revisit only if it blocks STJ source-gen) | Predictable migration. |

Everything **not** listed here is **parity by default** — same type names, property names, JSON output, and chart behavior, so consumers migrate by changing a namespace.

---

## 9. Proposed architecture

### 9.1 Solution / folder tree  *(flat repo-root layout — DECIDED)*
The new `BCJS` solution lives at the **repo root** with projects directly at the top level (no
`src/`/`samples/`/`tests/` wrappers). The original library is moved into `reference/` (read-only,
build-excluded) so it remains available for parity comparison without participating in the build.

The RCL **project folder/file is `BCJS.RCL`**, but its **identity is `BCJS`**
(`AssemblyName` = `BCJS`, `PackageId` = `BCJS`, `RootNamespace` = `BCJS`) — so the shipped DLL,
package, and namespaces are all `BCJS`; only the project file on disk is `BCJS.RCL.csproj`.

```
BlazorChartjs/                       (repo root)
├── BCJS.slnx
├── Directory.Build.props            (net10.0, nullable, LangVersion=latest, implicit usings, analyzers, pkg metadata)
├── .editorconfig
├── README.md
├── CHANGELOG.md
├── MIGRATION.md                     (from PSC.Blazor.Components.Chartjs → BCJS)
├── THIRD-PARTY-NOTICES.md           (Chart.js MIT + any plugins)
├── docs/
│   └── PARITY-AND-ARCHITECTURE.md   (this file)
├── reference/                       (the ORIGINAL, moved here; excluded from BCJS.slnx & build, gitignored)
│   ├── src/                         (was ./src — PSC.Blazor.Components.Chartjs)
│   └── ChartjsDemo/
├── BCJS.RCL/                        (Razor Class Library — the package; identity = BCJS)
│   ├── BCJS.RCL.csproj             (Microsoft.NET.Sdk.Razor; AssemblyName/PackageId/RootNamespace = BCJS)
│   ├── Components/                 Chart.razor (+ .razor.cs, .razor.css)
│   ├── Interop/                    ChartInterop.cs (IAsyncDisposable), DotNet callback hub
│   ├── Configuration/             IChartConfig, Options, Data, Dataset, Plugins, Scales, Axis, Ticks, …
│   │   ├── Charts/                BarChartConfig, LineChartConfig, … (the 8 entry points + their Data/Dataset)
│   │   ├── Plugins/               Legend, Tooltip, Title, DataLabels, Zoom/*, Crosshair, Autocolors
│   │   ├── Animations/            Animation, Animations, Tension
│   │   ├── Callbacks/             Callbacks, CallbackGenericContext, TicksCallbackContext, contexts
│   │   └── Enums/                 ChartType, Axes, TimeUnit, ZoomMode + string-enums (+ converters)
│   ├── Serialization/             BcjsJsonContext (JsonSerializerContext), converters, naming policy
│   └── wwwroot/
│       ├── chart-interop.js       (the single collocated ES module)
│       └── lib/chartjs/           Chart.js 4.5.1 dist (incl. auto/auto.js) + any pinned plugins (MIT)
├── BCJS.Sample/                    (Blazor WASM, net10) — line, bar, pie/doughnut, radar, mixed + update/destroy
└── BCJS.Tests/                     (xUnit + bUnit) — serialization assertions + component lifecycle
```

### 9.2 Namespace map (root `BCJS`)
| Sub-namespace | Contents |
|---|---|
| `BCJS` | `Chart` component, `ServiceCollectionExtensions` (`AddBcjs()`) |
| `BCJS.Interop` | `ChartInterop : IAsyncDisposable`, JS-invokable callback hub |
| `BCJS.Configuration` | `IChartConfig`, `IOptions`, `Options`, `Data`, `Dataset`, `Plugins`, `Scales`/`Axis`/`Ticks`/`Grid`, `Interaction`, `Parsing`, `Elements`, `Font`, `Padding` |
| `BCJS.Configuration.Charts` | the 8 `*ChartConfig` + their `*Data`/`*Dataset`/per-type options |
| `BCJS.Configuration.Plugins` | `Legend`, `Tooltip`, `Title`, `DataLabels`, `Crosshair`, `Autocolors`, `Zoom.*` |
| `BCJS.Configuration.Animations` | `Animation`, `Animations`, `Tension` |
| `BCJS.Configuration.Callbacks` | `Callbacks` + context record-structs |
| `BCJS.Enums` | `ChartType`, `Axes`, `TimeUnit`, `ZoomMode`, string-enums |
| `BCJS.Serialization` | `BcjsJsonSerializerContext`, `JsonStringEnum…Converter`s |

> Note: original splits `Models.Common` vs `Models.<Type>`. BCJS uses `Configuration` (clearer intent) with a `Charts` subfolder. This is a **namespace** change, fully covered by the migration guide; **type names stay the same** wherever possible so a find-and-replace of the root namespace is the bulk of a consumer's migration.

### 9.3 Interop design (target)
- `Chart.razor.cs` holds an `IJSObjectReference` (the imported `chart-interop.js`) **and** a per-chart JS handle; implements `IAsyncDisposable`.
- Module exports: `create(canvasId, dotNetRef, config)`, `update(canvasId, config)`, `addData`, `addDataset`, `clearData`, `destroy(canvasId)`.
- Inside the module: `import { Chart } from './lib/chartjs/auto/auto.js'` — the **auto bundle** (DECIDED): everything pre-registered, zero registration boilerplate, vendored from the official 4.5.1 dist. Still an isolated ES module (no global `<script>` tags). Conditional dynamic `import()` of zoom/datalabels only when the config asks for them. *(Can switch to explicit tree-shaken registration later if payload size matters.)*
- C#→JS config crosses as a source-gen-serialized object (no `eval`). Intent-flag → JS-function rewiring is preserved but reads typed booleans, not string sniffing.

### 9.4 Modernization baseline (applied throughout)
Nullable on · `LangVersion=latest` · file-scoped namespaces · implicit usings · **STJ source-gen** (camelCase, `JsonSerializerContext`) · records/`init`/`required` for option models where they fit · `IAsyncDisposable` · no runtime reflection over option types · no jQuery · JS via `IJSObjectReference`.

---

## 10. Decisions locked (sign-off)
- **JS loading** → vendor Chart.js 4.5.1 dist into `wwwroot/lib/chartjs/`, import the **auto bundle** from an isolated ES module. (No global `<script>` tags.)
- **Parity** → apply **all 10 deviations** in §8.
- **Layout** → **replace at repo root**; original moved to `reference/` (build-excluded).

---

### Appendix A — per-dataset styling property inventory (parity targets)
- **BarDataset**: backgroundColor `List<string>`, borderColor `List<string>`, borderWidth, fill, hoverBackgroundColor, stack
- **LineDataset**: backgroundColor, borderColor, borderWidth, cubicInterpolationMode, fill, fillColor, pointRadius, pointStyle, stepped, strokeColor, tension, yAxisID, y2AxisID
- **PieDataset / DoughnutDataset**: backgroundColor `List<string>`, borderWidth, hoverOffset
- **PolarDataset**: backgroundColor `List<string>`, borderWidth
- **RadarDataset**: backgroundColor, borderColor, borderWidth, fill, pointBackgroundColor, pointBorderColor, pointHoverBackgroundColor, pointHoverBorderColor
- **BubbleDataset**: backgroundColor (data = `BubbleCoords{x,y,r}`)
- **ScatterDataset**: backgroundColor, borderColor, borderWidth, pointHitRadius, pointStyle, pointRadius, showLine, tension, yAxisID, y2AxisID (data = `ScatterXYValue{x,y}`)

### Appendix B — string-enum value tables
Captured for: Align, AxisInteractions, CrossAlign, CubicInterpolationMode, DatalabelsAlign/Anchor/TextAlign, InteractionMode, LegendPosition, PointStyle (note `Rectangle→"rect"`), Position, StepMode, TextDirection; and const-string structs Axes, ChartType, TimeUnit, ZoomMode. (Exact values inventoried during Phase A; reproduced verbatim in the rewrite.)
