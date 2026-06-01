# Third-Party Notices

BCJS bundles and/or builds upon the following third-party software.

> Build note: the runtime ES modules below are vendored under `BCJS.RCL/js/lib/` (build source, not
> served) and bundled by esbuild into a single served module `BCJS.RCL/wwwroot/chart-interop.js`.
> Regenerate after editing the source with:
> `npx esbuild BCJS.RCL/js/chart-interop.src.js --bundle --format=esm --platform=browser --outfile=BCJS.RCL/wwwroot/chart-interop.js`

## Chart.js 4.5.1
- License: MIT
- Project: https://www.chartjs.org / https://github.com/chartjs/Chart.js
- © Chart.js Contributors
- Vendored ES-module runtime under `BCJS.RCL/js/lib/chartjs/` (`auto/auto.js`, `dist/chart.js`,
  `dist/helpers.js`, `dist/chunks/helpers.dataset.js`, `helpers/helpers.js`) plus its `@kurkle/color`
  0.3.4 dependency (`dist/chunks/kurkle-color.esm.js`, MIT). License: `BCJS.RCL/js/lib/chartjs/LICENSE.md`.

## chartjs-plugin-datalabels 2.2.0
- License: MIT
- Project: https://github.com/chartjs/chartjs-plugin-datalabels
- Vendored ES module at `BCJS.RCL/js/lib/datalabels/` (bare `chart.js` specifiers rewritten to the
  collocated vendored Chart.js). License: `BCJS.RCL/js/lib/datalabels/LICENSE.md`.

## chartjs-plugin-zoom 2.2.0
- License: MIT
- Project: https://github.com/chartjs/chartjs-plugin-zoom
- Vendored ES module at `BCJS.RCL/js/lib/zoom/` (bare `chart.js`/`hammerjs` specifiers rewritten;
  Hammer is stubbed to `null`, so wheel/drag zoom work and touch gestures are skipped unless a real
  Hammer build is supplied). License: `BCJS.RCL/js/lib/zoom/LICENSE.md`.

## PSC.Blazor.Components.Chartjs (origin of the design)
- BCJS is a clean reimplementation that uses the original library as a behavioral/API
  parity reference. It is a derivative work and inherits the original's license (see `LICENSE`).
- Project: https://github.com/erossini/BlazorChartjs — © Enrico Rossini / PureSourceCode.com
