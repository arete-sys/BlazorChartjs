namespace BCJS.Configuration;

/// <summary>Default element styling for the chart.</summary>
public sealed class Elements
{
    /// <summary>Default line element styling.</summary>
    [JsonPropertyName("line")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Line? Line { get; set; }
}

/// <summary>Default line element styling.</summary>
public sealed class Line
{
    /// <summary>Line border color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; }

    /// <summary>Line border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? BorderWidth { get; set; }
}
