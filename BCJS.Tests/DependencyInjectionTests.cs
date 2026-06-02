using BCJS.Interop;
using Microsoft.Extensions.DependencyInjection;

namespace BCJS.Tests;

public class DependencyInjectionTests
{
    [Fact]
    public void AddBcjs_registers_ChartInterop_as_scoped()
    {
        var services = new ServiceCollection();

        services.AddBcjs();

        var descriptor = Assert.Single(services, s => s.ServiceType == typeof(ChartInterop));
        Assert.Equal(ServiceLifetime.Scoped, descriptor.Lifetime);
    }

    [Fact]
    public void AddBcjs_is_idempotent()
    {
        var services = new ServiceCollection();

        services.AddBcjs();
        services.AddBcjs();

        Assert.Single(services, s => s.ServiceType == typeof(ChartInterop));
    }
}
