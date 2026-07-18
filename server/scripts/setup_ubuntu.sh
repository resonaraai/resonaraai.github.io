#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Installing system packages..."
sudo apt-get update
sudo apt-get install -y ffmpeg git cmake build-essential curl python3-venv python3-pip openssl

echo "Creating Python virtual environment..."
python3 -m venv .venv
. ./.venv/bin/activate
python -m pip install --upgrade pip wheel
python -m pip install -r requirements.txt
python -m pip install piper-tts

echo "Preparing whisper.cpp in /opt/whisper.cpp..."
if [ ! -d /opt/whisper.cpp ]; then
  sudo git clone https://github.com/ggml-org/whisper.cpp.git /opt/whisper.cpp
  sudo chown -R "$USER":"$USER" /opt/whisper.cpp
fi
cd /opt/whisper.cpp
cmake -B build
cmake --build build -j "$(nproc)" --config Release
if [ ! -f /opt/whisper.cpp/models/ggml-base.bin ]; then
  sh ./models/download-ggml-model.sh base
fi

cd "$ROOT_DIR"
echo "Preparing Piper German voice in /opt/piper-voices..."
sudo mkdir -p /opt/piper-voices
sudo chown -R "$USER":"$USER" /opt/piper-voices
if [ ! -f /opt/piper-voices/de_DE-thorsten-medium.onnx ]; then
  curl -L -o /opt/piper-voices/de_DE-thorsten-medium.onnx https://huggingface.co/Thorsten-Voice/Piper/resolve/main/de_DE-thorsten-medium.onnx
fi
if [ ! -f /opt/piper-voices/de_DE-thorsten-medium.onnx.json ]; then
  curl -L -o /opt/piper-voices/de_DE-thorsten-medium.onnx.json https://huggingface.co/Thorsten-Voice/Piper/resolve/main/de_DE-thorsten-medium.onnx.json
fi

if [ ! -f .env ]; then
  TOKEN="$(openssl rand -hex 32)"
  PIPER_PATH="$ROOT_DIR/.venv/bin/piper"
  sed \
    -e "s#replace-with-long-random-token#$TOKEN#g" \
    -e "s#PIPER_BIN=piper#PIPER_BIN=$PIPER_PATH#g" \
    .env.example > .env
  echo "Created .env with a generated SERVER_API_TOKEN."
fi

cat <<'MSG'
Setup complete.

Start the audio server with:
  ./scripts/run_server.sh

Ollama is optional now. The Resonara PWA-first mode only needs /api/transcribe and /api/speak.
To enable legacy server-generated replies later, install Ollama, pull a model, and set ENABLE_LEGACY_LLM=true.
MSG
