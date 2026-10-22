# Publishing BCJS to NuGet

The package id is **`BCJS`**; the only packable project is `BCJS.RCL/BCJS.RCL.csproj`. There are two
ways to publish — a GitHub Actions release workflow and a local command — and they produce an
**identical** package (same csproj settings), so it doesn't matter which you use for a given release.

## Versioning — single source of truth

The csproj `<Version>` is a deliberate placeholder (`0.0.0`). **The real version is supplied at publish
time** via the tag, the workflow input, or `-p:Version=`. That version also becomes the assembly version,
which feeds the runtime cache-busting query (`chart-interop.js?v=<version>`), so always publish with a
real version — never `0.0.0`.

Rules that apply to **both** paths:
- A given version can be published to nuget.org **only once**. Bump the version every release.
- `--skip-duplicate` makes re-pushing an already-published version a no-op instead of an error.
- The `.snupkg` (symbols) is pushed automatically alongside the matching `.nupkg`.

## One-time setup

1. **GitHub secret:** add your nuget.org API key as **`NUGET_API_KEY`**
   (Settings → Secrets and variables → Actions → New repository secret).
2. **Environment (recommended):** create an environment named **`nuget-release`**
   (Settings → Environments) and add protection rules (e.g. required reviewers) — the release job is
   gated on it.
3. **Key rotation:** nuget.org API keys expire after at most 365 days. Set a reminder to rotate the key
   and update the secret.

> The API key is a secret — never commit it to the repo.

## Option A — GitHub Actions (`.github/workflows/release.yml`)

Two triggers:

- **Tag:** push a `vX.Y.Z` tag — the version is the tag without the leading `v`.
  ```bash
  git tag v1.2.3
  git push origin v1.2.3
  ```
- **Manual:** Actions tab → **Release (NuGet)** → **Run workflow** → enter `1.2.3`.

The job restores, builds, runs unit tests, packs with the resolved version, and pushes to nuget.org.
(It is scoped to the library + unit tests; the Blazor sample build and the Playwright visual tests are
not part of the publish pipeline.)

## Option B — local / manual

From the repo root, pass the version explicitly, with `-p:ContinuousIntegrationBuild=true` for a
deterministic build (the scripts below do this; GitHub Actions sets it automatically):

```bash
dotnet pack -c Release -p:Version=1.2.3 -p:ContinuousIntegrationBuild=true -o ./artifacts
dotnet nuget push "./artifacts/*.nupkg" --api-key <KEY> --source https://api.nuget.org/v3/index.json --skip-duplicate
```

Store the key once so later pushes can omit `--api-key`:

```bash
dotnet nuget setapikey <KEY> --source https://api.nuget.org/v3/index.json
```

Or use the wrapper scripts (pack + push in one step):

```powershell
./publish.ps1 -Version 1.2.3 -ApiKey <KEY>   # -ApiKey optional if stored via setapikey
```
```bash
./publish.sh 1.2.3 <KEY>                      # key optional if stored via setapikey
```

## Notes

- **Strong naming:** the assembly is strong-named with `key/BCJS.snk` (committed; an OSS strong-name key
  is not a secret). This key is **permanent** — once a strong-named version is published it must never
  change.
- **SourceLink:** packs embed working source links from the GitHub `origin` remote, and `snupkg` enables
  source debugging via nuget.org's symbol server. CI uses the plain `github.com` remote; for local clones
  that use a custom SSH host alias (e.g. `github.com-Arete`), the RCL maps that alias to GitHub via
  `SourceLinkGitHubHost`, so local packs resolve source links too.
- **Prerelease:** versions like `1.2.3-beta1` publish fine. Note the assembly version drops the suffix
  (`1.2.3.0`), so two prereleases of the same base version share a cache-busting `?v=` — harmless.
