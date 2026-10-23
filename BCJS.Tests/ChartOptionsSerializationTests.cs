using System.Text.Json;
using BCJS.Configuration;
using BCJS.Serialization;

namespace BCJS.Tests;

/// <summary>
/// The HTML legend, value formats and the Chart.js 4 axis, dataset and layout options: unset options stay out
/// of the JSON so Chart.js keeps its defaults, and set ones use Chart.js's own names.
/// </summary>
public class ChartOptionsSerializationTests
{
    private static JsonElement Root(IChartConfig config) =>
        JsonDocument.Parse(ChartConfigSerializer.Serialize(config)).RootElement;

    private static string[] PropertyNames(JsonElement element) =>
        [.. element.EnumerateObject().Select(p => p.Name).Order(StringComparer.Ordinal)];

    [Fact]
    public void Html_legend_is_omitted_when_unset_and_serialized_when_set()
    {
        var unset = Root(new PieChartConfig { Options = new PieOptions { Plugins = new Plugins { Legend = new Legend() } } });
        Assert.False(unset.GetProperty("options").GetProperty("plugins").GetProperty("legend").TryGetProperty("bcjsHtml", out _));

        var set = Root(new PieChartConfig
        {
            Options = new PieOptions { Plugins = new Plugins { Legend = new Legend { Html = new HtmlLegend { CssClass = "dark" } } } },
        });
        var html = set.GetProperty("options").GetProperty("plugins").GetProperty("legend").GetProperty("bcjsHtml");
        Assert.Equal(["cssClass"], PropertyNames(html));
        Assert.Equal("dark", html.GetProperty("cssClass").GetString());
    }

    [Fact]
    public void Empty_html_legend_serializes_as_an_empty_object()
    {
        var html = Root(new PieChartConfig
        {
            Options = new PieOptions { Plugins = new Plugins { Legend = new Legend { Html = new HtmlLegend() } } },
        }).GetProperty("options").GetProperty("plugins").GetProperty("legend").GetProperty("bcjsHtml");

        Assert.Empty(PropertyNames(html));
    }

    [Fact]
    public void Value_formats_serialize_on_ticks_tooltip_and_data_labels()
    {
        var format = new ValueFormat { Decimals = 1, Prefix = "$", Suffix = "M", Compact = true, UseGrouping = true };
        var config = new BarChartConfig
        {
            Options = new Options
            {
                Plugins = new Plugins
                {
                    Tooltip = new Tooltip { Format = format },
                    DataLabels = new DataLabels { Format = new DataLabelsFormat { Percentage = true, MinPercentage = 3 } },
                },
                Scales = new Dictionary<string, Axis> { ["y"] = new() { Ticks = new Ticks { Format = format, Precision = 0 } } },
            },
        };
        var options = Root(config).GetProperty("options");

        var tooltip = options.GetProperty("plugins").GetProperty("tooltip").GetProperty("bcjsFormat");
        Assert.Equal(["compact", "decimals", "prefix", "suffix", "useGrouping"], PropertyNames(tooltip));

        var ticks = options.GetProperty("scales").GetProperty("y").GetProperty("ticks");
        Assert.Equal("$", ticks.GetProperty("bcjsFormat").GetProperty("prefix").GetString());
        Assert.Equal(0, ticks.GetProperty("precision").GetInt32());

        var labels = options.GetProperty("plugins").GetProperty("datalabels").GetProperty("bcjsFormat");
        Assert.Equal(["minPercentage", "percentage"], PropertyNames(labels));
    }

    [Fact]
    public void Unset_new_options_are_omitted()
    {
        var config = new BarChartConfig
        {
            Options = new Options
            {
                Plugins = new Plugins { Tooltip = new Tooltip() },
                Scales = new Dictionary<string, Axis> { ["y"] = new() { Ticks = new Ticks(), Grid = new Grid() } },
            },
        };
        config.Data.Datasets.Add(new BarDataset());
        var line = new LineChartConfig();
        line.Data.Datasets.Add(new LineDataset());

        var options = Root(config).GetProperty("options");
        Assert.False(options.TryGetProperty("layout", out _));
        Assert.False(options.TryGetProperty("locale", out _));
        Assert.False(options.GetProperty("plugins").GetProperty("tooltip").TryGetProperty("bcjsFormat", out _));
        var y = options.GetProperty("scales").GetProperty("y");
        foreach (var name in new[] { "border", "grace", "reverse" })
            Assert.False(y.TryGetProperty(name, out _), name);
        foreach (var name in new[] { "bcjsFormat", "precision", "padding", "display" })
            Assert.False(y.GetProperty("ticks").TryGetProperty(name, out _), name);
        Assert.False(y.GetProperty("grid").TryGetProperty("lineWidth", out _));

        var bar = Root(config).GetProperty("data").GetProperty("datasets")[0];
        foreach (var name in new[] { "hoverBorderColor", "borderRadius", "maxBarThickness", "barPercentage", "categoryPercentage" })
            Assert.False(bar.TryGetProperty(name, out _), name);

        var lineDataset = Root(line).GetProperty("data").GetProperty("datasets")[0];
        foreach (var name in new[] { "pointHoverRadius", "pointHitRadius", "pointBackgroundColor", "pointBorderColor", "borderDash", "spanGaps" })
            Assert.False(lineDataset.TryGetProperty(name, out _), name);
    }

    [Fact]
    public void Set_axis_dataset_and_layout_options_use_chartjs_names()
    {
        var config = new BarChartConfig
        {
            Options = new Options
            {
                Locale = "en-GB",
                Layout = new Layout { Padding = new Padding(8) },
                Scales = new Dictionary<string, Axis>
                {
                    ["x"] = new()
                    {
                        Border = new AxisBorder { Display = false, Color = "#ccc", Width = 2, Dash = [4, 4] },
                        Grace = "5%",
                        Reverse = true,
                        Grid = new Grid { LineWidth = 1 },
                        Ticks = new Ticks { Padding = 6, Display = false },
                    },
                },
            },
        };
        config.Data.Datasets.Add(new BarDataset
        {
            HoverBorderColor = ["#000"],
            BorderRadius = 4,
            MaxBarThickness = 40,
            BarPercentage = 0.8M,
            CategoryPercentage = 0.9M,
        });
        var line = new LineChartConfig();
        line.Data.Datasets.Add(new LineDataset
        {
            PointHoverRadius = 5,
            PointHitRadius = 8,
            PointBackgroundColor = "#fff",
            PointBorderColor = "#f90",
            BorderDash = [6, 4],
            SpanGaps = true,
        });

        var root = Root(config);
        var options = root.GetProperty("options");
        Assert.Equal("en-GB", options.GetProperty("locale").GetString());
        Assert.True(options.GetProperty("layout").TryGetProperty("padding", out _));
        var x = options.GetProperty("scales").GetProperty("x");
        Assert.Equal(["color", "dash", "display", "width"], PropertyNames(x.GetProperty("border")));
        Assert.Equal("5%", x.GetProperty("grace").GetString());
        Assert.True(x.GetProperty("reverse").GetBoolean());
        Assert.Equal(1, x.GetProperty("grid").GetProperty("lineWidth").GetInt32());
        Assert.Equal(6, x.GetProperty("ticks").GetProperty("padding").GetInt32());
        Assert.False(x.GetProperty("ticks").GetProperty("display").GetBoolean());

        var bar = root.GetProperty("data").GetProperty("datasets")[0];
        Assert.Equal(4, bar.GetProperty("borderRadius").GetInt32());
        Assert.Equal(40, bar.GetProperty("maxBarThickness").GetInt32());
        Assert.Equal(0.8M, bar.GetProperty("barPercentage").GetDecimal());
        Assert.Equal(0.9M, bar.GetProperty("categoryPercentage").GetDecimal());
        Assert.Equal("#000", bar.GetProperty("hoverBorderColor")[0].GetString());

        var lineDataset = Root(line).GetProperty("data").GetProperty("datasets")[0];
        Assert.Equal(5, lineDataset.GetProperty("pointHoverRadius").GetInt32());
        Assert.Equal(8, lineDataset.GetProperty("pointHitRadius").GetInt32());
        Assert.Equal("#fff", lineDataset.GetProperty("pointBackgroundColor").GetString());
        Assert.Equal("#f90", lineDataset.GetProperty("pointBorderColor").GetString());
        Assert.Equal(4, lineDataset.GetProperty("borderDash")[1].GetInt32());
        Assert.True(lineDataset.GetProperty("spanGaps").GetBoolean());
    }
}
