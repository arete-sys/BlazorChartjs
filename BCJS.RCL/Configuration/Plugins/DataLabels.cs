namespace BCJS.Configuration;

/// <summary>
/// Data labels plugin configuration (chartjs-plugin-datalabels). Can be set globally on
/// <see cref="Plugins.DataLabels"/> or per dataset on <see cref="Dataset.DataLabels"/>.
/// </summary>
public class DataLabels
{
    /// <summary>Label alignment relative to the anchor (see <see cref="DatalabelsAlign"/>).</summary>
    [JsonPropertyName("align")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DatalabelsAlign? Align { get; set; }

    /// <summary>Label anchor point (see <see cref="DatalabelsAnchor"/>).</summary>
    [JsonPropertyName("anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DatalabelsAnchor? Anchor { get; set; }

    /// <summary>Label background color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; }

    /// <summary>Label border color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; }

    /// <summary>Label border radius.</summary>
    [JsonPropertyName("borderRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int BorderRadius { get; set; }

    /// <summary>Label border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int BorderWidth { get; set; }

    /// <summary>Whether labels are clamped to the chart area.</summary>
    [JsonPropertyName("clamp")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Clamp { get; set; }

    /// <summary>Whether labels are clipped to the chart area.</summary>
    [JsonPropertyName("clip")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Clip { get; set; }

    /// <summary>Label text color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Label font.</summary>
    [JsonPropertyName("font")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? Font { get; set; }

    /// <summary>Label offset in pixels.</summary>
    [JsonPropertyName("offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int Offset { get; set; }

    /// <summary>Label opacity (0–1).</summary>
    [JsonPropertyName("opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal Opacity { get; set; }

    /// <summary>Label padding.</summary>
    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Padding? Padding { get; set; }

    /// <summary>Label rotation in degrees.</summary>
    [JsonPropertyName("rotation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int Rotation { get; set; }

    /// <summary>Multi-line text alignment (see <see cref="DatalabelsTextAlign"/>).</summary>
    [JsonPropertyName("textAlign")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DatalabelsTextAlign? TextAlign { get; set; }

    /// <summary>Text stroke color.</summary>
    [JsonPropertyName("textStrokeColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TextStrokeColor { get; set; }

    /// <summary>Text stroke width.</summary>
    [JsonPropertyName("textStrokeWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TextStrokeWidth { get; set; }

    /// <summary>Text shadow blur radius.</summary>
    [JsonPropertyName("textShadowBlur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TextShadowBlur { get; set; }

    /// <summary>Text shadow color.</summary>
    [JsonPropertyName("textShadowColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TextShadowColor { get; set; }
}
