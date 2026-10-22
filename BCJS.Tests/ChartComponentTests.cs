using BCJS;
using BCJS.Configuration;
using Bunit;

namespace BCJS.Tests;

public class ChartComponentTests
{
    private static BunitContext CreateContext(out BunitJSModuleInterop module)
    {
        var ctx = new BunitContext();
        ctx.JSInterop.Mode = JSRuntimeMode.Loose; // auto-succeed + record interop calls
        // Catch-all module setup: the component imports the script with a cache-busting "?v=<version>"
        // query, so matching a fixed URL here would miss it (and silently record zero invocations).
        module = ctx.JSInterop.SetupModule();
        return ctx;
    }

    private static LineChartConfig SampleConfig()
    {
        var cfg = new LineChartConfig();
        cfg.Data.Labels = ["A", "B"];
        cfg.Data.Datasets.Add(new LineDataset { Label = "S", Data = [1, 2] });
        return cfg;
    }

    [Fact]
    public void Renders_canvas_with_the_config_canvas_id()
    {
        using var ctx = CreateContext(out _);
        var config = SampleConfig();

        var cut = ctx.Render<Chart>(p => p.Add(c => c.Config, config));

        Assert.Equal(config.CanvasId, cut.Find("canvas").Id);
    }

    [Fact]
    public void Creates_the_chart_on_first_render()
    {
        using var ctx = CreateContext(out var module);
        var config = SampleConfig();

        ctx.Render<Chart>(p => p.Add(c => c.Config, config));

        var invocation = Assert.Single(module.Invocations["create"]);
        Assert.Equal(config.CanvasId, invocation.Arguments[0]);
    }

    [Fact]
    public async Task Destroys_the_chart_on_dispose()
    {
        using var ctx = CreateContext(out var module);
        var config = SampleConfig();
        ctx.Render<Chart>(p => p.Add(c => c.Config, config));

        await ctx.DisposeComponentsAsync();

        var invocation = Assert.Single(module.Invocations["destroy"]);
        Assert.Equal(config.CanvasId, invocation.Arguments[0]);
    }

    [Fact]
    public async Task UpdateAsync_pushes_changed_data_to_the_existing_chart()
    {
        using var ctx = CreateContext(out var module);
        var config = SampleConfig();
        var cut = ctx.Render<Chart>(p => p.Add(c => c.Config, config));

        config.Data.Labels = ["2021", "2022", "2023"];
        config.Data.Datasets[0].Data = [5, 6, 7];
        await cut.InvokeAsync(cut.Instance.UpdateAsync);

        Assert.Single(module.Invocations["create"]);
        var update = Assert.Single(module.Invocations["update"]);
        Assert.Equal(config.CanvasId, update.Arguments[0]);
        var json = Assert.IsType<string>(update.Arguments[2]);
        Assert.Contains("\"labels\":[\"2021\",\"2022\",\"2023\"]", json, StringComparison.Ordinal);
        Assert.Contains("\"data\":[5,6,7]", json, StringComparison.Ordinal);
    }

    [Fact]
    public void Applies_class_and_dimensions_to_the_container()
    {
        using var ctx = CreateContext(out _);

        var cut = ctx.Render<Chart>(p => p
            .Add(c => c.Config, SampleConfig())
            .Add(c => c.Class, "my-chart")
            .Add(c => c.Height, "300px"));

        var container = cut.Find("div.bcjs-chart-container");
        Assert.Contains("my-chart", container.ClassList);
        Assert.Contains("height:300px", container.GetAttribute("style"));
    }
}
