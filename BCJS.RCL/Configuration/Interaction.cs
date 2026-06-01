namespace BCJS.Configuration;

/// <summary>Chart.js interaction configuration.</summary>
public class Interaction
{
    /// <summary>Whether interaction requires intersecting an element.</summary>
    [JsonPropertyName("intersect")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Intersect { get; set; }

    /// <summary>Whether invisible points are included in interaction.</summary>
    [JsonPropertyName("includeInvisible")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? IncludeInvisible { get; set; }

    /// <summary>Interaction mode (see <see cref="InteractionMode"/>).</summary>
    [JsonPropertyName("mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public InteractionMode? Mode { get; set; }

    /// <summary>Interaction axis (see <see cref="AxisInteractions"/>).</summary>
    [JsonPropertyName("axis")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public AxisInteractions? Axis { get; set; }
}
