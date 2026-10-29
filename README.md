# BCJS — Chart.js components for Blazor

**BCJS** is a modern, clean reimplementation of a Blazor Chart.js wrapper, targeting
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
- In-place data updates (`UpdateAsync()`), an HTML tooltip themeable with CSS, round legend markers and
  browser-side label formatting that work on Blazor Server and WebAssembly alike.

## Install

```bash
dotnet add package BCJS
```

No script tags are required — the component imports its own JS module on first render.

### Setup (optional)

The `<Chart>` component works with no registration. Optionally call `AddBcjs()` in `Program.cs` so all
charts share a single JS-interop module reference instead of one per chart:

```csharp
builder.Services.AddBcjs();
```

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
| `AriaLabel` | `string?` | Accessible name: the canvas becomes `role="img"` with this label. |
| `ChildContent` | `RenderFragment?` | Content centred over the chart, e.g. a total in a doughnut's hole; the pointer passes through it. |
| `OnActiveChanged` | `EventCallback<ActiveElement[]>` | Raised when the elements under the pointer change (empty when it leaves them). |
| `OnChartClick` | `EventCallback<CallbackGenericContext>` | Raised when a data element is clicked. |
| `OnChartOver` | `EventCallback<HoverContext>` | Raised when the chart is hovered. |
| `OnLegendClick` | `EventCallback<LegendClickContext>` | Raised when a legend item is clicked. |

Methods (call via `@ref`):

```csharp
await chart.AddDataAsync(labels, datasetIndex, data); // append label/value pairs
await chart.AddDatasetAsync(dataset);                 // append a new dataset
await chart.ClearDataAsync();                          // clear labels + data
await chart.UpdateAsync();                             // push the current Config to the chart
var png = await chart.ToBase64ImageAsync(backgroundColor: "#fff"); // "data:image/png;base64,…"
await chart.SetActiveElementsAsync(new ActiveElement(0, 3));       // highlight a slice/point; none clears
```

`ToBase64ImageAsync(type, quality, backgroundColor)` returns the canvas as an image data URL (`null` before
the chart is drawn). The canvas is transparent unless `backgroundColor` is given. An HTML legend or tooltip
is not part of the canvas, so it is not in the image.

The canvas sits in its own `div.bcjs-chart-canvas` inside the container, which is what lets an
[HTML legend](#html-legend) sit beside it.

The chart is created on first render, updated when `Config` is replaced, and destroyed when the
component is disposed.

## Updating data

To redraw a chart with new data (for example when the user switches a 1-year / 5-year filter), change
the config's labels and datasets and call `UpdateAsync()`. The number of points, slices and datasets
may change.

```csharp
_config.Data.Labels = ["2022", "2023", "2024", "2025", "2026"];
_config.Data.Datasets[0].Data = [310, 360, 420, 480, 530];
await _chart.UpdateAsync();
```

The existing Chart.js instance is updated in place and animates from the old values to the new ones.
It is only rebuilt when the chart `Type` changes or `RegisterDataLabels` is switched on or off.
Assigning a new config object to `Config` goes through the same in-place update.

The same pattern applies to anything drawn on the canvas, such as colors on a theme change (see
[Light and dark themes](#light-and-dark-themes)).

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

> Synchronous JS→.NET callbacks (tooltip/tick/legend-filter) require Blazor **WebAssembly**. For
> formatting that must also work on Blazor Server, use the browser-side options instead:
> [`DataLabels.Format`](#data-labels), the [HTML tooltip](#html-tooltip) and its
> [custom function](#custom-tooltip-content-javascript-function).

### What works where

| Feature | Blazor Server | WebAssembly |
|---|---|---|
| All styling options (tooltip, legend, data labels, …) | ✅ | ✅ |
| `UpdateAsync()` in-place updates | ✅ | ✅ |
| `OnClickAsync`, `OnHoverAsync`, `OnLegendClick` (async) | ✅ | ✅ |
| `Tooltip.Callbacks`, tick callbacks, legend filter (sync .NET) | ❌ | ✅ |
| `DataLabels.Format`, `Ticks.Format`, `Tooltip.Format`, `Tooltip.Html`, `HtmlTooltip.Function`, `Legend.Html` (run in the browser) | ✅ | ✅ |

## Tooltips

BCJS supports Chart.js's canvas tooltip and an HTML tooltip.

| | Canvas tooltip (default) | HTML tooltip (`Tooltip.Html`) |
|---|---|---|
| Drawn | on the canvas | as HTML over the chart |
| Fonts | one per section (title, body, footer) | label and value styled separately |
| One line `"< 5k: 34.83"` with a bold value | ❌ | ✅ |
| Theming | C# options + `UpdateAsync()` | CSS classes and variables, or C# options |
| Custom content | `Callbacks` (WebAssembly only) | `HtmlTooltip.Function` (JavaScript) |

### Tooltip styling

`Plugins.Tooltip` exposes the Chart.js 4 tooltip options under their C# names. Every option is nullable
and left out of the JSON when unset, so Chart.js keeps its own default (an unset `Enabled` keeps the
tooltip on). The HTML tooltip honors the color, font, padding, corner and border options too.

| `Tooltip` | Chart.js |
|---|---|
| `Enabled`, `Mode` (`InteractionMode`), `Intersect`, `Position` (`TooltipPosition`) | `enabled`, `mode`, `intersect`, `position` |
| `BackgroundColor`, `BorderColor`, `BorderWidth`, `CornerRadius`, `Padding` | same names |
| `TitleColor`, `TitleFont`, `TitleAlign` (`TextAlign`), `TitleMarginBottom` | same names |
| `BodyColor`, `BodyFont`, `BodyAlign`, `FooterColor`, `FooterFont` | same names |
| `CaretPadding`, `CaretSize` | same names |
| `DisplayColors`, `BoxWidth`, `BoxHeight`, `BoxPadding`, `UsePointStyle` | same names |

```csharp
Tooltip = new Tooltip
{
    BackgroundColor = "rgba(160, 98, 20, 0.92)",
    DisplayColors = false,                       // no color square
    TitleFont = new Font { Weight = "normal" },  // the category label
    BodyFont = new Font { Weight = "bold" },     // the value
    Padding = new Padding(10),
    CornerRadius = 6,
},
```

On the canvas the title and body are separate lines, so this shows `"< 5k"` above a bold `"34.83"`.

### HTML tooltip

Set `Tooltip.Html` to render the tooltip as HTML over the chart instead of on the canvas (the Chart.js
"external" tooltip, laid out like ApexCharts'). Each data point is one row with its label and value side
by side, for example `"< 5k:"` regular and `"34.83"` bold on one line. It is built into BCJS, so it
works on Blazor Server and WebAssembly and needs no JavaScript of your own.

```csharp
Tooltip = new Tooltip
{
    Html = new HtmlTooltip(),
    BackgroundColor = "rgba(160, 98, 20, 0.92)",
    BodyFont = new Font { Size = 14 },
    DisplayColors = false,
    Padding = new Padding(10, 14, 10, 14),
},
```

| `HtmlTooltip` | Default | Purpose |
|---|---|---|
| `CssClass` | — | Extra class(es) on the tooltip element, e.g. `"dark"`. |
| `ShowTitle` | shown on axis charts, hidden on pie/doughnut/polar area | The category row above the values (e.g. `"Jan"`). |
| `Separator` | `":"` | Text after each row's label. |
| `LabelFont` / `ValueFont` | label regular, value bold | Fonts of the two spans (override `BodyFont`). |
| `Function` | — | Your own content; see [Custom tooltip content](#custom-tooltip-content-javascript-function). |

Rows are named by category on pie, doughnut and polar area charts (like their legend) and by dataset
label elsewhere; set `Mode = InteractionMode.Index` to list every series of the hovered category. With
`Callbacks.Label` set (WebAssembly), each row shows the callback's text instead.

BCJS renders one element per chart, hides it when the pointer leaves, keeps it inside the chart, and
removes it when the chart is destroyed:

```html
<div class="bcjs-tooltip [CssClass]" role="tooltip">
  <div class="bcjs-tooltip-title">Jan</div>          <!-- see ShowTitle -->
  <div class="bcjs-tooltip-row">                     <!-- one per data point -->
    <span class="bcjs-tooltip-marker"></span>        <!-- unless DisplayColors = false -->
    <span class="bcjs-tooltip-label">New:</span>
    <span class="bcjs-tooltip-value">32</span>       <!-- bold by default -->
  </div>
</div>
```

Labels and values are inserted as text, never parsed as HTML.

### Theming the HTML tooltip

BCJS's default tooltip styles have zero specificity, so any CSS on your page overrides them. They also
read CSS variables, so the tooltip can follow your theme without any C#:

```css
:root {
  --bcjs-tooltip-bg: rgba(160, 98, 20, 0.92);
  --bcjs-tooltip-color: #fff;
}
.dark {
  --bcjs-tooltip-bg: #3a2a10;
  --bcjs-tooltip-color: #f5f5f5;
}
/* Also: --bcjs-tooltip-border-color, --bcjs-tooltip-border-width, --bcjs-tooltip-radius,
   --bcjs-tooltip-padding. Or style the classes directly: */
.bcjs-tooltip { box-shadow: 0 4px 12px rgb(0 0 0 / 0.25); }
.bcjs-tooltip-value { font-weight: 600; }
```

Options set explicitly in C# (`BackgroundColor`, `BodyColor`, `BodyFont`, `Padding`, `CornerRadius`,
`BorderColor`, …) are applied as inline styles and take precedence over CSS. To theme the tooltip from
CSS, leave those options unset.

### Custom tooltip content (JavaScript function)

When the built-in rows are not enough (a percentage of the total, a second line, an icon), set
`HtmlTooltip.Function` to a JavaScript function, written as a C# string, that builds the content. This
mirrors ApexCharts' `tooltip.custom`. BCJS keeps the tooltip box, its styling, positioning and clean-up.

> [!WARNING]
> **Opt-in, uses `eval`.** The string is compiled in the browser with `eval`, and only for charts that
> set `Function`. Charts that don't use it never call `eval`.
>
> - **Content Security Policy:** if your page sets a CSP, its `script-src` must include
>   `'unsafe-eval'` for this option. If the policy blocks it, BCJS logs
>   `BCJS: Tooltip.Html.Function could not be compiled…` to the browser console and shows the built-in
>   HTML tooltip instead.
> - **Only constant, developer-written code.** The string runs as code in your users' browsers. Never
>   build it from data, user input or AI-generated output; that would let whoever controls that text
>   run arbitrary JavaScript in your app.
> - **Escape data you put into HTML strings.** A returned string is inserted as HTML as-is. Wrap every
>   piece of data in `escape(...)`, or return a DOM element instead (see below).

The function receives one object:

| Property | Contents |
|---|---|
| `dataPoints` | The hovered items: `label`, `formattedValue`, `raw`, `dataIndex`, `datasetIndex`, `dataset`, … |
| `title` | The title lines Chart.js computed (an array of strings). |
| `tooltip`, `chart` | The Chart.js tooltip model and chart instance. |
| `escape(text)` | Returns `text` with `& < > " '` escaped, for building HTML strings. |

It returns one of:

| Return value | Result |
|---|---|
| a string (or number) | Inserted as HTML. Escape the data with `escape(...)`. |
| a DOM element | Inserted as-is. Text set with `textContent` needs no escaping. |
| `null` / `undefined` | No tooltip for this point. |

If the function throws or returns anything else, BCJS logs one error and shows the built-in tooltip.

**Returning an HTML string:**

```csharp
private const string ShareTooltip = """
    ({ dataPoints, escape }) => {
      const p = dataPoints[0];
      const total = p.dataset.data.reduce((sum, v) => sum + v, 0);
      const share = (p.raw / total * 100).toFixed(1);
      return `<b>${escape(p.label)}</b><div>${escape(p.formattedValue)} (${share}% of total)</div>`;
    }
    """;

Tooltip = new Tooltip { Html = new HtmlTooltip { Function = ShareTooltip } },
```

**Returning a DOM element** (no escaping needed):

```csharp
private const string OrganizationsTooltip = """
    ({ dataPoints }) => {
      const p = dataPoints[0];
      const box = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = p.label;
      const count = document.createElement('div');
      count.textContent = `${p.formattedValue} organizations`;
      box.append(name, count);
      return box;
    }
    """;
```

Keep the functions in `const` strings, as above, so they are clearly code and never mixed with data.

## Legend

`Plugins.Legend.Labels` exposes the Chart.js 4 legend label options. Every option is nullable and left
out of the JSON when unset.

| `LegendLabels` | Chart.js |
|---|---|
| `UsePointStyle`, `PointStyle` (`PointStyle`), `PointStyleWidth` | same names |
| `BoxWidth`, `BoxHeight`, `Padding` (a number: the gap between items), `Font`, `Color` | same names |

Round markers on a right-hand legend:

```csharp
Legend = new Legend
{
    Position = LegendPosition.Right,
    Labels = new LegendLabels
    {
        UsePointStyle = true,
        PointStyle = PointStyle.Circle,
        BoxHeight = 11,                 // marker size
        Padding = 16,
        Font = new Font { Size = 14 },
        Color = "#3c3c3c",
    },
},
```

Clicking a legend item hides or shows its series (or slice, on pie, doughnut and polar area charts), as
in Chart.js; `OnLegendClick` is raised as well.

### HTML legend

Set `Legend.Html` to list the legend as HTML beside the chart instead of drawing it on the canvas. Its text
is as sharp as the rest of the page, a long list scrolls instead of splitting into columns, and CSS can
theme it.

```csharp
Legend = new Legend
{
    Html = new HtmlLegend(),
    Position = LegendPosition.Right,
    Labels = new LegendLabels { UsePointStyle = true, PointStyle = PointStyle.Circle, BoxHeight = 12, Font = new Font { Size = 14 } },
},
```

- **Layout** follows `Legend.Position` (`Right` and `Left` beside the chart, `Top` and `Bottom` above or
  below it and wrapping) and `Legend.Align` (`Start`, `Center`, `End`). The canvas shrinks to make room.
- **Items** are Chart.js's own legend items, so `Legend.Reverse` and the legend filter apply.
- **Markers** come from `Labels`: round with `UsePointStyle` and `PointStyle.Circle`, rounded with
  `PointStyle.RectRounded`, square otherwise; `BoxWidth`/`BoxHeight` set their size.
- **Text** takes `Labels.Font`, `Labels.Color` and `Labels.Padding` (the gap between items).
- **Click** or **Enter/Space** on a focused item hides or shows its series or slice; **hover** highlights it.
  Items are `role="button"` with `aria-pressed`.

| `HtmlLegend` | Purpose |
|---|---|
| `CssClass` | Extra class(es) on the list, e.g. `"dark"`. |

```html
<div class="bcjs-chart-container" data-bcjs-legend="right">
  <div class="bcjs-chart-canvas"><canvas></canvas></div>
  <ul class="bcjs-legend [CssClass]">
    <li class="bcjs-legend-item [bcjs-legend-item-hidden]" role="button" tabindex="0" aria-pressed="true">
      <span class="bcjs-legend-marker [bcjs-legend-marker-circle]"></span>
      <span class="bcjs-legend-text">Banks</span>
    </li>
  </ul>
</div>
```

Like the HTML tooltip, its default styles have zero specificity and read CSS variables, so it can follow
the page's theme with no C#: `--bcjs-legend-color`, `--bcjs-legend-font-size`, `--bcjs-legend-gap`,
`--bcjs-legend-marker-size` and `--bcjs-legend-hidden-opacity`. Options set in C# (`Labels.Color`,
`Labels.Font`, …) are inline styles and win over CSS, so leave `Labels.Color` unset to theme the text
from CSS.

### Light and dark themes

The canvas legend, axes and data labels are drawn on the canvas, so they don't follow your page's CSS; their
colors come from the config. On a theme change, set the colors and call `UpdateAsync()`; the chart is
updated in place:

```csharp
private async Task SetThemeAsync(bool dark)
{
    _legendLabels.Color = dark ? "#e6e6e6" : "#3c3c3c";
    await _chart.UpdateAsync();
}
```

The HTML tooltip and the HTML legend are the exceptions: they can be themed with CSS alone (see
[Theming the HTML tooltip](#theming-the-html-tooltip) and [HTML legend](#html-legend)).

## Data labels

Set `Options.RegisterDataLabels = true` and configure `Plugins.DataLabels` (or `Dataset.DataLabels` for
one dataset). The chartjs-plugin-datalabels plugin is attached only to the charts that set the flag.

`DataLabels.Format` formats the label text in the browser (no .NET callback, so it works on Server and
WebAssembly). It applies to numeric values.

| `DataLabelsFormat` | Effect |
|---|---|
| `Percentage` | Show the value as a percentage of the dataset total (visible items only). |
| `Decimals` | Digits after the decimal point (unset: the number as-is). |
| `Prefix` / `Suffix` | Text before / after the number, e.g. `"$"` or `"%"`. |
| `Compact` | Shorten large numbers in the chart's locale: `12500` → `12.5K`. |
| `UseGrouping` | Separate thousands in the chart's locale: `12500` → `12,500`. |
| `MinPercentage` | Hide the label of any item below this share of the visible total, e.g. `2.78` for slices under 10° (ApexCharts' `minAngleToShowLabel`). |

`DataLabelsFormat` is a `ValueFormat` (all but `MinPercentage`), which also formats
[axes and tooltips](#number-formats).

White percentage labels with a soft shadow, near the outer edge of each slice:

```csharp
DataLabels = new DataLabels
{
    Format = new DataLabelsFormat { Percentage = true, Decimals = 1, Suffix = "%" }, // "34.8%"
    Anchor = DatalabelsAnchor.End,
    Align = DatalabelsAlign.Start,
    Offset = 14,
    Color = "#fff",
    Font = new Font { Size = 14, Weight = "bold" },
    TextShadowColor = "rgba(0, 0, 0, 0.55)",
    TextShadowBlur = 6,
},
```

> `DataLabels` has a few non-nullable numeric options (`Offset`, `Opacity`, `BorderRadius`, …) that are
> omitted when 0, so they cannot be set to 0 explicitly (the plugin's default applies instead).

## Number formats

`ValueFormat` formats numbers in the browser, so it works on Blazor Server, where .NET tick and tooltip
callbacks cannot run. The locale is `Options.Locale` (e.g. `"en-GB"`), or the browser's when unset.

| Where | Option | Notes |
|---|---|---|
| Axis labels | `Ticks.Format` | Numeric axes only; a category axis keeps its labels. `Percentage` is ignored. |
| Tooltip values | `Tooltip.Format` | Canvas and HTML tooltip. Ignored where `Tooltip.Callbacks` sets the label. |
| Data labels | `DataLabels.Format` | See [Data labels](#data-labels). |

```csharp
Scales = new Dictionary<string, Axis>
{
    ["y"] = new() { Ticks = new Ticks { Format = new ValueFormat { Prefix = "$", Compact = true }, Precision = 0 } }, // "$12K"
},
Plugins = new Plugins
{
    Tooltip = new Tooltip { Format = new ValueFormat { Prefix = "$", Suffix = "M", UseGrouping = true } },     // "$12,500M"
},
```

## Axes, datasets and layout

Chart.js 4 options beyond the basics, each left out of the JSON when unset:

| Class | Options |
|---|---|
| `Axis` | `Border` (`AxisBorder`: `Display`, `Color`, `Width`, `Dash`), `Grace` (`"5%"`), `Reverse` |
| `Ticks` | `Precision` (`0` keeps a count axis to whole numbers), `Padding`, `Display`, `Format` |
| `Grid` | `LineWidth` (`DrawBorder` is Chart.js 3 only: use `Axis.Border`) |
| `BarDataset` | `BorderRadius`, `MaxBarThickness`, `BarPercentage`, `CategoryPercentage`, `HoverBorderColor` |
| `LineDataset` | `PointHoverRadius`, `PointHitRadius`, `PointBackgroundColor`, `PointBorderColor`, `BorderDash`, `SpanGaps` |
| `PieDataset`, `DoughnutDataset` | `BorderColor`, `HoverBackgroundColor`, `HoverBorderColor` |
| `Options` | `Layout` (`Padding` around the chart area), `Locale`, `Cutout` (doughnut hole, `"60%"`), `InactiveOpacity` |

## A chart linked to a list

`SetActiveElementsAsync` highlights elements as if hovered, and `OnActiveChanged` reports what the pointer
hovers, so a list beside the chart can drive it and follow it. `Options.InactiveOpacity` fades every other
element while one is active, whichever way it became active (the HTML legend's hover included).

```razor
<Chart @ref="_chart" Config="_config" Height="240px" OnActiveChanged="e => _active = e.Length == 0 ? null : e[0].Index">
    <strong>201</strong><span>organisations</span>   @* centred in the hole *@
</Chart>

@foreach (var (label, i) in _labels.Select((l, i) => (l, i)))
{
    <li class="@(_active == i ? "on" : null)" @onmouseenter="() => _chart!.SetActiveElementsAsync(new ActiveElement(0, i))"
        @onmouseleave="() => _chart!.SetActiveElementsAsync()">@label</li>
}

@code {
    // Options = new PieOptions { Cutout = "60%", InactiveOpacity = 0.3M, ... }, Type = ChartType.Doughnut
}
```

`SetActiveElementsAsync` does not raise `OnActiveChanged`: the caller already knows. The sample's **Doughnut with
a list** page is the full version.

## Time axes

BCJS bundles the Chart.js date-fns adapter, so time axes need no extra script:

```csharp
_config.Data.Labels = ["2025-01-01", "2025-02-01", "2025-03-01"]; // ISO dates (or Unix milliseconds)
Scales = new Dictionary<string, Axis>
{
    ["x"] = new()
    {
        Type = ScaleType.Time,              // spaced by real time; ScaleType.TimeSeries = one slot per point
        Time = new AxesTime
        {
            Unit = TimeUnit.Month,
            TooltipFormat = "MMMM yyyy",
            DisplayFormats = new AxesTimeFormats { Month = "MMM yy" },
        },
        Ticks = new Ticks { Source = "data" }, // a tick per data point instead of evenly spaced
    },
},
```

Formats are [date-fns tokens](https://date-fns.org/docs/format) (`yyyy`, `MMM`, `d`, `HH:mm`).
`AxesTime.Parser` reads date strings that are not ISO 8601, e.g. `"dd/MM/yyyy"`. Dates are shown in the
browser's time zone.

## Plugins

All chart types, mixed charts, callbacks, crosshair, grouped axes, and animations are implemented.
The **zoom** and **data-labels** plugins are vendored as isolated ES modules and loaded on demand:

- **Data labels** — see [Data labels](#data-labels).
- **Zoom / pan** — configure `Options.Plugins.Zoom`. Wheel, drag, and on touch screens pinch and pan
  (Hammer.js is bundled, without a `window.Hammer` global).

## Example: a dashboard pie

A pie with orange shades, white percentage labels, a right-hand legend with round markers, and a
one-line HTML tooltip (`"< 5k:"` regular, `"34.83"` bold). It uses no .NET callbacks, so it works on
Blazor Server and WebAssembly. `BCJS.Sample`'s **Dashboard pie** page adds a light/dark switch.

```razor
<Chart @ref="_chart" Config="_config" Height="280px" />

@code {
    private readonly PieChartConfig _config = new();
    private Chart? _chart;

    protected override void OnInitialized()
    {
        _config.Data.Labels = ["> 100k", "50k-100k", "25k-50k", "5k-25k", "< 5k"];
        _config.Data.Datasets.Add(new PieDataset
        {
            // No dataset Label: tooltip rows are named by category ("< 5k").
            Data = [21.89M, 11.94M, 5.47M, 25.87M, 34.83M],
            BackgroundColor = ["#F39B1E", "#F5A733", "#F7B44E", "#F9BE66", "#FDDD84"],
            BorderWidth = 2,
        });
        _config.Options = new PieOptions
        {
            Responsive = true,
            MaintainAspectRatio = false,
            RegisterDataLabels = true,
            Plugins = new Plugins
            {
                Legend = new Legend
                {
                    Position = LegendPosition.Right,
                    Labels = new LegendLabels
                    {
                        UsePointStyle = true, PointStyle = PointStyle.Circle, BoxHeight = 11, Padding = 16,
                        Font = new Font { Size = 14 }, Color = "#3c3c3c",
                    },
                },
                DataLabels = new DataLabels
                {
                    Format = new DataLabelsFormat { Percentage = true, Decimals = 1, Suffix = "%" },
                    Anchor = DatalabelsAnchor.End, Align = DatalabelsAlign.Start, Offset = 14,
                    Color = "#fff", Font = new Font { Size = 14, Weight = "bold" },
                    TextShadowColor = "rgba(0, 0, 0, 0.55)", TextShadowBlur = 6,
                },
                Tooltip = new Tooltip
                {
                    Html = new HtmlTooltip(),
                    BackgroundColor = "rgba(160, 98, 20, 0.92)",
                    BodyColor = "#fff",
                    BodyFont = new Font { Size = 14 },
                    DisplayColors = false,
                    CornerRadius = 6,
                    Padding = new Padding(10, 14, 10, 14),
                },
            },
        };
    }
}
```

## Debugging the bundle

`chart-interop.js` is minified and ships without a source map. To step through readable code, rebuild the
map from your version's release tag (`v<version>`). The build is deterministic, so the map matches the
file your app loads:

```bash
git clone https://github.com/arete-sys/BlazorChartjs && cd BlazorChartjs
git checkout v1.3.0          # your BCJS version
cd BCJS.RCL
npx esbuild@0.27.0 js/chart-interop.src.js --bundle --format=esm --platform=browser --minify --sourcemap=external --outfile=../artifacts/sourcemap/chart-interop.js
```

The `chart-interop.js` written next to the map is identical to the shipped one. In Chrome or Edge
DevTools, open `_content/BCJS/chart-interop.js` in **Sources**, right-click in the code and choose
**Add source map…**, then give the map's URL (serving the folder with any local web server works). The
readable sources (`chart-interop.src.js` and the vendored libraries) then appear under the bundle.

## Credits

- **Original library:** [PSC.Blazor.Components.Chartjs](https://github.com/erossini/BlazorChartjs) by
  Enrico Rossini — BCJS derives from its design and API (MIT).
- **BCJS rewrite:** **Arete**, with [Claude](https://claude.com/claude-code) (Anthropic) as co-author.

## License

See [`LICENSE`](LICENSE) and [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) (Chart.js, MIT).
