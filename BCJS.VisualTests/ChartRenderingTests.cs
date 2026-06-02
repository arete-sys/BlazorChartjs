using Microsoft.Playwright;

namespace BCJS.VisualTests;

/// <summary>
/// Drives the installed Chrome against the running sample and asserts every chart route actually
/// paints pixels on its canvas(es) with no console/page errors — the JS-executing check that bUnit
/// (which mocks interop) cannot do. Tagged "Visual" so it can be excluded from fast unit runs:
/// <c>dotnet test --filter Category!=Visual</c>.
/// </summary>
[Trait("Category", "Visual")]
public sealed class ChartRenderingTests : IClassFixture<SampleServerFixture>, IAsyncLifetime
{
    private const string PaintedPixelsPerCanvas = """
        () => [...document.querySelectorAll('canvas')].map(c => {
            try {
                const { data } = c.getContext('2d').getImageData(0, 0, c.width, c.height);
                let n = 0;
                for (let i = 3; i < data.length; i += 4) if (data[i] !== 0) n++;
                return n;
            } catch { return -1; }
        })
        """;

    private static readonly string[] AllRoutes =
        ["/line", "/bar", "/pie-doughnut", "/radar", "/mixed", "/zoom", "/datalabels"];

    private readonly SampleServerFixture _fixture;
    private readonly List<string> _errors = new();
    private IBrowserContext _context = default!;
    private IPage _page = default!;

    public ChartRenderingTests(SampleServerFixture fixture) => _fixture = fixture;

    public static IEnumerable<object[]> Routes() => AllRoutes.Select(r => new object[] { r });

    public async Task InitializeAsync()
    {
        _context = await _fixture.Browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1400, Height = 900 },
        });
        _page = await _context.NewPageAsync();
        _page.Console += (_, msg) =>
        {
            if (msg.Type == "error")
                _errors.Add("[console] " + msg.Text);
        };
        _page.PageError += (_, err) => _errors.Add("[pageerror] " + err);
    }

    public async Task DisposeAsync() => await _context.DisposeAsync();

    [Theory]
    [MemberData(nameof(Routes))]
    public async Task Route_paints_every_canvas_without_errors(string route)
    {
        await _page.GotoAsync(_fixture.BaseUrl + route, new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60_000,
        });
        await _page.WaitForSelectorAsync("canvas", new PageWaitForSelectorOptions { Timeout = 30_000 });
        await _page.WaitForTimeoutAsync(2_000); // let the chart animation settle

        var painted = await _page.EvaluateAsync<int[]>(PaintedPixelsPerCanvas);

        await SaveScreenshotAsync(route);

        Assert.NotEmpty(painted);
        Assert.All(painted, p =>
            Assert.True(p > 0, $"a canvas painted {p} pixels on {route} (expected > 0)"));
        Assert.True(_errors.Count == 0,
            $"console/page errors on {route}:{Environment.NewLine}{string.Join(Environment.NewLine, _errors)}");
    }

    private async Task SaveScreenshotAsync(string route)
    {
        var dir = Path.Combine(_fixture.RepoRoot, "artifacts-shots");
        Directory.CreateDirectory(dir);
        var name = route.Trim('/').Replace('/', '-');
        await _page.ScreenshotAsync(new PageScreenshotOptions { Path = Path.Combine(dir, $"{name}.png") });
    }
}
