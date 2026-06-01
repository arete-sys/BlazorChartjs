namespace BCJS.Configuration;

/// <summary>
/// Base chart data. The <c>[JsonDerivedType]</c> discriminators support the legend-filter round-trip,
/// where the JS side stamps a <c>$type</c> before sending the data back to .NET.
/// </summary>
[JsonDerivedType(typeof(Data), typeDiscriminator: "base")]
[JsonDerivedType(typeof(BarData), typeDiscriminator: "barData")]
[JsonDerivedType(typeof(DoughnutData), typeDiscriminator: "doughnutData")]
[JsonDerivedType(typeof(LineData), typeDiscriminator: "lineData")]
[JsonDerivedType(typeof(PieData), typeDiscriminator: "pieData")]
[JsonDerivedType(typeof(PolarData), typeDiscriminator: "polarData")]
[JsonDerivedType(typeof(RadarData), typeDiscriminator: "radarData")]
[JsonDerivedType(typeof(BubbleData), typeDiscriminator: "bubbleData")]
[JsonDerivedType(typeof(ScatterData), typeDiscriminator: "scatterData")]
public class Data
{
    /// <summary>The category labels shared by all datasets.</summary>
    [JsonPropertyName("labels")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string> Labels { get; set; } = [];
}

/// <summary>Chart data with strongly-typed datasets.</summary>
/// <typeparam name="T">The dataset type.</typeparam>
public class Data<T> : Data where T : class
{
    /// <summary>The datasets rendered by the chart.</summary>
    [JsonPropertyName("datasets")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<T> Datasets { get; set; } = [];
}
