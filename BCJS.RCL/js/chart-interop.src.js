// BCJS interop module — isolated ES module (deviation D-4): imports Chart.js 4.5.1 from the vendored
// `auto` bundle, no global <script> tags, no jQuery. The C# side passes a JSON config *string* which
// is parsed (deviation D-2: no eval) and its `has*`/control flags are rewired into real Chart.js
// callbacks that call back into .NET through an IJSObjectReference + DotNetObjectReference.

import { Chart } from './lib/chartjs/auto/auto.js';
import { getRelativePosition, toPadding } from './lib/chartjs/helpers/helpers.js';
import ChartDataLabels from './lib/datalabels/chartjs-plugin-datalabels.esm.js';
import zoomPlugin from './lib/zoom/chartjs-plugin-zoom.esm.js';

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

const CATEGORY_NAMED = new Set(['pie', 'doughnut', 'polarArea']);

// Read from the raw config, not resolved options: resolved defaults would override host CSS.
const HTML_TOOLTIP_OPTIONS = [
    'backgroundColor', 'borderColor', 'borderWidth', 'cornerRadius', 'padding', 'titleColor', 'titleFont',
    'titleMarginBottom', 'bodyColor', 'bodyFont', 'displayColors', 'boxWidth', 'boxHeight',
];

// :where() keeps these defaults at zero specificity so any host CSS overrides them.
function ensureTooltipStyles() {
    if (document.getElementById('bcjs-tooltip-styles')) return;
    const font = Chart.defaults.font;
    const style = document.createElement('style');
    style.id = 'bcjs-tooltip-styles';
    style.textContent = `
:where(.bcjs-tooltip) {
  position: absolute; left: 0; top: 0; z-index: 10; pointer-events: none; opacity: 0;
  transition: opacity .15s ease; white-space: nowrap; line-height: 1.3;
  font-family: ${font.family}; font-size: ${font.size}px;
  background: var(--bcjs-tooltip-bg, rgba(0, 0, 0, 0.8)); color: var(--bcjs-tooltip-color, #fff);
  border: var(--bcjs-tooltip-border-width, 0) solid var(--bcjs-tooltip-border-color, transparent);
  border-radius: var(--bcjs-tooltip-radius, 6px); padding: var(--bcjs-tooltip-padding, 6px);
}
:where(.bcjs-tooltip-title) { font-weight: bold; margin-bottom: 6px; }
:where(.bcjs-tooltip-row) { display: flex; align-items: center; gap: 0.4em; }
:where(.bcjs-tooltip-marker) { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }
:where(.bcjs-tooltip-value) { font-weight: bold; }
`;
    document.head.append(style);
}

function applyHtmlTooltip(config) {
    const tooltip = config.options?.plugins?.tooltip;
    const html = tooltip?.bcjsHtml;
    if (!html) return;
    delete tooltip.bcjsHtml;
    if (tooltip.enabled === false) return;

    const style = {};
    for (const key of HTML_TOOLTIP_OPTIONS) {
        if (tooltip[key] !== undefined) style[key] = tooltip[key];
    }
    const settings = {
        html,
        style,
        customLabel: !!tooltip.callbacks?.hasLabel,
        categoryNamed: CATEGORY_NAMED.has(config.type),
    };
    settings.showTitle = html.showTitle ?? !settings.categoryNamed;
    if (html.function) settings.fn = compileTooltipFunction(html.function);

    ensureTooltipStyles();
    tooltip.enabled = false;
    tooltip.external = (context) => renderHtmlTooltip(context, settings);
}

const HIDE_TOOLTIP = Symbol('hide');

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Compile only charts that set Function: pages without it must keep working under a CSP without 'unsafe-eval'.
function compileTooltipFunction(source) {
    try {
        const fn = (0, eval)(`'use strict'; (${source})`); // indirect eval: global scope, no BCJS locals
        if (typeof fn !== 'function') throw new TypeError('the code does not evaluate to a function');
        return fn;
    } catch (err) {
        console.error("BCJS: Tooltip.Html.Function could not be compiled, so the built-in tooltip is used. " +
            "If the page sets a Content Security Policy, its script-src must allow 'unsafe-eval'.", err);
        return null;
    }
}

function customTooltipContent(chart, tooltip, settings) {
    let result;
    try {
        result = settings.fn({
            chart,
            tooltip,
            dataPoints: tooltip.dataPoints,
            title: tooltip.title,
            escape: escapeHtml,
        });
    } catch (err) {
        if (!settings.fnFailed) console.error('BCJS: Tooltip.Html.Function threw, so the built-in tooltip is used.', err);
        settings.fnFailed = true;
        return undefined;
    }
    if (result === null || result === undefined) return HIDE_TOOLTIP;
    if (typeof result === 'string' || typeof result === 'number') return String(result);
    if (typeof result.nodeType === 'number') return result;
    if (!settings.fnFailed) {
        console.error('BCJS: Tooltip.Html.Function must return a string, a DOM node, or null; the built-in tooltip is used.', result);
    }
    settings.fnFailed = true;
    return undefined;
}

function applyFont(el, font) {
    if (!font) return;
    if (font.family) el.style.fontFamily = font.family;
    if (font.size) el.style.fontSize = `${font.size}px`;
    if (font.style) el.style.fontStyle = font.style;
    if (font.weight) el.style.fontWeight = font.weight;
    if (font.lineHeight) el.style.lineHeight = font.lineHeight;
}

function element(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    if (text !== undefined) el.textContent = text; // never innerHTML: labels are data
    return el;
}

function htmlTooltipElement(chart) {
    const container = chart.canvas.parentNode;
    let el = chart.$bcjsTooltip;
    if (!el || el.parentNode !== container) {
        el?.remove();
        el = element('div', 'bcjs-tooltip');
        el.setAttribute('role', 'tooltip');
        if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
        container.append(el);
        chart.$bcjsTooltip = el;
    }
    return el;
}

function removeHtmlTooltip(chart) {
    chart.$bcjsTooltip?.remove();
    chart.$bcjsTooltip = null;
}

function renderHtmlTooltip({ chart, tooltip }, settings) {
    const el = htmlTooltipElement(chart);
    if (tooltip.opacity === 0) {
        el.style.opacity = '0';
        return;
    }

    const { html, style: s } = settings;
    el.className = html.cssClass ? `bcjs-tooltip ${html.cssClass}` : 'bcjs-tooltip';
    el.style.background = s.backgroundColor ?? '';
    el.style.borderColor = s.borderColor ?? '';
    el.style.borderWidth = s.borderWidth !== undefined ? `${s.borderWidth}px` : '';
    el.style.borderRadius = typeof s.cornerRadius === 'number' ? `${s.cornerRadius}px` : '';
    if (s.padding !== undefined) {
        const p = toPadding(s.padding);
        el.style.padding = `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
    } else {
        el.style.padding = '';
    }

    const content = settings.fn ? customTooltipContent(chart, tooltip, settings) : undefined;
    if (content === HIDE_TOOLTIP) {
        el.style.opacity = '0';
        return;
    }
    if (typeof content === 'string') el.innerHTML = content; // the function's own HTML; escaping is its job
    else if (content) el.replaceChildren(content);
    else el.replaceChildren(...builtInTooltipContent(tooltip, settings));
    el.style.opacity = '1';
    positionHtmlTooltip(chart, tooltip, el);
}

function builtInTooltipContent(tooltip, settings) {
    const { html, style: s } = settings;
    const children = [];
    if (settings.showTitle && tooltip.title?.length) {
        const title = element('div', 'bcjs-tooltip-title', tooltip.title.join(' '));
        if (s.titleColor) title.style.color = s.titleColor;
        if (s.titleMarginBottom !== undefined) title.style.marginBottom = `${s.titleMarginBottom}px`;
        applyFont(title, s.titleFont);
        children.push(title);
    }

    tooltip.dataPoints.forEach((point, i) => {
        const row = element('div', 'bcjs-tooltip-row');
        if (s.bodyColor) row.style.color = s.bodyColor;
        if (s.displayColors !== false) {
            const marker = element('span', 'bcjs-tooltip-marker');
            // Over white like the canvas tooltip, else translucent colors show the tooltip background.
            const colors = tooltip.labelColors[i] ?? {};
            marker.style.background = colors.backgroundColor
                ? `linear-gradient(${colors.backgroundColor}, ${colors.backgroundColor}), #fff`
                : '';
            marker.style.border = typeof colors.borderColor === 'string' ? `1px solid ${colors.borderColor}` : '';
            if (s.boxWidth !== undefined) marker.style.width = `${s.boxWidth}px`;
            if (s.boxHeight !== undefined) marker.style.height = `${s.boxHeight}px`;
            row.append(marker);
        }
        if (settings.customLabel) {
            const text = element('span', 'bcjs-tooltip-text', (tooltip.body[i]?.lines ?? []).join(' '));
            applyFont(text, s.bodyFont);
            row.append(text);
        } else {
            const name = settings.categoryNamed ? point.label : (point.dataset.label || point.label);
            if (name) {
                const label = element('span', 'bcjs-tooltip-label', name + (html.separator ?? ':'));
                applyFont(label, s.bodyFont);
                applyFont(label, html.labelFont);
                row.append(label);
            }
            const value = element('span', 'bcjs-tooltip-value', point.formattedValue);
            applyFont(value, s.bodyFont);
            applyFont(value, html.valueFont);
            row.append(value);
        }
        children.push(row);
    });
    return children;
}

function positionHtmlTooltip(chart, tooltip, el) {
    const container = el.parentNode;
    const gap = 8;
    const x = chart.canvas.offsetLeft + tooltip.caretX;
    const y = chart.canvas.offsetTop + tooltip.caretY;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = x - w / 2;
    let top = y - h - gap;
    if (top < 0) top = y + gap;
    left = Math.min(Math.max(left, 0), Math.max(container.clientWidth - w, 0));
    top = Math.min(Math.max(top, 0), Math.max(container.clientHeight - h, 0));
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
}

// Rewires the serialized control flags into live Chart.js callbacks bound to `dotNetRef`.
function wireCallbacks(config, dotNetRef, getChart) {
    for (const dataset of config.data?.datasets ?? []) applyLabelFormat(dataset.datalabels);

    const options = config.options;
    if (!options) return;

    applyLabelFormat(options.plugins?.datalabels);
    applyHtmlTooltip(config);

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

    // Data-labels registration is handled in ensurePlugins(); just strip the flag here.
    delete options.registerDataLabels;

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

function applyLabelFormat(labels) {
    const format = labels?.bcjsFormat;
    if (!format) return;
    delete labels.bcjsFormat;
    labels.formatter = (value, ctx) => formatLabel(value, ctx, format);
}

function formatLabel(value, ctx, format) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return ChartDataLabels.defaults.formatter(value, ctx);
    }
    let n = value;
    if (format.percentage) {
        let total = 0;
        ctx.dataset.data.forEach((v, i) => {
            if (typeof v === 'number' && Number.isFinite(v) && ctx.chart.getDataVisibility(i)) total += v;
        });
        n = total === 0 ? 0 : (value / total) * 100;
    }
    const text = Number.isInteger(format.decimals) ? n.toFixed(format.decimals) : String(n);
    return (format.prefix ?? '') + text + (format.suffix ?? '');
}

// Inline per chart, never Chart.register: the plugin draws labels by default and would leak to every chart.
function usesDataLabels(config) {
    return !!config.options?.registerDataLabels;
}

// Optional Chart.js plugins are imported lazily and registered at most once (registration is global
// to the Chart.js instance). The vendored plugin modules have their bare 'chart.js' specifiers
// rewritten to the collocated vendored files, so everything stays isolated.
// Zoom may stay global: it is inert unless a chart configures it.
const registeredPlugins = new Set();

function ensurePlugins(config) {
    const options = config.options ?? {};

    if (options.plugins?.zoom && !registeredPlugins.has('zoom')) {
        Chart.register(zoomPlugin);
        registeredPlugins.add('zoom');
    }
}

// Pulls the crosshair config out of a config (it is a BCJS-side plugin, not a Chart.js one).
function takeCrosshair(config) {
    const crosshair = config.options?.plugins?.crosshair;
    if (config.options?.plugins) delete config.options.plugins.crosshair;
    return crosshair;
}

function setCrosshair(chart, canvasId, crosshair) {
    if (chart.$bcjsCrosshair) {
        chart.canvas.removeEventListener('mousemove', chart.$bcjsCrosshair);
        chart.$bcjsCrosshair = null;
        crosshairs.delete(canvasId);
    }
    if (crosshair) {
        crosshairs.set(canvasId, crosshair);
        const handler = (evt) => drawCrosshair(chart, evt, crosshair);
        chart.$bcjsCrosshair = handler;
        chart.canvas.addEventListener('mousemove', handler);
    }
}

function buildChart(canvasId, dotNetRef, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const crosshair = takeCrosshair(config);
    const dataLabels = usesDataLabels(config);
    if (dataLabels) config.plugins = [ChartDataLabels];

    wireCallbacks(config, dotNetRef, () => Chart.getChart(canvasId));

    const chart = new Chart(canvas.getContext('2d'), config);
    chart.$bcjsDataLabels = dataLabels;
    setCrosshair(chart, canvasId, crosshair);
    return chart;
}

// Reuse dataset objects: Chart.js drops a dataset's controller (and its animation) when the object changes.
function applyData(target, source) {
    target.labels = source.labels ?? [];
    const next = source.datasets ?? [];
    const current = target.datasets ?? (target.datasets = []);
    next.forEach((dataset, i) => {
        const existing = current[i];
        if (!existing) {
            current.push(dataset);
            return;
        }
        for (const key of Object.keys(existing)) {
            if (!(key in dataset)) delete existing[key];
        }
        Object.assign(existing, dataset);
    });
    current.length = next.length;
}

function parseConfig(jsonConfig) {
    return typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;
}

/** Creates a chart on the given canvas from a serialized config string. */
export async function create(canvasId, dotNetRef, jsonConfig) {
    destroy(canvasId);
    const config = parseConfig(jsonConfig);
    ensurePlugins(config);
    buildChart(canvasId, dotNetRef, config);
}

/** Updates the chart in place; rebuilds only on a type or data-labels change (inline plugins are fixed at construction). */
export async function update(canvasId, dotNetRef, jsonConfig) {
    const config = parseConfig(jsonConfig);
    ensurePlugins(config);

    const chart = Chart.getChart(canvasId);
    if (!chart || chart.config.type !== config.type || chart.$bcjsDataLabels !== usesDataLabels(config)) {
        destroy(canvasId);
        buildChart(canvasId, dotNetRef, config);
        return;
    }

    const crosshair = takeCrosshair(config);
    wireCallbacks(config, dotNetRef, () => chart);
    if (!config.options?.plugins?.tooltip?.external) removeHtmlTooltip(chart);
    applyData(chart.data, config.data ?? {});
    chart.options = config.options ?? {};
    setCrosshair(chart, canvasId, crosshair);
    chart.update();
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
    setCrosshair(chart, canvasId, null);
    removeHtmlTooltip(chart);
    chart.destroy();
}
