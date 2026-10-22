#!/usr/bin/env bash
# Pack and push the BCJS NuGet package to nuget.org in one step (manual/local release).
# Produces an identical package to the GitHub Actions workflow. The version is passed explicitly and
# also sets the assembly version behind the runtime cache-busting "?v=" query, so use a real version.
#
# Usage:
#   ./publish.sh <version> [api-key]
# Examples:
#   ./publish.sh 1.2.3 oy2...
#   ./publish.sh 1.2.3            # uses a key stored via: dotnet nuget setapikey <KEY> --source <nuget.org>
set -euo pipefail

VERSION="${1:?usage: ./publish.sh <version> [api-key]}"
API_KEY="${2:-}"
SOURCE="https://api.nuget.org/v3/index.json"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARTIFACTS="$ROOT/artifacts"
PROJECT="$ROOT/BCJS.RCL/BCJS.RCL.csproj"

rm -rf "$ARTIFACTS"

echo "Packing BCJS $VERSION ..."
dotnet pack "$PROJECT" -c Release -p:Version="$VERSION" -p:ContinuousIntegrationBuild=true -o "$ARTIFACTS"

echo "Pushing to $SOURCE ..."
if [ -n "$API_KEY" ]; then
  dotnet nuget push "$ARTIFACTS/*.nupkg" --api-key "$API_KEY" --source "$SOURCE" --skip-duplicate
else
  dotnet nuget push "$ARTIFACTS/*.nupkg" --source "$SOURCE" --skip-duplicate
fi

echo "Published BCJS $VERSION (.nupkg + .snupkg)."
