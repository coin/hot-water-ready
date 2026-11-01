#!/usr/bin/env bash
# Start (or restart) the throwaway test Home Assistant on http://localhost:8124 with the
# integration mounted from this checkout. Usage: dev/testha.sh [image tag, default 2026.10.4]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)"
tag="${1:-2026.10.4}"
mkdir -p "$here/testha/config"
cp "$here/testha/configuration.yaml" "$here/testha/config/configuration.yaml"
docker rm -f hwr-testha >/dev/null 2>&1 || true
docker run -d --name hwr-testha -p 8124:8123 \
  -e TZ=Europe/Lisbon \
  -v "$here/testha/config:/config" \
  -v "$here/../custom_components/hot_water_ready:/config/custom_components/hot_water_ready:ro" \
  "ghcr.io/home-assistant/home-assistant:$tag"
echo "Test HA starting on http://localhost:8124 (image $tag)"
