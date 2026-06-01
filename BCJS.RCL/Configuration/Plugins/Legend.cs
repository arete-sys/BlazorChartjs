namespace BCJS.Configuration;

/// <summary>
/// Legend configuration. The legend click delegate is not serialized; the <c>hasLegendClick</c> flag
/// tells the interop module whether to install the handler.
/// </summary>
public class Legend
{
    /// <summary>Legend alignment (see <see cref="Enums.Align"/>).</summary>
    [JsonPropertyName("align")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Align? Align { get; set; }

    /// <summary>Whether the legend is displayed.</summary>
    [JsonPropertyName("display")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Display { get; set; } = true;

    /// <summary>Whether the legend takes the full width/height of its position.</summary>
    [JsonPropertyName("fullSize")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? FullSize { get; set; }

    /// <summary>Legend label configuration.</summary>
    [JsonPropertyName("labels")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LegendLabels? Labels { get; set; }

    /// <summary>Legend position (see <see cref="LegendPosition"/>).</summary>
    [JsonPropertyName("position")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LegendPosition? Position { get; set; }

    /// <summary>Whether the legend item order is reversed.</summary>
    [JsonPropertyName("reverse")]
    public bool Reverse { get; set; }

    /// <summary>Whether the legend is rendered right-to-left.</summary>
    [JsonPropertyName("rtl")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? RTL { get; set; }

    /// <summary>Legend text direction (see <see cref="TextDirection"/>).</summary>
    [JsonPropertyName("textDirection")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TextDirection? TextDirection { get; set; }

    /// <summary>Tells the interop module to install the legend click handler.</summary>
    [JsonInclude]
    [JsonPropertyName("hasLegendClick")]
    public bool HasLegendClick => OnClickAsync is not null;

    /// <summary>Invoked when a legend item is clicked.</summary>
    [JsonIgnore]
    public Func<LegendClickContext, ValueTask>? OnClickAsync { get; set; }
}

/// <summary>
/// Legend label configuration. The filter delegate is not serialized; the <c>hasFilter</c> flag tells
/// the interop module whether to install the filter callback.
/// </summary>
public class LegendLabels
{
    /// <summary>Tells the interop module to install the legend label filter.</summary>
    [JsonInclude]
    [JsonPropertyName("hasFilter")]
    public bool HasFilter => Filter is not null;

    /// <summary>Returns whether a legend item should be shown.</summary>
    [JsonIgnore]
    public Func<LegendFilterContext, bool?>? Filter { get; set; }
}

/// <summary>A single legend item (as supplied to the legend filter callback).</summary>
public class LegendItem
{
    /// <summary>The legend item text.</summary>
    [JsonPropertyName("text")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Text { get; set; }

    /// <summary>Border radius of the legend box.</summary>
    [JsonPropertyName("borderRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? BorderRadius { get; set; }

    /// <summary>The dataset index this item represents.</summary>
    [JsonPropertyName("datasetIndex")]
    public int DatasetIndex { get; set; }

    /// <summary>The box fill color.</summary>
    [JsonPropertyName("fillStyle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FillStyle { get; set; }

    /// <summary>The label font color.</summary>
    [JsonPropertyName("fontColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FontColor { get; set; }

    /// <summary>Whether the dataset is hidden.</summary>
    [JsonPropertyName("hidden")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Hidden { get; set; }

    /// <summary>The box border line cap.</summary>
    [JsonPropertyName("lineCap")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? LineCap { get; set; }

    /// <summary>The box border dash pattern.</summary>
    [JsonPropertyName("lineDash")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<decimal?>? LineDash { get; set; }

    /// <summary>The box border dash offset.</summary>
    [JsonPropertyName("lineDashOffset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? LineDashOffset { get; set; }

    /// <summary>The box border line join.</summary>
    [JsonPropertyName("lineJoin")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? LineJoin { get; set; }

    /// <summary>The box border width.</summary>
    [JsonPropertyName("lineWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? LineWidth { get; set; }

    /// <summary>The box rotation in degrees.</summary>
    [JsonPropertyName("rotation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Rotation { get; set; }
}
