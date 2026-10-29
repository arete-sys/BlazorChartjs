# Migrating to BCJS

## Upgrading from BCJS 1.2 to 1.3

1.3 adds options only, with two changes worth checking:

- **The canvas has a wrapper.** It now sits in `div.bcjs-chart-canvas` inside the container. Host CSS that
  selects `.bcjs-chart-container > canvas` must select `.bcjs-chart-canvas > canvas` instead.
- **Clicking a legend item toggles its series or slice again**, as in plain Chart.js. Through 1.2 the
  click only raised `OnLegendClick`. `OnLegendClick` is still raised.

## Upgrading from BCJS 1.1 to 1.2

1.2 adds options only, with two behaviour changes worth checking:

- **Data labels are per chart.** In 1.1, `Options.RegisterDataLabels = true` registered the plugin
  globally, so charts created later on the same page drew value labels too, even without the flag. If a
  chart relied on that, set `RegisterDataLabels = true` on it.
- **`UpdateAsync()` updates in place.** The chart is no longer destroyed and re-created, so it animates
  from the old values to the new ones and keeps state held by the Chart.js instance (such as the hover
  state or the zoom plugin's state). To force a fresh chart, remove the `<Chart>` from the render tree and
  add it back.

## Migrating from PSC.Blazor.Components.Chartjs to BCJS

BCJS keeps the original's shape — the `<Chart>` component, the `*ChartConfig` entry points, the
dataset/option model, and the JSON contract — so most migration is a namespace swap. This guide lists
what changed.

## 1. Package & namespaces

| Original | BCJS |
|---|---|
| Package `PSC.Blazor.Components.Chartjs` | `BCJS` |
| `@using PSC.Blazor.Components.Chartjs` | `@using BCJS` |
| `…Models.Common`, `…Models.<Type>` | `@using BCJS.Configuration` (single namespace) |
| `…Enums`, `…Models.Common.StringEnums` | `@using BCJS.Enums` |

There are **no `<script>` tags to add** anymore. Remove the old `chart.js`, `hammer.js`,
`chartjs-plugin-*`, and wrapper `Chart.js` script references from `index.html` / `_Host.cshtml`; the
component imports its isolated module itself.

## 2. Renamed members

| Original | BCJS | Why |
|---|---|---|
| `chart.AddData(...)` (`async void`) | `await chart.AddDataAsync(...)` | `Task`-based (D-8) |
| `chart.AddDataset(...)` | `await chart.AddDatasetAsync(...)` | `Task`-based |
| `chart.ClearData()` | `await chart.ClearDataAsync()` | `Task`-based |
| _(none — recreated each change)_ | `await chart.UpdateAsync()` | real update path (D-5) |
| `Parsing.xAxisKey` / `yAxisKey` | `Parsing.XAxisKey` / `YAxisKey` | C# casing |
| `DataLabels.textShadowBlur` | `DataLabels.TextShadowBlur` | C# casing |

## 3. String options are now enums

The original modelled string options as classes with static members **plus** a paired `…String`
property. BCJS uses real C# enums with a camelCase converter. Call sites are unchanged:

```csharp
Position = LegendPosition.Right        // same as before
PointStyle = PointStyle.Rectangle      // still emits "rect"
```

…but the redundant `AlignString` / `PositionString` / `…String` companion properties are gone — set the
typed property directly. The emitted JSON is identical.

## 4. Lifecycle & disposal

`Chart` now implements **`IAsyncDisposable`** and destroys the underlying Chart.js instance on
disposal (the original leaked it). If you keep charts in a list and remove them, disposal now cleans
up JS resources automatically.

## 5. Serialization

Serialization moved to **System.Text.Json source generators**. If you relied on passing custom,
unmodelled properties through, add them to the option classes instead — there is no reflection
fallback over the option model.

## 6. Plugins

The **zoom** and **data-labels** plugins ship inside BCJS, so remove their `<script>` tags. Data labels
are drawn only on charts that set `Options.RegisterDataLabels = true`; zoom is configured with
`Options.Plugins.Zoom`, and touch pinch and pan work without a separate Hammer.js script.
