const els = {
  splashScreen: document.querySelector('#splashScreen'),
  trustGate: document.querySelector('#trustGate'),
  trustForm: document.querySelector('#trustForm'),
  acceptTrust: document.querySelector('#acceptTrust'),
  trustAiCheck: document.querySelector('#trustAiCheck'),
  trustDataCheck: document.querySelector('#trustDataCheck'),
  trustCrisisCheck: document.querySelector('#trustCrisisCheck'),
  heroStart: document.querySelector('#heroStart'),
  guidedStart: document.querySelector('#guidedStart'),
  guidedCheckin: document.querySelector('#guidedCheckin'),
  guidedWrite: document.querySelector('#guidedWrite'),
  resonancePaths: document.querySelector('#resonancePaths'),
  pathwayNote: document.querySelector('#pathwayNote'),
  pathwayCards: document.querySelectorAll('[data-pathway]'),
  dockReset: document.querySelector('#dockReset'),
  dockPaths: document.querySelector('#dockPaths'),
  dockSpeak: document.querySelector('#dockSpeak'),
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
  exerciseProgress: document.querySelector('#exerciseProgress'),
  exerciseSteps: document.querySelector('#exerciseSteps'),
  nextStep: document.querySelector('#nextStep'),
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
  privacyGauge: document.querySelector('#privacyGauge'),
  reflectionPanel: document.querySelector('#reflectionPanel'),
  reflectionBefore: document.querySelector('#reflectionBefore'),
  reflectionAfterValue: document.querySelector('#reflectionAfterValue'),
  reflectionPrompt: document.querySelector('#reflectionPrompt'),
  afterIntensity: document.querySelector('#afterIntensity'),
  reflectionNote: document.querySelector('#reflectionNote'),
  saveReflection: document.querySelector('#saveReflection'),
  skipReflection: document.querySelector('#skipReflection'),
  journalList: document.querySelector('#journalList'),
  journalHint: document.querySelector('#journalHint')
};

const storageKeys = {
  serverUrl: 'resonara.serverUrl',
  apiToken: 'resonara.apiToken',
  language: 'resonara.language',
  processingMode: 'resonara.processingMode',
  useServerTts: 'resonara.useServerTts',
  useBrowserTts: 'resonara.useBrowserTts',
  trustAccepted: 'resonara.trustAccepted',
  consentVersion: 'resonara.consentVersion',
  consentAt: 'resonara.consentAt',
  history: 'resonara.history',
  checkin: 'resonara.checkin',
  activeExercise: 'resonara.activeExercise',
  activePathway: 'resonara.activePathway',
  journal: 'resonara.journal'
};

const CONSENT_VERSION = '2026-07-resonance-paths-v6';

const defaultCheckin = {
  emotion: 'stress',
  intensity: 6,
  bodyFocus: 'Brust',
  sessionGoal: 'runterregeln'
};

const resonancePathways = {
  calm: {
    title: 'Sofort runterkommen',
    exercise: 'breath-46',
    checkin: { emotion: 'stress', intensity: 6, bodyFocus: 'Brust', sessionGoal: 'runterregeln' },
    note: 'Vorauswahl: Stress 6/10, Brust, 4-6 Atemanker. Du kannst alles danach ändern.',
    userLine: 'Ich brauche gerade einen kurzen Reset.',
    opening: 'Wir nehmen Tempo raus. Du musst nichts erklären – nur den ersten Atemzug finden.'
  },
  clarity: {
    title: 'Klarheit sammeln',
    exercise: 'pre-meeting-anchor',
    checkin: { emotion: 'unklar', intensity: 5, bodyFocus: 'Hals', sessionGoal: 'klarheit' },
    note: 'Vorauswahl: Unklarheit 5/10, Hals, Klarheitsanker. Gut vor Gesprächen oder Entscheidungen.',
    userLine: 'Ich möchte vor einem Gespräch ruhiger und klarer werden.',
    opening: 'Wir sortieren nur den nächsten Satz. Nicht die ganze Situation.'
  },
  release: {
    title: 'Spannung entladen',
    exercise: 'boundary-sort',
    checkin: { emotion: 'wut', intensity: 7, bodyFocus: 'Schultern', sessionGoal: 'klarheit' },
    note: 'Vorauswahl: Wut 7/10, Schultern, Grenze sortieren. Gut nach Konflikt, Kritik oder Druck.',
    userLine: 'Nach einem Konflikt ist noch Druck in mir.',
    opening: 'Wir lassen die Energie dosiert aus dem Körper und sortieren erst danach den nächsten Schritt.'
  },
  sleep: {
    title: 'Sanft abschalten',
    exercise: 'evening-release',
    checkin: { emotion: 'ueberforderung', intensity: 4, bodyFocus: 'ganzer Körper', sessionGoal: 'einschlafen' },
    note: 'Vorauswahl: Überforderung 4/10, ganzer Körper, Abend-Ausklang. Für Grübeln und Erschöpfung.',
    userLine: 'Ich möchte den Tag leiser machen und langsam abschalten.',
    opening: 'Wir lösen heute nichts mehr. Dein System darf ein kleines Stück weicher werden.'
  }
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
  activePathway: 'calm',
  exerciseStepIndex: 0,
  reflectionBeforeIntensity: defaultCheckin.intensity,
  reflectionStartedAt: null,
  journal: [],
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
  'pre-meeting-anchor': {
    title: 'Klarheitsanker',
    reason: 'Vor Gesprächen hilft ein kurzer Körperanker und ein einfacher nächster Satz.',
    tags: ['klarheit', 'mut', 'angst', 'unklar'],
    steps: [
      'Spüre beide Füße und lass den Blick kurz im Raum ankommen.',
      'Benennen: Was ist mir in diesem Gespräch wirklich wichtig?',
      'Formuliere einen ersten Satz, der ruhig und kurz ist.',
      'Atme einmal länger aus und nimm nur diesen ersten Satz mit.'
    ]
  },
  'boundary-sort': {
    title: 'Grenze sortieren',
    reason: 'Nach Konflikt hilft es, Körperdruck zu senken und Verantwortung zu trennen.',
    tags: ['wut', 'klarheit', 'runterregeln'],
    steps: [
      'Drücke beide Füße 5 Sekunden in den Boden und löse wieder.',
      'Sag innerlich: Das ist mein Anteil. Das ist der Anteil der anderen Person.',
      'Lege eine Hand auf Brust oder Bauch und frage: Welche Grenze braucht Schutz?',
      'Wähle einen kleinen nächsten Schritt: Abstand, Gespräch, Notiz oder Pause.'
    ]
  },
  'evening-release': {
    title: 'Abend-Ausklang',
    reason: 'Am Abend ist weniger Analyse oft hilfreicher als noch mehr Nachdenken.',
    tags: ['einschlafen', 'traurigkeit', 'ueberforderung', 'stress'],
    steps: [
      'Lege das Gerät für einen Moment etwas tiefer oder entspanne die Hände.',
      'Sag innerlich: Für heute muss ich das nicht fertig lösen.',
      'Spüre Stirn, Kiefer, Schultern und Bauch jeweils einen Atemzug lang.',
      'Wähle ein leises Ende: Licht dimmen, Wasser trinken oder drei langsame Atemzüge.'
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
  state.journal = safeParse(localStorage.getItem(storageKeys.journal), []);
  state.activeExerciseId = localStorage.getItem(storageKeys.activeExercise) || null;
  state.activePathway = localStorage.getItem(storageKeys.activePathway) || 'calm';
  bindEvents();
  initSplash();
  renderCheckin();
  renderHistory();
  initTrustGate();
  if (state.trustAccepted) addInitialMessage();
  renderExercise();
  renderJournal();
  renderPathwayUi(state.activePathway || 'calm');
  updateReflectionPanel(false);
  updateMetrics();
  registerServiceWorker();
  setConnectionStatus('Bereit');
  initVisuals();
}

function bindEvents() {
  els.saveSettings.addEventListener('click', () => saveSettings(true));
  els.trustForm.addEventListener('submit', acceptTrustGate);
  [els.trustAiCheck, els.trustDataCheck, els.trustCrisisCheck].forEach((input) => input.addEventListener('change', updateTrustCta));
  els.heroStart.addEventListener('click', showStartChoices);
  if (els.guidedStart) els.guidedStart.addEventListener('click', startHeroReset);
  if (els.guidedCheckin) els.guidedCheckin.addEventListener('click', startGuidedFlow);
  if (els.guidedWrite) els.guidedWrite.addEventListener('click', focusTextInput);
  if (els.pathwayCards) {
    els.pathwayCards.forEach((button) => {
      button.addEventListener('click', () => startResonancePath(button.dataset.pathway));
    });
  }
  if (els.dockReset) els.dockReset.addEventListener('click', () => { tryVibrate(12); startHeroReset(); });
  if (els.dockPaths) els.dockPaths.addEventListener('click', showPathways);
  if (els.dockSpeak) els.dockSpeak.addEventListener('click', () => { tryVibrate(16); focusTextInput(); });
  els.revisitTrust.addEventListener('click', showTrustGate);
  els.testConnection.addEventListener('click', testConnection);
  els.settingsToggle.addEventListener('click', toggleSettings);
  els.recordButton.addEventListener('click', toggleRecording);
  els.clearSession.addEventListener('click', clearSession);
  els.copySummary.addEventListener('click', copySummary);
  els.textForm.addEventListener('submit', submitText);
  els.suggestExercise.addEventListener('click', startHeroReset);
  if (els.nextStep) els.nextStep.addEventListener('click', runNextStep);
  if (els.afterIntensity) els.afterIntensity.addEventListener('input', handleAfterIntensity);
  if (els.saveReflection) els.saveReflection.addEventListener('click', saveReflection);
  if (els.skipReflection) els.skipReflection.addEventListener('click', () => updateReflectionPanel(false));
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
  state.trustAccepted = localStorage.getItem(storageKeys.trustAccepted) === 'true' && localStorage.getItem(storageKeys.consentVersion) === CONSENT_VERSION;
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
  localStorage.setItem(storageKeys.consentVersion, CONSENT_VERSION);
  localStorage.setItem(storageKeys.consentAt, new Date().toISOString());
  hideTrustGate(false);
  addInitialMessage();
  showStartChoices();
  updateCoachGuide(1);
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

function tryVibrate(pattern = 10) {
  if ('vibrate' in navigator && !visual.prefersReducedMotion) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
}

function showStartChoices() {
  if (!ensureTrustAccepted()) return;
  tryVibrate(8);
  const target = document.querySelector('#startGuide') || document.querySelector('.hero-card');
  if (target) target.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  updateCoachGuide(1);
}

function focusTextInput() {
  if (!ensureTrustAccepted()) return;
  tryVibrate(8);
  const target = document.querySelector('#coach') || els.textForm;
  if (target) target.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  window.setTimeout(() => els.textInput.focus({ preventScroll: true }), 220);
  updateCoachGuide(3);
}


function showPathways() {
  if (!ensureTrustAccepted()) return;
  tryVibrate(8);
  if (els.resonancePaths) {
    els.resonancePaths.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function startResonancePath(id) {
  if (!ensureTrustAccepted()) return;
  const path = resonancePathways[id] || resonancePathways.calm;
  const exercise = { id: path.exercise, ...exercises[path.exercise] };
  if (!exercise.title) return;
  state.activePathway = id || 'calm';
  state.checkin = { ...state.checkin, ...path.checkin };
  state.activeExerciseId = path.exercise;
  state.exerciseStepIndex = 0;
  captureReflectionStart();
  persistCheckin();
  persistActiveExercise();
  localStorage.setItem(storageKeys.activePathway, state.activePathway);
  renderCheckin();
  renderPathwayUi(state.activePathway);
  renderExercise(exercise);
  updateReflectionPanel(false);
  updateCoachGuide(2);
  appendMessage('user', path.userLine);
  const reply = [
    `Du hast „${path.title}“ gewählt.`,
    path.opening,
    `Wir starten mit „${exercise.title}“. Folge Schritt 1 im Übungsfeld.`,
    'Danach tippe einfach auf „Nächster Schritt“.'
  ].join('\n');
  appendMessage('assistant', reply);
  speakText(reply, 'ok');
  const target = els.exercisePanel && !els.exercisePanel.hidden ? els.exercisePanel : document.querySelector('#coach');
  window.setTimeout(() => target?.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'center' }), 120);
}

function renderPathwayUi(activeId = 'calm') {
  const path = resonancePathways[activeId] || resonancePathways.calm;
  if (els.pathwayNote) els.pathwayNote.textContent = path.note;
  if (els.pathwayCards) {
    els.pathwayCards.forEach((button) => {
      const isActive = button.dataset.pathway === activeId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }
  document.body.dataset.pathway = activeId;
}

function startGuidedFlow() {
  if (!ensureTrustAccepted()) return;
  tryVibrate(10);
  const target = document.querySelector('#checkinTitle') || document.querySelector('.checkin');
  if (target) target.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  updateCoachGuide(1);
  window.setTimeout(() => {
    const activeChip = document.querySelector('.chip.active');
    if (activeChip) activeChip.focus({ preventScroll: true });
  }, 180);
}



function startHeroReset() {
  startResonancePath('calm');
}

function focusCheckin() {
  if (!ensureTrustAccepted()) return;
  tryVibrate(8);
  document.querySelector('#checkinTitle').scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  updateCoachGuide(1);
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
  setConnectionStatus(normalizedUrl ? 'Stimme bereit' : 'Stimme optional');
  if (showToast) toastSystem('Stimme ist bereit. Dein Verlauf bleibt auf diesem Gerät.');
}

async function testConnection() {
  saveSettings(false);
  const serverUrl = getServerUrl();
  if (!serverUrl) {
    setConnectionStatus('Stimme noch nicht bereit', false);
    toastSystem('Bitte füge zuerst deine Sprachfreigabe ein. Schreiben funktioniert auch ohne Stimme.');
    return;
  }
  setConnectionStatus('Teste …', null);
  try {
    const data = await fetchJson(`${serverUrl}/health`, { headers: authHeaders(), mode: 'cors' });
    const deps = data.dependencies || {};
    const hasStt = deps.ffmpeg && deps.whisper_cpp_bin && deps.whisper_model;
    const hasTts = deps.piper_bin && deps.piper_model;
    setConnectionStatus(hasStt ? `Stimme bereit${hasTts ? '' : ', Antwortstimme fehlt'}` : 'Noch nicht bereit', hasStt);
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
    toastSystem('Du kannst sofort schreiben. Wenn du sprechen möchtest, aktiviere zuerst deine Stimme.');
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
  els.recordLabel.textContent = 'Lieber sprechen';
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
    toastSystem('Bitte zuerst deine Sprachfreigabe speichern oder direkt schreiben.');
    return;
  }
  setBusy(true, 'Resonara bereitet eine Antwort vor …');
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
    captureReflectionStart();
    persistActiveExercise();
    renderExercise();
    updateReflectionPanel(true);
    appendMessage('assistant', reply);
    speakText(reply, 'ok');
    return;
  }
  if (!exercises[id]) return;
  const exercise = { id, ...exercises[id] };
  state.activeExerciseId = id;
  state.exerciseStepIndex = 0;
  captureReflectionStart();
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
  state.exerciseStepIndex = 0;
  captureReflectionStart();
  persistActiveExercise();
  renderExercise(exercise);
  return { reply: composeReply({ exercise, text: clean, source }), role: 'assistant', safetyStatus: 'ok', exercise };
}

function applyBrowserTurn(turn) {
  appendMessage(turn.role || 'assistant', turn.reply);
  updateMetrics();
  if (turn.exercise && els.exercisePanel) {
    window.setTimeout(() => els.exercisePanel.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'center' }), 80);
  }
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
    ? `Okay. Wir starten mit ${emotion}, ${intensity}/10.`
    : `Ich nehme dich wahr: ${emotion}, ${intensity}/10, spürbar bei ${body}.`;
  state.exerciseStepIndex = 0;
  updateCoachGuide(2);
  return [
    opening,
    `Resonara schlägt jetzt „${exercise.title}“ vor.`,
    'Folge nur Schritt 1 im Übungsfeld. Danach tippe auf „Nächster Schritt“.'
  ].join('\n');
}

function runNextStep() {
  if (!ensureTrustAccepted()) return;
  if (!state.activeExerciseId || !exercises[state.activeExerciseId]) {
    runBrowserCoach('Ich möchte einen 2-Minuten-Reset starten.', 'suggest');
    return;
  }
  const exercise = { id: state.activeExerciseId, ...exercises[state.activeExerciseId] };
  const nextIndex = Math.min((state.exerciseStepIndex || 0) + 1, exercise.steps.length);
  if (nextIndex >= exercise.steps.length) {
    state.exerciseStepIndex = exercise.steps.length - 1;
    renderExercise(exercise);
    updateCoachGuide(4);
    updateReflectionPanel(true);
    const reply = [
      'Gut. Das reicht für diesen Moment.',
      'Schätze dich jetzt neu ein: Welche Zahl passt gerade?'
    ].join('\n');
    appendMessage('assistant', reply);
    speakText(reply, 'ok');
    if (els.reflectionPanel) els.reflectionPanel.scrollIntoView({ behavior: visual.prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    return;
  }
  state.exerciseStepIndex = nextIndex;
  renderExercise(exercise);
  updateCoachGuide(3);
  const reply = [
    `Jetzt Schritt ${nextIndex + 1}.`,
    nextIndex === exercise.steps.length - 1
      ? 'Danach schätzen wir neu ein.'
      : 'Wenn du bereit bist, tippe wieder auf „Nächster Schritt“. '
  ].join('\n');
  appendMessage('assistant', reply.trim());
  speakText(reply, 'ok');
}

function buildClosingReply() {
  const summary = buildSessionSummary();
  return [
    'Lass uns sanft abschließen.',
    'Was ist jetzt minimal anders – ruhiger, klarer oder einfach nur benannt?',
    `Kurznotiz: ${summary.oneLine}`
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
    if (els.exerciseProgress) els.exerciseProgress.textContent = '';
    updateBreathCard(null);
    updateCoachGuide(1);
    return;
  }
  const current = Math.min(Math.max(Number(state.exerciseStepIndex) || 0, 0), selected.steps.length - 1);
  els.exercisePanel.hidden = false;
  els.exerciseTitle.textContent = selected.title;
  els.exerciseReason.textContent = selected.reason;
  if (els.exerciseProgress) els.exerciseProgress.textContent = `Schritt ${current + 1} von ${selected.steps.length}`;
  els.exerciseSteps.innerHTML = '';
  selected.steps.forEach((step, index) => {
    const li = document.createElement('li');
    li.textContent = step;
    if (index < current) li.classList.add('is-done');
    if (index === current) li.classList.add('is-active');
    els.exerciseSteps.appendChild(li);
  });
  updateBreathCard(selected);
}

function updateCoachGuide(activeStep = 1) {
  document.querySelectorAll('.coach-step').forEach((step, index) => {
    const number = index + 1;
    step.classList.toggle('is-current', number === activeStep);
    step.classList.toggle('is-done', number < activeStep);
  });
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

function captureReflectionStart() {
  state.reflectionBeforeIntensity = Number(state.checkin.intensity) || 0;
  state.reflectionStartedAt = new Date().toISOString();
  if (els.afterIntensity) els.afterIntensity.value = String(state.reflectionBeforeIntensity);
  updateReflectionPanel(false);
}

function handleAfterIntensity() {
  const value = Number(els.afterIntensity && els.afterIntensity.value) || 0;
  if (els.reflectionAfterValue) els.reflectionAfterValue.textContent = String(value);
  document.documentElement.style.setProperty('--reflection-now', `${Math.max(0, Math.min(100, value * 10))}%`);
  updateReflectionPrompt(value);
}

function updateReflectionPanel(show = null) {
  if (!els.reflectionPanel) return;
  const hasExercise = Boolean(state.activeExerciseId);
  const shouldShow = show === null ? hasExercise : Boolean(show && hasExercise);
  els.reflectionPanel.hidden = !shouldShow;
  const before = Number.isFinite(state.reflectionBeforeIntensity) ? state.reflectionBeforeIntensity : Number(state.checkin.intensity) || 0;
  if (els.reflectionBefore) els.reflectionBefore.textContent = String(before);
  if (els.afterIntensity && !els.afterIntensity.value) els.afterIntensity.value = String(Number(state.checkin.intensity) || before);
  handleAfterIntensity();
}

function updateReflectionPrompt(afterValue) {
  if (!els.reflectionPrompt) return;
  const before = Number.isFinite(state.reflectionBeforeIntensity) ? state.reflectionBeforeIntensity : Number(state.checkin.intensity) || 0;
  const delta = before - afterValue;
  if (delta > 0) {
    els.reflectionPrompt.textContent = `Vorher ${before}/10, jetzt ${afterValue}/10. Nimm den kleinen Unterschied wahr – ohne ihn festhalten zu müssen.`;
  } else if (delta < 0) {
    els.reflectionPrompt.textContent = `Vorher ${before}/10, jetzt ${afterValue}/10. Gut, dass du es bemerkst. Mach langsamer und hol dir Unterstützung, wenn es zu viel wird.`;
  } else {
    els.reflectionPrompt.textContent = `Vorher ${before}/10, jetzt ${afterValue}/10. Auch stabil bleiben ist eine Information.`;
  }
}

function saveReflection() {
  if (!ensureTrustAccepted()) return;
  const before = Number.isFinite(state.reflectionBeforeIntensity) ? state.reflectionBeforeIntensity : Number(state.checkin.intensity) || 0;
  const after = Number(els.afterIntensity && els.afterIntensity.value);
  if (!Number.isFinite(after) || after < 0 || after > 10) return;
  const note = els.reflectionNote ? els.reflectionNote.value.trim() : '';
  const exerciseTitle = state.activeExerciseId && exercises[state.activeExerciseId] ? exercises[state.activeExerciseId].title : 'Abschluss';
  const entry = {
    at: new Date().toISOString(),
    emotion: state.checkin.emotion,
    bodyFocus: state.checkin.bodyFocus,
    goal: state.checkin.sessionGoal,
    exercise: exerciseTitle,
    before,
    after,
    delta: before - after,
    note
  };
  state.journal.unshift(entry);
  state.journal = state.journal.slice(0, 18);
  localStorage.setItem(storageKeys.journal, JSON.stringify(state.journal));
  state.checkin.intensity = after;
  persistCheckin();
  renderCheckin();
  renderJournal();
  updateMetrics();
  updateCoachGuide(4);
  if (els.reflectionNote) els.reflectionNote.value = '';
  const reply = buildReflectionSavedReply(entry);
  appendMessage('assistant', reply);
  speakText(reply, entry.delta < 0 ? 'caution' : 'ok');
  updateReflectionPanel(false);
}

function buildReflectionSavedReply(entry) {
  const direction = entry.delta > 0
    ? `von ${entry.before}/10 auf ${entry.after}/10 – ein Stück ruhiger.`
    : entry.delta < 0
      ? `von ${entry.before}/10 auf ${entry.after}/10 – gerade eher stärker.`
      : `bei ${entry.after}/10 – stabil genug für diesen Moment.`;
  const next = entry.delta < 0
    ? 'Mach jetzt kleiner: beide Füße spüren, einmal lang ausatmen, und hol dir menschliche Unterstützung, wenn es kippt.'
    : 'Nimm eine kleine Sache mit: Was hat dir eben am meisten geholfen?';
  return [`Gespeichert: ${direction}`, next].join('\n');
}

function renderJournal() {
  if (!els.journalList) return;
  els.journalList.innerHTML = '';
  if (!Array.isArray(state.journal) || state.journal.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'journal-empty';
    empty.textContent = 'Noch kein Eintrag. Nach dem ersten Reset kannst du deinen Vorher/Nachher-Moment speichern.';
    els.journalList.appendChild(empty);
    return;
  }
  for (const entry of state.journal.slice(0, 5)) {
    const item = document.createElement('article');
    item.className = 'journal-entry';
    const delta = Number(entry.delta) || 0;
    item.classList.toggle('is-softer', delta > 0);
    item.classList.toggle('is-harder', delta < 0);
    const when = new Date(entry.at);
    const dateText = Number.isNaN(when.getTime()) ? 'gerade' : when.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const emotion = emotionLabels[entry.emotion] || 'Gefühl';
    const movement = delta > 0 ? `-${Math.abs(delta)}` : delta < 0 ? `+${Math.abs(delta)}` : '0';
    item.innerHTML = '<div class="journal-entry-main"><strong></strong><span></span><p></p></div><div class="journal-delta"></div>';
    item.querySelector('strong').textContent = `${emotion} · ${entry.exercise || 'Übung'}`;
    item.querySelector('span').textContent = `${dateText} · ${entry.before}/10 → ${entry.after}/10`;
    item.querySelector('p').textContent = entry.note || `Fokus: ${entry.bodyFocus || 'Körper'}`;
    item.querySelector('.journal-delta').textContent = movement;
    els.journalList.appendChild(item);
  }
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
  tryVibrate(role === 'assistant' ? 8 : 4);
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
  appendMessage('assistant', 'Schön, dass du da bist. Ich bin Resonara – eine KI-Begleitung.\n\nDu kannst direkt mit einem 2-Minuten-Reset starten oder zuerst Gefühl und Zahl wählen. Ein kleiner Schritt reicht.');
}

function toastSystem(text) {
  appendMessage('system', text);
}

function clearSession() {
  state.history = [];
  state.activeExerciseId = null;
  localStorage.removeItem(storageKeys.history);
  localStorage.removeItem(storageKeys.activeExercise);
  localStorage.removeItem(storageKeys.activePathway);
  els.player.hidden = true;
  els.player.removeAttribute('src');
  renderHistory();
  renderExercise();
  updateReflectionPanel(false);
  if (state.trustAccepted) addInitialMessage();
  updateMetrics();
}

function resetLocalData() {
  const ok = window.confirm('Alle lokalen Resonara-Daten auf diesem Gerät löschen? Gespeicherte Sprachfreigaben werden ebenfalls gelöscht.');
  if (!ok) return;
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  state.history = [];
  state.journal = [];
  state.checkin = { ...defaultCheckin };
  state.activeExerciseId = null;
  loadSettings();
  renderCheckin();
  renderHistory();
  renderExercise();
  renderJournal();
  renderPathwayUi(state.activePathway || 'calm');
  updateReflectionPanel(false);
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
    journal: state.journal.slice(0, 12),
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
  const journalValues = Array.isArray(state.journal)
    ? [...state.journal].reverse().flatMap((entry) => [Number(entry.before), Number(entry.after)]).filter((value) => Number.isFinite(value))
    : [];
  if (journalValues.length) return journalValues.slice(-18);
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
