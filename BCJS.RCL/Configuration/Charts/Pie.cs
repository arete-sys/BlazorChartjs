namespace BCJS.Configuration;

/// <summary>Configuration for a pie chart.</summary>
public class PieChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public PieData Data { get; set; } = new();

    /// <summary>Name of a JS function invoked on animation complete.</summary>
    [JsonPropertyName("onAnimationComplete")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OnAnimationComplete { get; set; }

    /// <summary>The chart options.</summary>
    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PieOptions? Options { get; set; }

    /// <inheritdoc/>
    IOptions? IChartConfig.Options => Options;

    /// <summary>The chart type.</summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartType.Pie;
}

/// <summary>Pie chart data.</summary>
public class PieData : Data<PieDataset>;

/// <summary>A pie chart dataset.</summary>
public class PieDataset : Dataset
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

    /// <summary>Per-slice border colors.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? BorderColor { get; set; }

    /// <summary>Per-slice background colors while hovered. Unset: Chart.js darkens <see cref="BackgroundColor"/>.</summary>
    [JsonPropertyName("hoverBackgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? HoverBackgroundColor { get; set; }

    /// <summary>Per-slice border colors while hovered. Unset: Chart.js darkens <see cref="BorderColor"/>.</summary>
    [JsonPropertyName("hoverBorderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? HoverBorderColor { get; set; }
}

/// <summary>Pie chart options (adds circumference and rotation).</summary>
public class PieOptions : Options
{
    /// <summary>The sweep angle of the pie in degrees.</summary>
    [JsonPropertyName("circumference")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Circumference { get; set; }

    /// <summary>The starting angle of the pie in degrees.</summary>
    [JsonPropertyName("rotation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Rotation { get; set; }
}
