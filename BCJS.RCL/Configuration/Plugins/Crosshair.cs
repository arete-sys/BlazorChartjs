namespace BCJS.Configuration;

/// <summary>
/// Crosshair configuration (a BCJS-custom plugin drawn on pointer move). Removed from the serialized
/// config and handled by the interop module.
/// </summary>
public sealed class Crosshair
{
    /// <summary>The CSS cursor shown over the chart area.</summary>
    [JsonPropertyName("cursor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Cursor { get; set; }

    /// <summary>Horizontal crosshair line.</summary>
    [JsonPropertyName("horizontal")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CrosshairLine? Horizontal { get; set; }

    /// <summary>Vertical crosshair line.</summary>
    [JsonPropertyName("vertical")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CrosshairLine? Vertical { get; set; }
}

/// <summary>A single crosshair line's appearance.</summary>
public sealed class CrosshairLine
{
    /// <summary>Line color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Dash pattern.</summary>
    [JsonPropertyName("dash")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int[]? Dash { get; set; }

    /// <summary>Line width in pixels.</summary>
    [JsonPropertyName("width")]
    public int Width { get; set; } = 1;
}
