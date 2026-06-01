namespace BCJS.Configuration;

/// <summary>
/// The contract every chart configuration satisfies: a stable client-side canvas id, the Chart.js
/// <c>type</c>, and the (optional) options object.
/// </summary>
public interface IChartConfig
{
    /// <summary>A stable identifier for the chart's canvas element. Not serialized.</summary>
    string CanvasId { get; }

    /// <summary>The Chart.js chart type (see <see cref="ChartType"/>).</summary>
    string Type { get; set; }

    /// <summary>The options object, or <see langword="null"/> to use Chart.js defaults.</summary>
    IOptions? Options { get; }
}

/// <summary>Marker interface implemented by every options model (<c>Options</c>, <c>PieOptions</c>, …).</summary>
public interface IOptions
{
}

/// <summary>A typed dataset abstraction.</summary>
public interface IDataset
{
    /// <summary>An optional client-side identifier.</summary>
    string? Id { get; set; }

    /// <summary>The Chart.js dataset type override (see <see cref="ChartType"/>), or <see langword="null"/>.</summary>
    string? Type { get; set; }
}

/// <summary>A typed dataset exposing its strongly-typed data points.</summary>
/// <typeparam name="T">The data point type.</typeparam>
public interface IDataset<T> : IDataset
{
    /// <summary>The dataset's data points.</summary>
    List<T> Data { get; set; }
}
