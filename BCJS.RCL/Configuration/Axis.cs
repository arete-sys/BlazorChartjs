namespace BCJS.Configuration;

/// <summary>A Chart.js scale (axis) configuration.</summary>
public sealed class Axis
{
    /// <summary>Whether the axis begins at zero.</summary>
    [JsonPropertyName("beginAtZero")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? BeginAtZero { get; set; }

    /// <summary>Axis text/label color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Whether the axis is displayed.</summary>
    [JsonPropertyName("display")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Display { get; set; }

    /// <summary>Grid line configuration.</summary>
    [JsonPropertyName("grid")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Grid? Grid { get; set; }

    /// <summary>The maximum value.</summary>
    [JsonPropertyName("max")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Max { get; set; }

    /// <summary>The minimum value.</summary>
    [JsonPropertyName("min")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Min { get; set; }

    /// <summary>The axis position (see <see cref="Position"/>).</summary>
    [JsonPropertyName("position")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Position? Position { get; set; }

    /// <summary>Whether series on this axis are stacked.</summary>
    [JsonPropertyName("stacked")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Stacked { get; set; }

    /// <summary>A suggested maximum (does not clip data).</summary>
    [JsonPropertyName("suggestedMax")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? SuggestedMax { get; set; }

    /// <summary>A suggested minimum (does not clip data).</summary>
    [JsonPropertyName("suggestedMin")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? SuggestedMin { get; set; }

    /// <summary>Free-form text (preserved from the original for parity).</summary>
    [JsonPropertyName("Text")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Text { get; set; }

    /// <summary>Tick configuration.</summary>
    [JsonPropertyName("ticks")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Ticks? Ticks { get; set; }

    /// <summary>The axis line (Chart.js 4; replaces <see cref="Grid.DrawBorder"/>).</summary>
    [JsonPropertyName("border")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public AxisBorder? Border { get; set; }

    /// <summary>Extra space above the data on a numeric axis, as pixels (<c>"10"</c>) or a share of the range (<c>"5%"</c>).</summary>
    [JsonPropertyName("grace")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Grace { get; set; }

    /// <summary>Whether the axis runs in reverse.</summary>
    [JsonPropertyName("reverse")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Reverse { get; set; }

    /// <summary>Axis title configuration.</summary>
    [JsonPropertyName("title")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public AxesTitle? Title { get; set; }

    /// <summary>The scale type (e.g. <c>"linear"</c>, <c>"category"</c>, <c>"time"</c>, <c>"logarithmic"</c>).</summary>
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Type { get; set; }

    /// <summary>Time scale configuration (when <see cref="Type"/> is <c>"time"</c>).</summary>
    [JsonPropertyName("time")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public AxesTime? Time { get; set; }
}

/// <summary>Well-known Chart.js scale identifiers.</summary>
public static class Scales
{
    /// <summary>The default X axis id (<c>"x"</c>).</summary>
    public static string XAxisId => "x";

    /// <summary>The default Y axis id (<c>"y"</c>).</summary>
    public static string YAxisId => "y";

    /// <summary>A secondary Y axis id (<c>"y2"</c>).</summary>
    public static string Y2AxisId => "y2";
}
