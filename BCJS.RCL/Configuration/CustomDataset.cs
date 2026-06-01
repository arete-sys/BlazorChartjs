namespace BCJS.Configuration;

/// <summary>Base dataset for charts whose data points are objects (bubble, scatter).</summary>
[JsonDerivedType(typeof(CustomDataset), typeDiscriminator: "base")]
[JsonDerivedType(typeof(BubbleDataset), typeDiscriminator: "bubbleData")]
[JsonDerivedType(typeof(ScatterDataset), typeDiscriminator: "scatterData")]
public class CustomDataset
{
    /// <summary>The dataset label shown in the legend and tooltips.</summary>
    [JsonPropertyName("label")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Label { get; set; }
}

/// <summary>A dataset with strongly-typed object data points.</summary>
/// <typeparam name="T">The data point type (e.g. <c>BubbleCoords</c>, <c>ScatterXYValue</c>).</typeparam>
public class CustomDataset<T> : CustomDataset where T : class
{
    /// <summary>The object data points.</summary>
    [JsonPropertyName("data")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public virtual List<T>? Data { get; set; }
}
