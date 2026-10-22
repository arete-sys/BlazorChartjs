namespace BCJS.Configuration;

/// <summary>
/// Settings for the HTML tooltip (<see cref="Tooltip.Html"/>). Its default styles yield to any page CSS and
/// read <c>--bcjs-tooltip-*</c> variables; tooltip options set in C# become inline styles and win over CSS.
/// </summary>
public sealed class HtmlTooltip
{
    /// <summary>Extra CSS class(es) on the tooltip element, e.g. for a dark theme.</summary>
    [JsonPropertyName("cssClass")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CssClass { get; set; }

    /// <summary>
    /// Whether the category row (e.g. <c>"Jan"</c>) is shown above the rows. When unset: shown on axis
    /// charts, hidden on pie, doughnut and polar area charts (their rows are already named by category).
    /// </summary>
    [JsonPropertyName("showTitle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowTitle { get; set; }

    /// <summary>Text appended to each row's label (default <c>":"</c>).</summary>
    [JsonPropertyName("separator")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Separator { get; set; }

    /// <summary>Font of the row labels (overrides <see cref="Tooltip.BodyFont"/>).</summary>
    [JsonPropertyName("labelFont")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? LabelFont { get; set; }

    /// <summary>Font of the row values (overrides <see cref="Tooltip.BodyFont"/>; bold by default).</summary>
    [JsonPropertyName("valueFont")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? ValueFont { get; set; }

    /// <summary>
    /// JavaScript function source that returns the tooltip content: an HTML string (not escaped; use the
    /// <c>escape</c> argument), a DOM node, or <c>null</c> for no tooltip. Compiled with <c>eval</c> only when set,
    /// so a CSP must allow <c>'unsafe-eval'</c>. Pass constant developer code only; never build it from data
    /// or user/AI input.
    /// </summary>
    [JsonPropertyName("function")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Function { get; set; }
}
