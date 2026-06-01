namespace BCJS.Serialization;

/// <summary>
/// System.Text.Json source-generated serialization context for the BCJS option model (deviation D-3).
/// Registers every concrete chart configuration root; the generator walks the reachable option graph
/// from each, so no reflection-based serialization is needed at runtime (trimming/AOT friendly).
/// </summary>
[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    GenerationMode = JsonSourceGenerationMode.Default)]
// 'Options' would generate an accessor that hides JsonSerializerContext.Options; rename just its
// generated metadata property (the public type stays 'Options' for parity).
[JsonSerializable(typeof(Options), TypeInfoPropertyName = "ChartOptions")]
[JsonSerializable(typeof(BarChartConfig))]
[JsonSerializable(typeof(LineChartConfig))]
[JsonSerializable(typeof(PieChartConfig))]
[JsonSerializable(typeof(DoughnutChartConfig))]
[JsonSerializable(typeof(RadarChartConfig))]
[JsonSerializable(typeof(PolarChartConfig))]
[JsonSerializable(typeof(BubbleChartConfig))]
[JsonSerializable(typeof(ScatterChartConfig))]
public partial class BcjsJsonSerializerContext : JsonSerializerContext
{
}
