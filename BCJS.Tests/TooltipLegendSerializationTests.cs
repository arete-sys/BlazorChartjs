using System.Text.Json;
using BCJS.Configuration;
using BCJS.Enums;
using BCJS.Serialization;

namespace BCJS.Tests;

/// <summary>
/// Tooltip, legend-label and data-label format options: unset options must be absent from the JSON
/// (so Chart.js keeps its defaults) and set ones must use Chart.js's own option names and tokens.
/// </summary>
public class TooltipLegendSerializationTests
{
    private static readonly string[] TooltipOptionNames =
    [
        "enabled", "mode", "intersect", "position", "backgroundColor", "titleColor", "titleFont",
        "titleAlign", "titleMarginBottom", "bodyColor", "bodyFont", "bodyAlign", "footerColor",
        "footerFont", "padding", "caretPadding", "caretSize", "cornerRadius", "displayColors",
        "boxWidth", "boxHeight", "boxPadding", "usePointStyle", "borderColor", "borderWidth",
    ];

    private static readonly string[] LegendLabelOptionNames =
    [
        "usePointStyle", "pointStyle", "pointStyleWidth", "boxWidth", "boxHeight", "padding", "font", "color",
        "hasFilter", // BCJS control flag, always serialized
    ];

    private static JsonElement Plugins(PieOptions options)
    {
        var cfg = new PieChartConfig { Options = options };
        var json = ChartConfigSerializer.Serialize(cfg);
        return JsonDocument.Parse(json).RootElement.GetProperty("options").GetProperty("plugins");
    }

    private static string[] PropertyNames(JsonElement element) =>
        [.. element.EnumerateObject().Select(p => p.Name)];

    [Fact]
    public void Unset_tooltip_is_omitted()
    {
        var plugins = Plugins(new PieOptions());

        Assert.False(plugins.TryGetProperty("tooltip", out _));
    }

    [Fact]
    public void Empty_tooltip_serializes_as_an_empty_object()
    {
        // A leaked default (e.g. "enabled": false) would silently change every existing chart.
        var tooltip = Plugins(new PieOptions { Plugins = new Plugins { Tooltip = new Tooltip() } }).GetProperty("tooltip");

        Assert.Empty(PropertyNames(tooltip));
    }

    [Fact]
    public void Set_tooltip_options_use_chartjs_names()
    {
        var options = new PieOptions
        {
            Plugins = new Plugins
            {
                Tooltip = new Tooltip
                {
                    Enabled = true,
                    Mode = InteractionMode.Index,
                    Intersect = false,
                    Position = TooltipPosition.Nearest,
                    BackgroundColor = "rgba(160, 98, 20, 0.92)",
                    TitleColor = "#fff",
                    TitleFont = new Font { Weight = "normal", Size = 13 },
                    TitleAlign = TextAlign.Center,
                    TitleMarginBottom = 4,
                    BodyColor = "#fefefe",
                    BodyFont = new Font { Weight = "bold" },
                    BodyAlign = TextAlign.Right,
                    FooterColor = "#eee",
                    FooterFont = new Font { Style = "italic" },
                    Padding = new Padding(10),
                    CaretPadding = 3,
                    CaretSize = 0,
                    CornerRadius = 8,
                    DisplayColors = false,
                    BoxWidth = 10,
                    BoxHeight = 11,
                    BoxPadding = 4,
                    UsePointStyle = true,
                    BorderColor = "#000",
                    BorderWidth = 0,
                },
            },
        };

        var tooltip = Plugins(options).GetProperty("tooltip");

        Assert.Equal(TooltipOptionNames.Order(StringComparer.Ordinal), PropertyNames(tooltip).Order(StringComparer.Ordinal));

        Assert.True(tooltip.GetProperty("enabled").GetBoolean());
        Assert.Equal("index", tooltip.GetProperty("mode").GetString());
        Assert.False(tooltip.GetProperty("intersect").GetBoolean());
        Assert.Equal("nearest", tooltip.GetProperty("position").GetString());
        Assert.Equal("center", tooltip.GetProperty("titleAlign").GetString());
        Assert.Equal("right", tooltip.GetProperty("bodyAlign").GetString());
        Assert.Equal("normal", tooltip.GetProperty("titleFont").GetProperty("weight").GetString());
        Assert.Equal(13, tooltip.GetProperty("titleFont").GetProperty("size").GetInt32());
        Assert.Equal(10, tooltip.GetProperty("padding").GetProperty("top").GetInt32());
        Assert.False(tooltip.GetProperty("displayColors").GetBoolean());
        Assert.Equal(0, tooltip.GetProperty("caretSize").GetInt32());
        Assert.Equal(0, tooltip.GetProperty("borderWidth").GetInt32());
    }

    [Fact]
    public void Tooltip_callbacks_still_serialize_alongside_styling()
    {
        var options = new PieOptions
        {
            Plugins = new Plugins
            {
                Tooltip = new Tooltip { DisplayColors = false, Callbacks = new Callbacks { Label = _ => ["x"] } },
            },
        };

        var tooltip = Plugins(options).GetProperty("tooltip");

        Assert.True(tooltip.GetProperty("callbacks").GetProperty("hasLabel").GetBoolean());
        Assert.False(tooltip.GetProperty("displayColors").GetBoolean());
    }

    [Fact]
    public void Html_tooltip_is_omitted_when_unset_and_serialized_when_set()
    {
        var empty = Plugins(new PieOptions { Plugins = new Plugins { Tooltip = new Tooltip { Html = new HtmlTooltip() } } })
            .GetProperty("tooltip").GetProperty("bcjsHtml");
        Assert.Empty(PropertyNames(empty));

        var html = Plugins(new PieOptions
        {
            Plugins = new Plugins
            {
                Tooltip = new Tooltip
                {
                    Html = new HtmlTooltip
                    {
                        CssClass = "dark",
                        ShowTitle = false,
                        Separator = " -",
                        LabelFont = new Font { Weight = "normal" },
                        ValueFont = new Font { Weight = "bold" },
                        Function = "({ dataPoints }) => dataPoints[0].label",
                    },
                },
            },
        }).GetProperty("tooltip").GetProperty("bcjsHtml");

        Assert.Equal(["cssClass", "function", "labelFont", "separator", "showTitle", "valueFont"], PropertyNames(html).Order(StringComparer.Ordinal));
        Assert.Equal("({ dataPoints }) => dataPoints[0].label", html.GetProperty("function").GetString());
        Assert.Equal("dark", html.GetProperty("cssClass").GetString());
        Assert.False(html.GetProperty("showTitle").GetBoolean());
        Assert.Equal("bold", html.GetProperty("valueFont").GetProperty("weight").GetString());
    }

    [Fact]
    public void Empty_legend_labels_emit_only_the_filter_flag()
    {
        var options = new PieOptions { Plugins = new Plugins { Legend = new Legend { Labels = new LegendLabels() } } };

        var labels = Plugins(options).GetProperty("legend").GetProperty("labels");

        Assert.Equal(["hasFilter"], PropertyNames(labels));
        Assert.False(labels.GetProperty("hasFilter").GetBoolean());
    }

    [Fact]
    public void Set_legend_label_options_use_chartjs_names()
    {
        var options = new PieOptions
        {
            Plugins = new Plugins
            {
                Legend = new Legend
                {
                    Labels = new LegendLabels
                    {
                        UsePointStyle = true,
                        PointStyle = PointStyle.Circle,
                        PointStyleWidth = 14,
                        BoxWidth = 12,
                        BoxHeight = 12,
                        Padding = 16,
                        Font = new Font { Size = 14 },
                        Color = "#333",
                    },
                },
            },
        };

        var labels = Plugins(options).GetProperty("legend").GetProperty("labels");

        Assert.Equal(LegendLabelOptionNames.Order(StringComparer.Ordinal), PropertyNames(labels).Order(StringComparer.Ordinal));
        Assert.True(labels.GetProperty("usePointStyle").GetBoolean());
        Assert.Equal("circle", labels.GetProperty("pointStyle").GetString());
        Assert.Equal(14, labels.GetProperty("pointStyleWidth").GetInt32());
        Assert.Equal(16, labels.GetProperty("padding").GetInt32()); // a number here, unlike Tooltip.Padding
        Assert.Equal(14, labels.GetProperty("font").GetProperty("size").GetInt32());
        Assert.Equal("#333", labels.GetProperty("color").GetString());
    }

    [Fact]
    public void Legend_label_point_style_uses_chartjs_token()
    {
        var options = new PieOptions
        {
            Plugins = new Plugins { Legend = new Legend { Labels = new LegendLabels { PointStyle = PointStyle.RectangleRounded } } },
        };

        var labels = Plugins(options).GetProperty("legend").GetProperty("labels");

        Assert.Equal("rectRounded", labels.GetProperty("pointStyle").GetString());
    }

    [Fact]
    public void Data_label_format_is_omitted_when_unset_and_serialized_when_set()
    {
        var unset = Plugins(new PieOptions { Plugins = new Plugins { DataLabels = new DataLabels() } }).GetProperty("datalabels");
        Assert.False(unset.TryGetProperty("bcjsFormat", out _));

        var set = Plugins(new PieOptions
        {
            Plugins = new Plugins
            {
                DataLabels = new DataLabels { Format = new DataLabelsFormat { Percentage = true, Decimals = 1, Suffix = "%" } },
            },
        }).GetProperty("datalabels").GetProperty("bcjsFormat");

        Assert.Equal(["decimals", "percentage", "suffix"], PropertyNames(set).Order(StringComparer.Ordinal));
        Assert.True(set.GetProperty("percentage").GetBoolean());
        Assert.Equal(1, set.GetProperty("decimals").GetInt32());
        Assert.Equal("%", set.GetProperty("suffix").GetString());
    }
}
