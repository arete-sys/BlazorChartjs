#requires -Version 7.0
<#
.SYNOPSIS
  Pack and push the BCJS NuGet package to nuget.org in one step (manual/local release).

.DESCRIPTION
  Produces an identical package to the GitHub Actions release workflow (same csproj settings).
  The version is passed explicitly with -p:Version, which also sets the assembly version that
  drives the runtime cache-busting "?v=" query, so it must be a real release version.

.PARAMETER Version
  The package version to publish, e.g. 1.2.3 (or 1.2.3-beta1). Required.

.PARAMETER ApiKey
  nuget.org API key. Optional if you've stored it once with:
    dotnet nuget setapikey <KEY> --source https://api.nuget.org/v3/index.json

.PARAMETER Source
  NuGet feed. Defaults to nuget.org.

.EXAMPLE
  ./publish.ps1 -Version 1.2.3 -ApiKey oy2...
.EXAMPLE
  ./publish.ps1 -Version 1.2.3          # uses a previously stored API key
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Version,
    [string]$ApiKey,
    [string]$Source = 'https://api.nuget.org/v3/index.json'
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$artifacts = Join-Path $root 'artifacts'
$project = Join-Path $root 'BCJS.RCL/BCJS.RCL.csproj'

Remove-Item $artifacts -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Packing BCJS $Version ..."
dotnet pack $project -c Release -p:Version=$Version -p:ContinuousIntegrationBuild=true -o $artifacts
if ($LASTEXITCODE -ne 0) { throw 'dotnet pack failed.' }

$push = @('nuget', 'push', (Join-Path $artifacts '*.nupkg'),
          '--source', $Source, '--skip-duplicate')
if ($ApiKey) { $push += @('--api-key', $ApiKey) }

Write-Host "Pushing to $Source ..."
dotnet @push
if ($LASTEXITCODE -ne 0) { throw 'dotnet nuget push failed.' }

Write-Host "Published BCJS $Version (.nupkg + .snupkg)."
