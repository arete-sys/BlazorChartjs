namespace BCJS.Configuration;

/// <summary>
/// Axis tick configuration. The synchronous and asynchronous tick formatting callbacks are not
/// serialized; instead the <c>has*</c> flags tell the interop module which JS shim to install.
/// </summary>
public class Ticks
{
    /// <summary>Tells the interop module to install the synchronous tick callback.</summary>
    [JsonInclude]
    [JsonPropertyName("hasCallback")]
    public bool HasCallback => Callback is not null;

    /// <summary>Tells the interop module to install the asynchronous tick callback.</summary>
    [JsonInclude]
    [JsonPropertyName("hasAsyncCallback")]
    public bool HasAsyncCallback => CallbackAsync is not null;

    /// <summary>Synchronous tick label formatter.</summary>
    [JsonIgnore]
    public Func<TicksCallbackContext, string[]>? Callback { get; set; }

    /// <summary>Asynchronous tick label formatter.</summary>
    [JsonIgnore]
    public Func<TicksCallbackContext, Task<string[]>>? CallbackAsync { get; set; }

    /// <summary>Tick label color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    /// <summary>Tick label cross alignment.</summary>
    [JsonPropertyName("crossAlign")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CrossAlign? CrossAlign { get; set; }

    /// <summary>Tick label font.</summary>
    [JsonPropertyName("font")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Font? Font { get; set; }

    /// <summary>Maximum tick label rotation in degrees.</summary>
    [JsonPropertyName("maxRotation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaxRotation { get; set; }

    /// <summary>Maximum number of ticks shown.</summary>
    [JsonPropertyName("maxTicksLimit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaxTicksLimit { get; set; }

    /// <summary>Minimum tick label rotation in degrees.</summary>
    [JsonPropertyName("minRotation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MinRotation { get; set; }

    /// <summary>Whether ticks are automatically skipped to avoid overlap.</summary>
    [JsonPropertyName("autoSkip")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? AutoSkip { get; set; }

    /// <summary>Fixed step size between ticks.</summary>
    [JsonPropertyName("stepSize")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? StepSize { get; set; }
}
