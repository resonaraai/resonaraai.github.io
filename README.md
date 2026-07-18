# Resonara Web-App

Resonara ist ein Web-App-first MVP für emotionale Selbstregulation mit einer stark visuellen, lokalen Session-Oberfläche, vorgeschaltetem Datenschutz-/KI-Hinweis und evidenz-informierter Nutzerführung.

Ziel dieser Version: Fast alles läuft im Browser und kann statisch auf GitHub Pages deployed werden. Dein Linux-Rechner zu Hause macht nur die Sprachverarbeitung, die im Browser nicht zuverlässig lokal geht.

## Architektur

```text
GitHub Pages Web-App
  - Check-in: Gefühl, Intensität, Körper-Ort, Ziel
  - Resonanzfeld, Intensitätsring, Körper-Fokus und Live-Waveform im Browser
  - Atem-Orb für 4-6 Atemrhythmus und lokaler Regulationsbogen
  - Regelbasierte Übungsauswahl
  - lokale Session History und Summary
  - Krisen-Vorprüfung im Browser
  - Browser-TTS als Fallback
  - offline-fähige Assets via Service Worker

Tailscale Funnel
  - HTTPS-Brücke zum Linux-Rechner

Linux-Sprachdienst
  - /api/transcribe: Stimme -> whisper.cpp -> Text
  - /api/speak: Antworttext -> Piper -> gesprochene Antwort
  - optional legacy: Ollama generiert Antworten
```

Im Standardmodus sendet die Web-App nicht den kompletten Verlauf an den Server. Bei Sprache wird nur die Sprachdatei zur Texterkennung gesendet. Für Sprachausgabe wird nur der von der Web-App erzeugte Antworttext an Piper gesendet. Textnachrichten können komplett im Browser verarbeitet werden.

## Ordner

```text
docs/                  # statische Web-App für GitHub Pages
server/                # lokaler Linux-Sprachdienst
.github/workflows/     # GitHub Actions für Test + Pages Deploy
scripts/               # kleine Repo-Validierung für CI
```

## 1. GitHub Pages mit GitHub Actions deployen

1. Repo zu GitHub pushen.
2. In GitHub: `Settings -> Pages -> Source -> GitHub Actions` auswählen.
3. Push auf `main` startet `.github/workflows/pages.yml`.
4. Die Action prüft die Web-App und deployed den Inhalt aus `docs/`.

Lokal kannst du die Checks auch ausführen:

```bash
npm test
```

Die Web-App hat keinen Build-Step und keine Runtime-Abhängigkeiten. GitHub Actions prüft nur, ob Manifest, Service Worker, Icons und JavaScript konsistent sind.

### Visualisierung und Trust-Onboarding

Diese Version rendert die beeindruckenderen Produktmomente direkt im Browser: ein Canvas-basiertes Resonanzfeld im Hero, eine Live-Waveform für das Mikrofon, ein dynamischer Intensitätsring, ein Körper-Fokus-Map, ein Atem-Orb für den 4-6 Rhythmus und ein lokaler Regulationsbogen. Dafür werden keine externen Libraries oder CDNs benötigt; GitHub Pages liefert weiterhin nur statische Dateien aus.

Neu ist ein vorgeschalteter Trust-Screen: Nutzer sehen vor der ersten Session Datenschutz, KI-Transparenz, Grenzen und die evidenz-informierten Grundprinzipien. Erst nach drei aktiven Checkboxen wird Resonara gestartet. Die CTA startet anschließend direkt einen sanften 2-Minuten-Reset, damit Nutzer nicht in einer leeren Oberfläche hängen bleiben.

## 2. Linux-Sprachdienst vorbereiten

Auf Ubuntu/Debian:

```bash
cd server
./scripts/setup_ubuntu.sh
```

Das Script installiert Systempakete, baut `whisper.cpp`, lädt ein Whisper-Base-Modell, installiert Python-Abhängigkeiten, installiert Piper, lädt eine deutsche Thorsten-Voice und erzeugt `server/.env` mit einem zufälligen `SERVER_API_TOKEN`.

Ollama ist für den Standardmodus nicht nötig. Nur wenn du den Legacy-Modus nutzen willst:

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

Die Statusausgabe zeigt dir die öffentliche HTTPS-URL, z. B.:

```text
https://dein-rechner.dein-tailnet.ts.net
```

Diese URL trägst du in der Web-App als `Geschützter Sprachlink` ein. Den Token findest du in `server/.env`.

## 5. Web-App nutzen

1. Resonara-Seite auf GitHub Pages öffnen.
2. Datenschutz-/KI-Hinweis lesen und die drei Checkboxen bestätigen.
3. Im Setup die Funnel-URL und den Token speichern.
4. `Sprache prüfen` klicken.
5. Gefühl und Intensität wählen.
6. Text schreiben, 2-Minuten-Reset starten oder sprechen.

Der Standardmodus bleibt: Resonara entscheidet im Browser; nur deine Stimme oder der Antworttext wird bei Sprachfunktionen verarbeitet.

## 6. Produktgrenzen

Dieser MVP ist für emotionale Selbstregulierung, nicht für Therapie, Diagnose oder Notfallhilfe. Die Krisen-Erkennung ist eine einfache Heuristik und ersetzt keine professionelle Safety-Schicht.

Für einen echten Pilotbetrieb solltest du mindestens ergänzen:

- finalen Datenschutztext und wirksame Einwilligung für deinen konkreten Betrieb
- keine Speicherung von Sprachdaten ohne Grund
- klares Löschkonzept für lokale und dienstseitige Daten
- Token-Rotation und origin-spezifisches CORS
- Monitoring deines Linux-Rechners
- menschlicher Handoff für Krisenfälle

## 7. Systemd optional

Die Datei `server/systemd/resonara-audio.service` ist eine Vorlage, wenn du den Server dauerhaft als Dienst laufen lassen willst. Beispielablauf:

```bash
sudo useradd --system --home /opt/resonara-web-app --shell /usr/sbin/nologin resonara || true
sudo mkdir -p /opt/resonara-web-app
sudo cp -r . /opt/resonara-web-app
sudo chown -R resonara:resonara /opt/resonara-web-app
sudo cp /opt/resonara-web-app/server/systemd/resonara-audio.service /etc/systemd/system/resonara-audio.service
sudo systemctl daemon-reload
sudo systemctl enable --now resonara-audio
```

Danach Funnel separat aktivieren:

```bash
tailscale funnel --bg --https=443 127.0.0.1:8787
```


## Offizielles Resonara Branding

Diese Version nutzt die öffentlich eingebundenen Resonara-Bilder aus `resonaraai.github.io` lokal in `docs/assets/`:

- `resonara-logo.png` / `resonara-logo-hd.png` für Hero, Onboarding und Visualisierung
- neu generierte Web-App Icons auf Basis des Resonara-Logos
- `resonara-og.png` als Social-/Installations-Preview

Die Farb- und Kartenlogik ist an die public Landingpage angelehnt: dunkler Grund, violett/teal Gradient, transparente Cards und kompakte runde CTAs.


## Usability

Die Datei `USABILITY_REVIEW.md` beschreibt die wichtigsten Vereinfachungen für eine breite Endkundenbasis.


## Bonusfeature: Resonara Momente

Die App enthält jetzt einen kundenfreundlichen Szenario-Bereich mit vier geführten Momenten: akut runterkommen, Gedanken sortieren, nach Konflikt entladen und abends runterfahren. Jeder Moment setzt Check-in, Intensität und Übung passend vor, damit mehrere Produktmöglichkeiten in einer Demo direkt sichtbar werden.


## Bonusfeature: Resonanzwege

Die Web-App enthält vier kundentaugliche Einstiege: Sofort runterkommen, Klarheit sammeln, Spannung entladen und Sanft abschalten. Jeder Weg stellt Check-in und Übung passend ein und führt direkt zum ersten Schritt. Für deine Präsentation steht eine kurze Übersicht in `SHOWCASE_OPTIONS.md`.
