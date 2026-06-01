using Microsoft.JSInterop;

namespace BCJS.Interop;

/// <summary>
/// Thin wrapper over the collocated <c>chart-interop.js</c> ES module, loaded on demand via
/// <see cref="IJSObjectReference"/> (deviation D-4). Owns the module reference and disposes it
/// asynchronously (deviation D-1).
/// </summary>
public sealed class ChartInterop : IAsyncDisposable
{
    // A version query keeps this out of the net10 fingerprint import map (which would rewrite the URL
    // to a fingerprinted name the host may not serve) while still busting the cache on version bumps.
    private const string ModulePath = "./_content/BCJS/chart-interop.js?v=1.0.0";
    private readonly Lazy<Task<IJSObjectReference>> _module;

    /// <summary>Initializes a new instance of the <see cref="ChartInterop"/> class.</summary>
    /// <param name="jsRuntime">The JS runtime used to import the module.</param>
    public ChartInterop(IJSRuntime jsRuntime) =>
        _module = new Lazy<Task<IJSObjectReference>>(() =>
            jsRuntime.InvokeAsync<IJSObjectReference>("import", ModulePath).AsTask());

    /// <summary>Creates a chart from a serialized config string.</summary>
    public async ValueTask CreateAsync(string canvasId, DotNetObjectReference<Chart> dotNetRef, string jsonConfig)
    {
        var module = await _module.Value;
        await module.InvokeVoidAsync("create", canvasId, dotNetRef, jsonConfig);
    }

    /// <summary>Replaces the chart with one built from a new serialized config string.</summary>
    public async ValueTask UpdateAsync(string canvasId, DotNetObjectReference<Chart> dotNetRef, string jsonConfig)
    {
        var module = await _module.Value;
        await module.InvokeVoidAsync("update", canvasId, dotNetRef, jsonConfig);
    }

    /// <summary>Appends label/value pairs to a dataset.</summary>
    public async ValueTask AddDataAsync(string canvasId, List<string?> labels, int datasetIndex, List<decimal?> data)
    {
        var module = await _module.Value;
        var count = Math.Min(labels.Count, data.Count);
        for (var i = 0; i < count; i++)
            await module.InvokeVoidAsync("addData", canvasId, labels[i], datasetIndex, data[i]);
    }

    /// <summary>Appends a new dataset (passed as a serialized JSON string).</summary>
    public async ValueTask AddDatasetAsync(string canvasId, string datasetJson)
    {
        var module = await _module.Value;
        await module.InvokeVoidAsync("addDataset", canvasId, datasetJson);
    }

    /// <summary>Clears all labels and dataset data.</summary>
    public async ValueTask ClearDataAsync(string canvasId)
    {
        var module = await _module.Value;
        await module.InvokeVoidAsync("clearData", canvasId);
    }

    /// <summary>Destroys the chart instance.</summary>
    public async ValueTask DestroyAsync(string canvasId)
    {
        var module = await _module.Value;
        await module.InvokeVoidAsync("destroy", canvasId);
    }

    /// <inheritdoc/>
    public async ValueTask DisposeAsync()
    {
        if (_module.IsValueCreated)
        {
            try
            {
                var module = await _module.Value;
                await module.DisposeAsync();
            }
            catch (JSDisconnectedException)
            {
                // Circuit already gone (Blazor Server teardown); nothing to release.
            }
        }
    }
}
