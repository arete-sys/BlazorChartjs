namespace BCJS.Configuration;

/// <summary>
/// Tooltip callbacks. The formatting delegates are not serialized; the <c>has*</c> flags tell the
/// interop module which JS tooltip callback to install.
/// </summary>
public sealed class Callbacks
{
    /// <summary>Tells the interop module to install the tooltip label callback.</summary>
    [JsonInclude]
    [JsonPropertyName("hasLabel")]
    public bool HasLabel => Label is not null;

    /// <summary>Produces the tooltip label line(s) for a data element.</summary>
    [JsonIgnore]
    public Func<CallbackGenericContext, string[]>? Label { get; set; }

    /// <summary>Tells the interop module to install the tooltip title callback.</summary>
    [JsonInclude]
    [JsonPropertyName("hasCustomTitle")]
    public bool HasCustomTitle => Title is not null;

    /// <summary>Produces the tooltip title line(s).</summary>
    [JsonIgnore]
    public Func<CallbackGenericContext, string[]>? Title { get; set; }
}
