# Resonara Local Audio Server

FastAPI server fuer die PWA-first Resonara App. Der Standardmodus ist bewusst klein:

1. `/api/transcribe`: Audio rein, Text raus. Nutzt `ffmpeg` und `whisper.cpp`.
2. `/api/speak`: Text rein, WAV-Audio raus. Nutzt `Piper`.

Die Coach-Logik, Uebungsauswahl, Check-in-Daten, Session-Verlauf, Summary und Krisen-Vorpruefung laufen im Browser. Dadurch wird nur das an deinen Linux-Rechner geschickt, was fuer Audio noetig ist.

## Schnellstart

```bash
./scripts/setup_ubuntu.sh
./scripts/run_server.sh
```

Healthcheck:

```bash
TOKEN="$(grep SERVER_API_TOKEN .env | cut -d= -f2)"
curl -H "X-Client-Token: $TOKEN" http://127.0.0.1:8787/health
```

## Environment

Siehe `.env.example`.

Wichtig:

- `SERVER_API_TOKEN`: Shared Secret fuer die PWA. Bei Funnel unbedingt setzen.
- `CORS_ORIGINS`: Fuer Tests `*`, spaeter deine GitHub-Pages-Origin.
- `WHISPER_CPP_BIN`: Pfad zu `whisper-cli`.
- `WHISPER_MODEL`: Pfad zum ggml Whisper-Modell.
- `PIPER_MODEL`: Pfad zur Piper `.onnx` Stimme.
- `ENABLE_LEGACY_LLM`: Standard `false`. Nur auf `true` setzen, wenn der Server auch Antworten mit Ollama generieren soll.

## API

Alle Endpunkte akzeptieren den Header:

```text
X-Client-Token: SERVER_API_TOKEN
```

### GET `/health`

Prueft lokale Binaries, Modelle und Capabilities.

### POST `/api/transcribe`

Multipart Form:

- `audio`: WebM/Opus, OGG, MP4, WAV oder MP3
- `language`: `de`, `en` oder `auto`

Antwort:

```json
{
  "transcript": "Ich bin gerade angespannt.",
  "language": "de"
}
```

### POST `/api/speak`

JSON:

```json
{
  "text": "Wir machen jetzt den 4-6 Atemanker.",
  "safety_status": "ok"
}
```

Antwort:

```json
{
  "text_length": 40,
  "audio_mime": "audio/wav",
  "audio_base64": "...",
  "audio_error": null
}
```

### Legacy: POST `/api/turn` und `/api/text-turn`

Diese Endpunkte bleiben fuer Experimente erhalten, sind aber nicht der Standard. Sie senden Nutzertext bzw. kurzen Verlauf an Ollama und brauchen `ENABLE_LEGACY_LLM=true`.

## Funnel

```bash
./scripts/enable_funnel.sh
```

Danach die HTTPS-URL aus `tailscale funnel status` in der PWA eintragen.
