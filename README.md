# BCJS — Chart.js components for Blazor

**BCJS** is a modern, clean-room-styled reimplementation of a Blazor Chart.js wrapper, targeting
**.NET 10** and **Chart.js 4.5.1**. It ships Chart.js as an isolated ES module (no global `<script>`
tags, no jQuery), serializes its strongly-typed option model with **System.Text.Json source
generators**, and releases the underlying chart via `IAsyncDisposable`.

> BCJS is a derivative work informed by the API of
> [PSC.Blazor.Components.Chartjs](https://github.com/erossini/BlazorChartjs) and inherits its license.
> See [`MIGRATION.md`](MIGRATION.md) to move an existing app over.

## Highlights

- **net10.0**, nullable, trimming/AOT-friendly (no runtime reflection over the option model).
- **Chart.js 4.5.1** vendored as an ES module and imported via `IJSObjectReference` — fully isolated.
- One `<Chart>` component driven by a typed `IChartConfig`.
- 8 chart types: line, bar, pie, doughnut, radar, polar area, bubble, scatter — plus mixed charts.
- Source-generated camelCase serialization; string options are real C# enums that emit the exact
  Chart.js tokens (e.g. `PointStyle.Rectangle` → `"rect"`).

## Install

Reference the project (or the `BCJS` package once published) from your Blazor app:

```xml
<ProjectReference Include="..\BCJS.RCL\BCJS.RCL.csproj" />
```

No script tags are required — the component imports its own JS module on first render.

## Quick start

```razor
@using BCJS
@using BCJS.Configuration
@using BCJS.Enums

<Chart Config="_config" Height="400px" />

@code {
    private readonly LineChartConfig _config = new();

    protected override void OnInitialized()
    {
        _config.Data.Labels = ["Jan", "Feb", "Mar", "Apr"];
        _config.Data.Datasets.Add(new LineDataset
        {
            Label = "Sales",
            Data = [12, 19, 3, 5],
            BorderColor = "rgb(54, 162, 235)",
            Tension = 0.3M,
            Fill = true,
        });
        _config.Options = new Options
        {
            Responsive = true,
            MaintainAspectRatio = false,
            Plugins = new Plugins { Legend = new Legend { Position = LegendPosition.Bottom } },
        };
    }
}
```

## The `<Chart>` component

| Parameter | Type | Notes |
|---|---|---|
| `Config` | `IChartConfig` | **Required.** `BarChartConfig`, `LineChartConfig`, `PieChartConfig`, … |
| `Height` / `Width` | `string?` | CSS sizing for the container. |
| `Class` / `Style` | `string?` | Extra class / inline style on the container. |
| `OnChartClick` | `EventCallback<CallbackGenericContext>` | Raised when a data element is clicked. |
| `OnChartOver` | `EventCallback<HoverContext>` | Raised when the chart is hovered. |
| `OnLegendClick` | `EventCallback<LegendClickContext>` | Raised when a legend item is clicked. |

Methods (call via `@ref`):

```csharp
await chart.AddDataAsync(labels, datasetIndex, data); // append label/value pairs
await chart.AddDatasetAsync(dataset);                 // append a new dataset
await chart.ClearDataAsync();                          // clear labels + data
await chart.UpdateAsync();                             // re-push the current Config
```

The chart is created on first render, updated when `Config` is replaced, and destroyed when the
component is disposed.

## Callbacks

Set delegates on `Options` (or `Options.Plugins.Legend` / `Options.Plugins.Tooltip`); BCJS forwards a
`has*` flag to JS and installs the handler:

```csharp
_config.Options = new Options
{
    OnClickAsync = ctx => { /* ctx.DatasetIndex, ctx.DataIndex, ctx.Value */ return ValueTask.CompletedTask; },
    OnHoverAsync = ctx => { /* ctx.DataX, ctx.DataY */ return ValueTask.CompletedTask; },
    Plugins = new Plugins
    {
        Tooltip = new Tooltip { Callbacks = new Callbacks { Label = ctx => [$"Value: {ctx.Value}"] } },
    },
};
```

> Synchronous JS→.NET callbacks (tooltip/tick/legend-filter) require Blazor **WebAssembly**.

## Plugins

All chart types, mixed charts, callbacks, crosshair, grouped axes, and animations are implemented.
The **zoom** and **data-labels** plugins are vendored as isolated ES modules and loaded on demand:

- **Data labels** — set `Options.RegisterDataLabels = true` and configure `Plugins.DataLabels`.
- **Zoom / pan** — configure `Options.Plugins.Zoom`. Wheel and drag zoom work out of the box; touch
  pinch/pan needs a real Hammer build (BCJS ships a no-op stub to keep the module isolated).

## License

See [`LICENSE`](LICENSE) and [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) (Chart.js, MIT).
