namespace BCJS.Configuration;

/// <summary>Configuration for a bar chart.</summary>
public class BarChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public Data<BarDataset> Data { get; set; } = new();

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
    public string Type { get; set; } = ChartType.Bar;
}

/// <summary>Bar chart data.</summary>
public class BarData : Data<BarDataset>;

/// <summary>A bar chart dataset.</summary>
public class BarDataset : Dataset
{
    /// <summary>Per-bar background colors.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? BackgroundColor { get; set; } = [];

    /// <summary>Per-bar border colors.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? BorderColor { get; set; } = [];

    /// <summary>Bar border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }

    /// <summary>Whether the bar area is filled.</summary>
    [JsonPropertyName("fill")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Fill { get; set; }

    /// <summary>Per-bar hover background colors.</summary>
    [JsonPropertyName("hoverBackgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? HoverBackgroundColor { get; set; }

    /// <summary>Stack group identifier(s).</summary>
    [JsonPropertyName("stack")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? Stack { get; set; }
}
