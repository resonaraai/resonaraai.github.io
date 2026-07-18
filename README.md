# Resonara PWA

Resonara ist ein PWA-first MVP fuer emotionale Selbstregulation mit einer stark visuellen, lokalen Session-Oberflaeche, vorgeschaltetem Datenschutz-/KI-Hinweis und evidenz-informierter Nutzerfuehrung.

Ziel dieser Version: Fast alles laeuft im Browser und kann statisch auf GitHub Pages deployed werden. Dein Linux-Rechner zu Hause macht nur die Audio-nahe Arbeit, die im Browser nicht zuverlaessig lokal geht.

## Architektur

```text
GitHub Pages PWA
  - Check-in: Gefuehl, Intensitaet, Koerper-Ort, Ziel
  - Resonanzfeld, Intensitaetsring, Koerper-Fokus und Live-Waveform im Browser
  - Atem-Orb fuer 4-6 Atemrhythmus und lokaler Regulationsbogen
  - Regelbasierte Uebungsauswahl
  - lokale Session History und Summary
  - Krisen-Vorpruefung im Browser
  - Browser-TTS als Fallback
  - offline-faehige Assets via Service Worker

Tailscale Funnel
  - HTTPS-Bruecke zum Linux-Rechner

Linux Audio Server
  - /api/transcribe: Audio -> whisper.cpp -> Text
  - /api/speak: Text -> Piper -> WAV
  - optional legacy: Ollama generiert Antworten
```

Im Standardmodus sendet die PWA nicht den kompletten Verlauf an den Server. Bei Sprache wird nur die Audiodatei fuer STT gesendet. Fuer Sprachausgabe wird nur der von der PWA erzeugte Antworttext an Piper gesendet. Textnachrichten koennen komplett im Browser verarbeitet werden.

## Ordner

```text
docs/                  # statische PWA fuer GitHub Pages
server/                # lokaler Linux Audio Server
.github/workflows/     # GitHub Actions fuer Test + Pages Deploy
scripts/               # kleine Repo-Validierung fuer CI
```

## 1. GitHub Pages mit GitHub Actions deployen

1. Repo zu GitHub pushen.
2. In GitHub: `Settings -> Pages -> Source -> GitHub Actions` auswaehlen.
3. Push auf `main` startet `.github/workflows/pages.yml`.
4. Die Action prueft die PWA und deployed den Inhalt aus `docs/`.

Lokal kannst du die Checks auch ausfuehren:

```bash
npm test
```

Die PWA hat keinen Build-Step und keine Runtime-Abhaengigkeiten. GitHub Actions prueft nur, ob Manifest, Service Worker, Icons und JavaScript konsistent sind.

### Visualisierung und Trust-Onboarding

Diese Version rendert die beeindruckenderen Produktmomente direkt im Browser: ein Canvas-basiertes Resonanzfeld im Hero, eine Live-Waveform fuer das Mikrofon, ein dynamischer Intensitaetsring, ein Koerper-Fokus-Map, ein Atem-Orb fuer den 4-6 Rhythmus und ein lokaler Regulationsbogen. Dafuer werden keine externen Libraries oder CDNs benoetigt; GitHub Pages liefert weiterhin nur statische Dateien aus.

Neu ist ein vorgeschalteter Trust-Screen: Nutzer sehen vor der ersten Session Datenschutz, KI-Transparenz, Grenzen und die evidenz-informierten Grundprinzipien. Erst nach drei aktiven Checkboxen wird Resonara gestartet. Die CTA startet anschliessend direkt einen sanften 2-Minuten-Reset, damit Nutzer nicht in einer leeren Oberflaeche haengen bleiben.

## 2. Linux Audio Server vorbereiten

Auf Ubuntu/Debian:

```bash
cd server
./scripts/setup_ubuntu.sh
```

Das Script installiert Systempakete, baut `whisper.cpp`, laedt ein Whisper-Base-Modell, installiert Python-Abhaengigkeiten, installiert Piper, laedt eine deutsche Thorsten-Voice und erzeugt `server/.env` mit einem zufaelligen `SERVER_API_TOKEN`.

Ollama ist fuer den Standardmodus nicht noetig. Nur wenn du den Legacy-Modus nutzen willst:

```bash
ollama pull llama3.1:8b
# dann in server/.env setzen:
# ENABLE_LEGACY_LLM=true
```

## 3. Server starten

```bash
cd server
./scripts/run_server.sh
```

In einem zweiten Terminal testen:

```bash
TOKEN="$(grep SERVER_API_TOKEN server/.env | cut -d= -f2)"
curl -H "X-Client-Token: $TOKEN" http://127.0.0.1:8787/health
```

Wenn `transcribe` in den Capabilities auf `true` steht, ist STT bereit. Wenn `speak` auf `true` steht, ist Piper-TTS bereit.

## 4. Tailscale Funnel aktivieren

Auf dem Linux-Rechner:

```bash
cd server
./scripts/enable_funnel.sh
```

Oder direkt:

```bash
tailscale funnel --bg --https=443 127.0.0.1:8787
tailscale funnel status
```

Die Statusausgabe zeigt dir die oeffentliche HTTPS-URL, z. B.:

```text
https://dein-rechner.dein-tailnet.ts.net
```

Diese URL traegst du in der PWA als `Voice-Server URL` ein. Den Token findest du in `server/.env`.

## 5. PWA nutzen

1. Resonara-Seite auf GitHub Pages oeffnen.
2. Datenschutz-/KI-Hinweis lesen und die drei Checkboxen bestaetigen.
3. Im Setup die Funnel-URL und den Token speichern.
4. `Verbindung testen` klicken.
5. Gefuehl und Intensitaet waehlen.
6. Text schreiben, 2-Minuten-Reset starten oder Audio aufnehmen.

Der Standardmodus heisst `PWA entscheidet, Server nur Audio`. Dabei bleibt die fachliche Session-Logik im Browser.

## 6. Produktgrenzen

Dieser MVP ist fuer emotionale Selbstregulierung, nicht fuer Therapie, Diagnose oder Notfallhilfe. Die Krisen-Erkennung ist eine einfache Heuristik und ersetzt keine professionelle Safety-Schicht.

Fuer einen echten Pilotbetrieb solltest du mindestens ergaenzen:

- finalen Datenschutztext und wirksame Einwilligung fuer deinen konkreten Betrieb
- keine Speicherung von Audio ohne Grund
- klares Loeschkonzept fuer lokale und serverseitige Daten
- Token-Rotation und origin-spezifisches CORS
- Monitoring deines Home-Servers
- menschlicher Handoff fuer Krisenfaelle

## 7. Systemd optional

Die Datei `server/systemd/resonara-audio.service` ist eine Vorlage, wenn du den Server dauerhaft als Dienst laufen lassen willst. Beispielablauf:

```bash
sudo useradd --system --home /opt/resonara-pwa --shell /usr/sbin/nologin resonara || true
sudo mkdir -p /opt/resonara-pwa
sudo cp -r . /opt/resonara-pwa
sudo chown -R resonara:resonara /opt/resonara-pwa
sudo cp /opt/resonara-pwa/server/systemd/resonara-audio.service /etc/systemd/system/resonara-audio.service
sudo systemctl daemon-reload
sudo systemctl enable --now resonara-audio
```

Danach Funnel separat aktivieren:

```bash
tailscale funnel --bg --https=443 127.0.0.1:8787
```


## Offizielles Resonara Branding

Diese Version nutzt die oeffentlich eingebundenen Resonara-Bilder aus `resonaraai.github.io` lokal in `docs/assets/`:

- `resonara-logo.png` / `resonara-logo-hd.png` fuer Hero, Onboarding und Visualisierung
- neu generierte PWA Icons auf Basis des Resonara-Logos
- `resonara-og.png` als Social-/Installations-Preview

Die Farb- und Kartenlogik ist an die public Landingpage angelehnt: dunkler Grund, violett/teal Gradient, transparente Cards und kompakte runde CTAs.
