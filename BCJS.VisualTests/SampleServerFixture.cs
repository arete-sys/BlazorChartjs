using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using Microsoft.Playwright;

namespace BCJS.VisualTests;

/// <summary>
/// Starts ONE BCJS.Sample dev server on a free loopback port and launches the installed Chrome via
/// Playwright (Channel = "chrome", so no browser download). Shared across a test class via
/// <see cref="IClassFixture{T}"/>. Mirrors what visual-test/run-visual-test.ps1 does, but in-process
/// and as a gating test.
/// </summary>
public sealed class SampleServerFixture : IAsyncLifetime
{
    private Process? _server;

    public string BaseUrl { get; private set; } = "";
    public string RepoRoot { get; private set; } = "";
    public IPlaywright Playwright { get; private set; } = default!;
    public IBrowser Browser { get; private set; } = default!;

    public async ValueTask InitializeAsync()
    {
        RepoRoot = LocateRepoRoot();
        var sampleProject = Path.Combine(RepoRoot, "BCJS.Sample", "BCJS.Sample.csproj");
        var port = GetFreePort();
        BaseUrl = $"http://127.0.0.1:{port}";

        _server = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = $"run --project \"{sampleProject}\" -c Release --urls {BaseUrl}",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                WorkingDirectory = RepoRoot,
            },
        };
        _server.StartInfo.Environment["ASPNETCORE_URLS"] = BaseUrl;
        _server.Start();
        // Drain the pipes so a full buffer never blocks the server process.
        _ = _server.StandardOutput.ReadToEndAsync();
        _ = _server.StandardError.ReadToEndAsync();

        await WaitForServerAsync(BaseUrl, TimeSpan.FromMinutes(3));

        Playwright = await Microsoft.Playwright.Playwright.CreateAsync();
        Browser = await Playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Channel = "chrome",
            Headless = true,
        });
    }

    public async ValueTask DisposeAsync()
    {
        if (Browser is not null)
            await Browser.DisposeAsync();
        Playwright?.Dispose();

        if (_server is { HasExited: false })
        {
            try { _server.Kill(entireProcessTree: true); } catch { /* best effort */ }
        }
        _server?.Dispose();
    }

    private static int GetFreePort()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
    }

    private static string LocateRepoRoot()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            if (File.Exists(Path.Combine(dir.FullName, "BCJS.slnx")))
                return dir.FullName;
        }

        throw new InvalidOperationException(
            $"Could not locate the repo root (BCJS.slnx) from {AppContext.BaseDirectory}.");
    }

    private static async Task WaitForServerAsync(string baseUrl, TimeSpan timeout)
    {
        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
        var deadline = DateTime.UtcNow + timeout;
        while (DateTime.UtcNow < deadline)
        {
            try
            {
                var response = await http.GetAsync(baseUrl + "/");
                if (response.IsSuccessStatusCode)
                    return;
            }
            catch (HttpRequestException) { /* not listening yet */ }
            catch (TaskCanceledException) { /* request timed out; retry */ }

            await Task.Delay(500);
        }

        throw new TimeoutException($"BCJS.Sample did not start at {baseUrl} within {timeout}.");
    }
}
