namespace BCJS.Configuration;

/// <summary>Controls how object data is parsed against each axis.</summary>
public class Parsing
{
    /// <summary>The object key used for X values.</summary>
    [JsonPropertyName("xAxisKey")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? XAxisKey { get; set; }

    /// <summary>The object key used for Y values.</summary>
    [JsonPropertyName("yAxisKey")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? YAxisKey { get; set; }
}
