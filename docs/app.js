const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  splashScreen: $('#splashScreen'),
  trustGate: $('#trustGate'),
  trustForm: $('#trustForm'),
  acceptTrust: $('#acceptTrust'),
  trustAiCheck: $('#trustAiCheck'),
  trustDataCheck: $('#trustDataCheck'),
  trustCrisisCheck: $('#trustCrisisCheck'),
  app: $('#app'),
  brandHome: $('#brandHome'),
  installButton: $('#installButton'),
  connectionStatus: $('#connectionStatus'),
  stepKicker: $('#stepKicker'),
  stepTitleMini: $('#stepTitleMini'),
  progressBar: $('#progressBar'),
  backButton: $('#backButton'),
  nextButton: $('#nextButton'),
  emotionField: $('#emotionField'),
  intensity: $('#intensity'),
  intensityValue: $('#intensityValue'),
  intensityLabel: $('#intensityLabel'),
  bodyFocus: $('#bodyFocus'),
  sessionGoal: $('#sessionGoal'),
  suggestExercise: $('#suggestExercise'),
  exerciseTitle: $('#exerciseTitle'),
  exerciseReason: $('#exerciseReason'),
  exerciseSteps: $('#exerciseSteps'),
  breathOrb: $('#breathOrb'),
  breathCue: $('#breathCue'),
  breathPhase: $('#breathPhase'),
  messages: $('#messages'),
  recordButton: $('#recordButton'),
  recordLabel: $('#recordLabel'),
  recordStatus: $('#recordStatus'),
  writeToggle: $('#writeToggle'),
  textForm: $('#textForm'),
  textInput: $('#textInput'),
  finishSession: $('#finishSession'),
  player: $('#player'),
  afterIntensity: $('#afterIntensity'),
  afterIntensityValue: $('#afterIntensityValue'),
  nextStepInput: $('#nextStepInput'),
  copySummary: $('#copySummary'),
  exportSession: $('#exportSession'),
  newSession: $('#newSession'),
  settingsToggle: $('#settingsToggle'),
  settingsPanel: $('#settingsPanel'),
  closeSettings: $('#closeSettings'),
  serverUrl: $('#serverUrl'),
  apiToken: $('#apiToken'),
  language: $('#language'),
  processingMode: $('#processingMode'),
  useServerTts: $('#useServerTts'),
  useBrowserTts: $('#useBrowserTts'),
  saveSettings: $('#saveSettings'),
  testConnection: $('#testConnection'),
  historyToggle: $('#historyToggle'),
  historyPanel: $('#historyPanel'),
  closeHistory: $('#closeHistory'),
  metricTurns: $('#metricTurns'),
  metricExercise: $('#metricExercise'),
  metricIntensity: $('#metricIntensity'),
  clearSession: $('#clearSession'),
  resetLocalData: $('#resetLocalData'),
  revisitTrust: $('#revisitTrust'),
  ambientCanvas: $('#ambientCanvas'),
  resonanceCanvas: $('#resonanceCanvas'),
  intensityOrb: $('#intensityOrb'),
  orbLabel: $('#orbLabel'),
  orbValue: $('#orbValue'),
  orbSub: $('#orbSub')
};

const stepTitles = [
  'Ankommen',
  'Gef\u00fchl',
  'St\u00e4rke',
  'K\u00f6rper',
  'Richtung',
  '\u00dcbung',
  'Begleitung',
  'Abschluss'
];

const legacyModeName = 'legacy-server-turn';

const storageKeys = {
  trustAccepted: 'resonara.trustAccepted',
  serverUrl: 'resonara.serverUrl',
  apiToken: 'resonara.apiToken',
  language: 'resonara.language',
  useServerTts: 'resonara.useServerTts',
  useBrowserTts: 'resonara.useBrowserTts',
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
  step: 0,
  checkin: { ...defaultCheckin },
  afterIntensity: 5,
  activeExerciseId: 'breath-46',
  history: [],
  mediaRecorder: null,
  mediaStream: null,
  chunks: [],
  isRecording: false,
  busy: false,
  deferredInstallPrompt: null,
  ambientFrame: null,
  resonanceFrame: null,
  startTime: performance.now(),
  breathTimer: null
};

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

const crisisReply = [
  'Das klingt gerade nach einer Situation, in der du nicht allein bleiben solltest.',
  'Wenn du akut in Gefahr bist oder dir etwas antun k\u00f6nntest, ruf bitte jetzt 112 an oder geh sofort zu einer Person in deiner N\u00e4he.',
  'In Deutschland erreichst du die TelefonSeelsorge Tag und Nacht unter 0800 1110111, 0800 1110222 oder 116 123.',
  'Ich kann ruhig mit dir bleiben, aber das braucht jetzt zus\u00e4tzlich menschliche Unterst\u00fctzung.'
].join(' ');

const exercises = {
  'breath-46': {
    title: '4-6 Atemanker',
    reason: 'Bei Stress oder Angst hilft oft ein langsameres Ausatmen. Es gibt dem K\u00f6rper ein Signal von Sicherheit.',
    tags: ['stress', 'angst', 'ueberforderung', 'runterregeln'],
    cue: 'Einatmen - ausatmen',
    phase: '4 Z\u00e4hler ein, 6 Z\u00e4hler aus. Sanft und ohne Druck.',
    steps: [
      'Lege eine Hand auf Brust oder Bauch.',
      'Atme 4 Z\u00e4hler ein.',
      'Atme 6 Z\u00e4hler aus.',
      'Wiederhole es 6 ruhige Runden.'
    ]
  },
  'grounding-54321': {
    title: '5-4-3-2-1 Grounding',
    reason: 'Wenn innerer Alarm hochf\u00e4hrt, hilft klare Orientierung im Raum.',
    tags: ['angst', 'ueberforderung', 'klarheit'],
    cue: 'Umsehen',
    phase: 'Lass deine Augen langsam im Raum ankommen.',
    steps: [
      'Nenne 5 Dinge, die du sehen kannst.',
      'Nenne 4 Dinge, die du sp\u00fcrst.',
      'Nenne 3 Dinge, die du h\u00f6rst.',
      'Nenne 1 Sache, die gerade sicher genug ist.'
    ]
  },
  'orient-room': {
    title: 'Raum scannen',
    reason: 'Sanftes Umschauen bringt Aufmerksamkeit aus dem inneren Druck zur\u00fcck in die Gegenwart.',
    tags: ['angst', 'ueberforderung', 'stress'],
    cue: 'Orientieren',
    phase: 'Schau langsam nach links und rechts.',
    steps: [
      'Drehe den Kopf langsam nach links.',
      'Drehe den Kopf langsam nach rechts.',
      'Lass den Blick bei einem neutralen Gegenstand landen.',
      'Sp\u00fcre f\u00fcr 10 Sekunden den Boden.'
    ]
  },
  'name-feeling': {
    title: 'Gef\u00fchl benennen',
    reason: 'Benennen schafft Abstand. Das Gef\u00fchl ist da, aber es ist nicht alles, was du bist.',
    tags: ['traurigkeit', 'unklar', 'klarheit', 'mut'],
    cue: 'Benennen',
    phase: 'Ein einfaches Wort reicht.',
    steps: [
      'Sag innerlich: Da ist gerade ...',
      'Nenne ein m\u00f6glichst einfaches Wort.',
      'Sag: Es ist verst\u00e4ndlich, dass mein System reagiert.',
      'W\u00e4hle einen n\u00e4chsten Schritt, der klein genug ist.'
    ]
  },
  'release-shoulders': {
    title: 'Schultern entladen',
    reason: 'Bei Wut oder Druck hilft dosierte K\u00f6rperspannung, Energie sicher zu bewegen.',
    tags: ['wut', 'stress', 'runterregeln'],
    cue: 'L\u00f6sen',
    phase: 'Kurz anspannen, dann weich werden lassen.',
    steps: [
      'Ziehe die Schultern 3 Sekunden leicht hoch.',
      'Lass sie mit einem langen Ausatmen sinken.',
      'Dr\u00fccke die F\u00fc\u00dfe 5 Sekunden in den Boden.',
      'Pr\u00fcfe: Ist die Energie hei\u00df, schwer, zittrig oder dumpf?'
    ]
  },
  'soft-body-scan': {
    title: 'Weicher Body Scan',
    reason: 'F\u00fcr Ruhe und Einschlafen ist weniger Analyse und mehr K\u00f6rperkontakt oft hilfreicher.',
    tags: ['traurigkeit', 'einschlafen', 'stress'],
    cue: 'Weich werden',
    phase: 'Stirn, Augen und Kiefer ein Prozent l\u00f6sen.',
    steps: [
      'Lass Stirn, Augen und Kiefer etwas weicher werden.',
      'Sp\u00fcre Brust, Bauch und Becken.',
      'Atme so, als w\u00fcrdest du innerlich Platz machen.',
      'Sag dir: F\u00fcr diesen Moment muss ich nichts l\u00f6sen.'
    ]
  },
  'session-close': {
    title: 'Mini-Abschluss',
    reason: 'Ein kleiner Abschluss hilft, die Regulation in den Alltag mitzunehmen.',
    tags: ['klarheit', 'mut', 'runterregeln'],
    cue: 'Abschlie\u00dfen',
    phase: 'Was ist jetzt minimal anders?',
    steps: [
      'Nenne eine Sache, die sich minimal anders anf\u00fchlt.',
      'Gib der Intensit\u00e4t eine neue Zahl.',
      'W\u00e4hle einen n\u00e4chsten Schritt.',
      'Bedanke dich kurz bei deinem K\u00f6rper.'
    ]
  }
};

const emotionLabels = {
  stress: 'Stress',
  angst: 'Angst',
  wut: 'Wut',
  traurigkeit: 'Traurigkeit',
  ueberforderung: '\u00dcberforderung',
  unklar: 'Unklarheit'
};

const keywordMap = {
  angst: ['angst', 'panik', 'sorge', 'nerv\u00f6s', 'herzrasen', 'unsicher'],
  wut: ['wut', 'sauer', '\u00e4rger', 'w\u00fctend', 'hass', 'rasend'],
  traurigkeit: ['traurig', 'leer', 'einsam', 'weinen', 'verlust', 'schwer'],
  ueberforderung: ['\u00fcberfordert', 'zu viel', 'alles', 'druck', 'stress', 'chaos'],
  stress: ['stress', 'angespannt', 'getrieben', 'deadline', 'unruhe']
};

const colors = {
  stress: ['#2dd4bf', '#7c5cff', '#f3f6ff'],
  angst: ['#7c5cff', '#2dd4bf', '#f255b6'],
  wut: ['#f255b6', '#7c5cff', '#ffd166'],
  traurigkeit: ['#7c5cff', '#4ea7ff', '#2dd4bf'],
  ueberforderung: ['#7c5cff', '#f255b6', '#2dd4bf'],
  unklar: ['#2dd4bf', '#7c5cff', '#f3f6ff']
};

init();

function init() {
  loadSettings();
  bindEvents();
  restoreState();
  setupInstall();
  registerServiceWorker();
  startAmbientCanvas();
  startResonanceCanvas();
  updateTrustButton();
  updateExercisePreview();
  updateVisualState();
  updateMetrics();

  window.setTimeout(() => {
    els.splashScreen.classList.add('is-hidden');
    window.setTimeout(() => {
      els.splashScreen.hidden = true;
      if (localStorage.getItem(storageKeys.trustAccepted) === 'true') {
        showApp();
      } else {
        els.trustGate.hidden = false;
      }
    }, 460);
  }, 1150);
}

function bindEvents() {
  els.trustForm.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem(storageKeys.trustAccepted, 'true');
    showApp();
  });
  [els.trustAiCheck, els.trustDataCheck, els.trustCrisisCheck].forEach((input) => input.addEventListener('change', updateTrustButton));
  els.brandHome.addEventListener('click', () => setStep(0));
  els.backButton.addEventListener('click', () => setStep(Math.max(0, state.step - 1)));
  els.nextButton.addEventListener('click', handleNext);
  els.suggestExercise.addEventListener('click', startExercise);
  els.finishSession.addEventListener('click', () => setStep(7));
  els.newSession.addEventListener('click', newSession);
  els.writeToggle.addEventListener('click', toggleWriteForm);
  els.textForm.addEventListener('submit', handleTextSubmit);
  els.recordButton.addEventListener('click', toggleRecording);
  els.copySummary.addEventListener('click', copySummary);
  els.exportSession.addEventListener('click', exportSession);
  els.settingsToggle.addEventListener('click', () => togglePanel(els.settingsPanel, els.settingsToggle));
  els.closeSettings.addEventListener('click', () => togglePanel(els.settingsPanel, els.settingsToggle, false));
  els.historyToggle.addEventListener('click', () => togglePanel(els.historyPanel, els.historyToggle));
  els.closeHistory.addEventListener('click', () => togglePanel(els.historyPanel, els.historyToggle, false));
  els.saveSettings.addEventListener('click', saveSettings);
  els.testConnection.addEventListener('click', testConnection);
  els.clearSession.addEventListener('click', clearSession);
  els.resetLocalData.addEventListener('click', resetLocalData);
  els.revisitTrust.addEventListener('click', showTrustAgain);
  els.intensity.addEventListener('input', () => {
    state.checkin.intensity = Number(els.intensity.value);
    state.afterIntensity = Math.max(0, state.checkin.intensity - 1);
    els.afterIntensity.value = String(state.afterIntensity);
    updateVisualState();
    updateExercisePreview();
    persistCheckin();
  });
  els.afterIntensity.addEventListener('input', () => {
    state.afterIntensity = Number(els.afterIntensity.value);
    els.afterIntensityValue.textContent = String(state.afterIntensity);
  });

  $$('.choice[data-jump]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.jump))));
  $$('[data-open-audio]').forEach((button) => button.addEventListener('click', () => togglePanel(els.settingsPanel, els.settingsToggle, true)));
  $$('#emotionField .chip').forEach((button) => button.addEventListener('click', () => chooseEmotion(button.dataset.emotion)));
  $$('#bodyFocus .body-choice').forEach((button) => button.addEventListener('click', () => chooseBody(button.dataset.body)));
  $$('#sessionGoal .goal-choice').forEach((button) => button.addEventListener('click', () => chooseGoal(button.dataset.goal)));
}

function showApp() {
  els.trustGate.hidden = true;
  els.app.hidden = false;
  if (!state.history.length) {
    addMessage('assistant', 'Willkommen bei Resonara. Ich bin eine KI-Begleitung f\u00fcr kurze Selbstregulation - kein Mensch und keine Therapie. Wir gehen Schritt f\u00fcr Schritt.');
  }
  setStep(state.step || 0);
}

function showTrustAgain() {
  els.trustGate.hidden = false;
  els.app.hidden = true;
  updateTrustButton();
}

function updateTrustButton() {
  const ok = els.trustAiCheck.checked && els.trustDataCheck.checked && els.trustCrisisCheck.checked;
  els.acceptTrust.disabled = !ok;
}

function handleNext() {
  if (state.step === 4) updateExercisePreview();
  if (state.step === 5) {
    startExercise();
    return;
  }
  if (state.step === 7) {
    newSession();
    return;
  }
  setStep(Math.min(7, state.step + 1));
}

function setStep(step) {
  state.step = Math.max(0, Math.min(7, step));
  $$('.guide-step').forEach((section) => section.classList.toggle('active', Number(section.dataset.step) === state.step));
  els.stepKicker.textContent = `Schritt ${state.step + 1} von 8`;
  els.stepTitleMini.textContent = stepTitles[state.step];
  els.progressBar.style.width = `${((state.step + 1) / 8) * 100}%`;
  els.backButton.disabled = state.step === 0;
  els.nextButton.hidden = state.step === 6;
  els.backButton.hidden = state.step === 6 && window.innerWidth < 520;
  els.nextButton.textContent = nextButtonLabel(state.step);
  if (state.step === 5) updateExercisePreview();
  if (state.step === 6) startBreathCycle();
  else stopBreathCycle();
  updateVisualState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextButtonLabel(step) {
  if (step === 0) return 'Starten';
  if (step === 5) return '\u00dcbung starten';
  if (step === 7) return 'Neu starten';
  return 'Weiter';
}

function chooseEmotion(emotion) {
  state.checkin.emotion = emotion;
  $$('#emotionField .chip').forEach((button) => button.classList.toggle('active', button.dataset.emotion === emotion));
  updateVisualState();
  updateExercisePreview();
  persistCheckin();
  autoAdvanceOnChoice(1);
}

function chooseBody(body) {
  state.checkin.bodyFocus = body;
  $$('#bodyFocus .body-choice').forEach((button) => button.classList.toggle('active', button.dataset.body === body));
  updateVisualState();
  updateExercisePreview();
  persistCheckin();
  autoAdvanceOnChoice(3);
}

function chooseGoal(goal) {
  state.checkin.sessionGoal = goal;
  $$('#sessionGoal .goal-choice').forEach((button) => button.classList.toggle('active', button.dataset.goal === goal));
  updateExercisePreview();
  persistCheckin();
  autoAdvanceOnChoice(4);
}

function autoAdvanceOnChoice(step) {
  if (state.step === step && window.matchMedia('(max-width: 760px)').matches) {
    window.setTimeout(() => setStep(step + 1), 220);
  }
}

function updateVisualState() {
  const emotion = state.checkin.emotion;
  const label = emotionLabels[emotion] || 'Gef\u00fchl';
  const value = Number(state.checkin.intensity);
  els.intensity.value = String(value);
  els.intensityValue.textContent = String(value);
  els.afterIntensityValue.textContent = String(state.afterIntensity);
  els.intensityLabel.textContent = describeIntensity(value);
  els.orbLabel.textContent = label;
  els.orbValue.textContent = `${value}/10`;
  els.orbSub.textContent = state.step <= 1 ? 'du wirst gef\u00fchrt' : state.checkin.bodyFocus;
  els.metricIntensity.textContent = `${value}/10`;
}

function describeIntensity(value) {
  if (value <= 2) return 'leise wahrnehmbar';
  if (value <= 5) return 'sp\u00fcrbar, noch regulierbar';
  if (value <= 7) return 'deutlich - wir werden langsamer';
  return 'sehr stark - bitte sanft bleiben';
}

function selectExercise() {
  const check = state.checkin;
  if (check.sessionGoal === 'einschlafen') return 'soft-body-scan';
  if (check.emotion === 'wut') return 'release-shoulders';
  if (check.emotion === 'angst' && check.intensity >= 7) return 'grounding-54321';
  if (check.emotion === 'ueberforderung') return check.intensity >= 7 ? 'orient-room' : 'breath-46';
  if (check.sessionGoal === 'klarheit') return 'name-feeling';
  if (check.sessionGoal === 'mut') return 'name-feeling';
  if (check.emotion === 'traurigkeit') return 'soft-body-scan';
  return 'breath-46';
}

function updateExercisePreview() {
  state.activeExerciseId = selectExercise();
  localStorage.setItem(storageKeys.activeExercise, state.activeExerciseId);
  const exercise = exercises[state.activeExerciseId];
  els.exerciseTitle.textContent = exercise.title;
  els.exerciseReason.textContent = exercise.reason;
  els.exerciseSteps.innerHTML = exercise.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('');
  els.metricExercise.textContent = exercise.title;
  els.breathCue.textContent = exercise.cue;
  els.breathPhase.textContent = exercise.phase;
}

function startExercise() {
  updateExercisePreview();
  const exercise = exercises[state.activeExerciseId];
  addMessage('assistant', `Ich schlage ${exercise.title} vor. Bleib bei Schritt 1: ${exercise.steps[0]}`);
  speak(exercise.steps[0]);
  setStep(6);
}

function startBreathCycle() {
  stopBreathCycle();
  const exercise = exercises[state.activeExerciseId];
  let index = 0;
  els.breathCue.textContent = exercise.cue;
  els.breathPhase.textContent = exercise.phase;
  state.breathTimer = window.setInterval(() => {
    const phrases = exercise.steps;
    const phrase = phrases[index % phrases.length];
    els.breathCue.textContent = index % 2 === 0 ? exercise.cue : 'Weiter ruhig';
    els.breathPhase.textContent = phrase;
    index += 1;
  }, 7000);
}

function stopBreathCycle() {
  if (state.breathTimer) window.clearInterval(state.breathTimer);
  state.breathTimer = null;
}

function toggleWriteForm() {
  els.textForm.hidden = !els.textForm.hidden;
  if (!els.textForm.hidden) els.textInput.focus();
}

async function handleTextSubmit(event) {
  event.preventDefault();
  const text = els.textInput.value.trim();
  if (!text) return;
  els.textInput.value = '';
  await processUserText(text);
}

async function processUserText(text) {
  addMessage('user', text);
  const safety = crisisPatterns.some((pattern) => pattern.test(text));
  if (safety) {
    addMessage('assistant', crisisReply);
    await speak(crisisReply, 'crisis');
    return;
  }
  inferFromText(text);
  updateExercisePreview();
  const reply = buildBrowserReply(text);
  addMessage('assistant', reply);
  await speak(reply);
  persistHistory();
  updateMetrics();
}

function inferFromText(text) {
  const lower = text.toLowerCase();
  for (const [emotion, words] of Object.entries(keywordMap)) {
    if (words.some((word) => lower.includes(word))) {
      state.checkin.emotion = emotion;
      break;
    }
  }
  const match = lower.match(/\b(10|[0-9])\s*(von\s*)?10\b|\b(10|[0-9])\s*\/\s*10\b/);
  if (match) {
    const raw = match[1] || match[3];
    state.checkin.intensity = Math.max(0, Math.min(10, Number(raw)));
  }
  for (const body of ['Brust', 'Bauch', 'Kopf', 'Hals', 'Schultern']) {
    if (lower.includes(body.toLowerCase())) state.checkin.bodyFocus = body;
  }
  syncChoicesToState();
  persistCheckin();
  updateVisualState();
}

function buildBrowserReply(text) {
  const exercise = exercises[state.activeExerciseId];
  const label = emotionLabels[state.checkin.emotion] || 'das Gef\u00fchl';
  const first = exercise.steps[0];
  const second = exercise.steps[1] || 'Bleib f\u00fcr einen Moment bei deinem Atem.';
  return [
    `Ich nehme ${label} bei etwa ${state.checkin.intensity}/10 wahr, besonders im Bereich ${state.checkin.bodyFocus}.`,
    'Wir machen es klein und sicher.',
    `Jetzt: ${first}`,
    `Danach: ${second}`
  ].join(' ');
}

function addMessage(role, content) {
  const message = { role, content, at: new Date().toISOString() };
  state.history.push(message);
  state.history = state.history.slice(-30);
  const node = document.createElement('article');
  node.className = `message ${role}`;
  const who = role === 'assistant' ? 'Resonara KI' : 'Du';
  node.innerHTML = `<strong>${who}</strong>${escapeHtml(content)}`;
  els.messages.appendChild(node);
  els.messages.scrollTop = els.messages.scrollHeight;
  persistHistory();
  updateMetrics();
}

async function toggleRecording() {
  if (state.busy) return;
  if (state.isRecording) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  const settings = getAudioSettings();
  if (!settings.serverUrl) {
    els.recordStatus.textContent = 'Sprache ist noch nicht eingerichtet. Du kannst jetzt schreiben oder die Audio-Adresse eintragen.';
    togglePanel(els.settingsPanel, els.settingsToggle, true);
    return;
  }
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    els.recordStatus.textContent = 'Dein Browser unterst\u00fctzt diese Aufnahmefunktion nicht. Schreiben funktioniert weiterhin.';
    return;
  }
  try {
    state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.chunks = [];
    state.mediaRecorder = new MediaRecorder(state.mediaStream, { mimeType: pickMimeType() });
    state.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) state.chunks.push(event.data);
    });
    state.mediaRecorder.addEventListener('stop', handleRecordingStop);
    state.mediaRecorder.start();
    state.isRecording = true;
    els.recordButton.setAttribute('aria-pressed', 'true');
    els.recordLabel.textContent = 'Stoppen';
    els.recordStatus.textContent = 'Ich h\u00f6re zu. Sprich einen kurzen Satz.';
  } catch (error) {
    els.recordStatus.textContent = 'Das Mikrofon konnte nicht gestartet werden. Du kannst stattdessen schreiben.';
  }
}

function stopRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') state.mediaRecorder.stop();
  if (state.mediaStream) state.mediaStream.getTracks().forEach((track) => track.stop());
  state.isRecording = false;
  els.recordButton.setAttribute('aria-pressed', 'false');
  els.recordLabel.textContent = 'Sprechen';
  els.recordStatus.textContent = 'Aufnahme wird verarbeitet.';
}

async function handleRecordingStop() {
  const blob = new Blob(state.chunks, { type: pickMimeType() || 'audio/webm' });
  if (blob.size < 800) {
    els.recordStatus.textContent = 'Ich habe kaum Sprache erkannt. Versuche es noch einmal oder schreibe einen Satz.';
    return;
  }
  try {
    state.busy = true;
    const transcript = await transcribeAudio(blob);
    els.recordStatus.textContent = 'Ich habe dich verstanden.';
    await processUserText(transcript);
  } catch (error) {
    els.recordStatus.textContent = friendlyError(error, 'Sprache konnte gerade nicht verarbeitet werden. Schreiben funktioniert weiterhin.');
  } finally {
    state.busy = false;
  }
}

function pickMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return types.find((type) => window.MediaRecorder && MediaRecorder.isTypeSupported(type)) || '';
}

async function transcribeAudio(blob) {
  const settings = getAudioSettings();
  const form = new FormData();
  form.append('audio', blob, `resonara-${Date.now()}.webm`);
  form.append('language', settings.language);
  const response = await fetch(`${settings.serverUrl}/api/transcribe`, {
    method: 'POST',
    headers: tokenHeaders(settings),
    body: form
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  const transcript = String(data.transcript || '').trim();
  if (!transcript) throw new Error('empty transcript');
  return transcript;
}

async function speak(text, safetyStatus = 'ok') {
  const settings = getAudioSettings();
  if (settings.useServerTts && settings.serverUrl) {
    try {
      const response = await fetch(`${settings.serverUrl}/api/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...tokenHeaders(settings) },
        body: JSON.stringify({ text, safety_status: safetyStatus })
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      if (data.audio_base64 && data.audio_mime) {
        const blob = base64ToBlob(data.audio_base64, data.audio_mime);
        const url = URL.createObjectURL(blob);
        els.player.src = url;
        els.player.hidden = false;
        await els.player.play().catch(() => undefined);
        return;
      }
    } catch (error) {
      console.warn('Audio output unavailable', error);
    }
  }
  if (settings.useBrowserTts && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.92;
    utterance.pitch = 0.96;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

function base64ToBlob(base64, mime) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

function tokenHeaders(settings) {
  return settings.apiToken ? { 'X-Client-Token': settings.apiToken } : {};
}

function normalizeUrl(value) {
  return value.trim().replace(/\/+$/, '');
}

function getAudioSettings() {
  return {
    serverUrl: normalizeUrl(els.serverUrl.value),
    apiToken: els.apiToken.value.trim(),
    language: els.language.value || 'de',
    mode: els.processingMode.value || 'browser-first',
    useServerTts: els.useServerTts.checked,
    useBrowserTts: els.useBrowserTts.checked
  };
}

function loadSettings() {
  els.serverUrl.value = localStorage.getItem(storageKeys.serverUrl) || '';
  els.apiToken.value = localStorage.getItem(storageKeys.apiToken) || '';
  els.language.value = localStorage.getItem(storageKeys.language) || 'de';
  els.useServerTts.checked = localStorage.getItem(storageKeys.useServerTts) !== 'false';
  els.useBrowserTts.checked = localStorage.getItem(storageKeys.useBrowserTts) !== 'false';
}

function saveSettings() {
  const settings = getAudioSettings();
  localStorage.setItem(storageKeys.serverUrl, settings.serverUrl);
  localStorage.setItem(storageKeys.apiToken, settings.apiToken);
  localStorage.setItem(storageKeys.language, settings.language);
  localStorage.setItem(storageKeys.useServerTts, String(settings.useServerTts));
  localStorage.setItem(storageKeys.useBrowserTts, String(settings.useBrowserTts));
  els.connectionStatus.textContent = settings.serverUrl ? 'Sprache bereit' : 'Bereit';
  togglePanel(els.settingsPanel, els.settingsToggle, false);
}

async function testConnection() {
  const settings = getAudioSettings();
  if (!settings.serverUrl) {
    els.connectionStatus.textContent = 'Audio-Adresse fehlt';
    return;
  }
  try {
    els.connectionStatus.textContent = 'Pr\u00fcfe Sprache';
    const response = await fetch(`${settings.serverUrl}/health`, { headers: tokenHeaders(settings) });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    const canTranscribe = Boolean(data.capabilities && data.capabilities.transcribe);
    const canSpeak = Boolean(data.capabilities && data.capabilities.speak);
    els.connectionStatus.textContent = canTranscribe || canSpeak ? 'Sprache bereit' : 'Text bereit';
  } catch (error) {
    els.connectionStatus.textContent = 'Text bereit';
  }
}

function togglePanel(panel, button, force) {
  const next = typeof force === 'boolean' ? force : panel.hidden;
  panel.hidden = !next;
  if (button) button.setAttribute('aria-expanded', String(next));
  if (next) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function persistCheckin() {
  localStorage.setItem(storageKeys.checkin, JSON.stringify(state.checkin));
}

function persistHistory() {
  localStorage.setItem(storageKeys.history, JSON.stringify(state.history.slice(-30)));
}

function restoreState() {
  try {
    const savedCheckin = JSON.parse(localStorage.getItem(storageKeys.checkin) || 'null');
    if (savedCheckin && typeof savedCheckin === 'object') state.checkin = { ...defaultCheckin, ...savedCheckin };
  } catch {}
  try {
    const savedHistory = JSON.parse(localStorage.getItem(storageKeys.history) || '[]');
    if (Array.isArray(savedHistory)) state.history = savedHistory.slice(-30);
  } catch {}
  state.afterIntensity = Math.max(0, Number(state.checkin.intensity || 0) - 1);
  els.afterIntensity.value = String(state.afterIntensity);
  state.activeExerciseId = localStorage.getItem(storageKeys.activeExercise) || selectExercise();
  syncChoicesToState();
  renderHistory();
}

function syncChoicesToState() {
  $$('#emotionField .chip').forEach((button) => button.classList.toggle('active', button.dataset.emotion === state.checkin.emotion));
  $$('#bodyFocus .body-choice').forEach((button) => button.classList.toggle('active', button.dataset.body === state.checkin.bodyFocus));
  $$('#sessionGoal .goal-choice').forEach((button) => button.classList.toggle('active', button.dataset.goal === state.checkin.sessionGoal));
  els.intensity.value = String(state.checkin.intensity);
}

function renderHistory() {
  els.messages.innerHTML = '';
  state.history.slice(-8).forEach((message) => {
    const node = document.createElement('article');
    node.className = `message ${message.role}`;
    const who = message.role === 'assistant' ? 'Resonara KI' : 'Du';
    node.innerHTML = `<strong>${who}</strong>${escapeHtml(message.content)}`;
    els.messages.appendChild(node);
  });
}

function updateMetrics() {
  const turns = state.history.filter((item) => item.role === 'user').length;
  els.metricTurns.textContent = `${turns} ${turns === 1 ? 'Beitrag' : 'Beitr\u00e4ge'}`;
  const exercise = exercises[state.activeExerciseId] || exercises['breath-46'];
  els.metricExercise.textContent = exercise.title;
  els.metricIntensity.textContent = `${state.checkin.intensity}/10`;
}

function clearSession() {
  state.history = [];
  els.messages.innerHTML = '';
  addMessage('assistant', 'Der aktuelle Verlauf ist gel\u00f6scht. Wir k\u00f6nnen wieder langsam beginnen.');
  persistHistory();
  updateMetrics();
}

function resetLocalData() {
  const ok = window.confirm('Lokale Resonara-Daten wirklich l\u00f6schen?');
  if (!ok) return;
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  window.location.reload();
}

function buildSummary() {
  const exercise = exercises[state.activeExerciseId] || exercises['breath-46'];
  const next = els.nextStepInput.value.trim() || 'einen kleinen n\u00e4chsten Schritt w\u00e4hlen';
  return [
    'Resonara Kurznotiz',
    `Gef\u00fchl: ${emotionLabels[state.checkin.emotion] || state.checkin.emotion}`,
    `Start: ${state.checkin.intensity}/10`,
    `Jetzt: ${state.afterIntensity}/10`,
    `K\u00f6rper-Fokus: ${state.checkin.bodyFocus}`,
    `\u00dcbung: ${exercise.title}`,
    `N\u00e4chster Schritt: ${next}`
  ].join('\n');
}

async function copySummary() {
  const summary = buildSummary();
  try {
    await navigator.clipboard.writeText(summary);
    els.connectionStatus.textContent = 'Notiz kopiert';
  } catch {
    els.connectionStatus.textContent = 'Kopieren nicht m\u00f6glich';
  }
}

function exportSession() {
  const payload = {
    exportedAt: new Date().toISOString(),
    checkin: state.checkin,
    afterIntensity: state.afterIntensity,
    activeExercise: exercises[state.activeExerciseId],
    nextStep: els.nextStepInput.value.trim(),
    history: state.history
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resonara-session-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function newSession() {
  state.step = 0;
  state.checkin = { ...defaultCheckin };
  state.afterIntensity = 5;
  state.history = [];
  els.nextStepInput.value = '';
  els.messages.innerHTML = '';
  syncChoicesToState();
  updateExercisePreview();
  updateVisualState();
  addMessage('assistant', 'Wir starten neu. Ein Schritt reicht. Was ist gerade da?');
  persistCheckin();
  persistHistory();
  setStep(0);
}

function setupInstall() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    els.installButton.hidden = false;
  });
  els.installButton.addEventListener('click', async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice.catch(() => undefined);
    state.deferredInstallPrompt = null;
    els.installButton.hidden = true;
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => undefined));
  }
}

function startAmbientCanvas() {
  const canvas = els.ambientCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);
  const dots = Array.from({ length: 54 }, (_, index) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1 + Math.random() * 2.8,
    s: 0.2 + Math.random() * 0.48,
    o: 0.08 + Math.random() * 0.18,
    index
  }));
  const draw = (time) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    dots.forEach((dot) => {
      dot.y -= dot.s;
      dot.x += Math.sin(time / 2600 + dot.index) * 0.14;
      if (dot.y < -20) dot.y = window.innerHeight + 20;
      ctx.beginPath();
      ctx.fillStyle = `rgba(243, 246, 255, ${dot.o})`;
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    state.ambientFrame = requestAnimationFrame(draw);
  };
  state.ambientFrame = requestAnimationFrame(draw);
}

function startResonanceCanvas() {
  const canvas = els.resonanceCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const draw = (time) => {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const palette = colors[state.checkin.emotion] || colors.stress;
    ctx.clearRect(0, 0, w, h);
    for (let ring = 0; ring < 4; ring += 1) {
      const radius = 70 + ring * 46 + Math.sin(time / 900 + ring) * (8 + state.checkin.intensity);
      ctx.beginPath();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = hexToRgba(palette[ring % palette.length], 0.24 - ring * 0.035);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 18; i += 1) {
      const angle = (Math.PI * 2 * i) / 18 + time / 4200;
      const radius = 128 + Math.sin(time / 1100 + i) * 24;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(palette[i % palette.length], 0.36);
      ctx.arc(x, y, 2.4 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    state.resonanceFrame = requestAnimationFrame(draw);
  };
  state.resonanceFrame = requestAnimationFrame(draw);
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function friendlyError(error, fallback) {
  const text = error && error.message ? error.message : String(error || '');
  if (/401/.test(text)) return 'Der Zugangscode passt nicht. Bitte pr\u00fcfe die Spracheinstellungen.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(text)) return 'Die Audio-Verbindung ist gerade nicht erreichbar. Schreiben funktioniert weiterhin.';
  return fallback;
}
