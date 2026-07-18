const els = {
  splashScreen: document.querySelector('#splashScreen'),
  trustGate: document.querySelector('#trustGate'),
  trustForm: document.querySelector('#trustForm'),
  acceptTrust: document.querySelector('#acceptTrust'),
  trustAiCheck: document.querySelector('#trustAiCheck'),
  trustDataCheck: document.querySelector('#trustDataCheck'),
  trustCrisisCheck: document.querySelector('#trustCrisisCheck'),
  heroStart: document.querySelector('#heroStart'),
  revisitTrust: document.querySelector('#revisitTrust'),
  serverUrl: document.querySelector('#serverUrl'),
  apiToken: document.querySelector('#apiToken'),
  language: document.querySelector('#language'),
  processingMode: document.querySelector('#processingMode'),
  useServerTts: document.querySelector('#useServerTts'),
  useBrowserTts: document.querySelector('#useBrowserTts'),
  saveSettings: document.querySelector('#saveSettings'),
  testConnection: document.querySelector('#testConnection'),
  connectionStatus: document.querySelector('#connectionStatus'),
  settingsToggle: document.querySelector('#settingsToggle'),
  settingsPanel: document.querySelector('#settingsPanel'),
  installButton: document.querySelector('#installButton'),
  emotionField: document.querySelector('#emotionField'),
  intensity: document.querySelector('#intensity'),
  intensityValue: document.querySelector('#intensityValue'),
  bodyFocus: document.querySelector('#bodyFocus'),
  sessionGoal: document.querySelector('#sessionGoal'),
  suggestExercise: document.querySelector('#suggestExercise'),
  messages: document.querySelector('#messages'),
  exercisePanel: document.querySelector('#exercisePanel'),
  exerciseTitle: document.querySelector('#exerciseTitle'),
  exerciseReason: document.querySelector('#exerciseReason'),
  exerciseSteps: document.querySelector('#exerciseSteps'),
  recordButton: document.querySelector('#recordButton'),
  recordLabel: document.querySelector('#recordLabel'),
  recordStatus: document.querySelector('#recordStatus'),
  clearSession: document.querySelector('#clearSession'),
  copySummary: document.querySelector('#copySummary'),
  textForm: document.querySelector('#textForm'),
  textInput: document.querySelector('#textInput'),
  player: document.querySelector('#player'),
  exportSession: document.querySelector('#exportSession'),
  resetLocalData: document.querySelector('#resetLocalData'),
  metricTurns: document.querySelector('#metricTurns'),
  metricExercise: document.querySelector('#metricExercise'),
  metricIntensity: document.querySelector('#metricIntensity'),
  ambientCanvas: document.querySelector('#ambientCanvas'),
  resonanceCanvas: document.querySelector('#resonanceCanvas'),
  voiceCanvas: document.querySelector('#voiceCanvas'),
  timelineCanvas: document.querySelector('#timelineCanvas'),
  intensityOrb: document.querySelector('#intensityOrb'),
  emotionVizLabel: document.querySelector('#emotionVizLabel'),
  emotionVizSub: document.querySelector('#emotionVizSub'),
  intensityArc: document.querySelector('#intensityArc'),
  dialValue: document.querySelector('#dialValue'),
  dialLabel: document.querySelector('#dialLabel'),
  bodyVizLabel: document.querySelector('#bodyVizLabel'),
  visualMode: document.querySelector('#visualMode'),
  voiceModeLabel: document.querySelector('#voiceModeLabel'),
  breathOrb: document.querySelector('#breathOrb'),
  breathCue: document.querySelector('#breathCue'),
  breathPhase: document.querySelector('#breathPhase'),
  stabilityIndex: document.querySelector('#stabilityIndex'),
  sessionTempo: document.querySelector('#sessionTempo'),
  privacyGauge: document.querySelector('#privacyGauge')
};

const storageKeys = {
  serverUrl: 'resonara.serverUrl',
  apiToken: 'resonara.apiToken',
  language: 'resonara.language',
  processingMode: 'resonara.processingMode',
  useServerTts: 'resonara.useServerTts',
  useBrowserTts: 'resonara.useBrowserTts',
  trustAccepted: 'resonara.trustAccepted',
  history: 'resonara.history',
  checkin: 'resonara.checkin',
  activeExercise: 'resonara.activeExercise'
};

const defaultCheckin = {
  emotion: 'stress',
  intensity: 6,
  bodyFocus: 'Brust',
  sessionGoal: 'runterregeln'
};

const state = {
  mediaRecorder: null,
  mediaStream: null,
  chunks: [],
  isRecording: false,
  busy: false,
  history: [],
  checkin: { ...defaultCheckin },
  activeExerciseId: null,
  deferredInstallPrompt: null,
  trustAccepted: false
};

const visual = {
  frame: null,
  startedAt: performance.now(),
  audioContext: null,
  analyser: null,
  source: null,
  dataArray: null,
  audioLevel: 0,
  particles: [],
  lastBreathCue: '',
  prefersReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const crisisReply = [
  'Das klingt gerade nach einer Situation, in der du nicht allein bleiben solltest.',
  'Wenn du akut in Gefahr bist oder dir etwas antun könntest, ruf bitte jetzt 112 an oder geh sofort zu einer Person in deiner Nähe.',
  'In Deutschland erreichst du die TelefonSeelsorge Tag und Nacht unter 0800 1110111, 0800 1110222 oder 116 123.',
  'Ich kann hier ruhig bleiben, aber das braucht jetzt zusätzlich menschliche Unterstützung.'
].join(' ');

const crisisPatterns = [
  /\bich\s+will\s+(sterben|nicht\s+mehr\s+leben)\b/i,
  /\bich\s+(bringe|bring)\s+mich\s+um\b/i,
  /\bmir\s+das\s+leben\s+nehmen\b/i,
  /\bsuizid\b/i,
  /\bselbstmord\b/i,
  /\bsuizidal\b/i,
  /\bich\s+verletze\s+mich\b/i,
  /\bselbstverletz/i,
  /\bi\s+want\s+to\s+die\b/i,
  /\bkill\s+myself\b/i,
  /\bend\s+my\s+life\b/i
];

const exercises = {
  'breath-46': {
    title: '4-6 Atemanker',
    reason: 'Längeres Ausatmen sendet dem Körper ein Signal von Sicherheit und Tempo rausnehmen.',
    tags: ['stress', 'angst', 'ueberforderung', 'runterregeln'],
    steps: [
      'Lege eine Hand auf Brust oder Bauch und spüre den Kontakt.',
      'Atme 4 Zähler ein, ohne zu ziehen oder zu pressen.',
      'Atme 6 Zähler aus, als würdest du leise Nebel an eine Scheibe hauchen.',
      'Wiederhole das 6 Runden und lasse Schultern und Kiefer etwas weicher werden.'
    ]
  },
  'grounding-54321': {
    title: '5-4-3-2-1 Grounding',
    reason: 'Wenn das Nervensystem hochfährt, hilft klare Orientierung im Raum.',
    tags: ['angst', 'ueberforderung', 'klarheit'],
    steps: [
      'Nenne 5 Dinge, die du sehen kannst.',
      'Nenne 4 Dinge, die du spürst, zum Beispiel Kleidung, Stuhl oder Boden.',
      'Nenne 3 Dinge, die du hörst.',
      'Nenne 2 Dinge, die du riechst oder schmeckst, und 1 Sache, die jetzt sicher genug ist.'
    ]
  },
  'orient-room': {
    title: 'Raum scannen',
    reason: 'Sanftes Umschauen bringt Aufmerksamkeit aus dem inneren Alarm zurück in die Gegenwart.',
    tags: ['angst', 'ueberforderung', 'stress'],
    steps: [
      'Drehe den Kopf langsam nach links und rechts, ohne etwas zu leisten.',
      'Lass deinen Blick bei einem neutralen oder angenehmen Gegenstand landen.',
      'Benenne innerlich: Ich bin hier. Es ist jetzt. Mein Körper darf langsamer werden.',
      'Spüre für 10 Sekunden den Boden unter den Füßen.'
    ]
  },
  'name-feeling': {
    title: 'Gefühl benennen',
    reason: 'Benennen schafft Abstand: Das Gefühl ist da, aber es ist nicht alles, was du bist.',
    tags: ['traurigkeit', 'unklar', 'klarheit', 'mut'],
    steps: [
      'Sag innerlich: Da ist gerade ... und setze ein möglichst einfaches Wort ein.',
      'Ergänze: Es ist verständlich, dass mein System so reagiert.',
      'Frage dich: Was braucht der nächste kleine Schritt – Ruhe, Kontakt, Grenze oder Klarheit?',
      'Wähle eine Sache, die in zwei Minuten machbar ist.'
    ]
  },
  'release-shoulders': {
    title: 'Schultern entladen',
    reason: 'Bei Wut oder Druck hilft es oft, Spannung dosiert aus dem Körper zu nehmen.',
    tags: ['wut', 'stress', 'runterregeln'],
    steps: [
      'Ziehe beide Schultern für 3 Sekunden leicht hoch.',
      'Lass sie mit einem langen Ausatmen sinken.',
      'Drücke die Füße 5 Sekunden in den Boden und löse wieder.',
      'Prüfe: Ist die Energie eher heiß, schwer, zittrig oder dumpf?'
    ]
  },
  'soft-body-scan': {
    title: 'Weicher Body Scan',
    reason: 'Für Schlaf und Erschöpfung ist weniger Analyse und mehr Körperkontakt oft besser.',
    tags: ['traurigkeit', 'einschlafen', 'stress'],
    steps: [
      'Lass Stirn, Augen und Kiefer ein Prozent weicher werden.',
      'Spüre Brust, Bauch und Becken, ohne etwas zu verändern.',
      'Atme so, als würdest du innerlich Platz machen.',
      'Sag dir: Für diesen Moment muss ich nichts lösen.'
    ]
  },
  'session-close': {
    title: 'Mini-Abschluss',
    reason: 'Ein kleiner Abschluss hilft, die Regulation in den Alltag mitzunehmen.',
    tags: ['klarheit', 'mut', 'runterregeln'],
    steps: [
      'Nenne eine Sache, die sich jetzt minimal anders anfühlt.',
      'Gib der Intensität eine neue Zahl von 0 bis 10.',
      'Wähle einen nächsten Schritt, der kleiner ist als du denkst.',
      'Bedanke dich kurz bei deinem Körper für das Mitmachen.'
    ]
  }
};

const emotionLabels = {
  stress: 'Stress',
  angst: 'Angst',
  wut: 'Wut',
  traurigkeit: 'Traurigkeit',
  ueberforderung: 'Überforderung',
  unklar: 'Unklarheit'
};

const keywordMap = {
  angst: ['angst', 'panik', 'sorge', 'nervös', 'nervoes', 'herzrasen', 'unsicher'],
  wut: ['wut', 'sauer', 'ärger', 'aerger', 'wütend', 'wuetend', 'hass', 'rasend'],
  traurigkeit: ['traurig', 'leer', 'einsam', 'weinen', 'verlust', 'schwer'],
  ueberforderung: ['überfordert', 'ueberfordert', 'zu viel', 'alles', 'druck', 'stress', 'chaos'],
  stress: ['stress', 'angespannt', 'getrieben', 'deadline', 'unruhe']
};

const emotionVisuals = {
  stress: { a: '#2dd4bf', b: '#7c5cff', c: '#f3f6ff', tempo: 1.08 },
  angst: { a: '#7c5cff', b: '#2dd4bf', c: '#f255b6', tempo: 1.22 },
  wut: { a: '#f255b6', b: '#7c5cff', c: '#ffd166', tempo: 1.30 },
  traurigkeit: { a: '#7c5cff', b: '#4ea7ff', c: '#2dd4bf', tempo: 0.82 },
  ueberforderung: { a: '#7c5cff', b: '#f255b6', c: '#2dd4bf', tempo: 1.36 },
  unklar: { a: '#2dd4bf', b: '#7c5cff', c: '#f3f6ff', tempo: 0.95 }
};

const bodyNodeMap = {
  Kopf: ['head'],
  Hals: ['throat'],
  Brust: ['chest'],
  Bauch: ['belly'],
  Schultern: ['shoulders'],
  'ganzer Körper': ['head', 'throat', 'chest', 'belly', 'shoulders']
};

function init() {
  loadSettings();
  loadCheckin();
  state.history = safeParse(localStorage.getItem(storageKeys.history), []);
  state.activeExerciseId = localStorage.getItem(storageKeys.activeExercise) || null;
  bindEvents();
  initSplash();
  renderCheckin();
  renderHistory();
  initTrustGate();
  if (state.trustAccepted) addInitialMessage();
  renderExercise();
  updateMetrics();
  registerServiceWorker();
  setConnectionStatus('Bereit');
  initVisuals();
}

function bindEvents() {
  els.saveSettings.addEventListener('click', () => saveSettings(true));
  els.trustForm.addEventListener('submit', acceptTrustGate);
  [els.trustAiCheck, els.trustDataCheck, els.trustCrisisCheck].forEach((input) => input.addEventListener('change', updateTrustCta));
  els.heroStart.addEventListener('click', startHeroReset);
  els.revisitTrust.addEventListener('click', showTrustGate);
  els.testConnection.addEventListener('click', testConnection);
  els.settingsToggle.addEventListener('click', toggleSettings);
  els.recordButton.addEventListener('click', toggleRecording);
  els.clearSession.addEventListener('click', clearSession);
  els.copySummary.addEventListener('click', copySummary);
  els.textForm.addEventListener('submit', submitText);
  els.suggestExercise.addEventListener('click', () => runBrowserCoach('Ich möchte einen 2-Minuten-Reset starten.', 'suggest'));
  els.exportSession.addEventListener('click', exportSession);
  els.resetLocalData.addEventListener('click', resetLocalData);
  els.intensity.addEventListener('input', handleIntensity);
  els.bodyFocus.addEventListener('change', updateCheckinFromControls);
  els.sessionGoal.addEventListener('change', updateCheckinFromControls);
  els.emotionField.addEventListener('click', handleEmotionClick);
  document.querySelectorAll('[data-quick]').forEach((button) => {
    button.addEventListener('click', () => runQuickExercise(button.dataset.quick));
  });
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    els.installButton.hidden = false;
  });
  els.installButton.addEventListener('click', installPwa);
  window.addEventListener('resize', resizeVisuals);
  els.player.addEventListener('play', () => setVisualMode('Resonara spricht …', 'speaking'));
  els.player.addEventListener('ended', () => setVisualMode('Bereit', 'idle'));
  els.player.addEventListener('pause', () => { if (!state.busy && !state.isRecording) setVisualMode('Bereit', 'idle'); });
}



function initSplash() {
  if (!els.splashScreen) return;
  const delay = visual.prefersReducedMotion ? 420 : 1350;
  window.setTimeout(() => {
    els.splashScreen.classList.add('splash-screen--hidden');
    window.setTimeout(() => {
      els.splashScreen.hidden = true;
    }, visual.prefersReducedMotion ? 0 : 460);
  }, delay);
}

function initTrustGate() {
  state.trustAccepted = localStorage.getItem(storageKeys.trustAccepted) === 'true';
  if (state.trustAccepted) hideTrustGate(false);
  else showTrustGate(false);
  updateTrustCta();
}

function updateTrustCta() {
  const ok = els.trustAiCheck.checked && els.trustDataCheck.checked && els.trustCrisisCheck.checked;
  els.acceptTrust.disabled = !ok;
}

function acceptTrustGate(event) {
  event.preventDefault();
  updateTrustCta();
  if (els.acceptTrust.disabled) return;
  state.trustAccepted = true;
  localStorage.setItem(storageKeys.trustAccepted, 'true');
  hideTrustGate(true);
  addInitialMessage();
  document.querySelector('#coach').scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => {
    if (!state.history.some((item) => item.role === 'user')) runBrowserCoach('Ich möchte mit einem 2-Minuten-Reset beginnen.', 'suggest');
  }, visual.prefersReducedMotion ? 0 : 360);
}

function showTrustGate(focus = true) {
  els.trustGate.hidden = false;
  document.body.dataset.consent = 'pending';
  if (focus) setTimeout(() => els.trustAiCheck.focus(), 0);
}

function hideTrustGate(focusCoach = false) {
  els.trustGate.hidden = true;
  document.body.dataset.consent = 'accepted';
  if (focusCoach) setTimeout(() => els.textInput.focus(), 160);
}

function ensureTrustAccepted() {
  if (state.trustAccepted) return true;
  showTrustGate(true);
  return false;
}

function startHeroReset() {
  if (!ensureTrustAccepted()) return;
  document.querySelector('#coach').scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  runBrowserCoach('Ich möchte einen 2-Minuten-Reset starten.', 'suggest');
}

function loadSettings() {
  els.serverUrl.value = localStorage.getItem(storageKeys.serverUrl) || '';
  els.apiToken.value = localStorage.getItem(storageKeys.apiToken) || '';
  els.language.value = localStorage.getItem(storageKeys.language) || 'de';
  const savedMode = localStorage.getItem(storageKeys.processingMode) || 'browser-first';
  els.processingMode.value = els.processingMode.type === 'hidden' ? 'browser-first' : savedMode;
  els.useServerTts.checked = localStorage.getItem(storageKeys.useServerTts) !== 'false';
  els.useBrowserTts.checked = localStorage.getItem(storageKeys.useBrowserTts) !== 'false';
}

function loadCheckin() {
  const saved = safeParse(localStorage.getItem(storageKeys.checkin), null);
  state.checkin = { ...defaultCheckin, ...(saved || {}) };
  if (state.checkin.bodyFocus === 'ganzer Koerper') state.checkin.bodyFocus = 'ganzer Körper';
}

function saveSettings(showToast = true) {
  const normalizedUrl = normalizeServerUrl(els.serverUrl.value);
  els.serverUrl.value = normalizedUrl;
  localStorage.setItem(storageKeys.serverUrl, normalizedUrl);
  localStorage.setItem(storageKeys.apiToken, els.apiToken.value.trim());
  localStorage.setItem(storageKeys.language, els.language.value);
  localStorage.setItem(storageKeys.processingMode, els.processingMode.value);
  localStorage.setItem(storageKeys.useServerTts, String(els.useServerTts.checked));
  localStorage.setItem(storageKeys.useBrowserTts, String(els.useBrowserTts.checked));
  setConnectionStatus(normalizedUrl ? 'Stimme vorbereitet' : 'Stimme optional');
  if (showToast) toastSystem('Stimme gespeichert. Dein Verlauf bleibt auf diesem Gerät.');
}

async function testConnection() {
  saveSettings(false);
  const serverUrl = getServerUrl();
  if (!serverUrl) {
    setConnectionStatus('Sprachlink fehlt', false);
    toastSystem('Bitte trage zuerst deinen Sprachlink ein. Schreiben funktioniert auch ohne Stimme.');
    return;
  }
  setConnectionStatus('Teste …', null);
  try {
    const data = await fetchJson(`${serverUrl}/health`, { headers: authHeaders(), mode: 'cors' });
    const deps = data.dependencies || {};
    const hasStt = deps.ffmpeg && deps.whisper_cpp_bin && deps.whisper_model;
    const hasTts = deps.piper_bin && deps.piper_model;
    setConnectionStatus(hasStt ? `Verbunden${hasTts ? '' : ', Stimme fehlt'}` : 'Unvollständig', hasStt);
    const missing = Object.entries(deps).filter(([name, ok]) => name !== 'legacy_llm_enabled' && !ok).map(([name]) => name);
    if (missing.length) toastSystem('Die Sprachfunktion ist erreichbar, aber noch nicht vollständig eingerichtet.');
  } catch (error) {
    setConnectionStatus('Fehler', false);
    toastSystem(`Sprache konnte nicht aktiviert werden: ${error.message}`);
  }
}

function toggleSettings() {
  const expanded = els.settingsToggle.getAttribute('aria-expanded') === 'true';
  setSettingsOpen(!expanded);
}

function setSettingsOpen(open) {
  els.settingsToggle.setAttribute('aria-expanded', String(open));
  els.settingsPanel.classList.toggle('collapsed', !open);
}

function handleEmotionClick(event) {
  const button = event.target.closest('[data-emotion]');
  if (!button) return;
  state.checkin.emotion = button.dataset.emotion;
  persistCheckin();
  renderCheckin();
  updateMetrics();
}

function handleIntensity() {
  state.checkin.intensity = Number(els.intensity.value);
  persistCheckin();
  renderCheckin();
  updateMetrics();
}

function updateCheckinFromControls() {
  state.checkin.bodyFocus = els.bodyFocus.value;
  state.checkin.sessionGoal = els.sessionGoal.value;
  persistCheckin();
  renderCheckin();
  updateMetrics();
}

function renderCheckin() {
  els.intensity.value = String(state.checkin.intensity);
  els.intensityValue.textContent = String(state.checkin.intensity);
  els.bodyFocus.value = state.checkin.bodyFocus;
  els.sessionGoal.value = state.checkin.sessionGoal;
  document.querySelectorAll('[data-emotion]').forEach((button) => {
    button.classList.toggle('active', button.dataset.emotion === state.checkin.emotion);
  });
  updateVisualCheckin();
}

function persistCheckin() {
  localStorage.setItem(storageKeys.checkin, JSON.stringify(state.checkin));
}

async function toggleRecording() {
  if (state.busy) return;
  if (state.isRecording) stopRecording();
  else await startRecording();
}

async function startRecording() {
  if (!ensureTrustAccepted()) return;
  saveSettings(false);
  if (!getServerUrl()) {
    setSettingsOpen(true);
    els.settingsToggle.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    toastSystem('Sprache ist noch nicht eingerichtet. Du kannst sofort schreiben – oder hier deinen Sprachlink speichern.');
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toastSystem('Dieses Gerät unterstützt gerade keine Mikrofonaufnahme.');
    return;
  }
  try {
    state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    setupAudioAnalyser(state.mediaStream);
  } catch (error) {
    toastSystem(`Mikrofonzugriff nicht möglich: ${error.message}`);
    return;
  }
  const mimeType = chooseMimeType();
  state.chunks = [];
  state.mediaRecorder = new MediaRecorder(state.mediaStream, mimeType ? { mimeType } : undefined);
  state.mediaRecorder.addEventListener('dataavailable', (event) => {
    if (event.data && event.data.size > 0) state.chunks.push(event.data);
  });
  state.mediaRecorder.addEventListener('stop', async () => {
    const type = state.mediaRecorder && state.mediaRecorder.mimeType ? state.mediaRecorder.mimeType : 'audio/webm';
    const blob = new Blob(state.chunks, { type });
    cleanupRecorder();
    await sendAudio(blob);
  });
  state.mediaRecorder.start();
  state.isRecording = true;
  els.recordButton.classList.add('recording');
  els.recordButton.setAttribute('aria-pressed', 'true');
  els.recordLabel.textContent = 'Sprechen beenden';
  els.recordStatus.textContent = 'Ich höre zu. Ein Satz reicht – stoppe, wenn es genug ist.';
  setVisualMode('Du sprichst gerade …', 'recording');
}

function stopRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') state.mediaRecorder.stop();
  state.isRecording = false;
  els.recordButton.classList.remove('recording');
  els.recordButton.setAttribute('aria-pressed', 'false');
  els.recordLabel.textContent = 'Sprechen starten';
  els.recordStatus.textContent = 'Ich bereite deine Worte vor …';
  setVisualMode('Deine Worte werden vorbereitet …', 'busy');
}

function cleanupRecorder() {
  if (state.mediaStream) state.mediaStream.getTracks().forEach((track) => track.stop());
  stopAudioAnalyser();
  state.mediaStream = null;
  state.mediaRecorder = null;
}

async function sendAudio(blob) {
  if (!blob || blob.size < 1000) {
    els.recordStatus.textContent = 'Das war sehr kurz. Sprich gern noch einmal einen Satz.';
    return;
  }
  if (els.processingMode.value === 'legacy-server-turn') {
    await sendLegacyAudioTurn(blob);
    return;
  }
  setBusy(true, 'Ich höre deinen Satz noch einmal an …');
  try {
    const transcript = await transcribeAudio(blob);
    updateIntensityFromText(transcript);
    appendMessage('user', transcript);
    const turn = buildCoachTurn(transcript);
    applyBrowserTurn(turn);
    await speakText(turn.reply, turn.safetyStatus);
  } catch (error) {
    toastSystem(`Sprache gerade nicht verfügbar: ${error.message}`);
  } finally {
    setBusy(false, 'Bereit. Du kannst weiterschreiben oder wieder sprechen.');
  }
}

async function transcribeAudio(blob) {
  const form = new FormData();
  form.append('audio', blob, `aufnahme.${extensionForMime(blob.type)}`);
  form.append('language', els.language.value);
  const data = await postForm('/api/transcribe', form);
  const transcript = String(data.transcript || '').trim();
  if (!transcript) throw new Error('Ich konnte keine Sprache erkennen.');
  return transcript;
}

async function sendLegacyAudioTurn(blob) {
  setBusy(true, 'Deine Stimme und die Antwort werden vorbereitet …');
  const form = new FormData();
  form.append('audio', blob, `aufnahme.${extensionForMime(blob.type)}`);
  form.append('language', els.language.value);
  form.append('history', JSON.stringify(state.history.slice(-6)));
  try {
    const data = await postForm('/api/turn', form);
    if (data.transcript) appendMessage('user', data.transcript);
    if (data.reply) appendMessage(data.safety_status === 'crisis' ? 'system' : 'assistant', data.reply);
    playAudio(data.audio_base64, data.audio_mime || 'audio/wav');
  } catch (error) {
    toastSystem(`Sprache gerade nicht verfügbar: ${error.message}`);
  } finally {
    setBusy(false, 'Bereit. Du kannst weiterschreiben oder wieder sprechen.');
  }
}

async function submitText(event) {
  event.preventDefault();
  if (!ensureTrustAccepted()) return;
  if (state.busy) return;
  saveSettings(false);
  const message = els.textInput.value.trim();
  if (!message) return;
  els.textInput.value = '';
  updateIntensityFromText(message);
  if (els.processingMode.value === 'legacy-server-turn') {
    await sendLegacyTextTurn(message);
    return;
  }
  appendMessage('user', message);
  const turn = buildCoachTurn(message);
  applyBrowserTurn(turn);
  await speakText(turn.reply, turn.safetyStatus);
}

async function sendLegacyTextTurn(message) {
  if (!getServerUrl()) {
    toastSystem('Bitte zuerst deinen Sprachlink speichern oder direkt schreiben.');
    return;
  }
  setBusy(true, 'Antwort wird vorbereitet …');
  try {
    const data = await postJson('/api/text-turn', { message, history: state.history.slice(-6) });
    if (data.transcript) appendMessage('user', data.transcript);
    if (data.reply) appendMessage(data.safety_status === 'crisis' ? 'system' : 'assistant', data.reply);
    playAudio(data.audio_base64, data.audio_mime || 'audio/wav');
  } catch (error) {
    toastSystem(`Text-Fehler: ${error.message}`);
  } finally {
    setBusy(false, 'Bereit.');
  }
}

function runQuickExercise(id) {
  if (!ensureTrustAccepted()) return;
  if (id === 'session-close') {
    const reply = buildClosingReply();
    state.activeExerciseId = id;
    persistActiveExercise();
    renderExercise();
    appendMessage('assistant', reply);
    speakText(reply, 'ok');
    return;
  }
  const exercise = { id, ...exercises[id] };
  state.activeExerciseId = id;
  persistActiveExercise();
  renderExercise(exercise);
  const reply = composeReply({ exercise, source: 'quick' });
  appendMessage('assistant', reply);
  speakText(reply, 'ok');
}

function runBrowserCoach(text, source) {
  if (!ensureTrustAccepted()) return;
  const turn = buildCoachTurn(text, source);
  applyBrowserTurn(turn);
  speakText(turn.reply, turn.safetyStatus);
}

function buildCoachTurn(text, source = 'text') {
  const clean = String(text || '').trim();
  if (looksLikeCrisis(clean)) {
    return { reply: crisisReply, role: 'system', safetyStatus: 'crisis', exercise: null };
  }
  const inferredEmotion = inferEmotion(clean);
  if (state.checkin.emotion === 'unklar' && inferredEmotion) {
    state.checkin.emotion = inferredEmotion;
    persistCheckin();
    renderCheckin();
  }
  const exercise = selectExercise(clean, source);
  state.activeExerciseId = exercise.id;
  persistActiveExercise();
  renderExercise(exercise);
  return { reply: composeReply({ exercise, text: clean, source }), role: 'assistant', safetyStatus: 'ok', exercise };
}

function applyBrowserTurn(turn) {
  appendMessage(turn.role || 'assistant', turn.reply);
  updateMetrics();
}

function selectExercise(text, source) {
  const emotion = inferEmotion(text) || state.checkin.emotion;
  const goal = state.checkin.sessionGoal;
  const intensity = Number(state.checkin.intensity);
  let id = 'breath-46';
  if (source === 'suggest' && intensity >= 8) id = 'orient-room';
  else if (goal === 'einschlafen') id = 'soft-body-scan';
  else if (emotion === 'angst') id = intensity >= 7 ? 'grounding-54321' : 'breath-46';
  else if (emotion === 'wut') id = 'release-shoulders';
  else if (emotion === 'traurigkeit') id = 'name-feeling';
  else if (emotion === 'ueberforderung') id = intensity >= 7 ? 'orient-room' : 'grounding-54321';
  else if (goal === 'klarheit' || goal === 'mut') id = 'name-feeling';
  return { id, ...exercises[id] };
}

function composeReply({ exercise, text, source }) {
  const emotion = emotionLabels[state.checkin.emotion] || 'das Gefühl';
  const intensity = Number(state.checkin.intensity);
  const body = state.checkin.bodyFocus;
  const opening = source === 'suggest'
    ? `Ich bin Resonara, eine KI-Begleitung. Wir starten einen kurzen Reset für ${emotion} bei ${intensity}/10.`
    : `Ich nehme aus deinem Check-in mit: ${emotion} bei etwa ${intensity}/10, besonders im Bereich ${body}.`;
  const reflection = text && text.length > 12 && source !== 'suggest'
    ? 'Du musst das gerade nicht fertig erklären. Wir geben deinem Nervensystem zuerst eine klare, kleine Aufgabe.'
    : 'Wir machen es klein, langsam und machbar.';
  const steps = exercise.steps.slice(0, 3).map((step, index) => `${index + 1}. ${step}`);
  return [
    opening,
    reflection,
    `Übung: ${exercise.title}. ${exercise.reason}`,
    ...steps,
    'Danach gib dir eine neue Zahl von 0 bis 10. Wenn es schlimmer wird, stoppe und such dir menschliche Unterstützung.'
  ].join('\n');
}

function buildClosingReply() {
  const summary = buildSessionSummary();
  return [
    'Lass uns die Session klein abschließen.',
    'Nenne eine Sache, die minimal leichter, klarer oder ruhiger geworden ist.',
    'Wähle dann einen nächsten Schritt, der in zwei Minuten machbar ist.',
    `Lokale Kurznotiz: ${summary.oneLine}`
  ].join('\n');
}

function inferEmotion(text) {
  const lowered = String(text || '').toLowerCase();
  for (const [emotion, words] of Object.entries(keywordMap)) {
    if (words.some((word) => lowered.includes(word))) return emotion;
  }
  return null;
}

function updateIntensityFromText(text) {
  const match = String(text || '').match(/\b(10|[0-9])\s*(?:\/\s*10|von\s*10)?\b/i);
  if (!match) return;
  const next = Number(match[1]);
  if (Number.isInteger(next) && next >= 0 && next <= 10) {
    state.checkin.intensity = next;
    persistCheckin();
    renderCheckin();
    updateMetrics();
  }
}

function looksLikeCrisis(text) {
  return crisisPatterns.some((pattern) => pattern.test(text));
}

function renderExercise(exercise = null) {
  const selected = exercise || (state.activeExerciseId ? { id: state.activeExerciseId, ...exercises[state.activeExerciseId] } : null);
  if (!selected || !selected.title) {
    els.exercisePanel.hidden = true;
    updateBreathCard(null);
    return;
  }
  els.exercisePanel.hidden = false;
  els.exerciseTitle.textContent = selected.title;
  els.exerciseReason.textContent = selected.reason;
  els.exerciseSteps.innerHTML = '';
  selected.steps.forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    els.exerciseSteps.appendChild(li);
  });
  updateBreathCard(selected);
}

function persistActiveExercise() {
  if (state.activeExerciseId) localStorage.setItem(storageKeys.activeExercise, state.activeExerciseId);
}

async function speakText(text, safetyStatus = 'ok') {
  const clean = String(text || '').trim();
  if (!clean) return;
  if (els.useServerTts.checked && getServerUrl()) {
    try {
      const data = await postJson('/api/speak', { text: clean, safety_status: safetyStatus });
      if (data.audio_base64) {
        playAudio(data.audio_base64, data.audio_mime || 'audio/wav');
        return;
      }
    } catch (error) {
      toastSystem(`Gesprochene Antwort gerade nicht verfügbar: ${error.message}`);
    }
  }
  if (els.useBrowserTts.checked) browserSpeak(clean);
}

function browserSpeak(text) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text.replace(/\n+/g, ' '));
  utterance.lang = els.language.value === 'en' ? 'en-US' : 'de-DE';
  utterance.rate = 0.92;
  utterance.pitch = 0.95;
  utterance.onstart = () => setVisualMode('Sprachausgabe läuft …', 'speaking');
  utterance.onend = () => setVisualMode('Bereit', 'idle');
  utterance.onerror = () => setVisualMode('Bereit', 'idle');
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function playAudio(base64, mime) {
  if (!base64) return;
  els.player.src = `data:${mime};base64,${base64}`;
  els.player.hidden = false;
  els.player.play().catch(() => toastSystem('Die gesprochene Antwort ist bereit. Tippe auf Play, falls Autoplay blockiert wurde.'));
}

function appendMessage(role, text) {
  const normalized = String(text || '').trim();
  if (!normalized) return;
  state.history.push({
    role,
    content: normalized,
    at: new Date().toISOString(),
    checkin: { ...state.checkin },
    active_exercise: state.activeExerciseId
  });
  persistHistory();
  renderHistory();
  updateMetrics();
}

function renderHistory() {
  els.messages.innerHTML = '';
  for (const item of state.history) {
    const div = document.createElement('article');
    div.className = `message ${item.role}`;
    const label = item.role === 'user' ? 'Du' : item.role === 'system' ? 'Wichtig' : 'Resonara KI';
    div.innerHTML = '<span class="meta"></span><span class="content"></span>';
    div.querySelector('.meta').textContent = label;
    div.querySelector('.content').textContent = item.content;
    els.messages.appendChild(div);
  }
  els.messages.scrollTop = els.messages.scrollHeight;
}

function addInitialMessage() {
  if (!state.trustAccepted || state.history.length > 0) return;
  appendMessage('assistant', 'Willkommen bei Resonara. Ich bin eine KI-Begleitung für kurze Selbstregulation – kein Mensch und keine Therapie. Wähle dein Gefühl und deine Intensität, oder schreibe einfach einen Satz. Wenn du bereit bist, starten wir ruhig mit einem 2-Minuten-Reset.');
}

function toastSystem(text) {
  appendMessage('system', text);
}

function clearSession() {
  state.history = [];
  state.activeExerciseId = null;
  localStorage.removeItem(storageKeys.history);
  localStorage.removeItem(storageKeys.activeExercise);
  els.player.hidden = true;
  els.player.removeAttribute('src');
  renderHistory();
  renderExercise();
  if (state.trustAccepted) addInitialMessage();
  updateMetrics();
}

function resetLocalData() {
  const ok = window.confirm('Alle lokalen Resonara-Daten auf diesem Gerät löschen? Gespeicherte Sprachdaten werden ebenfalls gelöscht.');
  if (!ok) return;
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  state.history = [];
  state.checkin = { ...defaultCheckin };
  state.activeExerciseId = null;
  loadSettings();
  renderCheckin();
  renderHistory();
  renderExercise();
  state.trustAccepted = false;
  updateMetrics();
  setConnectionStatus('Bereit');
  initTrustGate();
}

function persistHistory() {
  const compact = state.history.slice(-40);
  state.history = compact;
  localStorage.setItem(storageKeys.history, JSON.stringify(compact));
}

function updateMetrics() {
  els.metricTurns.textContent = String(state.history.filter((item) => item.role === 'user').length);
  const exercise = state.activeExerciseId && exercises[state.activeExerciseId] ? exercises[state.activeExerciseId].title : '-';
  els.metricExercise.textContent = exercise;
  els.metricIntensity.textContent = `${state.checkin.intensity}/10`;
  updateVisualMetrics();
  drawTimeline();
}

function buildSessionSummary() {
  const lastUser = [...state.history].reverse().find((item) => item.role === 'user');
  const lastAssistant = [...state.history].reverse().find((item) => item.role === 'assistant');
  const exerciseTitle = state.activeExerciseId && exercises[state.activeExerciseId] ? exercises[state.activeExerciseId].title : 'keine Übung';
  const oneLine = `${emotionLabels[state.checkin.emotion] || 'Gefühl'} ${state.checkin.intensity}/10, Fokus ${state.checkin.bodyFocus}, Übung ${exerciseTitle}.`;
  return {
    product: 'Resonara',
    created_at: new Date().toISOString(),
    checkin: { ...state.checkin },
    active_exercise: state.activeExerciseId,
    oneLine,
    last_user: lastUser ? lastUser.content : '',
    last_reply: lastAssistant ? lastAssistant.content : '',
    history: state.history
  };
}

async function copySummary() {
  const summary = buildSessionSummary();
  const text = [
    'Resonara Kurznotiz',
    `Zeit: ${summary.created_at}`,
    `Kurz: ${summary.oneLine}`,
    summary.last_user ? `Letzter Satz: ${summary.last_user}` : '',
    summary.last_reply ? `Letzte Antwort: ${summary.last_reply}` : ''
  ].filter(Boolean).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    toastSystem('Notiz kopiert.');
  } catch {
    toastSystem(text);
  }
}

function exportSession() {
  const summary = buildSessionSummary();
  const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resonara-session-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function setBusy(isBusy, statusText) {
  state.busy = isBusy;
  els.recordButton.disabled = isBusy;
  els.textInput.disabled = isBusy;
  els.textForm.querySelector('button').disabled = isBusy;
  els.suggestExercise.disabled = isBusy;
  els.recordStatus.textContent = statusText;
  if (isBusy) setVisualMode(statusText || 'Verarbeite …', 'busy');
  else if (!state.isRecording) setVisualMode('Bereit', 'idle');
}

function setConnectionStatus(text, ok) {
  els.connectionStatus.textContent = text;
  els.connectionStatus.classList.toggle('ok', ok === true);
  els.connectionStatus.classList.toggle('bad', ok === false);
}

async function postForm(path, form) {
  const response = await fetch(`${getServerUrl()}${path}`, { method: 'POST', headers: authHeaders(), body: form, mode: 'cors' });
  return parseResponse(response);
}

async function postJson(path, body) {
  const response = await fetch(`${getServerUrl()}${path}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    mode: 'cors'
  });
  return parseResponse(response);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  return parseResponse(response);
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : { detail: await response.text() };
  if (!response.ok) throw new Error(data.detail || `HTTP ${response.status}`);
  return data;
}


function initVisuals() {
  visual.particles = Array.from({ length: 72 }, (_, index) => ({
    x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2.8,
    phase: Math.random() * Math.PI * 2, speed: 0.18 + Math.random() * 0.74, lane: index % 3
  }));
  resizeVisuals();
  updateVisualCheckin();
  updateVisualMetrics();
  drawTimeline();
  setVisualMode('Bereit', 'idle');
  if (visual.prefersReducedMotion) { drawVisuals(performance.now()); return; }
  visual.frame = requestAnimationFrame(visualLoop);
}

function visualLoop(time) { drawVisuals(time); visual.frame = requestAnimationFrame(visualLoop); }
function drawVisuals(time) { drawAmbient(time); drawResonance(time); drawVoice(time); updateBreathAnimation(time); }
function resizeVisuals() { [els.ambientCanvas, els.resonanceCanvas, els.voiceCanvas, els.timelineCanvas].forEach((canvas) => fitCanvas(canvas)); drawTimeline(); }

function fitCanvas(canvas) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height: rect.height, ratio };
}

function getEmotionVisual() { return emotionVisuals[state.checkin.emotion] || emotionVisuals.unklar; }

function drawAmbient(time) {
  const fit = fitCanvas(els.ambientCanvas); if (!fit) return;
  const { ctx, width, height } = fit; const mood = getEmotionVisual(); const intensity = Number(state.checkin.intensity) / 10;
  ctx.clearRect(0, 0, width, height);
  const base = ctx.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.26, Math.max(width, height) * 0.85);
  base.addColorStop(0, hexToRgba(mood.a, 0.18 + intensity * 0.08));
  base.addColorStop(0.38, hexToRgba(mood.b, 0.08 + intensity * 0.04));
  base.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = base; ctx.fillRect(0, 0, width, height);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const particle of visual.particles) {
    const t = (time * 0.00004 * mood.tempo * particle.speed) + particle.phase;
    const drift = Math.sin(t * 5 + particle.lane) * 0.035;
    const x = ((particle.x + time * 0.000006 * particle.speed) % 1) * width;
    const y = ((particle.y + drift + 1) % 1) * height;
    const alpha = 0.05 + intensity * 0.12 + Math.sin(t * 8) * 0.03;
    ctx.beginPath(); ctx.fillStyle = particle.lane === 0 ? hexToRgba(mood.a, alpha) : particle.lane === 1 ? hexToRgba(mood.b, alpha) : hexToRgba(mood.c, alpha);
    ctx.arc(x, y, particle.r * (1 + intensity), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawResonance(time) {
  const fit = fitCanvas(els.resonanceCanvas); if (!fit) return;
  const { ctx, width, height } = fit; const mood = getEmotionVisual(); const t = time * 0.001;
  const intensity = Number(state.checkin.intensity) / 10; const level = Math.max(visual.audioLevel, 0.04);
  ctx.clearRect(0, 0, width, height); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const cx = width / 2; const cy = height / 2; const maxR = Math.min(width, height) * 0.46;
  for (let i = 0; i < 9; i += 1) {
    const pulse = (Math.sin(t * (0.7 + i * 0.05) + i * 0.7) + 1) / 2;
    const radius = maxR * (0.22 + i * 0.085 + pulse * 0.015 + intensity * 0.012);
    ctx.beginPath(); ctx.lineWidth = 0.8 + i * 0.16;
    ctx.strokeStyle = i % 2 ? hexToRgba(mood.b, 0.12 + intensity * 0.08) : hexToRgba(mood.a, 0.12 + level * 0.24);
    ctx.ellipse(cx, cy, radius * (1.16 + Math.sin(t + i) * 0.08), radius * (0.58 + Math.cos(t * 0.8 + i) * 0.05), t * 0.16 + i * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawWaveRibbon(ctx, width, height, mood, t, intensity, level, 0.38);
  drawWaveRibbon(ctx, width, height, mood, t + 1.7, intensity, level, 0.62);
  ctx.restore();
}

function drawWaveRibbon(ctx, width, height, mood, t, intensity, level, yFactor) {
  const points = 74; const amp = height * (0.04 + intensity * 0.045 + level * 0.1); const mid = height * yFactor;
  ctx.beginPath();
  for (let i = 0; i <= points; i += 1) {
    const x = (i / points) * width;
    const y = mid + Math.sin(i * 0.34 + t * 1.6) * amp + Math.sin(i * 0.11 - t * 1.05) * amp * 0.55;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.lineWidth = 2.2; const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, hexToRgba(mood.a, 0.02)); gradient.addColorStop(0.25, hexToRgba(mood.a, 0.45));
  gradient.addColorStop(0.5, hexToRgba('#ffffff', 0.72)); gradient.addColorStop(0.75, hexToRgba(mood.b, 0.45)); gradient.addColorStop(1, hexToRgba(mood.b, 0.02));
  ctx.strokeStyle = gradient; ctx.shadowColor = mood.a; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0;
}

function drawVoice(time) {
  const fit = fitCanvas(els.voiceCanvas); if (!fit) return;
  const { ctx, width, height } = fit; const mood = getEmotionVisual(); const t = time * 0.001;
  ctx.clearRect(0, 0, width, height);
  const grid = ctx.createLinearGradient(0, 0, 0, height); grid.addColorStop(0, 'rgba(255,255,255,0.035)'); grid.addColorStop(1, 'rgba(255,255,255,0.01)');
  ctx.fillStyle = grid; ctx.fillRect(0, 0, width, height); drawVoiceGrid(ctx, width, height);
  let samples = null;
  if (visual.analyser && visual.dataArray) {
    visual.analyser.getByteTimeDomainData(visual.dataArray); samples = visual.dataArray; let rms = 0;
    for (const value of samples) { const centered = (value - 128) / 128; rms += centered * centered; }
    visual.audioLevel = Math.min(1, Math.sqrt(rms / samples.length) * 3.4);
  } else { visual.audioLevel *= 0.92; }
  document.documentElement.style.setProperty('--record-level', visual.audioLevel.toFixed(3));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const mid = height / 2; const bars = Math.min(96, Math.max(42, Math.floor(width / 9))); const gap = 3; const barW = Math.max(2, width / bars - gap);
  for (let i = 0; i < bars; i += 1) {
    let v;
    if (samples) { const sampleIndex = Math.floor((i / bars) * samples.length); v = Math.abs((samples[sampleIndex] - 128) / 128); }
    else { v = 0.08 + Math.pow(Math.sin(t * 1.8 + i * 0.38) * 0.5 + 0.5, 2) * 0.24 + (state.checkin.intensity / 10) * 0.1; }
    const barH = Math.max(5, v * height * 0.88 + visual.audioLevel * 34); const x = i * (barW + gap); const y = mid - barH / 2;
    const grad = ctx.createLinearGradient(0, y, 0, y + barH); grad.addColorStop(0, hexToRgba(mood.a, 0.1)); grad.addColorStop(0.5, hexToRgba(i % 2 ? mood.b : mood.a, 0.72)); grad.addColorStop(1, hexToRgba(mood.c, 0.1));
    ctx.fillStyle = grad; roundRect(ctx, x, y, barW, barH, 999); ctx.fill();
  }
  ctx.restore();
}

function drawVoiceGrid(ctx, width, height) {
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.045)'; ctx.lineWidth = 1;
  for (let y = 0; y <= height; y += height / 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  for (let x = 0; x <= width; x += 42) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  ctx.restore();
}

function drawTimeline() {
  const fit = fitCanvas(els.timelineCanvas); if (!fit) return;
  const { ctx, width, height } = fit; const mood = getEmotionVisual(); ctx.clearRect(0, 0, width, height); drawVoiceGrid(ctx, width, height);
  const values = getTimelineValues(); const pad = 18; const plotW = Math.max(1, width - pad * 2); const plotH = Math.max(1, height - pad * 2);
  const points = values.map((value, index) => ({ x: pad + (values.length === 1 ? 0.5 : index / (values.length - 1)) * plotW, y: pad + (1 - value / 10) * plotH, v: value }));
  const area = ctx.createLinearGradient(0, pad, 0, height - pad); area.addColorStop(0, hexToRgba(mood.a, 0.26)); area.addColorStop(1, hexToRgba(mood.b, 0.02));
  ctx.beginPath(); points.forEach((point, index) => { if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
  ctx.lineTo(points[points.length - 1].x, height - pad); ctx.lineTo(points[0].x, height - pad); ctx.closePath(); ctx.fillStyle = area; ctx.fill();
  ctx.beginPath(); points.forEach((point, index) => { if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
  const grad = ctx.createLinearGradient(0, 0, width, 0); grad.addColorStop(0, mood.a); grad.addColorStop(0.5, '#ffffff'); grad.addColorStop(1, mood.b);
  ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.shadowColor = mood.a; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
  for (const point of points) { ctx.beginPath(); ctx.fillStyle = hexToRgba('#ffffff', 0.92); ctx.arc(point.x, point.y, 3.8, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.strokeStyle = hexToRgba(mood.b, 0.52); ctx.arc(point.x, point.y, 8 + point.v * 0.25, 0, Math.PI * 2); ctx.stroke(); }
}

function getTimelineValues() {
  const values = state.history.filter((item) => item.role === 'user' || item.role === 'assistant').slice(-18).map((item) => Number(item.checkin && item.checkin.intensity)).filter((value) => Number.isFinite(value));
  if (!values.length) return [Number(state.checkin.intensity)]; return values;
}

function updateVisualCheckin() {
  const mood = getEmotionVisual(); const intensity = Number(state.checkin.intensity) || 0; const pct = Math.max(0, Math.min(100, intensity * 10));
  document.documentElement.style.setProperty('--emotion-a', mood.a); document.documentElement.style.setProperty('--emotion-b', mood.b); document.documentElement.style.setProperty('--emotion-c', mood.c); document.documentElement.style.setProperty('--intensity-level', `${pct}%`); document.documentElement.style.setProperty('--orb-scale', (1 + intensity * 0.012).toFixed(3)); document.body.dataset.emotion = state.checkin.emotion;
  const label = emotionLabels[state.checkin.emotion] || 'Unklar';
  if (els.emotionVizLabel) els.emotionVizLabel.textContent = label; if (els.emotionVizSub) els.emotionVizSub.textContent = `${intensity}/10 · ${state.checkin.bodyFocus}`; if (els.dialValue) els.dialValue.textContent = String(intensity); if (els.dialLabel) els.dialLabel.textContent = label; if (els.bodyVizLabel) els.bodyVizLabel.textContent = state.checkin.bodyFocus;
  if (els.intensityArc) { const circumference = 365; els.intensityArc.style.strokeDashoffset = String(circumference * (1 - intensity / 10)); }
  document.querySelectorAll('.body-node').forEach((node) => node.classList.remove('active'));
  const activeNames = bodyNodeMap[state.checkin.bodyFocus] || ['chest'];
  for (const name of activeNames) { if (name === 'shoulders') document.querySelectorAll('.body-node.shoulders').forEach((node) => node.classList.add('active')); else { const node = document.querySelector(`.body-node.${name}`); if (node) node.classList.add('active'); } }
}

function updateVisualMetrics() {
  if (!els.stabilityIndex || !els.sessionTempo || !els.privacyGauge) return;
  const values = getTimelineValues(); const first = values[0]; const last = values[values.length - 1]; const delta = Math.round((first - last) * 10) / 10;
  if (values.length < 2) els.stabilityIndex.textContent = 'Noch keine Kurve'; else if (delta > 0) els.stabilityIndex.textContent = `Runterreguliert um ${delta}`; else if (delta < 0) els.stabilityIndex.textContent = `Aktivierung +${Math.abs(delta)}`; else els.stabilityIndex.textContent = 'Stabil gehalten';
  const userTurns = state.history.filter((item) => item.role === 'user').length; const tempo = state.isRecording ? 'live' : userTurns <= 2 ? 'ruhig' : userTurns <= 7 ? 'stetig' : 'aktiv';
  els.sessionTempo.textContent = `Tempo: ${tempo}`; els.privacyGauge.textContent = els.processingMode && els.processingMode.value === 'legacy-server-turn' ? 'Privat: erweitert' : 'Privat: Gerät';
}

function updateBreathCard(exercise) {
  if (!els.breathCue || !els.breathPhase) return;
  if (!exercise || exercise.id !== 'breath-46') { els.breathCue.textContent = exercise ? exercise.title : 'Bereit'; els.breathPhase.textContent = exercise ? 'Die Kugel hält den Raum, auch wenn die Übung nicht atembasiert ist.' : 'Bei Atemübungen pulsiert die Kugel im 4-6-Rhythmus.'; document.documentElement.style.setProperty('--breath-scale', '1'); document.body.dataset.breath = 'idle'; return; }
  visual.lastBreathCue = '';
}

function updateBreathAnimation(time) {
  if (!els.breathCue || state.activeExerciseId !== 'breath-46') return;
  const cycle = 10000; const elapsed = (time - visual.startedAt) % cycle; const inhale = elapsed < 4000; const progress = inhale ? elapsed / 4000 : (elapsed - 4000) / 6000; const scale = inhale ? 0.94 + progress * 0.24 : 1.18 - progress * 0.22;
  document.documentElement.style.setProperty('--breath-scale', scale.toFixed(3));
  const cue = inhale ? 'Einatmen' : 'Ausatmen'; const left = inhale ? Math.ceil((4000 - elapsed) / 1000) : Math.ceil((10000 - elapsed) / 1000);
  if (visual.lastBreathCue !== `${cue}-${left}`) { visual.lastBreathCue = `${cue}-${left}`; els.breathCue.textContent = cue; els.breathPhase.textContent = inhale ? `Sanft ein für ${left}` : `Lang aus für ${left}`; document.body.dataset.breath = inhale ? 'inhale' : 'exhale'; }
}

function setupAudioAnalyser(stream) {
  stopAudioAnalyser();
  try { const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return; visual.audioContext = new AudioContextClass(); visual.analyser = visual.audioContext.createAnalyser(); visual.analyser.fftSize = 2048; visual.dataArray = new Uint8Array(visual.analyser.fftSize); visual.source = visual.audioContext.createMediaStreamSource(stream); visual.source.connect(visual.analyser); }
  catch { visual.audioContext = null; visual.analyser = null; visual.source = null; visual.dataArray = null; }
}

function stopAudioAnalyser() {
  if (visual.source) visual.source.disconnect(); if (visual.audioContext && visual.audioContext.state !== 'closed') visual.audioContext.close().catch(() => {});
  visual.audioContext = null; visual.analyser = null; visual.source = null; visual.dataArray = null;
}

function setVisualMode(text, stateName = 'idle') {
  if (els.visualMode) els.visualMode.textContent = text;
  if (els.voiceModeLabel) els.voiceModeLabel.textContent = stateName === 'recording' ? 'Du sprichst' : stateName === 'busy' ? 'Resonara hört nach' : stateName === 'speaking' ? 'Resonara spricht' : 'Bereit';
  document.body.dataset.state = stateName; updateVisualMetrics();
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + width, y, x + width, y + height, r); ctx.arcTo(x + width, y + height, x, y + height, r); ctx.arcTo(x, y + height, x, y, r); ctx.arcTo(x, y, x + width, y, r); ctx.closePath();
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex).replace('#', '').trim(); const value = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized.padEnd(6, '0').slice(0, 6); const int = Number.parseInt(value, 16); const r = (int >> 16) & 255; const g = (int >> 8) & 255; const b = int & 255; return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getServerUrl() {
  return normalizeServerUrl(localStorage.getItem(storageKeys.serverUrl) || els.serverUrl.value);
}

function normalizeServerUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function authHeaders() {
  const token = (localStorage.getItem(storageKeys.apiToken) || els.apiToken.value || '').trim();
  return token ? { 'X-Client-Token': token } : {};
}

function chooseMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function extensionForMime(mime) {
  if (mime.includes('mp4')) return 'm4a';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('wav')) return 'wav';
  return 'webm';
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function installPwa() {
  if (!state.deferredInstallPrompt) return;
  state.deferredInstallPrompt.prompt();
  state.deferredInstallPrompt = null;
  els.installButton.hidden = true;
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
}

init();
