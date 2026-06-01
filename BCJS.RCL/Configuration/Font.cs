namespace BCJS.Configuration;

/// <summary>Chart.js font configuration.</summary>
public class Font
{
    /// <summary>Font family.</summary>
    [JsonPropertyName("family")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Family { get; set; }

    /// <summary>Line height.</summary>
    [JsonPropertyName("lineHeight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? LineHeight { get; set; }

    /// <summary>Font size in pixels.</summary>
    [JsonPropertyName("size")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Size { get; set; }

    /// <summary>Font style (e.g. <c>"normal"</c>, <c>"italic"</c>).</summary>
    [JsonPropertyName("style")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Style { get; set; }

    /// <summary>Font weight (e.g. <c>"normal"</c>, <c>"bold"</c>, <c>"500"</c>).</summary>
    [JsonPropertyName("weight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Weight { get; set; }
}
