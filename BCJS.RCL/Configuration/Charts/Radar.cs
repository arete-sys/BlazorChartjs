namespace BCJS.Configuration;

/// <summary>Configuration for a radar chart.</summary>
public class RadarChartConfig : IChartConfig
{
    /// <summary>The canvas identifier (not serialized).</summary>
    [JsonIgnore]
    public string CanvasId { get; } = Guid.NewGuid().ToString();

    /// <summary>The chart data.</summary>
    [JsonPropertyName("data")]
    public RadarData Data { get; set; } = new();

    /// <summary>Name of a JS function invoked on animation complete.</summary>
    [JsonPropertyName("onAnimationComplete")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OnAnimationComplete { get; set; }

    /// <summary>The chart options.</summary>
    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RadarOptions? Options { get; set; }

    /// <inheritdoc/>
    IOptions? IChartConfig.Options => Options;

    /// <summary>The chart type.</summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartType.Radar;
}

/// <summary>Radar chart data.</summary>
public class RadarData : Data<RadarDataset>;

/// <summary>A radar chart dataset.</summary>
public class RadarDataset : Dataset
{
    /// <summary>Fill/background color.</summary>
    [JsonPropertyName("backgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BackgroundColor { get; set; }

    /// <summary>Line border color.</summary>
    [JsonPropertyName("borderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BorderColor { get; set; }

    /// <summary>Line border width.</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? BorderWidth { get; set; }

    /// <summary>Whether the radar area is filled.</summary>
    [JsonPropertyName("fill")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Fill { get; set; }

    /// <summary>Point background color.</summary>
    [JsonPropertyName("pointBackgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PointBackgroundColor { get; set; }

    /// <summary>Point border color.</summary>
    [JsonPropertyName("pointBorderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PointBorderColor { get; set; }

    /// <summary>Point hover background color.</summary>
    [JsonPropertyName("pointHoverBackgroundColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PointHoverBackgroundColor { get; set; }

    /// <summary>Point hover border color.</summary>
    [JsonPropertyName("pointHoverBorderColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PointHoverBorderColor { get; set; }
}

/// <summary>Radar chart options.</summary>
public class RadarOptions : IOptions
{
    /// <summary>Radar element styling.</summary>
    [JsonPropertyName("elements")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RadarOptionsElements? Elements { get; set; }

    /// <summary>Whether the chart maintains its aspect ratio.</summary>
    [JsonPropertyName("maintainAspectRatio")]
    public bool MaintainAspectRatio { get; set; }

    /// <summary>Whether the chart is responsive.</summary>
    [JsonPropertyName("responsive")]
    public bool Responsive { get; set; } = true;

    /// <summary>Radial scale configuration.</summary>
    [JsonPropertyName("scales")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RadarOptionsScales? Scales { get; set; }
}

/// <summary>Radar element styling.</summary>
public class RadarOptionsElements
{
    /// <summary>Radar line styling.</summary>
    [JsonPropertyName("line")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RadarOptionsElementsLine? Line { get; set; }
}

/// <summary>Radar line element styling.</summary>
public class RadarOptionsElementsLine
{
    /// <summary>Line border width (default 3).</summary>
    [JsonPropertyName("borderWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int BorderWidth { get; set; } = 3;
}

/// <summary>Radar scales container.</summary>
public class RadarOptionsScales
{
    /// <summary>The radial (r) scale.</summary>
    [JsonPropertyName("r")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RadarOptionsScalesRadius? R { get; set; }
}

/// <summary>Radial scale configuration.</summary>
public class RadarOptionsScalesRadius
{
    /// <summary>Whether the radial scale begins at zero.</summary>
    [JsonPropertyName("beginAtZero")]
    public bool BeginAtZero { get; set; }

    /// <summary>Maximum radial value.</summary>
    [JsonPropertyName("max")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? Max { get; set; }

    /// <summary>Minimum radial value.</summary>
    [JsonPropertyName("min")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? Min { get; set; }
}
