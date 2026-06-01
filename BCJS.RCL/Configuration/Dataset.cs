namespace BCJS.Configuration;

/// <summary>
/// Base dataset for value-only charts (bar, line, pie, …). Per-type styling lives on the derived
/// dataset classes. The discriminators support polymorphic round-tripping.
/// </summary>
[JsonDerivedType(typeof(Dataset), typeDiscriminator: "base")]
[JsonDerivedType(typeof(BarDataset), typeDiscriminator: "barDataset")]
[JsonDerivedType(typeof(DoughnutDataset), typeDiscriminator: "doughnutDataset")]
[JsonDerivedType(typeof(LineDataset), typeDiscriminator: "lineDataset")]
[JsonDerivedType(typeof(PieDataset), typeDiscriminator: "pieDataset")]
[JsonDerivedType(typeof(PolarDataset), typeDiscriminator: "polarDataset")]
[JsonDerivedType(typeof(RadarDataset), typeDiscriminator: "radarDataset")]
public class Dataset
{
    /// <summary>The numeric data points.</summary>
    [JsonPropertyName("data")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public virtual List<decimal?>? Data { get; set; }

    /// <summary>Per-dataset data labels plugin configuration.</summary>
    [JsonPropertyName("datalabels")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DataLabels? DataLabels { get; set; }

    /// <summary>The dataset label shown in the legend and tooltips.</summary>
    [JsonPropertyName("label")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Label { get; set; }

    /// <summary>The draw order of the dataset.</summary>
    [JsonPropertyName("order")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Order { get; set; }

    /// <summary>Per-dataset chart type override (enables mixed charts; see <see cref="ChartType"/>).</summary>
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Type { get; set; }
}
