namespace BCJS.Configuration;

/// <summary>Chart title plugin configuration.</summary>
public class Title
{
    /// <summary>Title alignment (see <see cref="Enums.Align"/>).</summary>
    [JsonPropertyName("align")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Align? Align { get; set; }

    /// <summary>Title color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Whether the title is displayed.</summary>
    [JsonPropertyName("display")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Display { get; set; }

    /// <summary>Whether the title takes the full width/height of its position.</summary>
    [JsonPropertyName("fullSize")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? FullSize { get; set; }

    /// <summary>Title position (see <see cref="Enums.Position"/>).</summary>
    [JsonPropertyName("position")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Position? Position { get; set; }

    /// <summary>The title text.</summary>
    [JsonPropertyName("text")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Text { get; set; }

    /// <summary>Title padding.</summary>
    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Padding? Padding { get; set; }

    /// <summary>Title font.</summary>
    [JsonPropertyName("font")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? Font { get; set; }
}
