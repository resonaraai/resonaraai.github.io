from __future__ import annotations

import asyncio
import base64
import hmac
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
from collections import defaultdict, deque
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Deque, Dict, List, Literal, Optional

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

Role = Literal["user", "assistant", "system"]

SYSTEM_PROMPT = """
Du bist Resonara, ein ruhiger, warmer Coach fuer emotionale Selbstregulierung auf Deutsch.
Du bist keine Therapeutin, stellst keine Diagnosen und ersetzt keine medizinische oder psychotherapeutische Hilfe.
Arbeite kurz, konkret und sicher: Atmung, Grounding, Koerperwahrnehmung, Benennen von Gefuehlen und freundliches Reframing.
Antworte in 2 bis 5 Saetzen. Gib maximal eine Uebung pro Antwort.
Bei Selbstgefaehrdung, Gewalt, akuter Panik mit Kontrollverlust, medizinischen Symptomen oder Gefahr: keine Coachinguebung vertiefen, sondern zu menschlicher Hilfe und Notfallhilfe ermutigen.
""".strip()

CRISIS_REPLY = (
    "Das klingt gerade nach einer Situation, in der du nicht allein bleiben solltest. "
    "Wenn du akut in Gefahr bist oder dir etwas antun koenntest, ruf bitte jetzt 112 an oder geh sofort zu einer Person in deiner Naehe. "
    "In Deutschland erreichst du die TelefonSeelsorge Tag und Nacht unter 0800 1110111, 0800 1110222 oder 116 123. "
    "Ich kann bei dir bleiben und ruhig mit dir atmen, aber das braucht jetzt zusaetzlich menschliche Unterstuetzung."
)

CRISIS_PATTERNS = [
    r"\bich\s+will\s+(sterben|nicht\s+mehr\s+leben)\b",
    r"\bich\s+(bringe|bring)\s+mich\s+um\b",
    r"\bmir\s+das\s+leben\s+nehmen\b",
    r"\bsuizid\b",
    r"\bselbstmord\b",
    r"\bsuizidal\b",
    r"\bich\s+verletze\s+mich\b",
    r"\bselbstverletz",
    r"\bi\s+want\s+to\s+die\b",
    r"\bkill\s+myself\b",
    r"\bend\s+my\s+life\b",
]


@dataclass(frozen=True)
class Settings:
    server_api_token: str
    max_audio_bytes: int
    request_limit_per_minute: int
    cors_origins: List[str]
    ffmpeg_bin: str
    whisper_cpp_bin: str
    whisper_model: str
    whisper_extra_args: List[str]
    enable_legacy_llm: bool
    ollama_url: str
    ollama_model: str
    ollama_temperature: float
    ollama_num_predict: int
    piper_bin: str
    piper_model: str
    piper_speaker: Optional[str]
    piper_extra_args: List[str]

    @staticmethod
    def from_env() -> "Settings":
        return Settings(
            server_api_token=os.getenv("SERVER_API_TOKEN", "").strip(),
            max_audio_bytes=int(os.getenv("MAX_AUDIO_BYTES", str(20 * 1024 * 1024))),
            request_limit_per_minute=int(os.getenv("REQUEST_LIMIT_PER_MINUTE", "30")),
            cors_origins=split_csv(os.getenv("CORS_ORIGINS") or os.getenv("CORS_ALLOW_ORIGINS", "*")),
            ffmpeg_bin=os.getenv("FFMPEG_BIN", "ffmpeg"),
            whisper_cpp_bin=os.getenv("WHISPER_CPP_BIN", "whisper-cli"),
            whisper_model=os.getenv("WHISPER_MODEL", "").strip(),
            whisper_extra_args=split_args(os.getenv("WHISPER_EXTRA_ARGS", "")),
            enable_legacy_llm=parse_bool(os.getenv("ENABLE_LEGACY_LLM", "false")),
            ollama_url=os.getenv("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/"),
            ollama_model=os.getenv("OLLAMA_MODEL", "llama3.1:8b"),
            ollama_temperature=float(os.getenv("OLLAMA_TEMPERATURE", "0.35")),
            ollama_num_predict=int(os.getenv("OLLAMA_NUM_PREDICT", "220")),
            piper_bin=os.getenv("PIPER_BIN", "piper"),
            piper_model=os.getenv("PIPER_MODEL", "").strip(),
            piper_speaker=os.getenv("PIPER_SPEAKER", "").strip() or None,
            piper_extra_args=split_args(os.getenv("PIPER_EXTRA_ARGS", "")),
        )


def parse_bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}


def split_csv(value: str) -> List[str]:
    items = [item.strip() for item in value.split(",") if item.strip()]
    return items or ["*"]


def split_args(value: str) -> List[str]:
    value = value.strip()
    if not value:
        return []
    if value.startswith("["):
        parsed = json.loads(value)
        if not isinstance(parsed, list) or not all(isinstance(item, str) for item in parsed):
            raise ValueError("Extra args JSON must be a list of strings")
        return parsed
    return value.split()


load_dotenv()
settings = Settings.from_env()
rate_limit: Dict[str, Deque[float]] = defaultdict(deque)

app = FastAPI(
    title="Resonara Local Audio Server",
    version="0.2.0",
    description="Minimal local STT and TTS server for the Resonara GitHub Pages Web-App. Legacy LLM endpoints are optional.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["content-type"],
    max_age=600,
)


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(max_length=2000)
    at: Optional[str] = None


class TextTurnRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1500)
    history: List[ChatMessage] = Field(default_factory=list)


class SpeakRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2400)
    safety_status: Optional[str] = Field(default="ok", max_length=32)


class TtsRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2400)


class LlmRequest(BaseModel):
    system: str = Field(default="", max_length=5000)
    prompt: str = Field(min_length=1, max_length=9000)
    temperature: Optional[float] = Field(default=None, ge=0, le=2)
    num_predict: Optional[int] = Field(default=None, ge=16, le=2048)


async def require_access(request: Request) -> None:
    apply_rate_limit(request)
    expected = settings.server_api_token
    if not expected:
        return
    supplied = request.headers.get("x-client-token") or request.query_params.get("token") or ""
    if not hmac.compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="Invalid or missing X-Client-Token")


def apply_rate_limit(request: Request) -> None:
    limit = max(settings.request_limit_per_minute, 1)
    client = request.client.host if request.client else "unknown"
    now = time.monotonic()
    bucket = rate_limit[client]
    while bucket and now - bucket[0] > 60:
        bucket.popleft()
    if len(bucket) >= limit:
        raise HTTPException(status_code=429, detail="Rate limit reached")
    bucket.append(now)


@app.get("/")
def root() -> Dict[str, Any]:
    return {
        "name": "Resonara Local Audio Server",
        "mode": "browser-first-audio-minimal",
        "health": "/health",
        "capabilities": "/api/capabilities",
        "endpoints": ["/api/transcribe", "/api/speak", "/api/turn", "/api/text-turn"],
    }


@app.get("/health")
def health(_: None = Depends(require_access)) -> Dict[str, Any]:
    deps = dependency_status()
    return {
        "ok": True,
        "auth_enabled": bool(settings.server_api_token),
        "name": "Resonara Local Audio Server",
        "version": "0.2.0",
        "mode": "browser-first-audio-minimal",
        "dependencies": deps,
        "capabilities": capabilities_from_deps(deps),
        "warnings": warnings_for(deps),
    }


@app.get("/api/capabilities")
def capabilities(_: None = Depends(require_access)) -> Dict[str, Any]:
    deps = dependency_status()
    return capabilities_from_deps(deps)


@app.post("/api/stt")
async def stt_endpoint(
    _: None = Depends(require_access),
    audio: UploadFile = File(...),
    language: str = Form("de"),
) -> Dict[str, Any]:
    payload = await audio.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Audio upload is empty")
    if len(payload) > settings.max_audio_bytes:
        raise HTTPException(status_code=413, detail="Audio upload too large")
    transcript = await asyncio.to_thread(process_transcription, payload, audio.filename or "audio.webm", language)
    if not transcript:
        raise HTTPException(status_code=422, detail="No speech detected")
    return {"transcript": transcript, "language": language, "bytes_received": len(payload)}


@app.post("/api/llm")
async def llm_endpoint(body: LlmRequest, _: None = Depends(require_access)) -> Dict[str, Any]:
    if not settings.enable_legacy_llm:
        raise HTTPException(status_code=501, detail="Legacy LLM endpoint is disabled. Use browser-first Web-App logic plus /api/transcribe and /api/speak.")
    reply = await asyncio.to_thread(
        call_ollama,
        body.prompt,
        body.system or SYSTEM_PROMPT,
        body.temperature,
        body.num_predict,
    )
    return {"reply": trim_text(reply.strip(), 1400), "model": settings.ollama_model}


@app.post("/api/tts")
async def tts_endpoint(body: TtsRequest, _: None = Depends(require_access)) -> Dict[str, Any]:
    return await asyncio.to_thread(synthesize_reply, body.text.strip())


@app.post("/api/transcribe")
async def transcribe_endpoint(
    _: None = Depends(require_access),
    audio: UploadFile = File(...),
    language: str = Form("de"),
) -> Dict[str, Any]:
    payload = await audio.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Audio upload is empty")
    if len(payload) > settings.max_audio_bytes:
        raise HTTPException(status_code=413, detail="Audio upload too large")
    transcript = await asyncio.to_thread(process_transcription, payload, audio.filename or "audio.webm", language)
    if not transcript:
        raise HTTPException(status_code=422, detail="No speech detected")
    return {"transcript": transcript, "language": language}


@app.post("/api/speak")
async def speak_endpoint(body: SpeakRequest, _: None = Depends(require_access)) -> Dict[str, Any]:
    result = await asyncio.to_thread(synthesize_reply, body.text.strip())
    return {"text_length": len(body.text.strip()), **result}


@app.post("/api/turn")
async def audio_turn(
    _: None = Depends(require_access),
    audio: UploadFile = File(...),
    language: str = Form("de"),
    history: str = Form("[]"),
) -> Dict[str, Any]:
    payload = await audio.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Audio upload is empty")
    if len(payload) > settings.max_audio_bytes:
        raise HTTPException(status_code=413, detail="Audio upload too large")

    parsed_history = parse_history_json(history)
    return await asyncio.to_thread(process_audio_turn, payload, audio.filename or "audio.webm", language, parsed_history)


@app.post("/api/text-turn")
async def text_turn(body: TextTurnRequest, _: None = Depends(require_access)) -> Dict[str, Any]:
    history = normalize_history([message_to_dict(item) for item in body.history])
    return await asyncio.to_thread(process_text_turn, body.message.strip(), history)


def process_transcription(payload: bytes, filename: str, language: str) -> str:
    ensure_stt_ready()
    suffix = suffix_from_filename(filename)
    with tempfile.TemporaryDirectory(prefix="resonara-stt-") as tmp:
        workdir = Path(tmp)
        input_path = workdir / f"input{suffix}"
        wav_path = workdir / "input.wav"
        input_path.write_bytes(payload)
        convert_to_wav(input_path, wav_path)
        return transcribe_with_whisper(wav_path, workdir, language).strip()


def process_audio_turn(payload: bytes, filename: str, language: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
    transcript = process_transcription(payload, filename, language)
    if not transcript:
        raise HTTPException(status_code=422, detail="No speech detected")

    reply, safety_status = generate_reply(transcript, history)
    audio_result = synthesize_reply(reply)
    return {
        "transcript": transcript,
        "reply": reply,
        "safety_status": safety_status,
        **audio_result,
    }


def process_text_turn(message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
    reply, safety_status = generate_reply(message, history)
    audio_result = synthesize_reply(reply)
    return {
        "transcript": message,
        "reply": reply,
        "safety_status": safety_status,
        **audio_result,
    }


def generate_reply(user_text: str, history: List[Dict[str, str]]) -> tuple[str, str]:
    if looks_like_crisis(user_text):
        return CRISIS_REPLY, "crisis"
    if not settings.enable_legacy_llm:
        raise HTTPException(status_code=501, detail="Legacy LLM turn endpoint is disabled. Use /api/transcribe and let the Web-App decide.")

    prompt = build_prompt(user_text, history)
    reply = call_ollama(prompt).strip()
    if not reply:
        reply = "Ich bin da. Lass uns fuer einen Moment den Kontakt zum Boden spueren und drei ruhige Atemzuege nehmen. Was ist danach auf einer Skala von 0 bis 10 noch spuerbar?"
    return trim_text(reply, 1400), "ok"


def build_prompt(user_text: str, history: List[Dict[str, str]]) -> str:
    safe_history = normalize_history(history)[-8:]
    lines = []
    for item in safe_history:
        role = "Nutzer" if item["role"] == "user" else "Coach"
        lines.append(f"{role}: {item['content']}")
    context = "\n".join(lines) if lines else "Noch kein Verlauf."
    return (
        "Bisheriger kurzer Verlauf:\n"
        f"{context}\n\n"
        "Aktuelle Nutzeraeusserung:\n"
        f"{user_text}\n\n"
        "Antworte als Selbstregulations-Coach: kurz, warm, konkret, keine Diagnose."
    )


def call_ollama(
    prompt: str,
    system_prompt: Optional[str] = None,
    temperature: Optional[float] = None,
    num_predict: Optional[int] = None,
) -> str:
    payload = {
        "model": settings.ollama_model,
        "system": system_prompt or SYSTEM_PROMPT,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": settings.ollama_temperature if temperature is None else float(temperature),
            "num_predict": settings.ollama_num_predict if num_predict is None else int(num_predict),
        },
    }
    try:
        with httpx.Client(timeout=120.0) as client:
            response = client.post(f"{settings.ollama_url}/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Ollama request failed: {exc}") from exc
    return str(data.get("response", ""))


def synthesize_reply(reply: str) -> Dict[str, Any]:
    clean = trim_text(reply.strip(), 2400)
    if not settings.piper_model or not Path(settings.piper_model).exists() or not executable_exists(settings.piper_bin):
        return {
            "audio_mime": None,
            "audio_base64": None,
            "audio_error": "Piper is not configured; returning text only.",
        }

    with tempfile.TemporaryDirectory(prefix="resonara-tts-") as tmp:
        output_path = Path(tmp) / "reply.wav"
        cmd = [settings.piper_bin, "-m", settings.piper_model, "-f", str(output_path)]
        if settings.piper_speaker is not None:
            cmd.extend(["--speaker", settings.piper_speaker])
        cmd.extend(settings.piper_extra_args)
        run_command(cmd, input_text=clean, timeout=90)
        if not output_path.exists() or output_path.stat().st_size == 0:
            return {
                "audio_mime": None,
                "audio_base64": None,
                "audio_error": "Piper did not create audio.",
            }
        return {
            "audio_mime": "audio/wav",
            "audio_base64": base64.b64encode(output_path.read_bytes()).decode("ascii"),
            "audio_error": None,
        }


def convert_to_wav(input_path: Path, wav_path: Path) -> None:
    cmd = [
        settings.ffmpeg_bin,
        "-nostdin",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(input_path),
        "-ar",
        "16000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        str(wav_path),
    ]
    run_command(cmd, timeout=90)


def transcribe_with_whisper(wav_path: Path, workdir: Path, language: str) -> str:
    out_base = workdir / "transcript"
    cmd = [
        settings.whisper_cpp_bin,
        "-m",
        settings.whisper_model,
        "-f",
        str(wav_path),
        "-nt",
        "-otxt",
        "-of",
        str(out_base),
    ]
    if language and language != "auto":
        cmd.extend(["-l", language])
    cmd.extend(settings.whisper_extra_args)
    result = run_command(cmd, timeout=240)

    txt_path = Path(f"{out_base}.txt")
    if txt_path.exists():
        return clean_transcript(txt_path.read_text(encoding="utf-8", errors="ignore"))
    return clean_transcript(result.stdout)


def run_command(cmd: List[str], input_text: Optional[str] = None, timeout: int = 120) -> subprocess.CompletedProcess[str]:
    try:
        result = subprocess.run(
            cmd,
            input=input_text,
            text=True,
            capture_output=True,
            timeout=timeout,
            check=False,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"Command not found: {cmd[0]}") from exc
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(status_code=504, detail=f"Command timed out: {cmd[0]}") from exc

    if result.returncode != 0:
        stderr = trim_text(result.stderr or result.stdout or "unknown error", 1200)
        raise HTTPException(status_code=500, detail=f"Command failed: {cmd[0]}: {stderr}")
    return result


def ensure_stt_ready() -> None:
    if not executable_exists(settings.ffmpeg_bin):
        raise HTTPException(status_code=500, detail="ffmpeg not found")
    if not executable_exists(settings.whisper_cpp_bin):
        raise HTTPException(status_code=500, detail="whisper-cli not found; set WHISPER_CPP_BIN")
    if not settings.whisper_model or not Path(settings.whisper_model).exists():
        raise HTTPException(status_code=500, detail="WHISPER_MODEL does not point to an existing ggml model")


def dependency_status() -> Dict[str, bool]:
    return {
        "ffmpeg": executable_exists(settings.ffmpeg_bin),
        "whisper_cpp_bin": executable_exists(settings.whisper_cpp_bin),
        "whisper_model": bool(settings.whisper_model and Path(settings.whisper_model).exists()),
        "piper_bin": executable_exists(settings.piper_bin),
        "piper_model": bool(settings.piper_model and Path(settings.piper_model).exists()),
        "legacy_llm_enabled": settings.enable_legacy_llm,
    }


def capabilities_from_deps(deps: Dict[str, bool]) -> Dict[str, Any]:
    transcribe = bool(deps.get("ffmpeg") and deps.get("whisper_cpp_bin") and deps.get("whisper_model"))
    speak = bool(deps.get("piper_bin") and deps.get("piper_model"))
    return {
        "transcribe": transcribe,
        "stt": transcribe,
        "llm": bool(settings.enable_legacy_llm and settings.ollama_url and settings.ollama_model),
        "speak": speak,
        "tts": speak,
        "browser_first_recommended": True,
        "legacy_server_turn": bool(settings.enable_legacy_llm),
        "endpoints": {
            "stt": "/api/stt",
            "legacy_llm": "/api/llm",
            "tts_alias": "/api/tts",
            "transcribe_alias": "/api/transcribe",
            "speak_alias": "/api/speak",
            "legacy_audio_turn": "/api/turn",
            "legacy_text_turn": "/api/text-turn",
        },
    }


def executable_exists(value: str) -> bool:
    if not value:
        return False
    path = Path(value)
    if path.is_absolute() or "/" in value:
        return path.exists() and os.access(path, os.X_OK)
    return shutil.which(value) is not None


def suffix_from_filename(filename: str) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix in {".webm", ".ogg", ".mp4", ".m4a", ".wav", ".mp3"}:
        return suffix
    return ".webm"


def parse_history_json(raw: str) -> List[Dict[str, str]]:
    try:
        parsed = json.loads(raw) if raw else []
    except json.JSONDecodeError:
        return []
    return normalize_history(parsed)


def message_to_dict(item: ChatMessage) -> Dict[str, Any]:
    if hasattr(item, "model_dump"):
        return item.model_dump()
    return item.dict()


def normalize_history(items: Any) -> List[Dict[str, str]]:
    if not isinstance(items, list):
        return []
    normalized: List[Dict[str, str]] = []
    for item in items[-12:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        if role not in {"user", "assistant"}:
            continue
        content = trim_text(str(item.get("content", "")).strip(), 1200)
        if content:
            normalized.append({"role": role, "content": content})
    return normalized


def clean_transcript(text: str) -> str:
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        line = re.sub(r"^\[[^\]]+\]\s*", "", line)
        if line.startswith(("whisper_", "system_info:", "main:")):
            continue
        lines.append(line)
    return trim_text(" ".join(lines), 1800)


def looks_like_crisis(text: str) -> bool:
    lowered = text.lower()
    return any(re.search(pattern, lowered) for pattern in CRISIS_PATTERNS)


def trim_text(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "..."


def warnings_for(deps: Dict[str, bool]) -> List[str]:
    warnings = []
    if not settings.server_api_token:
        warnings.append("SERVER_API_TOKEN is not set. Do not expose Funnel publicly without a token.")
    if settings.cors_origins == ["*"]:
        warnings.append("CORS_ORIGINS is '*'. This is convenient for testing, but token protection remains important.")
    for name, ok in deps.items():
        if name == "legacy_llm_enabled":
            continue
        if not ok:
            warnings.append(f"Missing or not executable: {name}")
    return warnings
