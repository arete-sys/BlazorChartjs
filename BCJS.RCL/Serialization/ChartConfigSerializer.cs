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

    /// <summary>
    /// Serializes a config fragment (e.g. a dataset) to JSON using the source-generated context.
    /// The runtime type must be reachable from a registered root.
    /// </summary>
    /// <param name="value">The value to serialize.</param>
    /// <returns>The JSON string.</returns>
    public static string SerializeFragment(object value) =>
        JsonSerializer.Serialize(value, value.GetType(), BcjsJsonSerializerContext.Default);
}
