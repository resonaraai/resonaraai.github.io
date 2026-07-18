#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-8787}"
HTTPS_PORT="${HTTPS_PORT:-443}"
if ! command -v tailscale >/dev/null 2>&1; then
  echo "tailscale command not found." >&2
  exit 1
fi

tailscale funnel --bg --https="$HTTPS_PORT" "127.0.0.1:$PORT"
tailscale funnel status
