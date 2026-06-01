namespace BCJS.Configuration;

/// <summary>Configuration for a doughnut chart.</summary>
public class DoughnutChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public DoughnutData Data { get; set; } = new();

    /// <summary>Name of a JS function invoked on animation complete.</summary>
    [JsonPropertyName("onAnimationComplete")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OnAnimationComplete { get; set; }

    /// <summary>The chart options.</summary>
    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Options? Options { get; set; }

    /// <inheritdoc/>
    IOptions? IChartConfig.Options => Options;

    /// <summary>The chart type.</summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartType.Doughnut;
}

/// <summary>Doughnut chart data.</summary>
public class DoughnutData : Data<DoughnutDataset>;

/// <summary>A doughnut chart dataset.</summary>
public class DoughnutDataset : Dataset
{
    /// <summary>Per-slice background colors.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? BackgroundColor { get; set; } = [];

    /// <summary>Slice border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }

    /// <summary>Hover offset in pixels.</summary>
    [JsonPropertyName("hoverOffset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? HoverOffset { get; set; }
}
