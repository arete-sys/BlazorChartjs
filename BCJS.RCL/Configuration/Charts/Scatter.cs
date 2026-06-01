namespace BCJS.Configuration;

/// <summary>Configuration for a scatter chart.</summary>
public class ScatterChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public ScatterData Data { get; set; } = new();

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
    public string Type { get; set; } = ChartType.Scatter;
}

/// <summary>Scatter chart data.</summary>
public class ScatterData : Data<ScatterDataset>;

/// <summary>A single scatter data point.</summary>
public class ScatterXYValue
{
    /// <summary>The X value.</summary>
    [JsonPropertyName("x")]
    public decimal X { get; set; }

    /// <summary>The Y value.</summary>
    [JsonPropertyName("y")]
    public decimal Y { get; set; }
}

/// <summary>A scatter chart dataset.</summary>
public class ScatterDataset : CustomDataset<ScatterXYValue>
{
    /// <summary>Point fill color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; }

    /// <summary>Point border color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; }

    /// <summary>Point border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }

    /// <summary>Point hit radius.</summary>
    [JsonPropertyName("pointHitRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? PointHitRadius { get; set; }

    /// <summary>Point marker style (see <see cref="Enums.PointStyle"/>).</summary>
    [JsonPropertyName("pointStyle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PointStyle? PointStyle { get; set; }

    /// <summary>Point marker radius.</summary>
    [JsonPropertyName("pointRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? PointRadius { get; set; }

    /// <summary>Whether a connecting line is drawn between points.</summary>
    [JsonPropertyName("showLine")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool ShowLine { get; set; }

    /// <summary>Line curve tension.</summary>
    [JsonPropertyName("tension")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal Tension { get; set; }

    /// <summary>Secondary Y axis id.</summary>
    [JsonPropertyName("y2AxisID")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Y2AxisId { get; set; }

    /// <summary>Y axis id.</summary>
    [JsonPropertyName("yAxisID")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? YAxisId { get; set; }
}
