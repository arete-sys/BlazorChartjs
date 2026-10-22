namespace BCJS.Configuration;

/// <summary>Tooltip plugin configuration. Unset options are omitted so Chart.js keeps its defaults.</summary>
public sealed class Tooltip
{
    /// <summary>
    /// Renders the tooltip as HTML over the chart (the Chart.js "external" tooltip), so a regular label
    /// and a bold value share one line and CSS can theme it. Works on Blazor Server and WebAssembly.
    /// </summary>
    [JsonPropertyName("bcjsHtml")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public HtmlTooltip? Html { get; set; }

    /// <summary>Tooltip callbacks (title/label formatting).</summary>
    [JsonPropertyName("callbacks")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Callbacks? Callbacks { get; set; }

    /// <summary>Whether the canvas tooltip is shown.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }

    /// <summary>Which elements appear in the tooltip (see <see cref="InteractionMode"/>).</summary>
    [JsonPropertyName("mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public InteractionMode? Mode { get; set; }

    /// <summary>Whether the pointer must intersect an element to show the tooltip.</summary>
    [JsonPropertyName("intersect")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Intersect { get; set; }

    /// <summary>The tooltip positioner (see <see cref="TooltipPosition"/>).</summary>
    [JsonPropertyName("position")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TooltipPosition? Position { get; set; }

    /// <summary>Tooltip box background color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; }

    /// <summary>Title text color.</summary>
    [JsonPropertyName("titleColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TitleColor { get; set; }

    /// <summary>Title font.</summary>
    [JsonPropertyName("titleFont")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? TitleFont { get; set; }

    /// <summary>Horizontal alignment of the title lines (see <see cref="TextAlign"/>).</summary>
    [JsonPropertyName("titleAlign")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TextAlign? TitleAlign { get; set; }

    /// <summary>Margin below the title, in pixels.</summary>
    [JsonPropertyName("titleMarginBottom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? TitleMarginBottom { get; set; }

    /// <summary>Body text color.</summary>
    [JsonPropertyName("bodyColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BodyColor { get; set; }

    /// <summary>Body font.</summary>
    [JsonPropertyName("bodyFont")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? BodyFont { get; set; }

    /// <summary>Horizontal alignment of the body lines (see <see cref="TextAlign"/>).</summary>
    [JsonPropertyName("bodyAlign")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TextAlign? BodyAlign { get; set; }

    /// <summary>Footer text color.</summary>
    [JsonPropertyName("footerColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FooterColor { get; set; }

    /// <summary>Footer font.</summary>
    [JsonPropertyName("footerFont")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? FooterFont { get; set; }

    /// <summary>Padding inside the tooltip box.</summary>
    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Padding? Padding { get; set; }

    /// <summary>Distance from the caret tip to the tooltip point, in pixels.</summary>
    [JsonPropertyName("caretPadding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? CaretPadding { get; set; }

    /// <summary>Size of the caret arrow, in pixels (<c>0</c> hides it).</summary>
    [JsonPropertyName("caretSize")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? CaretSize { get; set; }

    /// <summary>Corner radius of the tooltip box, in pixels.</summary>
    [JsonPropertyName("cornerRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? CornerRadius { get; set; }

    /// <summary>Whether the color square is drawn beside each body line.</summary>
    [JsonPropertyName("displayColors")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DisplayColors { get; set; }

    /// <summary>Width of the color box when <see cref="DisplayColors"/> is on.</summary>
    [JsonPropertyName("boxWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BoxWidth { get; set; }

    /// <summary>Height of the color box when <see cref="DisplayColors"/> is on.</summary>
    [JsonPropertyName("boxHeight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BoxHeight { get; set; }

    /// <summary>Gap between the color box and the body text, in pixels.</summary>
    [JsonPropertyName("boxPadding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BoxPadding { get; set; }

    /// <summary>Whether the color box uses the element's point style instead of a square.</summary>
    [JsonPropertyName("usePointStyle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? UsePointStyle { get; set; }

    /// <summary>Tooltip box border color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; }

    /// <summary>Tooltip box border width, in pixels.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }
}
