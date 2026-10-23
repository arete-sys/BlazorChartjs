namespace BCJS.Configuration;

/// <summary>Chart layout options.</summary>
public class Layout
{
    /// <summary>Padding around the chart area, e.g. to keep outer data labels from being clipped.</summary>
    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Padding? Padding { get; set; }
}
