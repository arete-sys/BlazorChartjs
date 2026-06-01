namespace BCJS.Enums;

/// <summary>Chart.js index/value axis identifiers used by <c>indexAxis</c>.</summary>
public static class Axes
{
    /// <summary>The X axis (<c>"x"</c>).</summary>
    public const string X = "x";

    /// <summary>The Y axis (<c>"y"</c>).</summary>
    public const string Y = "y";

    /// <summary>The default axis — omitted from the config (Chart.js applies its own default).</summary>
    public const string? Default = null;
}

/// <summary>The Chart.js chart type discriminators (the <c>type</c> field of a config).</summary>
public static class ChartType
{
    /// <summary>Bar chart.</summary>
    public const string Bar = "bar";

    /// <summary>Line chart.</summary>
    public const string Line = "line";

    /// <summary>Pie chart.</summary>
    public const string Pie = "pie";

    /// <summary>Doughnut chart.</summary>
    public const string Doughnut = "doughnut";

    /// <summary>Radar chart.</summary>
    public const string Radar = "radar";

    /// <summary>Bubble chart.</summary>
    public const string Bubble = "bubble";

    /// <summary>Polar area chart.</summary>
    public const string PolarArea = "polarArea";

    /// <summary>Scatter chart.</summary>
    public const string Scatter = "scatter";
}

/// <summary>Time units for a Chart.js time scale.</summary>
public static class TimeUnit
{
    /// <summary>Millisecond unit.</summary>
    public const string Millisecond = "millisecond";

    /// <summary>Second unit.</summary>
    public const string Second = "second";

    /// <summary>Minute unit.</summary>
    public const string Minute = "minute";

    /// <summary>Hour unit.</summary>
    public const string Hour = "hour";

    /// <summary>Day unit.</summary>
    public const string Day = "day";

    /// <summary>Week unit.</summary>
    public const string Week = "week";

    /// <summary>Month unit.</summary>
    public const string Month = "month";

    /// <summary>Quarter unit.</summary>
    public const string Quarter = "quarter";

    /// <summary>Year unit.</summary>
    public const string Year = "year";
}

/// <summary>Zoom/pan modes for the zoom plugin.</summary>
public static class ZoomMode
{
    /// <summary>Zoom/pan along the X axis only.</summary>
    public const string X = "x";

    /// <summary>Zoom/pan along the Y axis only.</summary>
    public const string Y = "y";

    /// <summary>Zoom/pan along both axes.</summary>
    public const string XY = "xy";
}
