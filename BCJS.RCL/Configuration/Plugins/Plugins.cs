namespace BCJS.Configuration;

/// <summary>The Chart.js <c>plugins</c> object.</summary>
public class Plugins
{
    /// <summary>Data labels plugin configuration.</summary>
    [JsonPropertyName("datalabels")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DataLabels? DataLabels { get; set; }

    /// <summary>Legend configuration.</summary>
    [JsonPropertyName("legend")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Legend? Legend { get; set; } = new();

    /// <summary>Tooltip configuration.</summary>
    [JsonPropertyName("tooltip")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Tooltip? Tooltip { get; set; }

    /// <summary>Crosshair plugin configuration (BCJS custom plugin).</summary>
    [JsonPropertyName("crosshair")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Crosshair? Crosshair { get; set; }

    /// <summary>Chart title configuration.</summary>
    [JsonPropertyName("title")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Title? Title { get; set; }

    /// <summary>Zoom/pan plugin configuration.</summary>
    [JsonPropertyName("zoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Zoom? Zoom { get; set; }
}
