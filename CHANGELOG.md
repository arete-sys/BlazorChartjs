# Changelog

All notable changes to BCJS are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

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

