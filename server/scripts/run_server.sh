#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -d .venv ]; then
  echo "Missing .venv. Run ./scripts/setup_ubuntu.sh first." >&2
  exit 1
fi
set -a
if [ -f .env ]; then
  . ./.env
fi
set +a
. ./.venv/bin/activate
exec uvicorn app:app --host 127.0.0.1 --port "${PORT:-8787}" --proxy-headers
