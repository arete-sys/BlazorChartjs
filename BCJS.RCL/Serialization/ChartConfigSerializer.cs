using System.Text.Json;

namespace BCJS.Serialization;

/// <summary>Serializes chart configurations to JSON using the source-generated context.</summary>
public static class ChartConfigSerializer
{
    /// <summary>
    /// Serializes a chart configuration to its Chart.js JSON config string using the runtime type so
    /// the correct source-generated metadata is selected.
    /// </summary>
    /// <param name="config">The configuration to serialize.</param>
    /// <returns>The JSON config string passed to the interop module.</returns>
    public static string Serialize(IChartConfig config) =>
        JsonSerializer.Serialize(config, config.GetType(), BcjsJsonSerializerContext.Default);
}
