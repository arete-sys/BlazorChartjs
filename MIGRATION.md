# Migrating from PSC.Blazor.Components.Chartjs to BCJS

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

## 6. Not yet ported

The **zoom** and **data-labels** external plugins are modelled but not yet vendored as isolated
modules. If you used them, track the follow-up or supply the plugin globally for now (data-labels is
auto-registered when a `ChartDataLabels` global exists).
