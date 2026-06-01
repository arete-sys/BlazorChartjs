namespace BCJS.Configuration;

/// <summary>Axis grid line configuration.</summary>
public class Grid
{
    /// <summary>Grid line color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Whether grid lines are displayed.</summary>
    [JsonPropertyName("display")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Display { get; set; }

    /// <summary>Whether the axis border is drawn.</summary>
    [JsonPropertyName("drawBorder")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DrawBorder { get; set; }

    /// <summary>Whether grid lines are drawn inside the chart area.</summary>
    [JsonPropertyName("drawOnChartArea")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DrawOnChartArea { get; set; }

    /// <summary>Whether tick marks are drawn.</summary>
    [JsonPropertyName("drawTicks")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DrawTicks { get; set; }
}
