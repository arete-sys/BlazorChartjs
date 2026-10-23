namespace BCJS.Configuration;

/// <summary>
/// Settings for the HTML legend (<see cref="Legend.Html"/>). It lays itself out from
/// <see cref="Legend.Position"/>, <see cref="Legend.Align"/> and <see cref="Legend.Reverse"/>, and takes its
/// marker, font, color and spacing from <see cref="Legend.Labels"/>. Its default styles yield to any page CSS
/// and read <c>--bcjs-legend-*</c> variables; label options set in C# become inline styles and win over CSS.
/// </summary>
public sealed class HtmlLegend
{
    /// <summary>Extra CSS class(es) on the legend list, e.g. for a dark theme.</summary>
    [JsonPropertyName("cssClass")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CssClass { get; set; }
}
