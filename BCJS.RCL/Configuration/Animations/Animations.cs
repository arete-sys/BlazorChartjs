namespace BCJS.Configuration;

/// <summary>A single animation definition.</summary>
public class Animation
{
    /// <summary>Delay before the animation starts (ms).</summary>
    [JsonPropertyName("delay")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Delay { get; set; }

    /// <summary>Animation duration (ms).</summary>
    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Duration { get; set; }

    /// <summary>Easing function name.</summary>
    [JsonPropertyName("easing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Easing { get; set; }

    /// <summary>Whether the animation loops.</summary>
    [JsonPropertyName("loop")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Loop { get; set; }
}

/// <summary>Per-property animation configuration (Chart.js <c>animations</c>).</summary>
public class Animations
{
    /// <summary>Whether colors are animated.</summary>
    [JsonPropertyName("colors")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Colors { get; set; }

    /// <summary>Tension animation.</summary>
    [JsonPropertyName("tension")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Tension? Tension { get; set; }

    /// <summary>Whether the X property is animated.</summary>
    [JsonPropertyName("x")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? X { get; set; }
}

/// <summary>A tension animation (animates line curvature between two values).</summary>
public class Tension : Animation
{
    /// <summary>The starting tension.</summary>
    [JsonPropertyName("from")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? From { get; set; }

    /// <summary>The ending tension.</summary>
    [JsonPropertyName("to")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? To { get; set; }
}
