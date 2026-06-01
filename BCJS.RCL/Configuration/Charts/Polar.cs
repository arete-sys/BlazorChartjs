namespace BCJS.Configuration;

/// <summary>Configuration for a polar area chart.</summary>
public class PolarChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart type.</summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartType.PolarArea;

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public PolarData Data { get; set; } = new();

    /// <summary>The chart options.</summary>
    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Options? Options { get; set; }

    /// <inheritdoc/>
    IOptions? IChartConfig.Options => Options;

    /// <summary>Name of a JS function invoked on animation complete.</summary>
    [JsonPropertyName("onAnimationComplete")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OnAnimationComplete { get; set; }
}

/// <summary>Polar area chart data.</summary>
public class PolarData : Data<PolarDataset>;

/// <summary>A polar area chart dataset.</summary>
public class PolarDataset : Dataset
{
    /// <summary>Per-sector background colors.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? BackgroundColor { get; set; } = [];

    /// <summary>Sector border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }
}
