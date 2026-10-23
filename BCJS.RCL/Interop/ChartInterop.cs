using Microsoft.JSInterop;

namespace BCJS.Interop;

/// <summary>
/// Thin wrapper over the collocated <c>chart-interop.js</c> ES module, loaded on demand via
/// <see cref="IJSObjectReference"/> (deviation D-4). Owns the module reference and disposes it
/// asynchronously (deviation D-1).
/// </summary>
public sealed class ChartInterop : IAsyncDisposable
{
    // The module is loaded by this hardcoded path via dynamic import(). We deliberately do NOT fingerprint
    // this RCL asset (no <StaticWebAssetFingerprintPattern>), so the physical file keeps its plain name on
    // every host. Fingerprinting does work in published WASM (verified 2026-06-02: adding the pattern in the
    // RCL renames the file to chart-interop.<hash>.js and emits an import-map entry that remaps the bare
    // path) — but it would then make loading depend on the consumer emitting that import map
    // (OverrideHtmlAssetPlaceholders), which isn't guaranteed for a redistributable library. Keeping the
    // plain name means the bare path resolves to a real file everywhere. The ?v= query then supplies the
    // version-bump cache busting the un-fingerprinted file otherwise lacks; it bypasses the import map and
    // is ignored by static file servers, resolving to the plain file across dev, server-hosted, and
    // dumb-static-host deployments alike. The query is derived from the assembly version so it advances
    // automatically on each release — no manual bump to forget.
    private static readonly string ModulePath =
        $"./_content/BCJS/chart-interop.js?v={typeof(ChartInterop).Assembly.GetName().Version}";
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

    /// <summary>Returns the chart as an image data URL, or <see langword="null"/> if it has not been drawn.</summary>
    public async ValueTask<string?> ToBase64ImageAsync(string canvasId, string type, double? quality, string? backgroundColor)
    {
        var module = await _module.Value;
        return await module.InvokeAsync<string?>("toBase64Image", canvasId, type, quality, backgroundColor);
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
