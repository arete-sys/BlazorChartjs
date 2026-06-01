namespace BCJS.Configuration;

/// <summary>Context passed to click/tooltip callbacks identifying a data element and its value.</summary>
/// <param name="DatasetIndex">The dataset index.</param>
/// <param name="DataIndex">The data point index within the dataset.</param>
/// <param name="Value">The data point value.</param>
public readonly record struct CallbackGenericContext(int DatasetIndex, int DataIndex, decimal Value);

/// <summary>Context passed to a tick formatting callback.</summary>
/// <param name="Value">The tick value.</param>
/// <param name="Index">The tick index.</param>
/// <param name="Ticks">All tick values on the axis.</param>
public readonly record struct TicksCallbackContext(decimal Value, int Index, decimal[] Ticks);

/// <summary>A clicked data value.</summary>
/// <param name="DatasetIndex">The dataset index.</param>
/// <param name="ValueIndex">The value index within the dataset.</param>
/// <param name="Value">The value.</param>
public readonly record struct ClickValue(int DatasetIndex, int ValueIndex, decimal Value);

/// <summary>Context passed to the chart hover callback (chart-space coordinates).</summary>
/// <param name="DataX">The X value under the pointer.</param>
/// <param name="DataY">The Y value under the pointer.</param>
public readonly record struct HoverContext(decimal DataX, decimal DataY);

/// <summary>Context passed to the legend click callback.</summary>
/// <param name="LegendIndex">The clicked legend item index.</param>
/// <param name="LegendText">The clicked legend item text.</param>
public readonly record struct LegendClickContext(int LegendIndex, string LegendText);

/// <summary>Context passed to the legend label filter callback.</summary>
/// <param name="Item">The legend item being evaluated.</param>
/// <param name="Data">The chart data.</param>
public readonly record struct LegendFilterContext(LegendItem Item, Data Data);

/// <summary>Context passed to zoom/pan callbacks.</summary>
/// <param name="Id">The chart id.</param>
public readonly record struct ZoomContext(string Id);
