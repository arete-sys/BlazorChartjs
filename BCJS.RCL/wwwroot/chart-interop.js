// BCJS interop module — isolated ES module (deviation D-4): imports Chart.js 4.5.1 from the vendored
// `auto` bundle, no global <script> tags, no jQuery. The C# side passes a JSON config *string* which
// is parsed (deviation D-2: no eval) and its `has*`/control flags are rewired into real Chart.js
// callbacks that call back into .NET through an IJSObjectReference + DotNetObjectReference.

import { Chart } from './lib/chartjs/auto/auto.js';
import { getRelativePosition } from './lib/chartjs/helpers/helpers.js';

// Maps a chart type to the polymorphic discriminator the .NET Data model expects (legend filter).
const DATA_TYPES = {
    bar: 'barData',
    line: 'lineData',
    pie: 'pieData',
    doughnut: 'doughnutData',
    radar: 'radarData',
    polarArea: 'polarData',
    bubble: 'bubbleData',
    scatter: 'scatterData',
};

// Per-chart crosshair settings, keyed by canvas id (the crosshair config is stripped before the
// chart is built and handled here instead).
const crosshairs = new Map();

function drawCrosshair(chart, evt, plugin) {
    const { canvas, ctx, chartArea: { left, right, top, bottom } } = chart;

    if (plugin.cursor) {
        const inside = evt.offsetX >= left && evt.offsetX <= right && evt.offsetY <= bottom && evt.offsetY >= top;
        canvas.style.cursor = inside ? plugin.cursor : 'default';
    }

    chart.draw();

    const stroke = (line, x1, y1, x2, y2) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = line.width ?? 1;
        if (line.color) ctx.strokeStyle = line.color;
        if (line.dash) ctx.setLineDash(line.dash);
        ctx.stroke();
        ctx.restore();
    };

    if (plugin.vertical && evt.offsetX >= left && evt.offsetX <= right) {
        stroke(plugin.vertical, evt.offsetX, top, evt.offsetX, bottom);
    }
    if (plugin.horizontal && evt.offsetY <= bottom && evt.offsetY >= top) {
        stroke(plugin.horizontal, left, evt.offsetY, right, evt.offsetY);
    }
}

// Reads "value;group;position" grouping labels for the secondary grouping axes.
function groupAxisTickCallbacks(scales, primaryId, secondaryId) {
    if (!scales?.[primaryId]) return;
    scales[primaryId].ticks = scales[primaryId].ticks || {};
    scales[primaryId].ticks.callback = function (value) {
        return this.getLabelForValue(value).split(';')[0];
    };
    if (scales[secondaryId]) {
        scales[secondaryId].type = 'category';
        scales[secondaryId].grid = { ...(scales[secondaryId].grid || {}), drawOnChartArea: false };
        scales[secondaryId].ticks = scales[secondaryId].ticks || {};
        scales[secondaryId].ticks.callback = function (value) {
            const parts = this.getLabelForValue(value).split(';');
            return parts[2] !== undefined && parts[2] !== '' ? parts[1] : '';
        };
    }
}

// Rewires the serialized control flags into live Chart.js callbacks bound to `dotNetRef`.
function wireCallbacks(config, dotNetRef, getChart) {
    const options = config.options;
    if (!options) return;

    // Legend label filter (synchronous; WASM only).
    if (options.plugins?.legend?.labels?.hasFilter) {
        delete options.plugins.legend.labels.hasFilter;
        options.plugins.legend.labels.filter = (item, data) => {
            const discriminator = DATA_TYPES[config.type] ?? 'base';
            const stamped = { $type: discriminator, ...JSON.parse(JSON.stringify(data)) };
            return dotNetRef.invokeMethod('LegendLabelsFilter', item, stamped);
        };
    }

    // Tooltip label / title (synchronous; WASM only).
    const tcb = options.plugins?.tooltip?.callbacks;
    if (tcb?.hasLabel) {
        delete tcb.hasLabel;
        tcb.label = (ctx) => dotNetRef.invokeMethod('TooltipLabel', [ctx.datasetIndex, ctx.dataIndex, Number(ctx.raw ?? 0)]);
    }
    if (tcb?.hasCustomTitle) {
        delete tcb.hasCustomTitle;
        tcb.title = (items) => {
            const c = items?.[0] ?? {};
            return dotNetRef.invokeMethod('TooltipTitle', [c.datasetIndex ?? -1, c.dataIndex ?? -1, Number(c.raw ?? 0)]);
        };
    }

    // Chart hover (async; works on Server + WASM).
    if (options.hasOnHoverAsync) {
        delete options.hasOnHoverAsync;
        options.onHover = (evt, _elements, chart) => {
            const pos = getRelativePosition(evt, chart);
            const dataX = chart.scales.x ? chart.scales.x.getValueForPixel(pos.x) : 0;
            const dataY = chart.scales.y ? chart.scales.y.getValueForPixel(pos.y) : 0;
            dotNetRef.invokeMethodAsync('OnHoverCallback', { DataX: dataX, DataY: dataY });
        };
    }

    // Grouped secondary axes.
    if (options.groupXAxis) {
        delete options.groupXAxis;
        groupAxisTickCallbacks(options.scales, 'x', 'xAxis2');
    }
    if (options.groupYAxis) {
        delete options.groupYAxis;
        groupAxisTickCallbacks(options.scales, 'y', 'yAxis2');
    }

    // Per-scale tick callbacks.
    if (options.scales) {
        for (const name of Object.keys(options.scales)) {
            const ticks = options.scales[name]?.ticks;
            if (!ticks) continue;
            if (ticks.hasCallback) {
                delete ticks.hasCallback;
                ticks.callback = (value, index, all) =>
                    dotNetRef.invokeMethod('TicksCallback', name, value, index, all.map(t => t.value));
            }
            if (ticks.hasAsyncCallback) {
                delete ticks.hasAsyncCallback;
                ticks.callback = (value, index, all) =>
                    dotNetRef.invokeMethodAsync('TicksCallbackAsync', name, value, index, all.map(t => t.value));
            }
        }
    }

    // Data labels: register the plugin if the consumer has made it globally available.
    if (options.registerDataLabels) {
        delete options.registerDataLabels;
        if (typeof globalThis.ChartDataLabels !== 'undefined') {
            Chart.register(globalThis.ChartDataLabels);
        }
    }

    // Always-on click + legend click forwarding.
    options.onClick = (_evt, elements, chart) => {
        if (!elements.length) return;
        const el = elements[0];
        const value = Number(chart.data.datasets[el.datasetIndex].data[el.index] ?? 0);
        dotNetRef.invokeMethodAsync('OnClickCallback', { DatasetIndex: el.datasetIndex, DataIndex: el.index, Value: value });
    };
    options.plugins = options.plugins || {};
    options.plugins.legend = options.plugins.legend || {};
    options.plugins.legend.onClick = (_evt, item) => {
        dotNetRef.invokeMethodAsync('OnLegendClickCallback', { LegendIndex: item.index ?? item.datasetIndex, LegendText: item.text });
    };
}

function buildChart(canvasId, dotNetRef, jsonConfig) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const config = typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;

    // Pull the crosshair config out before building (it is a BCJS-side plugin, not a Chart.js one).
    const crosshair = config.options?.plugins?.crosshair;
    if (config.options?.plugins) delete config.options.plugins.crosshair;

    wireCallbacks(config, dotNetRef, () => Chart.getChart(canvasId));

    const chart = new Chart(canvas.getContext('2d'), config);

    if (crosshair) {
        crosshairs.set(canvasId, crosshair);
        const handler = (evt) => drawCrosshair(chart, evt, crosshair);
        chart.$bcjsCrosshair = handler;
        canvas.addEventListener('mousemove', handler);
    }
    return chart;
}

/** Creates a chart on the given canvas from a serialized config string. */
export function create(canvasId, dotNetRef, jsonConfig) {
    destroy(canvasId);
    buildChart(canvasId, dotNetRef, jsonConfig);
}

/** Replaces an existing chart with a freshly built one (deviation D-5: real update path). */
export function update(canvasId, dotNetRef, jsonConfig) {
    destroy(canvasId);
    buildChart(canvasId, dotNetRef, jsonConfig);
}

/** Pushes a single label/value pair onto a dataset and redraws. */
export function addData(canvasId, label, datasetIndex, value) {
    const chart = Chart.getChart(canvasId);
    if (!chart) return;
    if (label !== null && label !== undefined) chart.data.labels.push(label);
    if (datasetIndex < chart.data.datasets.length) chart.data.datasets[datasetIndex].data.push(value);
    chart.update();
}

/** Appends a new dataset (passed as a serialized JSON string) and redraws. */
export function addDataset(canvasId, datasetJson) {
    const chart = Chart.getChart(canvasId);
    if (!chart) return;
    chart.data.datasets.push(typeof datasetJson === 'string' ? JSON.parse(datasetJson) : datasetJson);
    chart.update();
}

/** Clears all labels and dataset data and redraws. */
export function clearData(canvasId) {
    const chart = Chart.getChart(canvasId);
    if (!chart) return;
    chart.data.labels = [];
    chart.data.datasets.forEach(ds => { ds.data = []; });
    chart.update();
}

/** Destroys the chart and releases its crosshair listener (deviation D-1). */
export function destroy(canvasId) {
    const chart = Chart.getChart(canvasId);
    if (!chart) return;
    if (chart.$bcjsCrosshair) {
        chart.canvas.removeEventListener('mousemove', chart.$bcjsCrosshair);
    }
    crosshairs.delete(canvasId);
    chart.destroy();
}
