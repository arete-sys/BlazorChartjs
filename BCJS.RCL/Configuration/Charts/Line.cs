namespace BCJS.Configuration;

/// <summary>Configuration for a line chart.</summary>
public class LineChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public LineData Data { get; set; } = new();

    /// <summary>The chart options.</summary>
    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Options? Options { get; set; }

    /// <inheritdoc/>
    IOptions? IChartConfig.Options => Options;

    /// <summary>The chart type.</summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartType.Line;
}

/// <summary>Line chart data.</summary>
public class LineData : Data<LineDataset>;

/// <summary>An object data point for a line dataset (e.g. <c>{ x, y }</c>).</summary>
public class LineDataType
{
    /// <summary>The X value.</summary>
    [JsonPropertyName("x")]
    public string? X { get; set; }

    /// <summary>The Y value.</summary>
    [JsonPropertyName("y")]
    public string? Y { get; set; }
}

/// <summary>A line chart dataset.</summary>
public class LineDataset : Dataset
{
    /// <summary>Line fill/background color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; }

    /// <summary>Line border (stroke) color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; }

    /// <summary>Line width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }

    /// <summary>Curve interpolation mode (see <see cref="Enums.CubicInterpolationMode"/>).</summary>
    [JsonPropertyName("cubicInterpolationMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CubicInterpolationMode? CubicInterpolationMode { get; set; }

    /// <summary>Whether the area under the line is filled.</summary>
    [JsonPropertyName("fill")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Fill { get; set; }

    /// <summary>Legacy fill color.</summary>
    [JsonPropertyName("fillColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FillColor { get; set; }

    /// <summary>Point marker radius.</summary>
    [JsonPropertyName("pointRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? PointRadius { get; set; }

    /// <summary>Point marker style (see <see cref="Enums.PointStyle"/>).</summary>
    [JsonPropertyName("pointStyle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PointStyle? PointStyle { get; set; }

    /// <summary>Stepped line mode (see <see cref="Enums.StepMode"/>).</summary>
    [JsonPropertyName("stepped")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StepMode? StepMode { get; set; }

    /// <summary>Legacy stroke color.</summary>
    [JsonPropertyName("strokeColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? StrokeColor { get; set; }

    /// <summary>Line curve tension (0 = straight).</summary>
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
