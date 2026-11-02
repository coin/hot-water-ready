#!/usr/bin/env bash
# Start (or restart) the throwaway test Home Assistant on http://localhost:8124.
# Usage: dev/testha.sh [--hacs] [image tag, default 2026.10.4]
# By default the integration is mounted read-only from this checkout. With --hacs it is not, so
# HACS can install a release into the config instead (see dev/hacs-install.py); run the script
# again without --hacs to go back to the checkout.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)"
mount=(-v "$here/../custom_components/hot_water_ready:/config/custom_components/hot_water_ready:ro")
if [ "${1:-}" = "--hacs" ]; then
  mount=()
  shift
fi
tag="${1:-2026.10.4}"
mkdir -p "$here/testha/config"
cp "$here/testha/configuration.yaml" "$here/testha/config/configuration.yaml"
docker rm -f hwr-testha >/dev/null 2>&1 || true
docker run -d --name hwr-testha -p 8124:8123 \
  -e TZ=Europe/Lisbon \
  -v "$here/testha/config:/config" \
  "${mount[@]}" \
  "ghcr.io/home-assistant/home-assistant:$tag"
echo "Test HA starting on http://localhost:8124 (image $tag, integration from" \
  "$([ ${#mount[@]} -gt 0 ] && echo "the checkout" || echo "HACS"))"
echo "The card: http://localhost:8124/hwr-test/0 (dashboard HWR test), user in" \
  "dev/testha/config/test-credentials.txt. Nothing heats while automatic control is off or" \
  "every member is away."
