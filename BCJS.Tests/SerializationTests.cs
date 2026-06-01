using System.Text.Json;
using BCJS.Configuration;
using BCJS.Enums;
using BCJS.Serialization;

namespace BCJS.Tests;

public class SerializationTests
{
    private static JsonElement SerializeToElement(IChartConfig config)
    {
        var json = ChartConfigSerializer.Serialize(config);
        return JsonDocument.Parse(json).RootElement;
    }

    [Fact]
    public void Config_emits_type_and_camelcase_properties()
    {
        var cfg = new BarChartConfig { Options = new Options { MaintainAspectRatio = true } };

        var root = SerializeToElement(cfg);

        Assert.Equal("bar", root.GetProperty("type").GetString());
        Assert.True(root.GetProperty("options").GetProperty("maintainAspectRatio").GetBoolean());
        // camelCase, not PascalCase.
        Assert.False(root.GetProperty("options").TryGetProperty("MaintainAspectRatio", out _));
    }

    [Theory]
    [InlineData(PointStyle.Rectangle, "rect")]
    [InlineData(PointStyle.RectangleRot, "rectRot")]
    [InlineData(PointStyle.Circle, "circle")]
    [InlineData(PointStyle.CrossRot, "crossRot")]
    public void PointStyle_enum_serializes_to_chartjs_token(PointStyle style, string expected)
    {
        var cfg = new LineChartConfig();
        cfg.Data.Datasets.Add(new LineDataset { PointStyle = style });

        var root = SerializeToElement(cfg);
        var pointStyle = root.GetProperty("data").GetProperty("datasets")[0].GetProperty("pointStyle").GetString();

        Assert.Equal(expected, pointStyle);
    }

    [Fact]
    public void Enum_acronyms_lowercase_correctly()
    {
        var cfg = new BarChartConfig
        {
            Options = new Options
            {
                Interaction = new Interaction { Axis = AxisInteractions.XY },
                Plugins = new Plugins { Legend = new Legend { Position = LegendPosition.ChartArea, TextDirection = TextDirection.RTL } },
            },
        };

        var options = SerializeToElement(cfg).GetProperty("options");

        Assert.Equal("xy", options.GetProperty("interaction").GetProperty("axis").GetString());
        Assert.Equal("chartArea", options.GetProperty("plugins").GetProperty("legend").GetProperty("position").GetString());
        Assert.Equal("rtl", options.GetProperty("plugins").GetProperty("legend").GetProperty("textDirection").GetString());
    }

    [Fact]
    public void Config_does_not_emit_polymorphic_type_discriminator()
    {
        var cfg = new BarChartConfig();
        cfg.Data.Labels = ["A", "B"];
        cfg.Data.Datasets.Add(new BarDataset { Label = "x", Data = [1, 2] });

        var json = ChartConfigSerializer.Serialize(cfg);

        Assert.DoesNotContain("$type", json, StringComparison.Ordinal);
    }

    [Fact]
    public void Null_and_default_properties_are_omitted()
    {
        var cfg = new LineChartConfig { Options = new Options() };

        var options = SerializeToElement(cfg).GetProperty("options");

        // Nullable, unset -> omitted.
        Assert.False(options.TryGetProperty("scales", out _));
        Assert.False(options.TryGetProperty("animation", out _));
        Assert.False(options.TryGetProperty("indexAxis", out _)); // Axes.Default is null
    }

    [Fact]
    public void HasOnHoverAsync_flag_reflects_delegate_presence()
    {
        var with = new LineChartConfig { Options = new Options { OnHoverAsync = _ => ValueTask.CompletedTask } };
        var without = new LineChartConfig { Options = new Options() };

        Assert.True(SerializeToElement(with).GetProperty("options").GetProperty("hasOnHoverAsync").GetBoolean());
        Assert.False(SerializeToElement(without).GetProperty("options").GetProperty("hasOnHoverAsync").GetBoolean());
        // The delegate itself must never be serialized (only the has* flag is).
        Assert.DoesNotContain("\"onHoverAsync\"", ChartConfigSerializer.Serialize(with), StringComparison.Ordinal);
    }

    [Fact]
    public void Tick_callback_flag_is_emitted_when_callback_set()
    {
        var cfg = new BarChartConfig
        {
            Options = new Options
            {
                Scales = new Dictionary<string, Axis>
                {
                    ["y"] = new Axis { Ticks = new Ticks { Callback = _ => ["10"] } },
                },
            },
        };

        var ticks = SerializeToElement(cfg).GetProperty("options").GetProperty("scales").GetProperty("y").GetProperty("ticks");

        Assert.True(ticks.GetProperty("hasCallback").GetBoolean());
    }

    [Fact]
    public void SerializeFragment_serializes_a_dataset_for_AddDataset()
    {
        var json = ChartConfigSerializer.SerializeFragment(new BarDataset { Label = "x", Data = [1, 2] });
        Assert.Contains("\"label\":\"x\"", json, StringComparison.Ordinal);
        Assert.Contains("\"data\":[1,2]", json, StringComparison.Ordinal);
    }
}
