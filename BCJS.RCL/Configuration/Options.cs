using Microsoft.AspNetCore.Components.Web;

namespace BCJS.Configuration;

/// <summary>
/// The Chart.js <c>options</c> object plus a few BCJS control flags that the interop module reads to
/// wire up .NET callbacks. Delegate hooks (<see cref="OnClickAsync"/>, …) are not serialized; instead
/// a computed <c>has*</c> flag tells the JS side whether to install the corresponding handler.
/// </summary>
public class Options : IOptions
{
    private bool? _groupXAxis;
    private bool? _groupYAxis;

    /// <summary>Invoked when a data element is clicked.</summary>
    [JsonIgnore]
    public Func<CallbackGenericContext, ValueTask>? OnClickAsync { get; set; }

    /// <summary>Invoked when the chart is hovered.</summary>
    [JsonIgnore]
    public Func<HoverContext, ValueTask>? OnHoverAsync { get; set; }

    /// <summary>Invoked when the pointer leaves the chart container.</summary>
    [JsonIgnore]
    public Func<MouseEventArgs, ValueTask>? OnMouseOutAsync { get; set; }

    /// <summary>Enables or disables all animations.</summary>
    [JsonPropertyName("animation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Animation { get; set; }

    /// <summary>Per-property animation configuration.</summary>
    [JsonPropertyName("animations")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Animations? Animations { get; set; }

    /// <summary>Default element styling.</summary>
    [JsonPropertyName("elements")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Elements? Elements { get; set; }

    /// <summary>
    /// When set, the X axis is split into a primary axis plus a secondary grouping axis
    /// (<c>xAxis2</c>); labels use a semicolon (<c>;</c>) to separate value from group.
    /// </summary>
    [JsonPropertyName("groupXAxis")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? GroupXAxis
    {
        get => _groupXAxis;
        set
        {
            _groupXAxis = value;
            Scales ??= new Dictionary<string, Axis>();
            if (!Scales.ContainsKey("x"))
                Scales.Add("x", new Axis { Ticks = new Ticks() });
            if (!Scales.ContainsKey("xAxis2"))
                Scales.Add("xAxis2", new Axis { Type = "category", Grid = new Grid { DrawOnChartArea = false }, Ticks = new Ticks() });
        }
    }

    /// <summary>
    /// When set, the Y axis is split into a primary axis plus a secondary grouping axis
    /// (<c>yAxis2</c>); labels use a semicolon (<c>;</c>) to separate value from group.
    /// </summary>
    [JsonPropertyName("groupYAxis")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? GroupYAxis
    {
        get => _groupYAxis;
        set
        {
            _groupYAxis = value;
            Scales ??= new Dictionary<string, Axis>();
            if (!Scales.ContainsKey("y"))
                Scales.Add("y", new Axis { Ticks = new Ticks() });
            if (!Scales.ContainsKey("yAxis2"))
                Scales.Add("yAxis2", new Axis { Type = "category", Grid = new Grid { DrawOnChartArea = false }, Ticks = new Ticks() });
        }
    }

    /// <summary>Tells the interop module whether an <see cref="OnHoverAsync"/> handler should be installed.</summary>
    [JsonInclude]
    [JsonPropertyName("hasOnHoverAsync")]
    public bool HasOnHoverAsync => OnHoverAsync is not null;

    /// <summary>Optional container height (applied to the host element, not serialized to Chart.js).</summary>
    [JsonIgnore]
    public string? Height { get; set; }

    /// <summary>The index axis (<see cref="Axes"/>); omitted when <see langword="null"/>.</summary>
    [JsonPropertyName("indexAxis")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? IndexAxis { get; set; } = Axes.Default;

    /// <summary>Interaction configuration.</summary>
    [JsonPropertyName("interaction")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Interaction? Interaction { get; set; }

    /// <summary>Chart layout (padding around the chart area).</summary>
    [JsonPropertyName("layout")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Layout? Layout { get; set; }

    /// <summary>Locale for numbers in tooltips and formats (e.g. <c>"en-GB"</c>). Unset: the browser's.</summary>
    [JsonPropertyName("locale")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Locale { get; set; }

    /// <summary>Whether the chart maintains its original aspect ratio when resizing.</summary>
    [JsonPropertyName("maintainAspectRatio")]
    public bool MaintainAspectRatio { get; set; }

    /// <summary>Plugin configuration.</summary>
    [JsonPropertyName("plugins")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Plugins Plugins { get; set; } = new();

    /// <summary>Whether the chart resizes to fill its container.</summary>
    [JsonPropertyName("responsive")]
    public bool Responsive { get; set; } = true;

    /// <summary>
    /// Whether to register the data labels plugin for this chart. If the plugin script is not present
    /// it is simply not registered.
    /// </summary>
    [JsonPropertyName("registerDataLabels")]
    public bool RegisterDataLabels { get; set; }

    /// <summary>Scale (axis) configuration keyed by scale id (e.g. <c>"x"</c>, <c>"y"</c>).</summary>
    [JsonPropertyName("scales")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, Axis>? Scales { get; set; }
}
