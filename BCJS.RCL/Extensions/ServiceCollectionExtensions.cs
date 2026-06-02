using BCJS.Interop;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Microsoft.Extensions.DependencyInjection;

/// <summary>Dependency-injection registration for BCJS.</summary>
public static class BcjsServiceCollectionExtensions
{
    /// <summary>
    /// Registers BCJS services. This is <b>optional</b> — the <c>&lt;Chart&gt;</c> component works without
    /// it (it creates its own interop). Calling <c>AddBcjs()</c> registers a single scoped
    /// <see cref="ChartInterop"/> that all charts in the scope share, so the JS-interop module is
    /// referenced once per scope instead of once per chart.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The same <paramref name="services"/> for chaining.</returns>
    public static IServiceCollection AddBcjs(this IServiceCollection services)
    {
        services.TryAddScoped<ChartInterop>();
        return services;
    }
}
