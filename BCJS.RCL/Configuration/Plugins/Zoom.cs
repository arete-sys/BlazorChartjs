namespace BCJS.Configuration;

/// <summary>Zoom/pan plugin configuration (chartjs-plugin-zoom).</summary>
public sealed class Zoom
{
    /// <summary>Whether the plugin is enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }

    /// <summary>Zoom limits per scale.</summary>
    [JsonPropertyName("limits")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Limits? Limits { get; set; }

    /// <summary>Zoom/pan mode (see <see cref="ZoomMode"/>).</summary>
    [JsonPropertyName("mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Mode { get; set; } = "xy";

    /// <summary>The scale mode that takes precedence when over a scale.</summary>
    [JsonPropertyName("overScaleMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OverScaleMode { get; set; }

    /// <summary>Pan configuration.</summary>
    [JsonPropertyName("pan")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Pan? Pan { get; set; }

    /// <summary>Zoom (drag/pinch/wheel) configuration.</summary>
    [JsonPropertyName("zoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ZoomOptions? ZoomOptions { get; set; }
}

/// <summary>Zoom gesture configuration (drag/pinch/wheel).</summary>
public sealed class ZoomOptions
{
    /// <summary>Drag-to-zoom configuration.</summary>
    [JsonPropertyName("drag")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Drag? Drag { get; set; }

    /// <summary>Pinch-to-zoom configuration.</summary>
    [JsonPropertyName("pinch")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Pinch? Pinch { get; set; }

    /// <summary>Wheel-zoom configuration.</summary>
    [JsonPropertyName("wheel")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Wheel? Wheel { get; set; }
}

/// <summary>Pan configuration.</summary>
public sealed class Pan
{
    /// <summary>Whether panning is enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }

    /// <summary>Pan mode (see <see cref="ZoomMode"/>).</summary>
    [JsonPropertyName("mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Mode { get; set; } = "xy";

    /// <summary>Keyboard modifier required to pan.</summary>
    [JsonPropertyName("modifierKey")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ModifierKey { get; set; }

    /// <summary>The scale mode that takes precedence when over a scale.</summary>
    [JsonPropertyName("overScaleMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OverScaleMode { get; set; }

    /// <summary>Minimum pointer movement before panning starts.</summary>
    [JsonPropertyName("threshold")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int Threshold { get; set; } = 10;
}

/// <summary>Wheel-zoom configuration.</summary>
public sealed class Wheel
{
    /// <summary>Whether wheel zoom is enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }

    /// <summary>Keyboard modifier required to zoom.</summary>
    [JsonPropertyName("modifierKey")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ModifierKey { get; set; }

    /// <summary>Zoom speed.</summary>
    [JsonPropertyName("speed")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal Speed { get; set; } = 0.1M;
}

/// <summary>Pinch-zoom configuration.</summary>
public sealed class Pinch
{
    /// <summary>Whether pinch zoom is enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }
}

/// <summary>Drag-to-zoom configuration.</summary>
public sealed class Drag
{
    /// <summary>Whether drag zoom is enabled.</summary>
    [JsonPropertyName("enabled")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Enabled { get; set; }

    /// <summary>Drag box fill color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; } = "rgba(225,225,225,0.3)";

    /// <summary>Drag box border color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; } = "rgba(225,225,225)";

    /// <summary>Drag box border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }

    /// <summary>Keyboard modifier required to drag-zoom.</summary>
    [JsonPropertyName("modifierKey")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ModifierKey { get; set; }

    /// <summary>Minimum drag distance before zooming starts.</summary>
    [JsonPropertyName("threshold")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int Threshold { get; set; }
}

/// <summary>Zoom limits container (per-scale limits are added as needed).</summary>
public sealed class Limits
{
}

/// <summary>Min/max zoom limits for a single scale.</summary>
public sealed class ScaleLimits
{
    private string? _min;
    private string? _max;

    /// <summary>The minimum limit; defaults to <c>"original"</c>.</summary>
    [JsonPropertyName("min")]
    public string? Min
    {
        get => _min ?? "original";
        set => _min = value;
    }

    /// <summary>The maximum limit; defaults to <c>"original"</c>.</summary>
    [JsonPropertyName("max")]
    public string? Max
    {
        get => _max ?? "original";
        set => _max = value;
    }

    /// <summary>The minimum visible range.</summary>
    [JsonPropertyName("minRange")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? MinRange { get; set; }
}
