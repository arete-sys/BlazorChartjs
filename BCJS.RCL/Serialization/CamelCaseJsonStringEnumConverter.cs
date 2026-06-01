using System.Text.Json;

namespace BCJS.Serialization;

/// <summary>
/// A <see cref="JsonStringEnumConverter{TEnum}"/> that emits camelCase tokens by default, so enum
/// members serialize to the lowercase strings Chart.js expects (e.g. <c>Center</c> → <c>"center"</c>,
/// <c>XY</c> → <c>"xy"</c>). Individual members can override the result with
/// <see cref="JsonStringEnumMemberNameAttribute"/>. Integer values are disallowed so an invalid enum
/// never silently serializes as a number Chart.js cannot read.
/// </summary>
/// <typeparam name="TEnum">The enum type.</typeparam>
public sealed class CamelCaseJsonStringEnumConverter<TEnum> : JsonStringEnumConverter<TEnum>
    where TEnum : struct, Enum
{
    /// <summary>Initializes a new instance of the <see cref="CamelCaseJsonStringEnumConverter{TEnum}"/> class.</summary>
    public CamelCaseJsonStringEnumConverter()
        : base(namingPolicy: JsonNamingPolicy.CamelCase, allowIntegerValues: false)
    {
    }
}
