using System.Text.Json;
using Microsoft.Playwright;

namespace BCJS.VisualTests;

/// <summary>
/// Drives the installed Chrome against the running sample and asserts every chart route actually
/// paints pixels on its canvas(es) with no console/page errors — the JS-executing check that bUnit
/// (which mocks interop) cannot do. Tagged "Visual" so it can be excluded from fast unit runs:
/// <c>dotnet test --solution BCJS.slnx --filter-not-trait "Category=Visual"</c>.
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
        ["/line", "/bar", "/pie-doughnut", "/radar", "/mixed", "/zoom", "/datalabels", "/dashboard-pie", "/data-update", "/custom-tooltip"];

    // Chart.js replaces the canvas's "$chartjs" expando when a chart is re-created: same object = updated in place.
    private const string SnapshotCanvases = """
        () => { window.__bcjsSnapshot = [...document.querySelectorAll('canvas')].map(c => ({ expando: c.$chartjs, image: c.toDataURL() })); return window.__bcjsSnapshot.length; }
        """;

    private const string ReadHtmlTooltip = """
        (i) => {
            const container = document.querySelectorAll('canvas')[i].parentNode;
            const tips = container.querySelectorAll('.bcjs-tooltip');
            const el = tips[0];
            if (!el) return JSON.stringify({ count: 0 });
            const mid = (n) => { const r = n.getBoundingClientRect(); return r.top + r.height / 2; };
            const rows = [...el.querySelectorAll('.bcjs-tooltip-row')].map(r => {
                const label = r.querySelector('.bcjs-tooltip-label');
                const value = r.querySelector('.bcjs-tooltip-value');
                return {
                    label: label?.textContent ?? '', value: value?.textContent ?? '',
                    oneLine: !!label && !!value && Math.abs(mid(label) - mid(value)) < 2,
                    labelWeight: label ? getComputedStyle(label).fontWeight : '',
                    valueWeight: value ? getComputedStyle(value).fontWeight : '',
                    marker: !!r.querySelector('.bcjs-tooltip-marker'),
                };
            });
            const b = el.getBoundingClientRect(), c = container.getBoundingClientRect();
            return JSON.stringify({
                count: tips.length,
                opacity: getComputedStyle(el).opacity,
                title: el.querySelector('.bcjs-tooltip-title')?.textContent ?? '',
                rows,
                inside: b.left >= c.left - 1 && b.right <= c.right + 1 && b.top >= c.top - 1 && b.bottom <= c.bottom + 1,
            });
        }
        """;

    private const string ReadTooltipContent = """
        (i) => {
            const el = document.querySelectorAll('canvas')[i].parentNode.querySelector('.bcjs-tooltip');
            if (!el) return JSON.stringify({ found: false });
            return JSON.stringify({
                found: true,
                opacity: getComputedStyle(el).opacity,
                text: el.textContent,
                injected: !!el.querySelector('team'),
                strong: el.querySelector('strong')?.textContent ?? '',
            });
        }
        """;

    private const string CompareWithSnapshot = """
        () => [...document.querySelectorAll('canvas')].map((c, i) => {
            const before = window.__bcjsSnapshot[i];
            return [!!c.$chartjs && c.$chartjs === before.expando, c.toDataURL() !== before.image];
        })
        """;

    private readonly SampleServerFixture _fixture;
    private readonly List<string> _errors = new();
    private IBrowserContext _context = default!;
    private IPage _page = default!;

    public ChartRenderingTests(SampleServerFixture fixture) => _fixture = fixture;

    public static IEnumerable<object[]> Routes() => AllRoutes.Select(r => new object[] { r });

    public async ValueTask InitializeAsync()
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

    public async ValueTask DisposeAsync() => await _context.DisposeAsync();

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

    [Fact]
    public async Task Data_update_redraws_the_same_chart_instances()
    {
        await _page.GotoAsync(_fixture.BaseUrl + "/data-update", new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60_000,
        });
        await _page.WaitForSelectorAsync("canvas", new PageWaitForSelectorOptions { Timeout = 30_000 });
        await _page.WaitForTimeoutAsync(2_000);

        foreach (var (button, shot) in new[] { ("#range-5y", "data-update-5y"), ("#range-1y", "data-update-1y") })
        {
            var canvases = await _page.EvaluateAsync<int>(SnapshotCanvases);
            Assert.Equal(4, canvases);

            await _page.ClickAsync(button);
            await _page.WaitForTimeoutAsync(2_000); // let the update animation settle

            var results = await _page.EvaluateAsync<bool[][]>(CompareWithSnapshot);
            var painted = await _page.EvaluateAsync<int[]>(PaintedPixelsPerCanvas);
            await SaveScreenshotAsync("/" + shot);

            Assert.All(results, r => Assert.True(r[0], $"a chart was re-created instead of updated after {button}"));
            Assert.All(results, r => Assert.True(r[1], $"a canvas did not redraw after {button}"));
            Assert.All(painted, p => Assert.True(p > 0, $"a canvas painted {p} pixels after {button}"));
        }

        Assert.True(_errors.Count == 0,
            $"console/page errors on /data-update:{Environment.NewLine}{string.Join(Environment.NewLine, _errors)}");
    }

    [Fact]
    public async Task Dashboard_pie_shows_tooltip_and_switches_theme_in_place()
    {
        await _page.GotoAsync(_fixture.BaseUrl + "/dashboard-pie", new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60_000,
        });
        await _page.WaitForSelectorAsync("canvas", new PageWaitForSelectorOptions { Timeout = 30_000 });
        await _page.WaitForTimeoutAsync(2_000);

        var card = _page.Locator(".dashboard-card");
        var box = await _page.Locator("canvas").BoundingBoxAsync();
        Assert.NotNull(box);
        // Up-left of the pie centre is the "< 5k" slice (the pie sits left of the legend).
        var (x, y) = (box.X + box.Width * 0.40f - 70, box.Y + box.Height * 0.5f - 30);

        await _page.Mouse.MoveAsync(x, y);
        await _page.WaitForTimeoutAsync(800);
        await card.ScreenshotAsync(new LocatorScreenshotOptions { Path = ShotPath("dashboard-pie-light-tooltip") });

        var tip = await ReadTooltipAsync(0);
        Assert.Equal(1, tip.GetProperty("count").GetInt32());
        Assert.Equal("1", tip.GetProperty("opacity").GetString());
        Assert.Equal("", tip.GetProperty("title").GetString());
        Assert.True(tip.GetProperty("inside").GetBoolean(), "the tooltip is not inside the chart");
        var row = Assert.Single(tip.GetProperty("rows").EnumerateArray());
        Assert.Equal("< 5k:", row.GetProperty("label").GetString());
        Assert.Equal("34.83", row.GetProperty("value").GetString());
        Assert.True(row.GetProperty("oneLine").GetBoolean(), "label and value are not on one line");
        Assert.Equal("400", row.GetProperty("labelWeight").GetString());
        Assert.Equal("700", row.GetProperty("valueWeight").GetString());
        Assert.False(row.GetProperty("marker").GetBoolean()); // DisplayColors = false

        await _page.Mouse.MoveAsync(0, 0);
        await _page.WaitForTimeoutAsync(800);
        Assert.Equal("0", (await ReadTooltipAsync(0)).GetProperty("opacity").GetString());
        Assert.Equal(1, await _page.EvaluateAsync<int>(SnapshotCanvases));
        await _page.ClickAsync("#theme-dark");
        await _page.WaitForTimeoutAsync(1_500);
        var result = Assert.Single(await _page.EvaluateAsync<bool[][]>(CompareWithSnapshot));
        Assert.True(result[0], "the chart was re-created instead of updated on the theme switch");
        Assert.True(result[1], "the canvas did not redraw on the theme switch");
        await card.ScreenshotAsync(new LocatorScreenshotOptions { Path = ShotPath("dashboard-pie-dark") });

        await _page.Mouse.MoveAsync(x, y);
        await _page.WaitForTimeoutAsync(800);
        await card.ScreenshotAsync(new LocatorScreenshotOptions { Path = ShotPath("dashboard-pie-dark-tooltip") });
        var darkTip = await ReadTooltipAsync(0);
        Assert.Equal(1, darkTip.GetProperty("count").GetInt32());
        Assert.Equal("1", darkTip.GetProperty("opacity").GetString());

        Assert.True(_errors.Count == 0,
            $"console/page errors on /dashboard-pie:{Environment.NewLine}{string.Join(Environment.NewLine, _errors)}");
    }

    [Fact]
    public async Task Html_tooltip_lists_every_series_under_a_title()
    {
        await _page.GotoAsync(_fixture.BaseUrl + "/data-update", new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60_000,
        });
        await _page.WaitForSelectorAsync("canvas", new PageWaitForSelectorOptions { Timeout = 30_000 });
        await _page.WaitForTimeoutAsync(2_000);

        var box = await _page.Locator("canvas").Nth(1).BoundingBoxAsync();
        Assert.NotNull(box);
        await _page.Mouse.MoveAsync(box.X + box.Width * 0.5f, box.Y + box.Height * 0.6f);
        await _page.WaitForTimeoutAsync(800);
        await _page.Locator("canvas").Nth(1).Locator("..").ScreenshotAsync(new LocatorScreenshotOptions { Path = ShotPath("data-update-stacked-tooltip") });

        var tip = await ReadTooltipAsync(1);
        Assert.Equal(1, tip.GetProperty("count").GetInt32());
        Assert.Equal("1", tip.GetProperty("opacity").GetString());
        Assert.False(string.IsNullOrEmpty(tip.GetProperty("title").GetString()), "no title row on an axis chart");
        Assert.True(tip.GetProperty("inside").GetBoolean(), "the tooltip is not inside the chart");
        var rows = tip.GetProperty("rows").EnumerateArray().ToList();
        Assert.Equal(["New:", "Returning:"], rows.Select(r => r.GetProperty("label").GetString()));
        Assert.All(rows, r => Assert.True(r.GetProperty("oneLine").GetBoolean(), "label and value are not on one line"));
        Assert.All(rows, r => Assert.True(r.GetProperty("marker").GetBoolean(), "no color marker"));

        Assert.True(_errors.Count == 0,
            $"console/page errors on /data-update:{Environment.NewLine}{string.Join(Environment.NewLine, _errors)}");
    }

    [Fact]
    public async Task Custom_tooltip_function_renders_string_and_dom_results()
    {
        await _page.GotoAsync(_fixture.BaseUrl + "/custom-tooltip", new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60_000,
        });
        await _page.WaitForSelectorAsync("canvas", new PageWaitForSelectorOptions { Timeout = 30_000 });
        await _page.WaitForTimeoutAsync(2_000);

        var bar = await _page.Locator("canvas").Nth(0).BoundingBoxAsync();
        Assert.NotNull(bar);
        await _page.Mouse.MoveAsync(bar.X + bar.Width * 0.53f, bar.Y + bar.Height * 0.6f);
        await _page.WaitForTimeoutAsync(800);
        await _page.Locator("canvas").Nth(0).Locator("..").ScreenshotAsync(new LocatorScreenshotOptions { Path = ShotPath("custom-tooltip-string") });

        var text = await ReadContentAsync(0);
        Assert.Equal("1", text.GetProperty("opacity").GetString());
        Assert.Contains("R&D <team>", text.GetProperty("text").GetString(), StringComparison.Ordinal);
        Assert.Contains("150 tickets (41.7% of total)", text.GetProperty("text").GetString(), StringComparison.Ordinal);
        Assert.False(text.GetProperty("injected").GetBoolean(), "data was parsed as HTML");

        var ring = await _page.Locator("canvas").Nth(1).BoundingBoxAsync();
        Assert.NotNull(ring);
        await _page.Mouse.MoveAsync(ring.X + ring.Width * 0.2f, ring.Y + ring.Height * 0.4f);
        await _page.WaitForTimeoutAsync(800);
        await _page.Locator("canvas").Nth(1).Locator("..").ScreenshotAsync(new LocatorScreenshotOptions { Path = ShotPath("custom-tooltip-dom") });

        var dom = await ReadContentAsync(1);
        Assert.Equal("1", dom.GetProperty("opacity").GetString());
        Assert.False(string.IsNullOrEmpty(dom.GetProperty("strong").GetString()), "the returned element was not inserted");
        Assert.Contains("organizations", dom.GetProperty("text").GetString(), StringComparison.Ordinal);

        Assert.True(_errors.Count == 0,
            $"console/page errors on /custom-tooltip:{Environment.NewLine}{string.Join(Environment.NewLine, _errors)}");
    }

    private async Task<JsonElement> ReadContentAsync(int canvasIndex)
    {
        var json = await _page.EvaluateAsync<string>(ReadTooltipContent, canvasIndex);
        return JsonDocument.Parse(json).RootElement.Clone();
    }

    private async Task<JsonElement> ReadTooltipAsync(int canvasIndex)
    {
        var json = await _page.EvaluateAsync<string>(ReadHtmlTooltip, canvasIndex);
        return JsonDocument.Parse(json).RootElement.Clone();
    }

    private string ShotPath(string name)
    {
        var dir = Path.Combine(_fixture.RepoRoot, "artifacts-shots");
        Directory.CreateDirectory(dir);
        return Path.Combine(dir, $"{name}.png");
    }

    private async Task SaveScreenshotAsync(string route)
    {
        var dir = Path.Combine(_fixture.RepoRoot, "artifacts-shots");
        Directory.CreateDirectory(dir);
        var name = route.Trim('/').Replace('/', '-');
        await _page.ScreenshotAsync(new PageScreenshotOptions { Path = Path.Combine(dir, $"{name}.png") });
    }
}
