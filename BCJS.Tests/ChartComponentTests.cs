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

    [Fact]
    public void Canvas_sits_in_its_own_box_inside_the_container()
    {
        using var ctx = CreateContext(out _);

        var cut = ctx.Render<Chart>(p => p.Add(c => c.Config, SampleConfig()));

        Assert.NotNull(cut.Find("div.bcjs-chart-container > div.bcjs-chart-canvas > canvas"));
    }

    [Fact]
    public void AriaLabel_makes_the_canvas_a_labelled_image()
    {
        using var ctx = CreateContext(out _);

        var unlabelled = ctx.Render<Chart>(p => p.Add(c => c.Config, SampleConfig())).Find("canvas");
        Assert.False(unlabelled.HasAttribute("role"));
        Assert.False(unlabelled.HasAttribute("aria-label"));

        var labelled = ctx.Render<Chart>(p => p
            .Add(c => c.Config, SampleConfig())
            .Add(c => c.AriaLabel, "Notes per month")).Find("canvas");
        Assert.Equal("img", labelled.GetAttribute("role"));
        Assert.Equal("Notes per month", labelled.GetAttribute("aria-label"));
    }

    [Fact]
    public void Child_content_is_centred_over_the_canvas_only_when_given()
    {
        using var ctx = CreateContext(out _);

        var bare = ctx.Render<Chart>(p => p.Add(c => c.Config, SampleConfig()));
        Assert.Empty(bare.FindAll(".bcjs-chart-overlay"));

        var withContent = ctx.Render<Chart>(p => p
            .Add(c => c.Config, SampleConfig())
            .AddChildContent("<strong>201</strong>"));
        var overlay = withContent.Find("div.bcjs-chart-canvas > div.bcjs-chart-overlay");
        Assert.Equal("201", overlay.QuerySelector("strong")?.TextContent);
    }

    [Fact]
    public void Create_tells_the_module_whether_to_report_active_changes()
    {
        using var ctx = CreateContext(out var module);
        ctx.Render<Chart>(p => p.Add(c => c.Config, SampleConfig()));
        Assert.Equal(false, Assert.Single(module.Invocations["create"]).Arguments[3]);

        using var ctx2 = CreateContext(out var module2);
        ctx2.Render<Chart>(p => p
            .Add(c => c.Config, SampleConfig())
            .Add(c => c.OnActiveChanged, (ActiveElement[] _) => { }));
        Assert.Equal(true, Assert.Single(module2.Invocations["create"]).Arguments[3]);
    }

    [Fact]
    public async Task SetActiveElementsAsync_passes_the_elements_and_OnActiveChanged_raises_them()
    {
        using var ctx = CreateContext(out var module);
        ActiveElement[]? raised = null;
        var config = SampleConfig();
        var cut = ctx.Render<Chart>(p => p
            .Add(c => c.Config, config)
            .Add(c => c.OnActiveChanged, (ActiveElement[] e) => raised = e));

        await cut.InvokeAsync(() => cut.Instance.SetActiveElementsAsync(new ActiveElement(0, 3)));
        var invocation = Assert.Single(module.Invocations["setActiveElements"]);
        Assert.Equal(config.CanvasId, invocation.Arguments[0]);
        Assert.Equal([new ActiveElement(0, 3)], (ActiveElement[])invocation.Arguments[1]!);

        await cut.InvokeAsync(() => cut.Instance.OnActiveChangedCallback([new ActiveElement(0, 1)]));
        Assert.NotNull(raised);
        Assert.Equal([new ActiveElement(0, 1)], raised);
    }

    [Fact]
    public async Task ToBase64ImageAsync_calls_the_module_with_the_canvas_and_options()
    {
        using var ctx = CreateContext(out var module);
        var config = SampleConfig();
        var cut = ctx.Render<Chart>(p => p.Add(c => c.Config, config));

        await cut.InvokeAsync(() => cut.Instance.ToBase64ImageAsync("image/jpeg", 0.9, "#fff"));

        var invocation = Assert.Single(module.Invocations["toBase64Image"]);
        Assert.Equal([config.CanvasId, "image/jpeg", 0.9, "#fff"], invocation.Arguments);
    }
}
