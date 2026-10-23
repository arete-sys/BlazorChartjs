namespace BCJS.Configuration;

/// <summary>Time scale configuration (Chart.js <c>scales.&lt;id&gt;.time</c>).</summary>
public sealed class AxesTime
{
    /// <summary>How data is parsed into time (<c>"auto"</c>, <c>"data"</c>, <c>"labels"</c>).</summary>
    [JsonPropertyName("source")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Source { get; set; }

    /// <summary>date-fns format for parsing date strings that are not ISO 8601, e.g. <c>"dd/MM/yyyy"</c>. Unset: ISO strings and timestamps are read as they are.</summary>
    [JsonPropertyName("parser")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Parser { get; set; }

    /// <summary>Display format strings keyed by time unit.</summary>
    [JsonPropertyName("displayFormats")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public AxesTimeFormats? DisplayFormats { get; set; }

    /// <summary>Whether weeks start on the ISO weekday.</summary>
    [JsonPropertyName("isoWeekday")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? IsoWeekday { get; set; }

    /// <summary>Round timestamps to this unit.</summary>
    [JsonPropertyName("round")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Round { get; set; }

    /// <summary>Format used for the tooltip title.</summary>
    [JsonPropertyName("tooltipFormat")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TooltipFormat { get; set; }

    /// <summary>Force a specific unit (see <see cref="TimeUnit"/>).</summary>
    [JsonPropertyName("unit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Unit { get; set; }

    /// <summary>The minimum display unit (see <see cref="TimeUnit"/>).</summary>
    [JsonPropertyName("minUnit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? MinUnit { get; set; }
}

/// <summary>Per-unit display format strings for a time scale.</summary>
public sealed class AxesTimeFormats
{
    /// <summary>Millisecond format.</summary>
    [JsonPropertyName("millisecond")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Millisecond { get; set; }

    /// <summary>Second format.</summary>
    [JsonPropertyName("second")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Second { get; set; }

    /// <summary>Minute format.</summary>
    [JsonPropertyName("minute")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Minute { get; set; }

    /// <summary>Hour format.</summary>
    [JsonPropertyName("hour")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Hour { get; set; }

    /// <summary>Day format.</summary>
    [JsonPropertyName("day")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Day { get; set; }

    /// <summary>Week format.</summary>
    [JsonPropertyName("week")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Week { get; set; }

    /// <summary>Month format.</summary>
    [JsonPropertyName("month")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Month { get; set; }

    /// <summary>Quarter format.</summary>
    [JsonPropertyName("quarter")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Quarter { get; set; }

    /// <summary>Year format.</summary>
    [JsonPropertyName("year")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Year { get; set; }
}
