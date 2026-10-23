using System.Text.Json;
using BCJS.Configuration;
using BCJS.Serialization;

namespace BCJS.Tests;

/// <summary>Pie and doughnut slice colors: unset ones stay out of the JSON so Chart.js keeps its hover defaults.</summary>
public class ArcColorSerializationTests
{
    private static JsonElement Dataset(IChartConfig config) =>
        JsonDocument.Parse(ChartConfigSerializer.Serialize(config)).RootElement
            .GetProperty("data").GetProperty("datasets")[0];

    [Fact]
    public void Unset_arc_colors_are_omitted()
    {
        var pie = new PieChartConfig();
        pie.Data.Datasets.Add(new PieDataset());
        var doughnut = new DoughnutChartConfig();
        doughnut.Data.Datasets.Add(new DoughnutDataset());

        foreach (var dataset in new[] { Dataset(pie), Dataset(doughnut) })
        {
            Assert.False(dataset.TryGetProperty("borderColor", out _));
            Assert.False(dataset.TryGetProperty("hoverBackgroundColor", out _));
            Assert.False(dataset.TryGetProperty("hoverBorderColor", out _));
        }
    }

    [Fact]
    public void Set_arc_colors_use_chartjs_names()
    {
        var pie = new PieChartConfig();
        pie.Data.Datasets.Add(new PieDataset
        {
            BorderColor = ["#fff"],
            HoverBackgroundColor = ["#f00", "#0f0"],
            HoverBorderColor = ["#000"],
        });
        var doughnut = new DoughnutChartConfig();
        doughnut.Data.Datasets.Add(new DoughnutDataset { HoverBackgroundColor = ["#f00"] });

        var p = Dataset(pie);
        Assert.Equal("#fff", p.GetProperty("borderColor")[0].GetString());
        Assert.Equal("#0f0", p.GetProperty("hoverBackgroundColor")[1].GetString());
        Assert.Equal("#000", p.GetProperty("hoverBorderColor")[0].GetString());
        Assert.Equal("#f00", Dataset(doughnut).GetProperty("hoverBackgroundColor")[0].GetString());
    }
}
