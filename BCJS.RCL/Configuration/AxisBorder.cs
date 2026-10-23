namespace BCJS.Configuration;

/// <summary>The axis line drawn along the edge of the chart area (Chart.js 4 <c>scale.border</c>).</summary>
public class AxisBorder
{
    /// <summary>Whether the axis line is drawn.</summary>
    [JsonPropertyName("display")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Display { get; set; }

    /// <summary>Axis line color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Axis line width in pixels.</summary>
    [JsonPropertyName("width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Width { get; set; }

    /// <summary>Dash pattern of the axis line and its grid lines, e.g. <c>[4, 4]</c>.</summary>
    [JsonPropertyName("dash")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<int>? Dash { get; set; }
}
