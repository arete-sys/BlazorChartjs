namespace BCJS.Configuration;

/// <summary>Configuration for a bubble chart.</summary>
public class BubbleChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public BubbleData Data { get; set; } = new();

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
    public string Type { get; set; } = ChartType.Bubble;
}

/// <summary>Bubble chart data.</summary>
public class BubbleData : Data<BubbleDataset>;

/// <summary>A single bubble data point.</summary>
public class BubbleCoords
{
    /// <summary>The X coordinate.</summary>
    [JsonPropertyName("x")]
    public int X { get; set; }

    /// <summary>The Y coordinate.</summary>
    [JsonPropertyName("y")]
    public int Y { get; set; }

    /// <summary>The bubble radius.</summary>
    [JsonPropertyName("r")]
    public int R { get; set; }
}

/// <summary>A bubble chart dataset.</summary>
public class BubbleDataset : CustomDataset<BubbleCoords>
{
    /// <summary>Bubble fill color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; }
}
