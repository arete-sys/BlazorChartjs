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

    /// <summary>
    /// BCJS label text format (e.g. a percentage), applied in the browser so it works on Blazor Server
    /// and WebAssembly. When unset the plugin's default formatter is used.
    /// </summary>
    [JsonPropertyName("bcjsFormat")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DataLabelsFormat? Format { get; set; }

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

/// <summary>
/// Declarative number format applied in the browser, so it works on Blazor Server and WebAssembly: used by
/// <see cref="Ticks.Format"/>, <see cref="Tooltip.Format"/> and (as <see cref="DataLabelsFormat"/>)
/// <see cref="DataLabels.Format"/>. Applies to numeric values; other values are shown unchanged.
/// </summary>
public class ValueFormat
{
    /// <summary>
    /// When <see langword="true"/>, the value is shown as a percentage of its dataset's total (counting only
    /// visible items) instead of the raw value. Ignored on axis ticks.
    /// </summary>
    [JsonPropertyName("percentage")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Percentage { get; set; }

    /// <summary>Digits after the decimal point. When unset the number is shown as-is.</summary>
    [JsonPropertyName("decimals")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Decimals { get; set; }

    /// <summary>Text placed before the number (e.g. <c>"$"</c>).</summary>
    [JsonPropertyName("prefix")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Prefix { get; set; }

    /// <summary>Text placed after the number (e.g. <c>"%"</c>).</summary>
    [JsonPropertyName("suffix")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Suffix { get; set; }

    /// <summary>
    /// When <see langword="true"/>, large numbers are shortened in the chart's locale (<c>12,500</c> → <c>12.5K</c>).
    /// <see cref="Decimals"/> is then the most digits after the point (default 1).
    /// </summary>
    [JsonPropertyName("compact")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Compact { get; set; }

    /// <summary>
    /// When <see langword="true"/>, thousands are separated in the chart's locale (<c>12,500</c>). Unset: no
    /// separators, as before this option existed.
    /// </summary>
    [JsonPropertyName("useGrouping")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? UseGrouping { get; set; }
}

/// <summary>
/// Data-label text format (see <see cref="DataLabels.Format"/>): a <see cref="ValueFormat"/> that can also hide
/// the labels of small items.
/// </summary>
public sealed class DataLabelsFormat : ValueFormat
{
    /// <summary>
    /// Hides the label of any item whose share of the visible total is below this percentage, e.g.
    /// <c>2.78</c> for slices under 10° (ApexCharts' <c>minAngleToShowLabel</c>). Applies with or without
    /// <see cref="ValueFormat.Percentage"/>.
    /// </summary>
    [JsonPropertyName("minPercentage")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? MinPercentage { get; set; }
}
