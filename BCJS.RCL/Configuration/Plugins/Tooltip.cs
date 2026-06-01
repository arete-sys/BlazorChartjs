namespace BCJS.Configuration;

/// <summary>Tooltip plugin configuration.</summary>
public sealed class Tooltip
{
    /// <summary>Tooltip callbacks (title/label formatting).</summary>
    [JsonPropertyName("callbacks")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Callbacks? Callbacks { get; set; }
}
