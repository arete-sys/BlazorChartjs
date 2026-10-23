# Third-Party Notices

BCJS bundles and/or builds upon the following third-party software.

> Build note: the runtime ES modules below are vendored under `BCJS.RCL/js/lib/` (build source, not
> served) and bundled by esbuild into a single served module `BCJS.RCL/wwwroot/chart-interop.js`.
> Regenerate after editing the source, from `BCJS.RCL/`:
> `npx esbuild@0.27.0 js/chart-interop.src.js --bundle --format=esm --platform=browser --minify --outfile=wwwroot/chart-interop.js`
> The bundle is minified; the licence headers of the bundled libraries are kept at the end of the file.

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
- Vendored ES module at `BCJS.RCL/js/lib/zoom/` (bare `chart.js`/`hammerjs` specifiers rewritten to
  the collocated vendored files). License: `BCJS.RCL/js/lib/zoom/LICENSE.md`.

## Hammer.js 2.0.8
- License: MIT
- Project: https://github.com/hammerjs/hammer.js — © Jorik Tangelder
- Bundled by esbuild 0.27.0 into the ES module `BCJS.RCL/js/lib/zoom/hammer.esm.js`, which gives the zoom
  plugin touch pinch and pan. **Modified:** the line `freeGlobal.Hammer = Hammer;` is removed, so loading
  BCJS sets no `window.Hammer` global. License: appended to `BCJS.RCL/js/lib/zoom/LICENSE.md`.

## chartjs-adapter-date-fns 3.0.0 and date-fns 4.1.0
- License: MIT (both)
- Projects: https://github.com/chartjs/chartjs-adapter-date-fns, https://github.com/date-fns/date-fns
- Bundled by esbuild 0.27.0 into one ES module, `BCJS.RCL/js/lib/dateadapter/chartjs-adapter-date-fns.bundle.esm.js`,
  with the bare `chart.js` import rewritten to `../chartjs/dist/chart.js` so it registers on the vendored
  Chart.js. Licenses: `BCJS.RCL/js/lib/dateadapter/LICENSE.md`.

## PSC.Blazor.Components.Chartjs (origin of the design)
- BCJS is a clean reimplementation that uses the original library as a behavioral/API
  parity reference. It is a derivative work and inherits the original's license (see `LICENSE`).
- Project: https://github.com/erossini/BlazorChartjs — © Enrico Rossini / PureSourceCode.com
