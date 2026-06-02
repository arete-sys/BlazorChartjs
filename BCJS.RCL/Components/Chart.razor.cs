using BCJS.Interop;
using BCJS.Serialization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;

namespace BCJS;

/// <summary>
/// The BCJS chart component. Renders a Chart.js chart from a strongly-typed <see cref="IChartConfig"/>
/// and bridges JS interactions back to .NET. Implements <see cref="IAsyncDisposable"/> so the
/// underlying Chart.js instance and JS references are released (deviation D-1).
/// </summary>
public partial class Chart : IAsyncDisposable
{
    private ChartInterop? _interop;
    private bool _ownsInterop;
    private DotNetObjectReference<Chart>? _selfRef;
    private IChartConfig? _renderedConfig;

    /// <summary>The chart configuration. Required.</summary>
    [Parameter]
    [EditorRequired]
    public IChartConfig Config { get; set; } = default!;

    /// <summary>Optional CSS height for the chart container (e.g. <c>"400px"</c>).</summary>
    [Parameter]
    public string? Height { get; set; }

    /// <summary>Optional CSS width for the chart container.</summary>
    [Parameter]
    public string? Width { get; set; }

    /// <summary>Optional extra CSS class for the chart container.</summary>
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Optional inline style for the chart container.</summary>
    [Parameter]
    public string? Style { get; set; }

    /// <summary>Raised when a data element is clicked.</summary>
    [Parameter]
    public EventCallback<CallbackGenericContext> OnChartClick { get; set; }

    /// <summary>Raised when the chart is hovered.</summary>
    [Parameter]
    public EventCallback<HoverContext> OnChartOver { get; set; }

    /// <summary>Raised when a legend item is clicked.</summary>
    [Parameter]
    public EventCallback<LegendClickContext> OnLegendClick { get; set; }

    /// <inheritdoc/>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (Config is null)
            return;

        if (_interop is null)
        {
            // Prefer a shared interop registered via AddBcjs(); otherwise create (and own) our own,
            // so the component still works with zero DI configuration.
            _interop = Services.GetService<ChartInterop>();
            if (_interop is null)
            {
                _interop = new ChartInterop(JSRuntime);
                _ownsInterop = true;
            }
        }

        _selfRef ??= DotNetObjectReference.Create(this);

        if (ReferenceEquals(Config, _renderedConfig))
            return;

        var json = ChartConfigSerializer.Serialize(Config);
        if (_renderedConfig is null)
            await _interop.CreateAsync(Config.CanvasId, _selfRef, json);
        else
            await _interop.UpdateAsync(Config.CanvasId, _selfRef, json);

        _renderedConfig = Config;
    }

    /// <summary>Re-serializes the current <see cref="Config"/> and pushes it to the chart.</summary>
    public async Task UpdateAsync()
    {
        if (_interop is null || Config is null || _selfRef is null)
            return;
        await _interop.UpdateAsync(Config.CanvasId, _selfRef, ChartConfigSerializer.Serialize(Config));
    }

    /// <summary>Appends label/value pairs to a dataset and redraws.</summary>
    /// <param name="labels">The labels to append.</param>
    /// <param name="datasetIndex">The dataset index.</param>
    /// <param name="data">The values to append (zipped with <paramref name="labels"/>).</param>
    public async Task AddDataAsync(List<string?> labels, int datasetIndex, List<decimal?> data)
    {
        if (_interop is null || Config is null)
            return;
        await _interop.AddDataAsync(Config.CanvasId, labels, datasetIndex, data);
    }

    /// <summary>Appends a new dataset and redraws.</summary>
    /// <typeparam name="T">The dataset type.</typeparam>
    /// <param name="dataset">The dataset to append.</param>
    public async Task AddDatasetAsync<T>(T dataset)
        where T : class
    {
        if (_interop is null || Config is null)
            return;
        await _interop.AddDatasetAsync(Config.CanvasId, ChartConfigSerializer.SerializeFragment(dataset));
    }

    /// <summary>Clears all labels and dataset data and redraws.</summary>
    public async Task ClearDataAsync()
    {
        if (_interop is null || Config is null)
            return;
        await _interop.ClearDataAsync(Config.CanvasId);
    }

    private async Task OnMouseOutAsync(MouseEventArgs args)
    {
        if (Config?.Options is Options { OnMouseOutAsync: { } handler })
            await handler(args);
    }

    #region JS-invokable callbacks

    /// <summary>Invoked by JS when a data element is clicked.</summary>
    [JSInvokable]
    public async Task OnClickCallback(CallbackGenericContext ctx)
    {
        if (OnChartClick.HasDelegate)
            await OnChartClick.InvokeAsync(ctx);
        if (Config?.Options is Options { OnClickAsync: { } handler })
            await handler(ctx);
    }

    /// <summary>Invoked by JS when the chart is hovered.</summary>
    [JSInvokable]
    public async Task OnHoverCallback(HoverContext ctx)
    {
        if (OnChartOver.HasDelegate)
            await OnChartOver.InvokeAsync(ctx);
        if (Config?.Options is Options { OnHoverAsync: { } handler })
            await handler(ctx);
    }

    /// <summary>Invoked by JS when a legend item is clicked.</summary>
    [JSInvokable]
    public async Task OnLegendClickCallback(LegendClickContext ctx)
    {
        if (OnLegendClick.HasDelegate)
            await OnLegendClick.InvokeAsync(ctx);
        if (Config?.Options is Options { Plugins.Legend.OnClickAsync: { } handler })
            await handler(ctx);
    }

    /// <summary>Invoked by JS to filter legend items.</summary>
    [JSInvokable]
    public bool? LegendLabelsFilter(LegendItem item, Data data)
    {
        if (Config?.Options is Options { Plugins.Legend.Labels.Filter: { } filter })
            return filter(new LegendFilterContext(item, data));
        return true;
    }

    /// <summary>Invoked by JS to format a tooltip label.</summary>
    [JSInvokable]
    public string[] TooltipLabel(decimal[] parameters)
    {
        if (Config?.Options is Options { Plugins.Tooltip.Callbacks.Label: { } label })
            return label(new CallbackGenericContext((int)parameters[0], (int)parameters[1], parameters[2]));
        return [];
    }

    /// <summary>Invoked by JS to format a tooltip title.</summary>
    [JSInvokable]
    public string[] TooltipTitle(decimal[] parameters)
    {
        if (Config?.Options is Options { Plugins.Tooltip.Callbacks.Title: { } title })
            return title(new CallbackGenericContext((int)parameters[0], (int)parameters[1], parameters[2]));
        return [];
    }

    /// <summary>Invoked by JS to format axis tick labels (synchronous).</summary>
    [JSInvokable]
    public string[] TicksCallback(string scaleName, decimal value, int index, decimal[] ticks)
    {
        if (Config?.Options is Options { Scales: { } scales }
            && scales.TryGetValue(scaleName, out var axis)
            && axis.Ticks?.Callback is { } callback)
            return callback(new TicksCallbackContext(value, index, ticks));
        return [];
    }

    /// <summary>Invoked by JS to format axis tick labels (asynchronous).</summary>
    [JSInvokable]
    public async Task<string[]> TicksCallbackAsync(string scaleName, decimal value, int index, decimal[] ticks)
    {
        if (Config?.Options is Options { Scales: { } scales }
            && scales.TryGetValue(scaleName, out var axis)
            && axis.Ticks?.CallbackAsync is { } callback)
            return await callback(new TicksCallbackContext(value, index, ticks));
        return [];
    }

    #endregion

    /// <inheritdoc/>
    public async ValueTask DisposeAsync()
    {
        if (_interop is not null)
        {
            try
            {
                if (_renderedConfig is not null && Config is not null)
                    await _interop.DestroyAsync(Config.CanvasId);
            }
            catch (JSDisconnectedException)
            {
                // Circuit gone; nothing to release on the JS side.
            }
            catch (ObjectDisposedException)
            {
                // A shared (DI-owned) interop may be disposed before this component during teardown.
            }

            // Only dispose the interop module if we created it; a shared one is owned by DI.
            if (_ownsInterop)
                await _interop.DisposeAsync();
        }

        _selfRef?.Dispose();
        GC.SuppressFinalize(this);
    }
}
