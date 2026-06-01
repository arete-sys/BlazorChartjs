namespace BCJS.Configuration;

/// <summary>The built-in Chart.js colors plugin configuration.</summary>
public class Colors
{
    /// <summary>Whether the colors plugin is enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }

    /// <summary>Whether to override colors already set on datasets.</summary>
    [JsonPropertyName("forceOverride")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ForceOverride { get; set; }
}

/// <summary>The chartjs-plugin-autocolors configuration.</summary>
public class Autocolors
{
    /// <summary>Whether automatic colors are enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }
}
