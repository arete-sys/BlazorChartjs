using BCJS;
using BCJS.Configuration;
using Bunit;

namespace BCJS.Tests;

public class ChartComponentTests
{
    private static TestContext CreateContext(out BunitJSModuleInterop module)
    {
        var ctx = new TestContext();
        ctx.JSInterop.Mode = JSRuntimeMode.Loose; // auto-succeed + record interop calls
        module = ctx.JSInterop.SetupModule("./_content/BCJS/chart-interop.js");
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

        var cut = ctx.RenderComponent<Chart>(p => p.Add(c => c.Config, config));

        Assert.Equal(config.CanvasId, cut.Find("canvas").Id);
    }

    [Fact]
    public void Creates_the_chart_on_first_render()
    {
        using var ctx = CreateContext(out var module);
        var config = SampleConfig();

        ctx.RenderComponent<Chart>(p => p.Add(c => c.Config, config));

        var invocation = Assert.Single(module.Invocations["create"]);
        Assert.Equal(config.CanvasId, invocation.Arguments[0]);
    }

    [Fact]
    public void Destroys_the_chart_on_dispose()
    {
        using var ctx = CreateContext(out var module);
        var config = SampleConfig();
        ctx.RenderComponent<Chart>(p => p.Add(c => c.Config, config));

        ctx.DisposeComponents();

        var invocation = Assert.Single(module.Invocations["destroy"]);
        Assert.Equal(config.CanvasId, invocation.Arguments[0]);
    }

    [Fact]
    public void Applies_class_and_dimensions_to_the_container()
    {
        using var ctx = CreateContext(out _);

        var cut = ctx.RenderComponent<Chart>(p => p
            .Add(c => c.Config, SampleConfig())
            .Add(c => c.Class, "my-chart")
            .Add(c => c.Height, "300px"));

        var container = cut.Find("div.bcjs-chart-container");
        Assert.Contains("my-chart", container.ClassList);
        Assert.Contains("height:300px", container.GetAttribute("style"));
    }
}
