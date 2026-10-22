using BCJS.Serialization;

namespace BCJS.Enums;

// Modernization note (deviation D-9): the original modelled these as classes exposing static
// instances plus a paired "<Name>String" property for serialization. BCJS uses real enums with a
// camelCase string converter, so consumer call sites (e.g. Align.Center) are unchanged but the
// option model needs only a single property and emits the same Chart.js tokens.

/// <summary>Alignment of an element (legend, title, …).</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<Align>))]
public enum Align
{
    /// <summary><c>"start"</c></summary>
    Start,

    /// <summary><c>"center"</c></summary>
    Center,

    /// <summary><c>"end"</c></summary>
    End,
}

/// <summary>Axis along which the interaction is computed.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<AxisInteractions>))]
public enum AxisInteractions
{
    /// <summary><c>"r"</c> (radial).</summary>
    R,

    /// <summary><c>"x"</c></summary>
    X,

    /// <summary><c>"xy"</c></summary>
    XY,

    /// <summary><c>"y"</c></summary>
    Y,
}

/// <summary>Tick label cross alignment.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<CrossAlign>))]
public enum CrossAlign
{
    /// <summary><c>"near"</c></summary>
    Near,

    /// <summary><c>"center"</c></summary>
    Center,

    /// <summary><c>"far"</c></summary>
    Far,
}

/// <summary>Line interpolation mode.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<CubicInterpolationMode>))]
public enum CubicInterpolationMode
{
    /// <summary><c>"default"</c></summary>
    Default,

    /// <summary><c>"monotone"</c></summary>
    Monotone,
}

/// <summary>Data labels plugin alignment.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<DatalabelsAlign>))]
public enum DatalabelsAlign
{
    /// <summary><c>"bottom"</c></summary>
    Bottom,

    /// <summary><c>"center"</c></summary>
    Center,

    /// <summary><c>"end"</c></summary>
    End,

    /// <summary><c>"left"</c></summary>
    Left,

    /// <summary><c>"right"</c></summary>
    Right,

    /// <summary><c>"start"</c></summary>
    Start,

    /// <summary><c>"top"</c></summary>
    Top,
}

/// <summary>Data labels plugin anchor.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<DatalabelsAnchor>))]
public enum DatalabelsAnchor
{
    /// <summary><c>"start"</c></summary>
    Start,

    /// <summary><c>"center"</c></summary>
    Center,

    /// <summary><c>"end"</c></summary>
    End,
}

/// <summary>Data labels plugin text alignment.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<DatalabelsTextAlign>))]
public enum DatalabelsTextAlign
{
    /// <summary><c>"center"</c></summary>
    Center,

    /// <summary><c>"end"</c></summary>
    End,

    /// <summary><c>"left"</c></summary>
    Left,

    /// <summary><c>"right"</c></summary>
    Right,

    /// <summary><c>"start"</c></summary>
    Start,
}

/// <summary>Chart interaction mode.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<InteractionMode>))]
public enum InteractionMode
{
    /// <summary><c>"dataset"</c></summary>
    Dataset,

    /// <summary><c>"index"</c></summary>
    Index,

    /// <summary><c>"nearest"</c></summary>
    Nearest,

    /// <summary><c>"point"</c></summary>
    Point,

    /// <summary><c>"x"</c></summary>
    X,

    /// <summary><c>"y"</c></summary>
    Y,
}

/// <summary>Legend position.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<LegendPosition>))]
public enum LegendPosition
{
    /// <summary><c>"bar"</c></summary>
    Bar,

    /// <summary><c>"bottom"</c></summary>
    Bottom,

    /// <summary><c>"chartArea"</c></summary>
    ChartArea,

    /// <summary><c>"left"</c></summary>
    Left,

    /// <summary><c>"right"</c></summary>
    Right,
}

/// <summary>Point marker style.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<PointStyle>))]
public enum PointStyle
{
    /// <summary><c>"circle"</c></summary>
    Circle,

    /// <summary><c>"cross"</c></summary>
    Cross,

    /// <summary><c>"crossRot"</c></summary>
    CrossRot,

    /// <summary><c>"dash"</c></summary>
    Dash,

    /// <summary><c>"line"</c></summary>
    Line,

    /// <summary><c>"rect"</c></summary>
    [JsonStringEnumMemberName("rect")]
    Rectangle,

    /// <summary><c>"rectRot"</c></summary>
    [JsonStringEnumMemberName("rectRot")]
    RectangleRot,

    /// <summary><c>"rectRounded"</c></summary>
    [JsonStringEnumMemberName("rectRounded")]
    RectangleRounded,

    /// <summary><c>"star"</c></summary>
    Star,

    /// <summary><c>"triangle"</c></summary>
    Triangle,
}

/// <summary>Axis / title position.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<Position>))]
public enum Position
{
    /// <summary><c>"top"</c></summary>
    Top,

    /// <summary><c>"left"</c></summary>
    Left,

    /// <summary><c>"bottom"</c></summary>
    Bottom,

    /// <summary><c>"right"</c></summary>
    Right,
}

/// <summary>Stepped-line mode (Chart.js <c>stepped</c>).</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<StepMode>))]
public enum StepMode
{
    /// <summary><c>"false"</c></summary>
    False,

    /// <summary><c>"true"</c></summary>
    True,

    /// <summary><c>"before"</c></summary>
    Before,

    /// <summary><c>"after"</c></summary>
    After,

    /// <summary><c>"middle"</c></summary>
    Middle,
}

/// <summary>Text direction.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<TextDirection>))]
public enum TextDirection
{
    /// <summary><c>"ltr"</c></summary>
    LTR,

    /// <summary><c>"rtl"</c></summary>
    RTL,
}

/// <summary>Horizontal text alignment (Chart.js <c>TextAlign</c>, e.g. tooltip <c>titleAlign</c>/<c>bodyAlign</c>).</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<TextAlign>))]
public enum TextAlign
{
    /// <summary><c>"left"</c></summary>
    Left,

    /// <summary><c>"center"</c></summary>
    Center,

    /// <summary><c>"right"</c></summary>
    Right,
}

/// <summary>Built-in tooltip positioner (Chart.js tooltip <c>position</c>).</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter<TooltipPosition>))]
public enum TooltipPosition
{
    /// <summary><c>"average"</c> — the average position of the active items.</summary>
    Average,

    /// <summary><c>"nearest"</c> — the position of the element closest to the event.</summary>
    Nearest,
}
