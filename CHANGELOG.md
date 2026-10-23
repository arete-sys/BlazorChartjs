# Changelog

All notable changes to BCJS are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `Legend.Html` (`HtmlLegend`: `CssClass`): the legend as an HTML list beside the chart, laid out from
  `Legend.Position`/`Align`/`Reverse` and styled from `Legend.Labels`. Items toggle their series or slice on
  click and on Enter/Space, highlight it on hover, and are `role="button"` with `aria-pressed`. Default
  styles have zero specificity and read `--bcjs-legend-*` variables, so it can be themed from CSS.
- `ValueFormat`, a browser-side number format (`Percentage`, `Decimals`, `Prefix`, `Suffix`, and new
  `Compact` and `UseGrouping`), used by the new `Ticks.Format` and `Tooltip.Format`, so axis labels and
  tooltip values can be formatted on Blazor Server. `DataLabelsFormat` now derives from it.
- `Chart.AriaLabel` (the canvas becomes `role="img"` with that label) and
  `Chart.ToBase64ImageAsync(type, quality, backgroundColor)`.
- Chart.js 4 options: `Axis.Border` (`AxisBorder`), `Axis.Grace`, `Axis.Reverse`, `Ticks.Precision`,
  `Ticks.Padding`, `Ticks.Display`, `Grid.LineWidth`, `BarDataset.HoverBorderColor`/`BorderRadius`/
  `MaxBarThickness`/`BarPercentage`/`CategoryPercentage`, `LineDataset.PointHoverRadius`/
  `PointHitRadius`/`PointBackgroundColor`/`PointBorderColor`/`BorderDash`/`SpanGaps`,
  `Options.Layout` (`Layout.Padding`) and `Options.Locale`.
- **Time axes work out of the box**: the Chart.js date-fns adapter (chartjs-adapter-date-fns 3.0.0 with
  date-fns 4.1.0) is bundled, so `ScaleType.Time` and `ScaleType.TimeSeries` axes render with date-fns
  format tokens. New `ScaleType` constants, `AxesTime.Parser` and `Ticks.Source`.
- **Touch zoom and pan**: Hammer.js 2.0.8 replaces the zoom plugin's no-op stub, so pinch and pan work on
  touch screens. Its `window.Hammer` global assignment is removed.
- `LegendPosition.Top`, Chart.js's default legend position, which the enum lacked.
- Sample pages: **HTML legend** (a pie and a bar chart with HTML legends and browser-side formats) and
  **Time axis** (a monthly line on a time axis with wheel, drag and pinch zoom).
- Slice colors on `PieDataset` and `DoughnutDataset`: `BorderColor`, `HoverBackgroundColor` and
  `HoverBorderColor` (per-slice lists, like `BackgroundColor`). Unset, Chart.js darkens the slice and
  its border on hover, which barely shows on translucent colors.
- `DataLabelsFormat.MinPercentage`: hides the label of an item below that share of the visible total,
  like ApexCharts' `minAngleToShowLabel` (`2.78` ≈ 10°).

### Changed
- `chart-interop.js` is now minified: 331 KB, down from 517 KB unminified in 1.2.0 even with the date
  adapter and Hammer.js added (757 KB unminified). The bundled libraries' licence headers are kept at the
  end of the file. No source map ships; the README's *Debugging the bundle* rebuilds the matching one.
- The canvas now sits in its own `div.bcjs-chart-canvas` inside the container (Chart.js sizes the canvas
  from its parent, and an HTML legend needs to sit beside it). Host CSS that selects
  `.bcjs-chart-container > canvas` must select `.bcjs-chart-canvas > canvas` instead; the HTML tooltip is
  positioned inside the new element.

### Fixed
- Clicking a legend item now hides or shows its series or slice. BCJS replaced Chart.js's legend
  `onClick` to raise `OnLegendClick`, which dropped the toggle; it now runs Chart.js's own handler first.
- An HTML legend added after the chart's first draw no longer leaves the canvas at its old width: the
  chart is resized as soon as the legend appears, moves or goes.

## [1.2.0] — 2026-10-22

### Added
- Tooltip styling options on `Tooltip`: `Enabled`, `Mode`, `Intersect`, `Position`, `BackgroundColor`,
  `TitleColor`, `TitleFont`, `TitleAlign`, `TitleMarginBottom`, `BodyColor`, `BodyFont`, `BodyAlign`,
  `FooterColor`, `FooterFont`, `Padding`, `CaretPadding`, `CaretSize`, `CornerRadius`, `DisplayColors`,
  `BoxWidth`, `BoxHeight`, `BoxPadding`, `UsePointStyle`, `BorderColor`, `BorderWidth`.
- Legend label options on `LegendLabels`: `UsePointStyle`, `PointStyle`, `PointStyleWidth`, `BoxWidth`,
  `BoxHeight`, `Padding`, `Font`, `Color`.
- `TextAlign` and `TooltipPosition` enums.
- `Tooltip.Html` (`HtmlTooltip`: `CssClass`, `ShowTitle`, `Separator`, `LabelFont`, `ValueFont`): an
  HTML tooltip rendered over the chart (Chart.js "external" tooltip), with the label and value as
  separate elements so a regular label and a bold value share one line, themeable with CSS classes and
  `--bcjs-tooltip-*` variables. Built in, so it works on Server and WASM.
- `HtmlTooltip.Function`: optional custom tooltip content from a JavaScript function written as a C#
  string (like ApexCharts' `tooltip.custom`). It may return an HTML string (an `escape` helper is
  provided), a DOM element, or `null` to hide the tooltip. **Opt-in and uses `eval`:** it is compiled
  only for charts that set it, so a page with a Content Security Policy must allow `'unsafe-eval'`
  only if it uses this option. Never build the string from data or user/AI input. See the README.
- `DataLabels.Format` (`DataLabelsFormat`: `Percentage`, `Decimals`, `Prefix`, `Suffix`) to format
  data-label text in the browser, e.g. `34.8%` of the total, with no .NET callback (Server and WASM).
- Sample pages: **Dashboard pie** (styled tooltip, round legend markers, percentage labels and a
  light/dark switch), **Data updates** (a range filter that redraws pie, stacked bar, horizontal bar
  and line charts) and **Custom tooltip** (string and DOM-element functions).

All new options are nullable and omitted from the JSON when unset, so existing charts serialize
exactly as before.

### Changed
- `UpdateAsync()` (and replacing `Config`) now updates the existing Chart.js instance in place instead
  of destroying and re-creating it: labels and datasets are swapped and the chart animates to the new
  values. The chart is still rebuilt when its type changes or `RegisterDataLabels` is toggled.
- The package now depends on `Microsoft.AspNetCore.Components.Web` 10.0.13 (was 10.0.8). Build-only
  dependencies were updated too (SourceLink 10.0.402, which clears a NuGet audit advisory in
  `Microsoft.Build.Tasks.Git` 8.0.0).

### Fixed
- `RegisterDataLabels = true` registered the data-labels plugin globally, so every chart created
  afterwards on the page also drew value labels. The plugin is now attached only to the charts that
  set the flag. See [`MIGRATION.md`](MIGRATION.md#upgrading-from-bcjs-11-to-12).

## [1.1.0] — 2026-06-02

### Added
- `AddBcjs()` service-collection extension that registers a single scoped `ChartInterop` shared by all
  charts. **Optional and non-breaking** — the `<Chart>` component still works without it (it creates
  and owns its own interop when none is registered).

## [1.0.0] — 2026-06-02

The first release of **BCJS**, a ground-up rewrite of the Blazor Chart.js wrapper originally published
as `PSC.Blazor.Components.Chartjs`. BCJS keeps that library's public shape and JSON contract while
modernizing the runtime, serialization, and JS interop. See [`MIGRATION.md`](MIGRATION.md).

### Added
- **net10.0** Razor Class Library with identity `BCJS` (assembly, package, and root namespace).
- **Chart.js 4.5.1** vendored as an ES module (`auto` bundle) and loaded via `IJSObjectReference`
  — no global `<script>` tags, no jQuery.
- Strongly-typed option model for all 8 chart types (line, bar, pie, doughnut, radar, polar area,
  bubble, scatter) plus mixed charts, scales, plugins, zoom, animations, and tooltip/legend/tick
  callbacks.
- **System.Text.Json source-generated** serialization (camelCase, trimming/AOT-friendly).
- `<Chart>` component with `Config`/`Height`/`Width`/`Class`/`Style` parameters, `OnChartClick` /
  `OnChartOver` / `OnLegendClick` events, and `AddDataAsync` / `AddDatasetAsync` / `ClearDataAsync` /
  `UpdateAsync` methods.
- Crosshair plugin and grouped secondary axes ported into the interop module.
- **zoom** and **data-labels** plugins vendored as isolated ES modules, loaded on demand (zoom's
  Hammer dependency is stubbed; wheel/drag zoom work, touch gestures need a real Hammer build).
- `BCJS.Sample` (Blazor WebAssembly) demonstrating line, bar, pie/doughnut, radar, and mixed charts
  with add-data, update, and destroy.
- `BCJS.Tests` (xUnit serialization + bUnit component lifecycle).
- `BCJS.VisualTests` (Playwright real-browser rendering checks across all chart routes).

### Changed (deviations from the original)
- Public methods are `Task`-based instead of `async void`.
- String options are real C# enums with a camelCase converter (the `…String` companion properties are
  removed); emitted JSON is unchanged.
- `Chart` implements `IAsyncDisposable` and destroys the Chart.js instance on disposal.
- Real create/update/destroy lifecycle instead of recreating the chart on every config change.
- The config is serialized and `JSON.parse`d — the original's `eval` is gone.
- A few property names were corrected to C# casing (`Parsing.XAxisKey`, `DataLabels.TextShadowBlur`).

