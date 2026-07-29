(function () {
  'use strict';

  /* ============ Storage ============ */
  const STORAGE_KEY = 'bitacora_v1';

  function defaultSettings() {
    return {
      reminderEnabled: false,
      reminderTime: '21:00',
      tracksConsumo: true,
      tracksJoints: false,
      tracksTeeth: false,
      tracksSupplements: false,
      tracksAgua: false,
      aguaGoal: 8,
      tracksSueno: false,
      sleepGoalHours: 8,
      tracksPeso: false,
      tracksAyuno: false,
      tracksMeditacion: false,
      tracksLectura: false,
      tracksCiclo: false,
      cicloAvgLength: 28,
      cicloAvgPeriodLength: 5,
      tracksWorkouts: false,
      restTimerSeconds: 90,
      workoutTemplates: [],
      tracksRecetasFavoritas: true,
      savedRecipes: [],
      shoppingList: [],
      tracksSnacks: false,
      tracksGratitud: false,
      tracksEnergia: false,
      tracksRopa: false,
      usualMeals: { desayuno: [], comida: [], cena: [] },
      monthlyBudget: null,
      travelModeActive: false,
      cardOrder: {},
      themeMode: 'auto',
      densityMode: 'comfortable',
      lastBackupDate: null,
      jointPricePer4: 4.50,
      dailyTasks: [],
      weeklyTasks: [],
      badHabits: [],
      purchaseItems: [],
      supplements: [],
      goals: [],
      exercises: [],
      profile: { name: '', sex: '', birthdate: '', height: null, weight: null },
      onboardingDismissed: false
    };
  }

  function normalizeStore(parsed) {
      parsed.entries = (parsed.entries && typeof parsed.entries === 'object') ? parsed.entries : {};
      parsed.weeks = parsed.weeks || {};
      parsed.settings = parsed.settings || defaultSettings();
      if (!Array.isArray(parsed.settings.weeklyTasks)) {
        parsed.settings.weeklyTasks = defaultSettings().weeklyTasks;
      }
      if (!Array.isArray(parsed.settings.dailyTasks)) {
        parsed.settings.dailyTasks = defaultSettings().dailyTasks;
      }
      if (!Array.isArray(parsed.settings.badHabits)) {
        parsed.settings.badHabits = [];
      }
      if (!Array.isArray(parsed.settings.supplements)) {
        parsed.settings.supplements = [];
      }
      if (!Array.isArray(parsed.settings.goals)) {
        parsed.settings.goals = [];
      }
      parsed.settings.goals.forEach((g) => {
        if (typeof g.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(g.dueDate)) g.dueDate = null;
      });
      if (!Array.isArray(parsed.settings.exercises)) {
        parsed.settings.exercises = [];
      }
      if (!Array.isArray(parsed.settings.purchaseItems)) {
        parsed.settings.purchaseItems = [
          { id: 'packRojo', label: 'Lucky rojo', price: 5.50 },
          { id: 'packBlanco', label: 'Lucky blanco', price: 6.30 }
        ];
        Object.keys(parsed.entries).forEach((key) => {
          const entry = parsed.entries[key];
          if (!entry || typeof entry !== 'object') return;
          entry.purchases = entry.purchases || {};
          if (entry.packRojo) entry.purchases.packRojo = entry.packRojo;
          if (entry.packBlanco) entry.purchases.packBlanco = entry.packBlanco;
        });
      }
      if (typeof parsed.settings.tracksConsumo !== 'boolean') {
        parsed.settings.tracksConsumo = true;
      }
      if (typeof parsed.settings.tracksJoints !== 'boolean') {
        parsed.settings.tracksJoints = true;
      }
      if (typeof parsed.settings.tracksTeeth !== 'boolean') {
        parsed.settings.tracksTeeth = true;
      }
      if (typeof parsed.settings.tracksSupplements !== 'boolean') {
        parsed.settings.tracksSupplements = false;
      }
      if (typeof parsed.settings.tracksAgua !== 'boolean') {
        parsed.settings.tracksAgua = false;
      }
      if (typeof parsed.settings.aguaGoal !== 'number' || parsed.settings.aguaGoal <= 0) {
        parsed.settings.aguaGoal = 8;
      }
      if (typeof parsed.settings.tracksSueno !== 'boolean') {
        parsed.settings.tracksSueno = false;
      }
      if (typeof parsed.settings.sleepGoalHours !== 'number' || parsed.settings.sleepGoalHours <= 0) {
        parsed.settings.sleepGoalHours = 8;
      }
      if (typeof parsed.settings.tracksPeso !== 'boolean') {
        parsed.settings.tracksPeso = false;
      }
      if (typeof parsed.settings.tracksAyuno !== 'boolean') {
        parsed.settings.tracksAyuno = false;
      }
      if (typeof parsed.settings.tracksMeditacion !== 'boolean') {
        parsed.settings.tracksMeditacion = false;
      }
      if (typeof parsed.settings.tracksLectura !== 'boolean') {
        parsed.settings.tracksLectura = false;
      }
      if (typeof parsed.settings.tracksCiclo !== 'boolean') {
        parsed.settings.tracksCiclo = false;
      }
      if (typeof parsed.settings.cicloAvgLength !== 'number' || parsed.settings.cicloAvgLength < 15) {
        parsed.settings.cicloAvgLength = 28;
      }
      if (typeof parsed.settings.cicloAvgPeriodLength !== 'number' || parsed.settings.cicloAvgPeriodLength < 1) {
        parsed.settings.cicloAvgPeriodLength = 5;
      }
      if (typeof parsed.settings.tracksWorkouts !== 'boolean') {
        parsed.settings.tracksWorkouts = false;
      }
      if (typeof parsed.settings.restTimerSeconds !== 'number' || parsed.settings.restTimerSeconds < 10) {
        parsed.settings.restTimerSeconds = 90;
      }
      if (!Array.isArray(parsed.settings.workoutTemplates)) {
        parsed.settings.workoutTemplates = [];
      }
      if (typeof parsed.settings.tracksRecetasFavoritas !== 'boolean') {
        parsed.settings.tracksRecetasFavoritas = true;
      }
      if (!Array.isArray(parsed.settings.savedRecipes)) {
        parsed.settings.savedRecipes = [];
      }
      if (!Array.isArray(parsed.settings.shoppingList)) {
        parsed.settings.shoppingList = [];
      }
      if (typeof parsed.settings.tracksSnacks !== 'boolean') {
        parsed.settings.tracksSnacks = false;
      }
      if (typeof parsed.settings.tracksGratitud !== 'boolean') {
        parsed.settings.tracksGratitud = false;
      }
      if (typeof parsed.settings.tracksEnergia !== 'boolean') {
        parsed.settings.tracksEnergia = false;
      }
      if (typeof parsed.settings.tracksRopa !== 'boolean') {
        parsed.settings.tracksRopa = false;
      }
      if (!parsed.settings.usualMeals || typeof parsed.settings.usualMeals !== 'object') {
        parsed.settings.usualMeals = defaultSettings().usualMeals;
      }
      ['desayuno', 'comida', 'cena'].forEach((meal) => {
        if (!Array.isArray(parsed.settings.usualMeals[meal])) {
          parsed.settings.usualMeals[meal] = [];
        }
      });
      if (parsed.settings.monthlyBudget !== null && typeof parsed.settings.monthlyBudget !== 'number') {
        parsed.settings.monthlyBudget = null;
      }
      if (typeof parsed.settings.travelModeActive !== 'boolean') {
        parsed.settings.travelModeActive = false;
      }
      if (!parsed.settings.cardOrder || typeof parsed.settings.cardOrder !== 'object') {
        parsed.settings.cardOrder = {};
      }
      if (!parsed.settings.profile || typeof parsed.settings.profile !== 'object') {
        parsed.settings.profile = defaultSettings().profile;
      }
      if (typeof parsed.settings.jointPricePer4 !== 'number' || parsed.settings.jointPricePer4 < 0) {
        parsed.settings.jointPricePer4 = 4.50;
      }
      if (!['auto', 'light', 'dark', 'black'].includes(parsed.settings.themeMode)) {
        parsed.settings.themeMode = 'auto';
      }
      if (!['comfortable', 'compact'].includes(parsed.settings.densityMode)) {
        parsed.settings.densityMode = 'comfortable';
      }
      if (parsed.settings.lastBackupDate !== null && typeof parsed.settings.lastBackupDate !== 'string') {
        parsed.settings.lastBackupDate = null;
      }
      return parsed;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { entries: {}, weeks: {}, settings: defaultSettings(), lastNotifiedDate: null };
      return normalizeStore(JSON.parse(raw));
    } catch (e) {
      return { entries: {}, weeks: {}, settings: defaultSettings(), lastNotifiedDate: null };
    }
  }

  let storageWarned = false;
  function saveStore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      if (!storageWarned) {
        storageWarned = true;
        alert('No se ha podido guardar. El almacenamiento del dispositivo está lleno o no disponible; los últimos cambios podrían no conservarse.');
      }
    }
  }

  const store = loadStore();

  function emptyEntry() {
    return {
      exercise: false,
      read: false,
      test: false,
      teeth: 0,
      reflection: '',
      badHabits: {},
      supplements: {},
      goals: {},
      meals: {
        desayuno: { time: '', desc: '', health: 0 },
        comida: { time: '', desc: '', health: 0 },
        cena: { time: '', desc: '', health: 0 }
      },
      cigarettes: 0,
      joints: 0,
      purchases: {},
      agua: 0,
      sleepHours: 0,
      sleepQuality: 0,
      weight: null,
      fastStart: '',
      fastEnd: '',
      meditationMin: 0,
      readingMin: 0,
      periodDay: false,
      periodFlow: null,
      cycleSymptoms: [],
      workout: { durationMin: 0, exercises: {}, templateId: '' },
      snacks: [],
      gratitude: ['', '', ''],
      energyLevel: 0,
      stressLevel: 0,
      outfitPlanned: false,
      paused: false
    };
  }

  function formatEuro(n) {
    return `${n.toFixed(2).replace('.', ',')} €`;
  }

  function consumoEnabled() {
    return store.settings.tracksConsumo !== false;
  }

  function jointsEnabled() {
    return store.settings.tracksJoints !== false;
  }

  function teethEnabled() {
    return store.settings.tracksTeeth !== false;
  }

  function supplementsEnabled() {
    return store.settings.tracksSupplements === true;
  }

  function aguaEnabled() {
    return store.settings.tracksAgua === true;
  }

  function suenoEnabled() {
    return store.settings.tracksSueno === true;
  }

  function pesoEnabled() {
    return store.settings.tracksPeso === true;
  }

  function ayunoEnabled() {
    return store.settings.tracksAyuno === true;
  }

  function meditacionEnabled() {
    return store.settings.tracksMeditacion === true;
  }

  function lecturaEnabled() {
    return store.settings.tracksLectura === true;
  }

  function cicloEnabled() {
    return store.settings.tracksCiclo === true;
  }

  const CYCLE_SYMPTOMS = [
    { id: 'cramps', label: 'Cólicos' },
    { id: 'headache', label: 'Dolor de cabeza' },
    { id: 'bloating', label: 'Hinchazón' },
    { id: 'fatigue', label: 'Cansancio' },
    { id: 'moodSwings', label: 'Cambios de humor' },
    { id: 'acne', label: 'Acné' },
    { id: 'tenderBreasts', label: 'Sensibilidad' },
    { id: 'nausea', label: 'Náuseas' }
  ];

  const PERIOD_FLOW_LEVELS = [
    { id: 'spotting', label: 'Manchado' },
    { id: 'light', label: 'Ligero' },
    { id: 'medium', label: 'Medio' },
    { id: 'heavy', label: 'Abundante' }
  ];

  const CYCLE_PHASE_LABELS = {
    menstrual: 'Menstruación',
    folicular: 'Fase folicular',
    ovulacion: 'Ventana fértil',
    lutea: 'Fase lútea'
  };

  function getPeriodStartDates() {
    const keys = Object.keys(store.entries).filter((k) => store.entries[k].periodDay).sort();
    const starts = [];
    let prevDate = null;
    keys.forEach((k) => {
      const d = new Date(`${k}T00:00:00`);
      if (!prevDate || (d - prevDate) > DAY_MS) starts.push(d);
      prevDate = d;
    });
    return starts;
  }

  function getPeriodRunLengths() {
    const keys = Object.keys(store.entries).filter((k) => store.entries[k].periodDay).sort();
    const runs = [];
    let runStart = null, prevDate = null;
    keys.forEach((k) => {
      const d = new Date(`${k}T00:00:00`);
      if (!prevDate || (d - prevDate) > DAY_MS) {
        if (runStart) runs.push(Math.round((prevDate - runStart) / DAY_MS) + 1);
        runStart = d;
      }
      prevDate = d;
    });
    if (runStart) runs.push(Math.round((prevDate - runStart) / DAY_MS) + 1);
    return runs;
  }

  function cycleAvgLength() {
    const starts = getPeriodStartDates();
    if (starts.length >= 2) {
      const diffs = [];
      for (let i = 1; i < starts.length; i++) diffs.push(Math.round((starts[i] - starts[i - 1]) / DAY_MS));
      const recent = diffs.slice(-6).filter((d) => d >= 10 && d <= 60);
      if (recent.length) return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
    }
    return store.settings.cicloAvgLength || 28;
  }

  function cycleAvgPeriodLength() {
    const runs = getPeriodRunLengths();
    if (runs.length) {
      const recent = runs.slice(-6).filter((d) => d >= 1 && d <= 15);
      if (recent.length) return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
    }
    return store.settings.cicloAvgPeriodLength || 5;
  }

  function cycleInfo(forDate) {
    const starts = getPeriodStartDates();
    if (starts.length === 0) return null;
    const avgLen = cycleAvgLength();
    const avgPeriod = cycleAvgPeriodLength();
    const lastStart = starts[starts.length - 1];
    const today = startOfDay(forDate);
    const cycleDay = Math.round((today - lastStart) / DAY_MS) + 1;
    const nextPeriodDate = new Date(lastStart);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgLen);
    const daysUntilNext = Math.round((nextPeriodDate - today) / DAY_MS);
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    let phase;
    if (cycleDay >= 1 && cycleDay <= avgPeriod) phase = 'menstrual';
    else if (today >= fertileStart && today <= fertileEnd) phase = 'ovulacion';
    else if (today < fertileStart) phase = 'folicular';
    else phase = 'lutea';

    return { cycleDay, phase, lastStart, nextPeriodDate, daysUntilNext, ovulationDate, fertileStart, fertileEnd, avgLen, avgPeriod, cycleCount: starts.length };
  }

  function fmtShortDate(d) {
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  }

  function workoutsEnabled() {
    return store.settings.tracksWorkouts === true;
  }

  function snacksEnabled() {
    return store.settings.tracksSnacks === true;
  }

  function gratitudEnabled() {
    return store.settings.tracksGratitud === true;
  }

  function energiaEnabled() {
    return store.settings.tracksEnergia === true;
  }

  function ropaEnabled() {
    return store.settings.tracksRopa === true;
  }

  const EXERCISE_GROUPS = [
    { id: '', label: 'Sin grupo' },
    { id: 'empuje', label: 'Empuje' },
    { id: 'tiron', label: 'Tirón' },
    { id: 'pierna', label: 'Pierna' },
    { id: 'core', label: 'Core' },
    { id: 'cardio', label: 'Cardio' }
  ];
  function exerciseGroupLabel(id) {
    const g = EXERCISE_GROUPS.find((x) => x.id === id);
    return g ? g.label : 'Sin grupo';
  }

  function aguaGoal() {
    return store.settings.aguaGoal || 8;
  }

  function renderSpendGroups(container, year, monthIndex, lastDay, monthLabel, yearLabel) {
    const groups = store.settings.purchaseItems.map((item, i) => ({
      label: item.label,
      month: monthPurchaseSpend(item.id, item.price, year, monthIndex, lastDay),
      year: yearPurchaseSpend(item.id, item.price, year),
      color: purchaseColor(i)
    }));
    const showJoints = jointsEnabled();
    if (showJoints) {
      groups.push({ label: 'Joints', month: monthJointsSpend(year, monthIndex, lastDay), year: yearJointsSpend(year) });
    }
    if (groups.length > 1) {
      const totalMonth = groups.reduce((s, g) => s + g.month, 0);
      const totalYear = groups.reduce((s, g) => s + g.year, 0);
      groups.push({ label: 'Total', month: totalMonth, year: totalYear, isTotal: true });
    }

    if (groups.length === 0) {
      container.innerHTML = '<p class="task-empty-hint">Sin gastos configurados todavía.</p>';
      return;
    }

    container.innerHTML = groups.map((g) => {
      const tileStyle = g.color ? ` style="background:color-mix(in srgb, ${g.color} 14%, var(--surface-alt))"` : '';
      const labelStyle = g.color ? ` style="color:${g.color}"` : '';
      return `
      <div class="spend-group${g.isTotal ? ' spend-group--total' : ''}">
        <div class="spend-group-label"${labelStyle}>${escapeHtml(g.label)}</div>
        <div class="avg-grid">
          <div class="avg-tile"${tileStyle}>
            <span class="avg-value">${formatEuro(g.month)}</span>
            <span class="avg-label">${monthLabel}</span>
          </div>
          <div class="avg-tile"${tileStyle}>
            <span class="avg-value">${formatEuro(g.year)}</span>
            <span class="avg-label">${yearLabel}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function getEntry(key) {
    return store.entries[key] || null;
  }

  // Reused across every Stats sub-render (rings, agua, sueño, gasto, gráficos…) so a
  // single month's entries aren't re-fetched from scratch by each section. Keyed by
  // year+month+day (not just day) since some helpers (yearPurchaseSpend, etc.) query
  // several different months within one renderStats() pass. Reset at the top of
  // renderStats() so it never serves data from before the last edit.
  let statsEntryCache = null;
  function getEntryForDay(year, monthIndex, day) {
    if (!statsEntryCache) return getEntry(dateKey(new Date(year, monthIndex, day)));
    const cacheKey = `${year}-${monthIndex}-${day}`;
    if (statsEntryCache.has(cacheKey)) return statsEntryCache.get(cacheKey);
    const entry = getEntry(dateKey(new Date(year, monthIndex, day)));
    statsEntryCache.set(cacheKey, entry);
    return entry;
  }

  function ensureEntry(key) {
    if (!store.entries[key]) store.entries[key] = emptyEntry();
    return store.entries[key];
  }

  function getWeek(key) {
    return store.weeks[key] || {};
  }

  function ensureWeek(key) {
    if (!store.weeks[key]) store.weeks[key] = {};
    return store.weeks[key];
  }

  /* ============ Date helpers ============ */
  const DAY_MS = 86400000;

  function pad2(n) { return String(n).padStart(2, '0'); }

  function dateKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function startOfDay(d) {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
  }

  function isoWeekKey(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0..Sun=6
    date.setUTCDate(date.getUTCDate() - dayNum + 3); // Thursday of this week
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
    const week = 1 + Math.round((date - firstThursday) / (7 * DAY_MS));
    return `${date.getUTCFullYear()}-W${pad2(week)}`;
  }

  function weekRangeLabel(d) {
    const day = (d.getDay() + 6) % 7; // Mon=0
    const monday = new Date(d);
    monday.setDate(d.getDate() - day);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (x) => `${x.getDate()} ${MONTHS_SHORT[x.getMonth()]}`;
    return `${fmt(monday)} – ${fmt(sunday)}`;
  }

  const MONTHS_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const WEEKDAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  // Shared small icons (replace bare unicode glyphs so every checkmark/star reads as
  // part of the same drawn icon set as the rest of the app).
  const CHECK_TICK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12.5l4.3 4.3L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CROSS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke-linecap="round"/></svg>';
  const RIBBON_OUTLINE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.8-6 3.8V5.5a1 1 0 0 1 1-1Z" stroke-linejoin="round"/></svg>';
  const RIBBON_FILLED_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.8-6 3.8V5.5a1 1 0 0 1 1-1Z"/></svg>';

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  /* ============ App state ============ */
  let currentDate = startOfDay(new Date());
  let statsMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  let activeTab = 'hoy';

  /* ============ Tab switching ============ */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  const daySelector = document.getElementById('daySelector');

  function switchTab(tab) {
    const changed = activeTab !== tab;
    activeTab = tab;
    tabButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tab));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== tab; });
    daySelector.style.display = (tab === 'stats' || tab === 'ajustes') ? 'none' : 'flex';
    if (tab === 'stats') renderStats();
    if (tab === 'ajustes') refreshAjustesUI();
    if (changed) {
      const panel = document.querySelector('.tab-panel:not([hidden])');
      if (panel) {
        panel.classList.remove('tab-fade-in');
        void panel.offsetWidth;
        panel.classList.add('tab-fade-in');
      }
    }
  }

  tabButtons.forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  const tabBtnConsumo = document.getElementById('tabBtnConsumo');
  function updateConsumoTabVisibility() {
    tabBtnConsumo.hidden = !consumoEnabled();
    if (!consumoEnabled() && activeTab === 'consumo') switchTab('hoy');
  }

  const tabBtnObjetivos = document.getElementById('tabBtnObjetivos');
  function objetivosEnabled() {
    return aguaEnabled() || suenoEnabled() || pesoEnabled() || ayunoEnabled() ||
      meditacionEnabled() || lecturaEnabled() || workoutsEnabled() || store.settings.goals.length > 0;
  }
  function updateObjetivosTabVisibility() {
    tabBtnObjetivos.hidden = !objetivosEnabled();
    if (!objetivosEnabled() && activeTab === 'objetivos') switchTab('hoy');
  }

  function updateConsumoTabIcon() {
    const basket = document.getElementById('tabIconBasket');
    const cigarette = document.getElementById('tabIconCigarette');
    if (!basket || !cigarette) return;
    const showCigarette = jointsEnabled();
    basket.style.display = showCigarette ? 'none' : 'inline-block';
    cigarette.style.display = showCigarette ? 'inline-block' : 'none';
  }

  /* ============ AJUSTES accordion ============ */
  const panelAjustes = document.getElementById('panel-ajustes');
  panelAjustes.addEventListener('click', (e) => {
    const header = e.target.closest('[data-accordion-toggle]');
    if (!header) return;
    const body = header.nextElementSibling;
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!isOpen));
    body.hidden = isOpen;
  });

  /* ============ Ajustes: buscador ============ */
  const settingsSearchInput = document.getElementById('settingsSearchInput');
  const settingsSearchClear = document.getElementById('settingsSearchClear');
  const settingsNoResults = document.getElementById('settingsNoResults');
  const settingsMoreToggle = document.getElementById('settingsMoreToggle');
  const settingsMoreGroup = document.getElementById('settingsMoreGroup');

  function normalizeSearchText(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function applySettingsSearch() {
    const query = normalizeSearchText(settingsSearchInput.value);
    settingsSearchClear.hidden = query.length === 0;
    const cards = panelAjustes.querySelectorAll('.accordion-card, .backup-card');
    let anyMatch = false;
    let anyMatchInMore = false;
    cards.forEach((card) => {
      if (!query) { card.hidden = false; anyMatch = true; return; }
      const titleEl = card.querySelector('.card-title');
      const title = normalizeSearchText(titleEl ? titleEl.textContent : '');
      const keywords = normalizeSearchText(card.dataset.settingsKeywords);
      const matches = title.includes(query) || keywords.includes(query);
      card.hidden = !matches;
      if (matches) {
        anyMatch = true;
        if (settingsMoreGroup.contains(card)) anyMatchInMore = true;
        const header = card.querySelector('[data-accordion-toggle]');
        const body = card.querySelector('.accordion-body');
        if (header && body) { header.setAttribute('aria-expanded', 'true'); body.hidden = false; }
      }
    });
    panelAjustes.querySelectorAll('.settings-group').forEach((group) => {
      if (!query) { group.hidden = false; return; }
      const visibleCards = Array.from(group.querySelectorAll('.accordion-card')).filter((c) => !c.hidden);
      group.hidden = visibleCards.length === 0;
    });
    if (query && anyMatchInMore) {
      settingsMoreGroup.hidden = false;
      settingsMoreToggle.setAttribute('aria-expanded', 'true');
    }
    settingsNoResults.hidden = anyMatch;
  }
  settingsSearchInput.addEventListener('input', applySettingsSearch);
  settingsSearchClear.addEventListener('click', () => {
    settingsSearchInput.value = '';
    applySettingsSearch();
    settingsSearchInput.focus();
  });

  /* ============ Ajustes: "Más funciones" ============ */
  settingsMoreToggle.addEventListener('click', () => {
    const isOpen = settingsMoreToggle.getAttribute('aria-expanded') === 'true';
    settingsMoreToggle.setAttribute('aria-expanded', String(!isOpen));
    settingsMoreGroup.hidden = isOpen;
  });

  /* ============ Ajustes: contadores y estados en cada acordeón ============ */
  function setAccordionBadge(id, count) {
    const el = document.getElementById(id);
    if (!el) return;
    if (count > 0) { el.hidden = false; el.textContent = String(count); }
    else el.hidden = true;
  }
  function setAccordionDot(id, isOn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    el.classList.toggle('is-on', isOn);
  }
  function updateAccordionBadges() {
    setAccordionBadge('dailyTasksBadge', store.settings.dailyTasks.length);
    setAccordionBadge('weeklyTasksBadge', store.settings.weeklyTasks.length);
    setAccordionBadge('badHabitsBadge', store.settings.badHabits.length);
    setAccordionBadge('goalsBadge', store.settings.goals.length);
    setAccordionDot('supplementsDot', supplementsEnabled());
    setAccordionDot('consumoDot', consumoEnabled());
    setAccordionDot('aguaDot', aguaEnabled());
    setAccordionDot('suenoDot', suenoEnabled());
    setAccordionDot('pesoDot', pesoEnabled());
    setAccordionDot('ayunoDot', ayunoEnabled());
    setAccordionDot('menteDot', meditacionEnabled() || lecturaEnabled());
    setAccordionDot('cicloDot', cicloEnabled());
    setAccordionDot('ejercicioDot', workoutsEnabled());
    setAccordionDot('energiaDot', energiaEnabled());
    setAccordionDot('gratitudDot', gratitudEnabled());
    setAccordionDot('snacksDot', snacksEnabled());
    setAccordionDot('ropaDot', ropaEnabled());
    setAccordionDot('reminderDot', !!store.settings.reminderEnabled);
    setAccordionDot('travelDot', !!store.settings.travelModeActive);
  }

  /* ============ Ajustes: aviso de función activada pero sin usar ============ */
  function anyEntryMatches(predicate) {
    return Object.values(store.entries).some(predicate);
  }
  function hasEnoughHistoryToJudge() {
    return Object.keys(store.entries).length >= 14;
  }
  function setUnusedHint(id, enabled, hasData, featureName) {
    const el = document.getElementById(id);
    if (!el) return;
    if (enabled && hasEnoughHistoryToJudge() && !hasData) {
      el.hidden = false;
      el.textContent = `No hay registros en ${featureName} todavía. Si no lo usas, puedes desactivarlo arriba.`;
    } else {
      el.hidden = true;
    }
  }
  function updateUnusedFeatureHints() {
    setUnusedHint('supplementsUnusedHint', supplementsEnabled(),
      anyEntryMatches((e) => e.supplements && Object.values(e.supplements).some(Boolean)), 'Suplementos');
    setUnusedHint('aguaUnusedHint', aguaEnabled(), anyEntryMatches((e) => e.agua > 0), 'Agua');
    setUnusedHint('suenoUnusedHint', suenoEnabled(), anyEntryMatches((e) => e.sleepHours > 0), 'Sueño');
    setUnusedHint('pesoUnusedHint', pesoEnabled(), anyEntryMatches((e) => e.weight != null), 'Peso corporal');
    setUnusedHint('ayunoUnusedHint', ayunoEnabled(), anyEntryMatches((e) => e.fastStart || e.fastEnd), 'Ayuno intermitente');
    setUnusedHint('cicloUnusedHint', cicloEnabled(), anyEntryMatches((e) => e.periodDay), 'Ciclo menstrual');
    setUnusedHint('ejercicioUnusedHint', workoutsEnabled(), anyEntryMatches((e) => e.workout && e.workout.durationMin > 0), 'Ejercicio');
    setUnusedHint('energiaUnusedHint', energiaEnabled(), anyEntryMatches((e) => e.energyLevel > 0 || e.stressLevel > 0), 'Energía y estrés');
    setUnusedHint('gratitudUnusedHint', gratitudEnabled(),
      anyEntryMatches((e) => Array.isArray(e.gratitude) && e.gratitude.some((g) => g && g.trim())), 'Gratitud');
    setUnusedHint('snacksUnusedHint', snacksEnabled(), anyEntryMatches((e) => Array.isArray(e.snacks) && e.snacks.length > 0), 'Snacks');
    setUnusedHint('ropaUnusedHint', ropaEnabled(), anyEntryMatches((e) => e.outfitPlanned), 'Ropa del día');
  }

  /* ============ Ajustes: vista previa de densidad ============ */
  const densityPreview = document.getElementById('densityPreview');
  function updateDensityPreview() {
    densityPreview.querySelectorAll('.density-preview-swatch').forEach((sw) => {
      sw.classList.toggle('is-selected', sw.dataset.preview === densityModeSelect.value);
    });
  }

  /* ============ Ajustes: toast (confirmación / deshacer) ============ */
  const settingsToastWrap = document.getElementById('settingsToastWrap');
  let settingsToastTimer = null;
  function hideSettingsToast() {
    const toast = settingsToastWrap.querySelector('.settings-toast');
    if (!toast) return;
    toast.classList.remove('is-visible');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 220);
  }
  function showSettingsToast(message, actionLabel, onAction) {
    clearTimeout(settingsToastTimer);
    settingsToastWrap.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'settings-toast';
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);
    if (actionLabel && onAction) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'settings-toast-action';
      btn.textContent = actionLabel;
      btn.addEventListener('click', () => {
        onAction();
        hideSettingsToast();
      });
      toast.appendChild(btn);
    }
    settingsToastWrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    settingsToastTimer = setTimeout(hideSettingsToast, actionLabel ? 5000 : 1800);
  }

  /* ============ Ajustes: borrar con deshacer ============ */
  function deleteWithUndo(array, id, label, onAfterChange) {
    const idx = array.findIndex((item) => item.id === id);
    if (idx === -1) return;
    const [removed] = array.splice(idx, 1);
    saveStore();
    onAfterChange();
    showSettingsToast(`"${label}" eliminado`, 'Deshacer', () => {
      array.splice(idx, 0, removed);
      saveStore();
      onAfterChange();
    });
  }

  /* ============ Ajustes: confirmación al cambiar un ajuste + refresco en vivo ============ */
  panelAjustes.addEventListener('change', (e) => {
    const input = e.target.closest('.switch input[type="checkbox"]');
    if (input) showSettingsToast('Guardado');
    updateAccordionBadges();
    updateUnusedFeatureHints();
    updateOnboardingCard();
    if (e.target === densityModeSelect) updateDensityPreview();
  });
  panelAjustes.addEventListener('click', () => {
    updateAccordionBadges();
    updateUnusedFeatureHints();
    updateOnboardingCard();
  });

  /* ============ Ajustes: checklist "Empieza aquí" ============ */
  const onboardingCard = document.getElementById('onboardingCard');
  const onboardingDismissBtn = document.getElementById('onboardingDismissBtn');
  function isFreshAccount() {
    return Object.keys(store.entries).length < 3;
  }
  function updateOnboardingCard() {
    if (store.settings.onboardingDismissed || !isFreshAccount()) { onboardingCard.hidden = true; return; }
    onboardingCard.hidden = false;
    document.getElementById('onboardingStepProfile').classList.toggle('is-done', !!store.settings.profile.name.trim());
    document.getElementById('onboardingStepTasks').classList.toggle('is-done', store.settings.dailyTasks.length > 0);
  }
  onboardingDismissBtn.addEventListener('click', () => {
    store.settings.onboardingDismissed = true;
    saveStore();
    onboardingCard.hidden = true;
  });
  panelAjustes.querySelectorAll('.onboarding-item[data-onboarding-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.onboardingTarget);
      if (!target) return;
      if (target === settingsMoreToggle) {
        if (settingsMoreToggle.getAttribute('aria-expanded') !== 'true') settingsMoreToggle.click();
      } else {
        const header = target.matches('[data-accordion-toggle]') ? target : target.querySelector('[data-accordion-toggle]');
        if (header && header.getAttribute('aria-expanded') !== 'true') header.click();
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ============ Ajustes: refresco general al entrar en la pestaña ============ */
  function refreshAjustesUI() {
    updateAccordionBadges();
    updateUnusedFeatureHints();
    updateDensityPreview();
    updateOnboardingCard();
  }

  /* ============ Day navigation ============ */
  const dayLabelMain = document.getElementById('dayLabelMain');
  const dayLabelSub = document.getElementById('dayLabelSub');

  function updateDayLabel() {
    const today = startOfDay(new Date());
    if (currentDate.getTime() === today.getTime()) {
      dayLabelMain.textContent = 'Hoy';
    } else {
      dayLabelMain.textContent = WEEKDAYS_LONG[currentDate.getDay()];
      dayLabelMain.textContent = dayLabelMain.textContent[0].toUpperCase() + dayLabelMain.textContent.slice(1);
    }
    dayLabelSub.textContent = `${currentDate.getDate()} de ${MONTHS_LONG[currentDate.getMonth()]}`;
  }

  function playDayTurn(direction) {
    const panel = document.querySelector('.tab-panel:not([hidden])');
    if (!panel) return;
    panel.classList.remove('day-turn-prev', 'day-turn-next');
    void panel.offsetWidth;
    panel.classList.add(direction === 'prev' ? 'day-turn-prev' : 'day-turn-next');
  }

  document.getElementById('prevDay').addEventListener('click', () => {
    currentDate = new Date(currentDate.getTime() - DAY_MS);
    renderAll();
    playDayTurn('prev');
  });
  document.getElementById('nextDay').addEventListener('click', () => {
    currentDate = new Date(currentDate.getTime() + DAY_MS);
    renderAll();
    playDayTurn('next');
  });

  /* ============ HOY panel ============ */
  const reflectionInput = document.getElementById('reflectionInput');
  const reflectionHint = document.getElementById('reflectionHint');
  const weekRangeEl = document.getElementById('weekRange');
  const weeklyTaskList = document.getElementById('weeklyTaskList');
  const dailyTaskList = document.getElementById('dailyTaskList');

  const STREAK_MILESTONES = [7, 14, 30, 60, 100, 150, 200, 365, 500, 1000];

  function playCompletionStamp() {
    const badge = document.getElementById('streakBadge');
    if (!badge || badge.hidden) return;
    badge.classList.remove('stamp-pulse', 'milestone-burst');
    void badge.offsetWidth;
    badge.classList.add('stamp-pulse');
  }

  function playMilestoneCelebration() {
    const badge = document.getElementById('streakBadge');
    if (!badge || badge.hidden) return;
    badge.classList.remove('stamp-pulse', 'milestone-burst');
    void badge.offsetWidth;
    badge.classList.add('milestone-burst');
  }

  function handleDayCompletionFeedback(wasComplete, streakBefore) {
    if (wasComplete) return;
    const entry = getEntry(dateKey(currentDate));
    if (!isDayComplete(entry)) return;
    const streakAfter = currentStreak();
    if (streakAfter !== streakBefore && STREAK_MILESTONES.includes(streakAfter)) {
      playMilestoneCelebration();
    } else {
      playCompletionStamp();
    }
  }

  dailyTaskList.addEventListener('click', (e) => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    const wasComplete = isDayComplete(entry);
    const streakBefore = currentStreak();
    const checkBtn = e.target.closest('[data-check]');
    if (checkBtn) {
      const field = checkBtn.dataset.check;
      entry[field] = !entry[field];
      saveStore();
      renderHoy();
      handleDayCompletionFeedback(wasComplete, streakBefore);
      return;
    }
    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      const delta = parseInt(stepBtn.dataset.step, 10);
      entry.teeth = Math.max(0, (entry.teeth || 0) + delta);
      saveStore();
      renderHoy();
      handleDayCompletionFeedback(wasComplete, streakBefore);
    }
  });

  weeklyTaskList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-check-week]');
    if (!btn) return;
    const wk = isoWeekKey(currentDate);
    const week = ensureWeek(wk);
    const taskId = btn.dataset.checkWeek;
    week[taskId] = !week[taskId];
    saveStore();
    renderHoy();
  });

  const badHabitList = document.getElementById('badHabitList');
  badHabitList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-check-bad]');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.badHabits = entry.badHabits || {};
    const habitId = btn.dataset.checkBad;
    entry.badHabits[habitId] = !entry.badHabits[habitId];
    saveStore();
    renderHoy();
  });

  const supplementList = document.getElementById('supplementList');
  const supplementsCard = document.getElementById('supplementsCard');
  supplementList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-check-supplement]');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.supplements = entry.supplements || {};
    const supId = btn.dataset.checkSupplement;
    entry.supplements[supId] = !entry.supplements[supId];
    saveStore();
    renderHoy();
  });

  const aguaCard = document.getElementById('aguaCard');
  document.querySelectorAll('[data-stepper="agua"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.agua = Math.max(0, (entry.agua || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderHoy();
    });
  });

  const suenoCard = document.getElementById('suenoCard');
  document.querySelectorAll('[data-stepper="sleepHours"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.sleepHours = Math.max(0, Math.round(((entry.sleepHours || 0) + parseFloat(btn.dataset.step)) * 2) / 2);
      saveStore();
      renderHoy();
    });
  });
  document.querySelectorAll('.health-scale[data-health-sleep]').forEach((scale) => {
    scale.addEventListener('click', (e) => {
      const btn = e.target.closest('.health-btn');
      if (!btn) return;
      const value = parseInt(btn.dataset.value, 10);
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.sleepQuality = entry.sleepQuality === value ? 0 : value;
      saveStore();
      renderHoy();
    });
  });

  const pesoCard = document.getElementById('pesoCard');
  const weightInput = document.getElementById('weightInput');
  weightInput.addEventListener('change', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    const value = parseFloat(weightInput.value);
    entry.weight = (!isNaN(value) && value >= 0) ? value : null;
    saveStore();
    renderHoy();
  });

  const ayunoCard = document.getElementById('ayunoCard');
  const fastStartInput = document.getElementById('fastStartInput');
  const fastEndInput = document.getElementById('fastEndInput');
  function fastingHours(entry) {
    if (!entry.fastStart || !entry.fastEnd) return 0;
    const [sh, sm] = entry.fastStart.split(':').map(Number);
    const [eh, em] = entry.fastEnd.split(':').map(Number);
    const start = sh * 60 + sm;
    let end = eh * 60 + em;
    if (end <= start) end += 24 * 60;
    return (end - start) / 60;
  }
  fastStartInput.addEventListener('change', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.fastStart = fastStartInput.value;
    saveStore();
    renderHoy();
  });
  fastEndInput.addEventListener('change', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.fastEnd = fastEndInput.value;
    saveStore();
    renderHoy();
  });

  const menteCard = document.getElementById('menteCard');
  document.querySelectorAll('[data-stepper="meditationMin"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.meditationMin = Math.max(0, (entry.meditationMin || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderHoy();
    });
  });
  document.querySelectorAll('[data-stepper="readingMin"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.readingMin = Math.max(0, (entry.readingMin || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderHoy();
    });
  });

  const cicloCard = document.getElementById('cicloCard');
  const periodDayBtn = document.getElementById('periodDayBtn');
  const cycleFlowRow = document.getElementById('cycleFlowRow');
  const cycleFlowScale = document.getElementById('cycleFlowScale');
  const cycleSymptomList = document.getElementById('cycleSymptomList');
  const cycleInfoLine = document.getElementById('cycleInfoLine');

  periodDayBtn.addEventListener('click', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.periodDay = !entry.periodDay;
    if (!entry.periodDay) entry.periodFlow = null;
    saveStore();
    renderHoy();
  });

  cycleFlowScale.addEventListener('click', (e) => {
    const btn = e.target.closest('.flow-btn');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.periodFlow = entry.periodFlow === btn.dataset.flow ? null : btn.dataset.flow;
    saveStore();
    renderHoy();
  });

  cycleSymptomList.innerHTML = CYCLE_SYMPTOMS.map((s) => `<button type="button" class="symptom-chip" data-symptom="${s.id}" aria-pressed="false">${s.label}</button>`).join('');
  cycleSymptomList.addEventListener('click', (e) => {
    const btn = e.target.closest('.symptom-chip');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.cycleSymptoms = entry.cycleSymptoms || [];
    const id = btn.dataset.symptom;
    const idx = entry.cycleSymptoms.indexOf(id);
    if (idx === -1) entry.cycleSymptoms.push(id);
    else entry.cycleSymptoms.splice(idx, 1);
    saveStore();
    renderHoy();
  });

  function renderCicloCard(entry) {
    if (!cicloEnabled()) { cicloCard.hidden = true; return; }
    cicloCard.hidden = false;
    periodDayBtn.setAttribute('aria-pressed', String(!!entry.periodDay));
    cycleFlowRow.hidden = !entry.periodDay;
    cycleFlowScale.querySelectorAll('.flow-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(entry.periodFlow === btn.dataset.flow));
    });
    const symptoms = entry.cycleSymptoms || [];
    cycleSymptomList.querySelectorAll('.symptom-chip').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(symptoms.includes(btn.dataset.symptom)));
    });

    const info = cycleInfo(currentDate);
    if (!info) {
      cycleInfoLine.textContent = 'Marca tu primer día de regla para empezar a estimar tu ciclo.';
      return;
    }
    const phaseLabel = CYCLE_PHASE_LABELS[info.phase];
    let nextLine;
    if (info.daysUntilNext > 0) nextLine = `próxima regla en ${info.daysUntilNext} ${info.daysUntilNext === 1 ? 'día' : 'días'}`;
    else if (info.daysUntilNext === 0) nextLine = 'tu regla debería empezar hoy';
    else nextLine = `regla con ${Math.abs(info.daysUntilNext)} ${Math.abs(info.daysUntilNext) === 1 ? 'día' : 'días'} de retraso`;
    let html = `Día <strong>${info.cycleDay}</strong> del ciclo · ${phaseLabel} · ${nextLine}`;
    if (info.phase === 'folicular' || info.phase === 'ovulacion') {
      html += `<br>Ventana fértil estimada: ${fmtShortDate(info.fertileStart)}–${fmtShortDate(info.fertileEnd)}`;
    }
    if (info.cycleCount < 2) {
      html += '<br>Estimación basada en la duración media configurada en Ajustes (aún poco historial propio).';
    }
    cycleInfoLine.innerHTML = html;
  }

  const goalsCard = document.getElementById('goalsCard');
  const goalsList = document.getElementById('goalsList');
  goalsList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-check-goal]');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.goals = entry.goals || {};
    const goalId = btn.dataset.checkGoal;
    entry.goals[goalId] = !entry.goals[goalId];
    saveStore();
    renderHoy();
  });

  const workoutCard = document.getElementById('workoutCard');
  const exerciseLogList = document.getElementById('exerciseLogList');
  const exerciseEmptyHint = document.getElementById('exerciseEmptyHint');
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.addEventListener('change', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.workout = entry.workout || { durationMin: 0, exercises: {}, templateId: '' };
    entry.workout.templateId = templateSelect.value;
    saveStore();
    renderHoy();
  });

  /* ---- Cronómetro de descanso ---- */
  const restTimerValueEl = document.getElementById('restTimerValue');
  const restTimerStartBtn = document.getElementById('restTimerStartBtn');
  const restTimerResetBtn = document.getElementById('restTimerResetBtn');
  const restTimerEl = document.getElementById('restTimer');
  let restTimerRemaining = store.settings.restTimerSeconds || 90;
  let restTimerInterval = null;

  function formatRestTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  function renderRestTimer() {
    restTimerValueEl.textContent = formatRestTime(Math.max(0, restTimerRemaining));
    restTimerEl.classList.toggle('rest-timer--done', restTimerRemaining <= 0 && restTimerInterval === null);
  }
  function stopRestTimer() {
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;
    }
  }
  restTimerStartBtn.addEventListener('click', () => {
    if (restTimerInterval) {
      stopRestTimer();
      restTimerStartBtn.textContent = 'Iniciar';
      return;
    }
    if (restTimerRemaining <= 0) restTimerRemaining = store.settings.restTimerSeconds || 90;
    restTimerStartBtn.textContent = 'Pausar';
    restTimerInterval = setInterval(() => {
      restTimerRemaining -= 1;
      renderRestTimer();
      if (restTimerRemaining <= 0) {
        stopRestTimer();
        restTimerStartBtn.textContent = 'Iniciar';
      }
    }, 1000);
  });
  restTimerResetBtn.addEventListener('click', () => {
    stopRestTimer();
    restTimerStartBtn.textContent = 'Iniciar';
    restTimerRemaining = store.settings.restTimerSeconds || 90;
    renderRestTimer();
  });
  renderRestTimer();

  document.querySelectorAll('[data-stepper="workoutDuration"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.workout = entry.workout || { durationMin: 0, exercises: {} };
      entry.workout.durationMin = Math.max(0, (entry.workout.durationMin || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderHoy();
    });
  });

  function ensureExerciseLog(entry, exerciseId) {
    entry.workout = entry.workout || { durationMin: 0, exercises: {} };
    entry.workout.exercises = entry.workout.exercises || {};
    entry.workout.exercises[exerciseId] = entry.workout.exercises[exerciseId] || { weight: null, reps: 0, failure: false };
    return entry.workout.exercises[exerciseId];
  }

  exerciseLogList.addEventListener('change', (e) => {
    const input = e.target.closest('.exercise-input');
    if (!input) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    const log = ensureExerciseLog(entry, input.dataset.exerciseId);
    const field = input.dataset.exerciseField;
    const value = parseFloat(input.value);
    log[field] = (!isNaN(value) && value >= 0) ? value : (field === 'weight' ? null : 0);
    saveStore();
  });

  exerciseLogList.addEventListener('click', (e) => {
    const btn = e.target.closest('.failure-btn');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    const log = ensureExerciseLog(entry, btn.dataset.exerciseId);
    log.failure = !log.failure;
    saveStore();
    btn.setAttribute('aria-pressed', String(log.failure));
  });

  function isDayComplete(entry) {
    if (!entry) return false;
    return store.settings.dailyTasks.every((t) => entry[t.id]) && (!teethEnabled() || entry.teeth > 0);
  }

  function currentStreak() {
    const totalTasks = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    if (totalTasks === 0) return 0;
    let cursor = startOfDay(new Date());
    let cursorEntry = getEntry(dateKey(cursor));
    while (cursorEntry && cursorEntry.paused) {
      cursor = new Date(cursor.getTime() - DAY_MS);
      cursorEntry = getEntry(dateKey(cursor));
    }
    if (!isDayComplete(cursorEntry)) {
      cursor = new Date(cursor.getTime() - DAY_MS);
    }
    let streak = 0;
    while (true) {
      const entry = getEntry(dateKey(cursor));
      if (entry && entry.paused) {
        cursor = new Date(cursor.getTime() - DAY_MS);
        continue;
      }
      if (!isDayComplete(entry)) break;
      streak++;
      cursor = new Date(cursor.getTime() - DAY_MS);
    }
    return streak;
  }

  function updateStreakBadge() {
    const badge = document.getElementById('streakBadge');
    const today = startOfDay(new Date());
    if (currentDate.getTime() !== today.getTime()) {
      badge.hidden = true;
      return;
    }
    const streak = currentStreak();
    if (streak < 1) {
      badge.hidden = true;
      return;
    }
    badge.hidden = false;
    badge.textContent = `🔥 ${streak} ${streak === 1 ? 'día seguido' : 'días seguidos'} completando tu día`;
  }

  let reflectionTimer = null;
  reflectionInput.addEventListener('input', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.reflection = reflectionInput.value;
    reflectionHint.textContent = 'Escribiendo…';
    clearTimeout(reflectionTimer);
    reflectionTimer = setTimeout(() => {
      saveStore();
      reflectionHint.textContent = 'Guardado automáticamente';
    }, 400);
  });

  /* ============ Dictado por voz de la reflexión ============ */
  const dictateBtn = document.getElementById('dictateBtn');
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognitionCtor) {
    dictateBtn.hidden = false;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;
    let listening = false;

    recognition.addEventListener('result', (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) transcript += e.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (!transcript) return;
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      const current = reflectionInput.value;
      const needsSpace = current && !/\s$/.test(current);
      reflectionInput.value = `${current}${needsSpace ? ' ' : ''}${transcript} `;
      entry.reflection = reflectionInput.value;
      saveStore();
      reflectionHint.textContent = 'Guardado automáticamente';
    });
    recognition.addEventListener('end', () => {
      listening = false;
      dictateBtn.classList.remove('is-listening');
      dictateBtn.setAttribute('aria-pressed', 'false');
    });
    recognition.addEventListener('error', () => {
      listening = false;
      dictateBtn.classList.remove('is-listening');
      dictateBtn.setAttribute('aria-pressed', 'false');
    });

    dictateBtn.addEventListener('click', () => {
      if (listening) {
        recognition.stop();
        return;
      }
      try {
        recognition.start();
        listening = true;
        dictateBtn.classList.add('is-listening');
        dictateBtn.setAttribute('aria-pressed', 'true');
      } catch (e) {
        // Already started or mic permission denied — ignore, button state stays off.
      }
    });
  }

  function goalDueLabel(dueDate) {
    if (!dueDate) return '';
    const [y, m, d] = dueDate.split('-').map(Number);
    const due = startOfDay(new Date(y, m - 1, d));
    const daysLeft = Math.round((due - startOfDay(new Date())) / DAY_MS);
    if (daysLeft > 0) return ` · vence en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}`;
    if (daysLeft === 0) return ' · vence hoy';
    return ` · venció hace ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'día' : 'días'}`;
  }

  function fmtKeyDate(key) {
    const [y, m, d] = key.split('-').map(Number);
    return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
  }

  const reflectionSearchCard = document.getElementById('reflectionSearchCard');
  const reflectionSearchInput = document.getElementById('reflectionSearchInput');
  const reflectionSearchResults = document.getElementById('reflectionSearchResults');

  function renderReflectionSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { reflectionSearchResults.innerHTML = ''; return; }
    const matches = Object.keys(store.entries)
      .filter((key) => (store.entries[key].reflection || '').toLowerCase().includes(q))
      .sort()
      .reverse()
      .slice(0, 30);
    if (matches.length === 0) {
      reflectionSearchResults.innerHTML = '<p class="hint-text">Sin resultados.</p>';
      return;
    }
    reflectionSearchResults.innerHTML = matches.map((key) => {
      const text = store.entries[key].reflection || '';
      const idx = text.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 30);
      const end = Math.min(text.length, idx + q.length + 40);
      const snippet = `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
      return `<button type="button" class="reflection-result" data-jump-date="${key}">
        <span class="reflection-result-date">${fmtKeyDate(key)}</span>
        <span class="reflection-result-snippet">${escapeHtml(snippet)}</span>
      </button>`;
    }).join('');
  }

  reflectionSearchInput.addEventListener('input', () => renderReflectionSearchResults(reflectionSearchInput.value));

  reflectionSearchResults.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jump-date]');
    if (!btn) return;
    const [y, m, d] = btn.dataset.jumpDate.split('-').map(Number);
    currentDate = startOfDay(new Date(y, m - 1, d));
    switchTab('hoy');
    renderAll();
  });

  const gratitudCard = document.getElementById('gratitudCard');
  const gratitudeInputs = document.querySelectorAll('.gratitude-input');
  let gratitudeTimer = null;
  gratitudeInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.gratitude = entry.gratitude || ['', '', ''];
      entry.gratitude[Number(input.dataset.gratitudeIndex)] = input.value;
      clearTimeout(gratitudeTimer);
      gratitudeTimer = setTimeout(saveStore, 400);
    });
  });

  const energiaCard = document.getElementById('energiaCard');
  energiaCard.addEventListener('click', (e) => {
    const btn = e.target.closest('.health-btn');
    if (!btn) return;
    const scale = btn.closest('.health-scale');
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    const value = Number(btn.dataset.value);
    if (scale.hasAttribute('data-health-energy')) {
      entry.energyLevel = entry.energyLevel === value ? 0 : value;
    } else if (scale.hasAttribute('data-health-stress')) {
      entry.stressLevel = entry.stressLevel === value ? 0 : value;
    }
    saveStore();
    renderHoy();
  });

  const ropaCard = document.getElementById('ropaCard');
  const outfitBtn = document.getElementById('outfitBtn');
  outfitBtn.addEventListener('click', () => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.outfitPlanned = !entry.outfitPlanned;
    saveStore();
    renderHoy();
  });

  function renderWellbeingCards(entry) {
    gratitudCard.hidden = !gratitudEnabled();
    if (gratitudEnabled()) {
      const g = entry.gratitude || ['', '', ''];
      gratitudeInputs.forEach((input) => {
        input.value = g[Number(input.dataset.gratitudeIndex)] || '';
      });
    }
    energiaCard.hidden = !energiaEnabled();
    if (energiaEnabled()) {
      energiaCard.querySelectorAll('[data-health-energy] .health-btn').forEach((btn) => {
        btn.classList.toggle('is-active', Number(btn.dataset.value) === (entry.energyLevel || 0));
      });
      energiaCard.querySelectorAll('[data-health-stress] .health-btn').forEach((btn) => {
        btn.classList.toggle('is-active', Number(btn.dataset.value) === (entry.stressLevel || 0));
      });
    }
    ropaCard.hidden = !ropaEnabled();
    if (ropaEnabled()) {
      outfitBtn.setAttribute('aria-pressed', String(!!entry.outfitPlanned));
    }
  }

  const DAILY_QUOTES = [
    { text: 'Viste con descuido y recordarán el vestido; viste impecable y te recordarán a ti.', author: 'Coco Chanel' },
    { text: 'Los pantalones de chándal son una señal de derrota. Perdiste el control de tu vida, así que compraste un chándal.', author: 'Karl Lagerfeld' },
    { text: 'Vestir bien es una forma de buena educación.', author: 'Tom Ford' },
    { text: 'Las modas pasan, el estilo es eterno.', author: 'Yves Saint Laurent' },
    { text: 'El estilo es una forma de decir quién eres sin tener que hablar.', author: 'Giorgio Armani' },
    { text: 'No diseño ropa, diseño sueños.', author: 'Ralph Lauren' },
    { text: 'La elegancia es un rechazo.', author: 'Diana Vreeland' },
    { text: 'Ponte traje.', author: 'Barney Stinson — Cómo conocí a vuestra madre' },
    { text: 'No importa lo despacio que vayas, siempre que no te detengas.', author: 'Confucio' },
    { text: 'Un viaje de mil millas comienza con un solo paso.', author: 'Lao-Tsé' },
    { text: 'Si fallas en prepararte, te estás preparando para fallar.', author: 'Benjamin Franklin' },
    { text: 'Cada acción que realizas es un voto por el tipo de persona en la que quieres convertirte.', author: 'James Clear' },
    { text: 'Ten en cuenta que muy poco es necesario para hacer una vida feliz.', author: 'Marco Aurelio' },
    { text: 'No es que tengamos poco tiempo, sino que perdemos mucho.', author: 'Séneca' },
    { text: 'No son las cosas las que nos perturban, sino la opinión que tenemos de ellas.', author: 'Epicteto' },
    { text: 'Siempre parece imposible hasta que se hace.', author: 'Nelson Mandela' },
    { text: 'El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar.', author: 'Winston Churchill' },
    { text: 'Lo que no te mata, te hace más fuerte.', author: 'Friedrich Nietzsche' },
    { text: 'Cuando ya no podemos cambiar una situación, nos enfrentamos al reto de cambiarnos a nosotros mismos.', author: 'Viktor Frankl' },
    { text: 'Lo que hay detrás de ti y lo que hay delante de ti son cosas insignificantes comparadas con lo que hay dentro de ti.', author: 'Ralph Waldo Emerson' },
    { text: 'La única forma de hacer un gran trabajo es amar lo que haces.', author: 'Steve Jobs' },
    { text: 'No cuentes los días, haz que los días cuenten.', author: 'Muhammad Ali' },
    { text: 'La vida es como andar en bicicleta: para mantener el equilibrio, debes seguir moviéndote.', author: 'Albert Einstein' },
    { text: 'La mente lo es todo. En lo que piensas, te conviertes.', author: 'Buda' },
    { text: 'No hay que temer nada en la vida, solo hay que comprenderlo.', author: 'Marie Curie' },
    { text: 'Puedes encontrarte con muchas derrotas, pero no debes dejar que te derroten.', author: 'Maya Angelou' },
    { text: 'No temo al hombre que ha practicado 10.000 patadas una vez, sino al que ha practicado una patada 10.000 veces.', author: 'Bruce Lee' },
    { text: 'He fallado una y otra vez en mi vida, y por eso he tenido éxito.', author: 'Michael Jordan' },
    { text: 'Empieza donde estás. Usa lo que tienes. Haz lo que puedas.', author: 'Arthur Ashe' },
    { text: 'Nunca subestimes el poder de los sueños y la influencia del espíritu humano.', author: 'Wilma Rudolph' },
    { text: 'Todo lo negativo — presión, desafíos — es una oportunidad para que yo crezca.', author: 'Kobe Bryant' },
    { text: 'El éxito no es casualidad: es trabajo duro, perseverancia, aprendizaje, sacrificio y amor por lo que haces.', author: 'Pelé' },
    { text: 'Si he visto más lejos es porque he subido a hombros de gigantes.', author: 'Isaac Newton' },
    { text: 'El presente es de ellos; el futuro, por el que realmente he trabajado, es mío.', author: 'Nikola Tesla' },
    { text: 'Por muy difícil que parezca la vida, siempre hay algo que puedes hacer y en lo que puedes tener éxito.', author: 'Stephen Hawking' },
    { text: 'La suerte favorece a la mente preparada.', author: 'Louis Pasteur' },
    { text: 'En algún lugar, algo increíble está esperando ser descubierto.', author: 'Carl Sagan' },
    { text: 'Nadie puede hacerte sentir inferior sin tu consentimiento.', author: 'Eleanor Roosevelt' },
    { text: 'Pies, ¿para qué los quiero si tengo alas para volar?', author: 'Frida Kahlo' },
    { text: 'Cuando el mundo entero calla, hasta una sola voz se vuelve poderosa.', author: 'Malala Yousafzai' },
    { text: 'La aventura vale la pena en sí misma.', author: 'Amelia Earhart' },
    { text: 'Lucha por lo que te importa, pero hazlo de una manera que atraiga a otros a unirse a ti.', author: 'Ruth Bader Ginsburg' },
    { text: 'No se nace mujer: se llega a serlo.', author: 'Simone de Beauvoir' },
    { text: 'La atención es la forma más rara y pura de generosidad.', author: 'Simone Weil' },
    { text: 'No deseo que las mujeres tengan poder sobre los hombres, sino sobre ellas mismas.', author: 'Mary Wollstonecraft' },
  ];

  const sessionQuote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];

  function updateDailyQuote() {
    const quoteEl = document.getElementById('dailyQuote');
    if (!quoteEl) return;
    const today = startOfDay(new Date());
    if (currentDate.getTime() !== today.getTime()) {
      quoteEl.innerHTML = '';
      return;
    }
    quoteEl.innerHTML = `<span class="daily-quote-text">"${sessionQuote.text}"</span><span class="daily-quote-author">${sessionQuote.author}</span>`;
  }

  function updateGreeting(entry) {
    const greetingEl = document.getElementById('dayGreeting');
    const today = startOfDay(new Date());
    if (currentDate.getTime() !== today.getTime()) {
      greetingEl.textContent = '';
      return;
    }
    if (entry.paused) {
      greetingEl.innerHTML = '<strong>Modo viaje activado</strong> — hoy no cuenta para tu racha.';
      return;
    }
    const hour = new Date().getHours();
    const salute = hour < 6 ? 'Buenas noches' : hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
    const name = (store.settings.profile && store.settings.profile.name || '').trim();
    const lead = name ? `${salute} ${escapeHtml(name)}` : salute;
    const sep = name ? ',' : ' —';
    const dailyTotal = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    if (dailyTotal === 0) {
      greetingEl.textContent = `${lead}.`;
      return;
    }
    let done = 0;
    store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) done++; });
    if (teethEnabled() && entry.teeth > 0) done++;
    if (done >= dailyTotal) {
      greetingEl.innerHTML = `${lead}${sep} <strong>ya has completado tu día</strong>.`;
    } else {
      const remaining = dailyTotal - done;
      greetingEl.innerHTML = `${lead}${sep} te ${remaining === 1 ? 'falta' : 'faltan'} <strong>${remaining}</strong> ${remaining === 1 ? 'tarea' : 'tareas'} hoy.`;
    }
  }

  function renderYearAgo() {
    const card = document.getElementById('yearAgoCard');
    const today = startOfDay(new Date());
    if (currentDate.getTime() !== today.getTime()) { card.hidden = true; return; }

    // Look back up to 10 years, most recent first, and show the first one with data.
    let pastDate = null, entry = null, yearsBack = 0;
    for (let y = 1; y <= 10; y++) {
      const candidate = new Date(today);
      candidate.setFullYear(candidate.getFullYear() - y);
      const candidateEntry = getEntry(dateKey(candidate));
      if (candidateEntry) { pastDate = candidate; entry = candidateEntry; yearsBack = y; break; }
    }
    if (!entry) { card.hidden = true; return; }

    const dailyTotal = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    let done = 0;
    store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) done++; });
    if (teethEnabled() && entry.teeth > 0) done++;

    const bits = [];
    if (dailyTotal > 0) bits.push(`${done}/${dailyTotal} hábitos completados`);
    if (entry.weight != null) bits.push(`${entry.weight} kg`);
    if (entry.sleepHours) bits.push(`${entry.sleepHours} h de sueño`);
    const summary = bits.length ? `<p class="hint-text" style="margin:0 0 8px">${escapeHtml(bits.join(' · '))}</p>` : '';
    const reflection = (entry.reflection || '').trim();
    const excerpt = reflection.length > 140 ? `${reflection.slice(0, 140)}…` : reflection;
    const reflectionHtml = excerpt ? `<p class="hint-text" style="margin:0;font-style:italic">"${escapeHtml(excerpt)}"</p>` : '';
    if (!summary && !reflectionHtml) { card.hidden = true; return; }
    card.hidden = false;
    document.getElementById('yearAgoTitle').textContent = yearsBack === 1 ? 'Hace un año' : `Hace ${yearsBack} años`;
    document.getElementById('yearAgoBody').innerHTML = `<p class="hint-text" style="margin:0 0 8px">${fmtShortDate(pastDate)} de ${pastDate.getFullYear()}</p>${summary}${reflectionHtml}`;
  }

  function renderHoy() {
    const key = dateKey(currentDate);
    const today = startOfDay(new Date());
    if (store.settings.travelModeActive && currentDate.getTime() === today.getTime()) {
      const liveEntry = ensureEntry(key);
      if (!liveEntry.paused) {
        liveEntry.paused = true;
        saveStore();
      }
    }
    const entry = getEntry(key) || emptyEntry();
    updateGreeting(entry);
    updateDailyQuote();
    renderYearAgo();

    const dailyItemsHtml = store.settings.dailyTasks.map((t) => `
      <li class="habit-row" data-habit="${t.id}">
        <button class="check-btn" data-check="${t.id}" aria-pressed="${!!entry[t.id]}">
          <span class="check-icon">${CHECK_TICK_SVG}</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${escapeHtml(t.label)}</span>
        </div>
      </li>`).join('');
    const teethHtml = teethEnabled() ? `
      <li class="habit-row habit-row--stepper" data-habit="teeth">
        <div class="habit-text">
          <span class="habit-name">Lavarme los dientes</span>
          <span class="habit-meta">mínimo 1 vez / día</span>
        </div>
        <div class="stepper" data-stepper="teeth">
          <button class="stepper-btn" data-step="-1" aria-label="Restar">–</button>
          <span class="stepper-value" id="teethValue">${entry.teeth || 0}</span>
          <button class="stepper-btn" data-step="1" aria-label="Sumar">+</button>
        </div>
      </li>` : '';
    const dailyEmptyHtml = (!dailyItemsHtml && !teethHtml) ? '<li class="task-empty-hint">No tienes tareas diarias. Añade una en Ajustes.</li>' : '';
    dailyTaskList.innerHTML = dailyItemsHtml + teethHtml + dailyEmptyHtml;

    const wk = isoWeekKey(currentDate);
    const week = getWeek(wk);
    const tasks = store.settings.weeklyTasks;
    weeklyTaskList.innerHTML = tasks.length ? tasks.map((t) => `
      <li class="habit-row" data-habit="${t.id}">
        <button class="check-btn" data-check-week="${t.id}" aria-pressed="${!!week[t.id]}">
          <span class="check-icon">${CHECK_TICK_SVG}</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${escapeHtml(t.label)}</span>
          <span class="habit-meta">esta semana</span>
        </div>
      </li>`).join('') : '<li class="task-empty-hint">No tienes tareas semanales. Añade una en Ajustes.</li>';
    weekRangeEl.textContent = weekRangeLabel(currentDate);

    const badHabits = store.settings.badHabits;
    const entryBadHabits = entry.badHabits || {};
    badHabitList.innerHTML = badHabits.length ? badHabits.map((b) => `
      <li class="habit-row" data-habit="${b.id}">
        <button class="check-btn check-btn--bad" data-check-bad="${b.id}" aria-pressed="${!!entryBadHabits[b.id]}">
          <span class="check-icon">${CROSS_SVG}</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${escapeHtml(b.label)}</span>
        </div>
      </li>`).join('') : '<li class="task-empty-hint">No tienes malos hábitos registrados. Añade uno en Ajustes.</li>';

    supplementsCard.hidden = !supplementsEnabled();
    const supplements = store.settings.supplements;
    const entrySupplements = entry.supplements || {};
    supplementList.innerHTML = supplements.length ? supplements.map((s) => `
      <li class="habit-row" data-habit="${s.id}">
        <button class="check-btn" data-check-supplement="${s.id}" aria-pressed="${!!entrySupplements[s.id]}">
          <span class="check-icon">${CHECK_TICK_SVG}</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${escapeHtml(s.label)}</span>
        </div>
      </li>`).join('') : '<li class="task-empty-hint">No tienes suplementos registrados. Añade uno en Ajustes.</li>';

    renderCicloCard(entry);
    renderWellbeingCards(entry);

    updateStreakBadge();
    renderObjetivos(entry);

    reflectionInput.value = entry.reflection || '';
    reflectionHint.textContent = 'Guardado automáticamente';
  }

  function renderObjetivos(entry) {
    aguaCard.hidden = !aguaEnabled();
    document.getElementById('aguaValue').textContent = entry.agua || 0;
    document.getElementById('aguaGoalHint').textContent = `Objetivo: ${aguaGoal()} vasos`;

    suenoCard.hidden = !suenoEnabled();
    document.getElementById('sleepHoursValue').textContent = entry.sleepHours || 0;
    document.querySelectorAll('.health-scale[data-health-sleep] .health-btn').forEach((btn) => {
      btn.classList.toggle('is-active', parseInt(btn.dataset.value, 10) === (entry.sleepQuality || 0));
    });

    pesoCard.hidden = !pesoEnabled();
    weightInput.value = entry.weight != null ? entry.weight : '';

    ayunoCard.hidden = !ayunoEnabled();
    fastStartInput.value = entry.fastStart || '';
    fastEndInput.value = entry.fastEnd || '';
    const fh = fastingHours(entry);
    document.getElementById('fastingHoursHint').textContent = fh > 0 ? `Ayuno de ${fh.toFixed(1)} horas.` : '';

    menteCard.hidden = !(meditacionEnabled() || lecturaEnabled());
    document.getElementById('meditationRow').hidden = !meditacionEnabled();
    document.getElementById('lecturaRow').hidden = !lecturaEnabled();
    document.getElementById('meditationMinValue').textContent = entry.meditationMin || 0;
    document.getElementById('readingMinValue').textContent = entry.readingMin || 0;

    workoutCard.hidden = !workoutsEnabled();
    const workout = entry.workout || { durationMin: 0, exercises: {}, templateId: '' };
    document.getElementById('workoutDurationValue').textContent = `${workout.durationMin || 0} min`;
    const templates = store.settings.workoutTemplates || [];
    const templateSelectRow = document.getElementById('templateSelectRow');
    templateSelectRow.hidden = templates.length === 0;
    if (templates.length > 0) {
      templateSelect.innerHTML = '<option value="">Todos los ejercicios</option>' +
        templates.map((t) => `<option value="${t.id}">${escapeHtml(t.label)}</option>`).join('');
      templateSelect.value = workout.templateId || '';
    }
    const activeTemplate = templates.find((t) => t.id === workout.templateId);
    const exercises = activeTemplate
      ? store.settings.exercises.filter((ex) => activeTemplate.exerciseIds.includes(ex.id))
      : store.settings.exercises;
    const workoutExercises = workout.exercises || {};
    exerciseEmptyHint.hidden = store.settings.exercises.length > 0;
    exerciseLogList.innerHTML = exercises.map((ex) => {
      const log = workoutExercises[ex.id] || { weight: null, reps: 0, failure: false };
      const groupTag = ex.group ? `<span class="exercise-row-group">${escapeHtml(exerciseGroupLabel(ex.group))}</span>` : '';
      return `
      <li class="exercise-row" data-exercise="${ex.id}">
        <div class="exercise-row-name">${escapeHtml(ex.label)}${groupTag}</div>
        <div class="exercise-row-inputs">
          <div class="exercise-field">
            <label>Peso (kg)</label>
            <input type="number" class="exercise-input" data-exercise-id="${ex.id}" data-exercise-field="weight" min="0" step="0.5" placeholder="0" value="${log.weight != null ? log.weight : ''}" />
          </div>
          <div class="exercise-field">
            <label>Reps</label>
            <input type="number" class="exercise-input" data-exercise-id="${ex.id}" data-exercise-field="reps" min="0" step="1" placeholder="0" value="${log.reps || ''}" />
          </div>
          <button type="button" class="failure-btn" data-exercise-id="${ex.id}" aria-pressed="${!!log.failure}">Al fallo</button>
        </div>
      </li>`;
    }).join('');

    const goals = store.settings.goals;
    const entryGoals = entry.goals || {};
    goalsCard.hidden = goals.length === 0;
    goalsList.innerHTML = goals.map((g) => `
      <li class="habit-row" data-habit="${g.id}">
        <button class="check-btn" data-check-goal="${g.id}" aria-pressed="${!!entryGoals[g.id]}">
          <span class="check-icon">${CHECK_TICK_SVG}</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${escapeHtml(g.label)}</span>
          <span class="habit-meta">objetivo: ${g.target}/mes${goalDueLabel(g.dueDate)}</span>
        </div>
      </li>`).join('');

    updateObjetivosTabVisibility();
  }

  /* ============ COMIDAS panel ============ */
  const mealInputs = document.querySelectorAll('[data-meal-time], [data-meal-desc]');
  const mealDescTimers = {};

  mealInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      const mealTime = input.dataset.mealTime;
      const mealDesc = input.dataset.mealDesc;
      if (mealTime) {
        entry.meals[mealTime].time = input.value;
        saveStore();
      }
      if (mealDesc) {
        entry.meals[mealDesc].desc = input.value;
        clearTimeout(mealDescTimers[mealDesc]);
        mealDescTimers[mealDesc] = setTimeout(saveStore, 400);
      }
    });
  });

  const healthScales = document.querySelectorAll('.health-scale[data-health]');

  healthScales.forEach((scale) => {
    scale.addEventListener('click', (e) => {
      const btn = e.target.closest('.health-btn');
      if (!btn) return;
      const meal = scale.dataset.health;
      const value = parseInt(btn.dataset.value, 10);
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.meals[meal].health = entry.meals[meal].health === value ? 0 : value;
      saveStore();
      renderComidas();
    });
  });

  function generateUsualMealId() {
    return `um_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function renderUsualMealChips(meal) {
    const list = store.settings.usualMeals[meal] || [];
    const wrap = document.getElementById(`usualChips-${meal}`);
    wrap.innerHTML = list.map((u) => `
      <span class="usual-meal-chip">
        <button type="button" class="usual-meal-chip-select" data-usual-select="${meal}:${u.id}">${escapeHtml(u.desc)}</button>
        <button type="button" class="usual-meal-chip-remove" data-usual-remove="${meal}:${u.id}" aria-label="Quitar de habituales">×</button>
      </span>`).join('');
  }

  ['desayuno', 'comida', 'cena'].forEach((meal) => {
    document.getElementById(`usualChips-${meal}`).addEventListener('click', (e) => {
      const selectBtn = e.target.closest('[data-usual-select]');
      const removeBtn = e.target.closest('[data-usual-remove]');
      if (selectBtn) {
        const [mealType, id] = selectBtn.dataset.usualSelect.split(':');
        const usual = (store.settings.usualMeals[mealType] || []).find((u) => u.id === id);
        if (!usual) return;
        const key = dateKey(currentDate);
        const entry = ensureEntry(key);
        entry.meals[mealType].desc = usual.desc;
        if (usual.health) entry.meals[mealType].health = usual.health;
        saveStore();
        renderComidas();
      } else if (removeBtn) {
        const [mealType, id] = removeBtn.dataset.usualRemove.split(':');
        store.settings.usualMeals[mealType] = (store.settings.usualMeals[mealType] || []).filter((u) => u.id !== id);
        saveStore();
        renderUsualMealChips(mealType);
      }
    });
  });

  document.querySelectorAll('[data-save-usual]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const meal = btn.dataset.saveUsual;
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      const desc = (entry.meals[meal].desc || '').trim();
      if (!desc) return;
      const list = store.settings.usualMeals[meal] || (store.settings.usualMeals[meal] = []);
      const already = list.some((u) => u.desc.trim().toLowerCase() === desc.toLowerCase());
      if (already) return;
      list.push({ id: generateUsualMealId(), desc, health: entry.meals[meal].health || 0 });
      saveStore();
      renderUsualMealChips(meal);
    });
  });

  function renderComidas() {
    const key = dateKey(currentDate);
    const entry = getEntry(key) || emptyEntry();
    ['desayuno', 'comida', 'cena'].forEach((meal) => {
      document.getElementById(`time-${meal}`).value = entry.meals[meal].time || '';
      document.getElementById(`desc-${meal}`).value = entry.meals[meal].desc || '';
      const health = entry.meals[meal].health || 0;
      document.querySelectorAll(`.health-scale[data-health="${meal}"] .health-btn`).forEach((btn) => {
        btn.classList.toggle('is-active', parseInt(btn.dataset.value, 10) === health);
      });
      renderUsualMealChips(meal);
    });
    renderSnacks(entry);
    renderSavedRecipes();
    renderShoppingList();
  }

  /* ============ Snacks ============ */
  const snacksCard = document.getElementById('snacksCard');
  const snackList = document.getElementById('snackList');
  const newSnackInput = document.getElementById('newSnackInput');
  const addSnackBtn = document.getElementById('addSnackBtn');

  function renderSnacks(entry) {
    snacksCard.hidden = !snacksEnabled();
    if (!snacksEnabled()) return;
    const snacks = entry.snacks || [];
    snackList.innerHTML = snacks.length ? snacks.map((s, i) => `
      <li class="task-manage-item">
        <span class="task-manage-label">${escapeHtml(s)}</span>
        <button class="task-remove-btn" data-remove-snack="${i}" aria-label="Quitar">×</button>
      </li>`).join('') : '<li class="task-empty-hint">Sin snacks registrados hoy.</li>';
  }

  function addSnack() {
    const text = newSnackInput.value.trim();
    if (!text) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.snacks = entry.snacks || [];
    entry.snacks.push(text);
    newSnackInput.value = '';
    saveStore();
    renderComidas();
  }
  addSnackBtn.addEventListener('click', addSnack);
  newSnackInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addSnack(); });
  snackList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-snack]');
    if (!btn) return;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.snacks = entry.snacks || [];
    entry.snacks.splice(parseInt(btn.dataset.removeSnack, 10), 1);
    saveStore();
    renderComidas();
  });

  /* ============ Recetas favoritas + lista de la compra ============ */
  const savedRecipesCard = document.getElementById('savedRecipesCard');
  const savedRecipesList = document.getElementById('savedRecipesList');
  const shoppingListCard = document.getElementById('shoppingListCard');
  const shoppingListItems = document.getElementById('shoppingListItems');
  const newShoppingItemInput = document.getElementById('newShoppingItemInput');
  const addShoppingItemBtn = document.getElementById('addShoppingItemBtn');
  const clearShoppingListBtn = document.getElementById('clearShoppingListBtn');

  function renderSavedRecipes() {
    const saved = store.settings.savedRecipes || [];
    savedRecipesCard.hidden = saved.length === 0;
    if (saved.length === 0) return;
    savedRecipesList.innerHTML = saved.map((r, i) => `
      <li class="task-manage-item">
        <span class="task-manage-label">${escapeHtml(r.name)}</span>
        <button class="secondary-btn" data-shopping-from-recipe="${i}" style="margin-right:6px">+ Lista</button>
        <button class="task-remove-btn" data-remove-saved-recipe="${i}" aria-label="Quitar">×</button>
      </li>`).join('');
  }
  savedRecipesList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove-saved-recipe]');
    const shopBtn = e.target.closest('[data-shopping-from-recipe]');
    if (removeBtn) {
      store.settings.savedRecipes.splice(parseInt(removeBtn.dataset.removeSavedRecipe, 10), 1);
      saveStore();
      renderComidas();
    } else if (shopBtn) {
      const recipe = store.settings.savedRecipes[parseInt(shopBtn.dataset.shoppingFromRecipe, 10)];
      if (recipe && Array.isArray(recipe.ingredientsList)) {
        recipe.ingredientsList.forEach((label) => {
          if (!store.settings.shoppingList.some((it) => it.text === label)) {
            store.settings.shoppingList.push({ text: label, done: false });
          }
        });
        saveStore();
        renderComidas();
      }
    }
  });

  function renderShoppingList() {
    const list = store.settings.shoppingList || [];
    shoppingListCard.hidden = list.length === 0;
    if (list.length === 0) return;
    shoppingListItems.innerHTML = list.map((item, i) => `
      <li class="task-manage-item">
        <label class="shopping-item-label">
          <input type="checkbox" data-shopping-check="${i}" ${item.done ? 'checked' : ''} />
          <span class="${item.done ? 'shopping-item-done' : ''}">${escapeHtml(item.text)}</span>
        </label>
        <button class="task-remove-btn" data-remove-shopping="${i}" aria-label="Quitar">×</button>
      </li>`).join('');
  }
  function addShoppingItem() {
    const text = newShoppingItemInput.value.trim();
    if (!text) return;
    store.settings.shoppingList.push({ text, done: false });
    newShoppingItemInput.value = '';
    saveStore();
    renderComidas();
  }
  addShoppingItemBtn.addEventListener('click', addShoppingItem);
  newShoppingItemInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addShoppingItem(); });
  shoppingListItems.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove-shopping]');
    if (removeBtn) {
      store.settings.shoppingList.splice(parseInt(removeBtn.dataset.removeShopping, 10), 1);
      saveStore();
      renderComidas();
    }
  });
  shoppingListItems.addEventListener('change', (e) => {
    const check = e.target.closest('[data-shopping-check]');
    if (!check) return;
    const item = store.settings.shoppingList[parseInt(check.dataset.shoppingCheck, 10)];
    if (item) {
      item.done = check.checked;
      saveStore();
      renderComidas();
    }
  });
  clearShoppingListBtn.addEventListener('click', () => {
    store.settings.shoppingList = [];
    saveStore();
    renderComidas();
  });

  /* ============ Recipe search ============ */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function safeUrl(url) {
    if (typeof url !== 'string') return '';
    return /^https?:\/\//i.test(url.trim()) ? url.trim() : '';
  }

  const RECIPE_API_BASE = 'https://www.themealdb.com/api/json/v1/1';
  const RECIPE_CANDIDATE_LIMIT = 10;

  async function searchRecipesByIngredients(ingredients) {
    const primary = ingredients[0].trim().toLowerCase().replace(/\s+/g, '_');
    const filterRes = await fetch(`${RECIPE_API_BASE}/filter.php?i=${encodeURIComponent(primary)}`);
    if (!filterRes.ok) throw new Error('network');
    const filterData = await filterRes.json();
    const candidates = (filterData.meals || []).slice(0, RECIPE_CANDIDATE_LIMIT);
    if (candidates.length === 0) return [];
    const others = ingredients.slice(1).map((x) => x.trim().toLowerCase());
    const details = await Promise.all(candidates.map((c) =>
      fetch(`${RECIPE_API_BASE}/lookup.php?i=${encodeURIComponent(c.idMeal)}`)
        .then((r) => r.json())
        .then((d) => (d.meals && d.meals[0]) || null)
        .catch(() => null)
    ));
    return details.filter((meal) => {
      if (!meal) return false;
      if (others.length === 0) return true;
      const mealIngredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.trim()) mealIngredients.push(ing.trim().toLowerCase());
      }
      return others.every((need) => mealIngredients.some((ing) => ing.includes(need) || need.includes(ing)));
    });
  }

  const TRANSLATE_API_BASE = 'https://api.mymemory.translated.net/get';
  const TRANSLATE_CHUNK_LIMIT = 450;

  function chunkTextForTranslation(text, maxLen) {
    if (text.length <= maxLen) return [text];
    const words = text.split(/\s+/);
    const chunks = [];
    let current = '';
    words.forEach((w) => {
      if ((current ? current + ' ' + w : w).length > maxLen) {
        if (current) chunks.push(current);
        current = w;
      } else {
        current = current ? `${current} ${w}` : w;
      }
    });
    if (current) chunks.push(current);
    return chunks;
  }

  async function translateText(text, langpair) {
    const trimmed = (text || '').trim();
    if (!trimmed) return trimmed;
    const chunks = chunkTextForTranslation(trimmed, TRANSLATE_CHUNK_LIMIT);
    const translatedChunks = [];
    for (const chunk of chunks) {
      const res = await fetch(`${TRANSLATE_API_BASE}?q=${encodeURIComponent(chunk)}&langpair=${langpair}`);
      if (!res.ok) throw new Error('translate-http');
      const data = await res.json();
      const translated = data.responseData && data.responseData.translatedText;
      if (!translated) throw new Error('translate-empty');
      translatedChunks.push(translated);
    }
    return translatedChunks.join(' ');
  }

  function translateToSpanish(text) {
    return translateText(text, 'en|es');
  }

  // Static Spanish -> English ingredient dictionary, used as a reliable first pass
  // before falling back to the live translation API (which can be slow, rate-limited
  // or unavailable). Keys are lowercase with accents stripped.
  const ES_EN_INGREDIENTS = {
    // Carnes y aves
    pollo: 'chicken', 'pechuga de pollo': 'chicken breast', 'muslo de pollo': 'chicken thigh',
    'alitas de pollo': 'chicken wings', ternera: 'beef', 'carne de res': 'beef', res: 'beef',
    cerdo: 'pork', 'lomo de cerdo': 'pork loin', panceta: 'bacon', tocino: 'bacon', beicon: 'bacon',
    jamon: 'ham', cordero: 'lamb', pavo: 'turkey', conejo: 'rabbit', chorizo: 'chorizo',
    salchicha: 'sausage', salchichas: 'sausages', 'carne picada': 'ground beef', 'carne molida': 'ground beef',
    // Pescados y mariscos
    salmon: 'salmon', atun: 'tuna', bacalao: 'cod', merluza: 'hake', gambas: 'shrimp',
    camarones: 'shrimp', langostinos: 'prawns', calamar: 'squid', calamares: 'squid',
    pulpo: 'octopus', mejillones: 'mussels', almejas: 'clams', sardinas: 'sardines',
    trucha: 'trout', anchoas: 'anchovies', vieiras: 'scallops', cangrejo: 'crab', langosta: 'lobster',
    // Lacteos y huevos
    huevo: 'egg', huevos: 'eggs', leche: 'milk', mantequilla: 'butter', queso: 'cheese',
    'queso parmesano': 'parmesan cheese', 'queso mozzarella': 'mozzarella cheese',
    'queso cheddar': 'cheddar cheese', 'queso crema': 'cream cheese', nata: 'cream',
    crema: 'cream', 'crema agria': 'sour cream', yogur: 'yogurt', yogurt: 'yogurt', requeson: 'cottage cheese',
    // Verduras
    cebolla: 'onion', cebollas: 'onions', ajo: 'garlic', tomate: 'tomato', tomates: 'tomatoes',
    patata: 'potato', patatas: 'potatoes', papa: 'potato', papas: 'potatoes',
    zanahoria: 'carrot', zanahorias: 'carrots', pimiento: 'bell pepper', pimientos: 'bell peppers',
    'pimiento rojo': 'red pepper', 'pimiento verde': 'green pepper', chile: 'chili pepper',
    guindilla: 'chili pepper', calabacin: 'zucchini', berenjena: 'eggplant', brocoli: 'broccoli',
    coliflor: 'cauliflower', espinaca: 'spinach', espinacas: 'spinach', lechuga: 'lettuce',
    pepino: 'cucumber', apio: 'celery', guisantes: 'peas', guisante: 'peas', arvejas: 'peas',
    chicharos: 'peas', 'judias verdes': 'green beans', 'judías verdes': 'green beans',
    habas: 'broad beans', maiz: 'corn', elote: 'corn', choclo: 'corn', champinon: 'mushroom',
    champinones: 'mushrooms', setas: 'mushrooms', col: 'cabbage', repollo: 'cabbage',
    'coles de bruselas': 'brussels sprouts', remolacha: 'beetroot', rabano: 'radish',
    esparragos: 'asparagus', alcachofa: 'artichoke', puerro: 'leek', jengibre: 'ginger',
    aguacate: 'avocado', palta: 'avocado', calabaza: 'pumpkin', batata: 'sweet potato', boniato: 'sweet potato',
    // Legumbres y cereales
    arroz: 'rice', lentejas: 'lentils', garbanzos: 'chickpeas', frijoles: 'beans', alubias: 'beans',
    judias: 'beans', pasta: 'pasta', espagueti: 'spaghetti', espaguetis: 'spaghetti',
    macarrones: 'macaroni', fideos: 'noodles', harina: 'flour', pan: 'bread',
    'pan rallado': 'breadcrumbs', avena: 'oats', quinoa: 'quinoa', cuscus: 'couscous',
    // Frutas
    limon: 'lemon', lima: 'lime', naranja: 'orange', manzana: 'apple', platano: 'banana',
    banana: 'banana', fresa: 'strawberry', fresas: 'strawberries', uva: 'grape', uvas: 'grapes',
    pina: 'pineapple', mango: 'mango', sandia: 'watermelon', melon: 'melon', pera: 'pear',
    melocoton: 'peach', durazno: 'peach', cereza: 'cherry', cerezas: 'cherries', ciruela: 'plum',
    coco: 'coconut', kiwi: 'kiwi', arandanos: 'blueberries', mora: 'blackberry', moras: 'blackberries',
    granada: 'pomegranate', higo: 'fig',
    // Especias y hierbas
    sal: 'salt', pimienta: 'pepper', 'pimienta negra': 'black pepper', oregano: 'oregano',
    albahaca: 'basil', perejil: 'parsley', cilantro: 'cilantro', comino: 'cumin', canela: 'cinnamon',
    pimenton: 'paprika', 'nuez moscada': 'nutmeg', laurel: 'bay leaf', tomillo: 'thyme',
    romero: 'rosemary', curcuma: 'turmeric', curry: 'curry', azafran: 'saffron', vainilla: 'vanilla',
    // Aceites, salsas y condimentos
    aceite: 'oil', 'aceite de oliva': 'olive oil', 'aceite vegetal': 'vegetable oil', vinagre: 'vinegar',
    'salsa de soja': 'soy sauce', mostaza: 'mustard', mayonesa: 'mayonnaise', ketchup: 'ketchup',
    miel: 'honey', azucar: 'sugar', 'azucar moreno': 'brown sugar', 'mantequilla de mani': 'peanut butter',
    caldo: 'stock', 'caldo de pollo': 'chicken stock', 'caldo de carne': 'beef stock',
    vino: 'wine', 'vino blanco': 'white wine', 'vino tinto': 'red wine', cerveza: 'beer', agua: 'water',
    // Frutos secos
    almendras: 'almonds', nueces: 'walnuts', avellanas: 'hazelnuts', pistachos: 'pistachios',
    cacahuetes: 'peanuts', mani: 'peanuts', pasas: 'raisins', datiles: 'dates',
    // Panadería / repostería
    chocolate: 'chocolate', cacao: 'cocoa', levadura: 'yeast', bicarbonato: 'baking soda', gelatina: 'gelatin'
  };

  function stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function normalizeEs(str) {
    return stripAccents(str.toLowerCase().trim()).replace(/\s+/g, ' ');
  }

  function longestPhraseMatch(words, dict) {
    for (let size = words.length; size >= 1; size--) {
      for (let start = 0; start + size <= words.length; start++) {
        const phrase = words.slice(start, start + size).join(' ');
        if (dict[phrase]) return dict[phrase];
      }
    }
    return null;
  }

  function lookupIngredientTranslation(text) {
    const norm = normalizeEs(text);
    if (ES_EN_INGREDIENTS[norm]) return ES_EN_INGREDIENTS[norm];
    const stripped = norm.replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '').trim();
    if (stripped && ES_EN_INGREDIENTS[stripped]) return ES_EN_INGREDIENTS[stripped];
    return longestPhraseMatch(stripped.split(' '), ES_EN_INGREDIENTS);
  }

  // English -> Spanish, for translating recipe results that come back from TheMealDB.
  const EN_ES_INGREDIENTS = {
    // Carnes y aves
    chicken: 'pollo', 'chicken breast': 'pechuga de pollo', 'chicken breasts': 'pechugas de pollo',
    'chicken thigh': 'muslo de pollo', 'chicken thighs': 'muslos de pollo', 'chicken drumsticks': 'contramuslos de pollo',
    'chicken wings': 'alitas de pollo', 'chicken mince': 'pollo picado', 'minced chicken': 'pollo picado',
    beef: 'ternera', 'beef mince': 'carne picada de ternera', 'minced beef': 'carne picada', 'ground beef': 'carne picada',
    steak: 'filete', 'sirloin steak': 'filete de solomillo', pork: 'cerdo', 'pork chops': 'chuletas de cerdo',
    'pork belly': 'panceta de cerdo', 'pork loin': 'lomo de cerdo', 'ground pork': 'carne de cerdo picada',
    bacon: 'panceta', 'streaky bacon': 'panceta', 'back bacon': 'bacon', ham: 'jamón', lamb: 'cordero',
    'lamb chops': 'chuletas de cordero', 'leg of lamb': 'pierna de cordero', turkey: 'pavo',
    'turkey breast': 'pechuga de pavo', duck: 'pato', 'duck breast': 'pechuga de pato', rabbit: 'conejo',
    chorizo: 'chorizo', sausage: 'salchicha', sausages: 'salchichas', 'sausage meat': 'carne de salchicha',
    mince: 'carne picada', 'minced meat': 'carne picada', veal: 'ternera',
    // Pescados y mariscos
    salmon: 'salmón', 'salmon fillets': 'filetes de salmón', 'smoked salmon': 'salmón ahumado',
    tuna: 'atún', 'canned tuna': 'atún en lata', 'tuna steaks': 'filetes de atún', cod: 'bacalao',
    'cod fillets': 'filetes de bacalao', haddock: 'eglefino', hake: 'merluza', shrimp: 'gambas',
    prawns: 'gambas', 'king prawns': 'langostinos', 'tiger prawns': 'langostinos tigre', squid: 'calamar',
    octopus: 'pulpo', mussels: 'mejillones', clams: 'almejas', sardines: 'sardinas', trout: 'trucha',
    anchovies: 'anchoas', scallops: 'vieiras', crab: 'cangrejo', 'crab meat': 'carne de cangrejo', lobster: 'langosta',
    'white fish': 'pescado blanco', 'fish fillets': 'filetes de pescado',
    // Lacteos y huevos
    egg: 'huevo', eggs: 'huevos', 'egg yolk': 'yema de huevo', 'egg yolks': 'yemas de huevo',
    'egg white': 'clara de huevo', 'egg whites': 'claras de huevo', milk: 'leche', buttermilk: 'suero de leche',
    'condensed milk': 'leche condensada', 'evaporated milk': 'leche evaporada', 'coconut milk': 'leche de coco',
    'coconut cream': 'crema de coco', butter: 'mantequilla', margarine: 'margarina', cheese: 'queso',
    'parmesan cheese': 'queso parmesano', parmesan: 'parmesano', 'mozzarella cheese': 'queso mozzarella',
    mozzarella: 'mozzarella', 'cheddar cheese': 'queso cheddar', cheddar: 'cheddar',
    'cream cheese': 'queso crema', 'feta cheese': 'queso feta', feta: 'feta', 'goat cheese': 'queso de cabra',
    'ricotta cheese': 'queso ricotta', ricotta: 'ricotta', 'cottage cheese': 'requesón',
    cream: 'nata', 'double cream': 'nata para montar', 'single cream': 'nata líquida',
    'sour cream': 'nata agria', 'creme fraiche': 'crema fresca', 'greek yogurt': 'yogur griego',
    yogurt: 'yogur', yoghurt: 'yogur',
    // Verduras
    onion: 'cebolla', onions: 'cebollas', 'spring onion': 'cebolleta', 'spring onions': 'cebolletas',
    'red onion': 'cebolla roja', 'red onions': 'cebollas rojas', garlic: 'ajo', 'garlic clove': 'diente de ajo',
    'garlic cloves': 'dientes de ajo', tomato: 'tomate', tomatoes: 'tomates', 'cherry tomatoes': 'tomates cherry',
    'tomato puree': 'puré de tomate', 'tomato paste': 'concentrado de tomate', passata: 'tomate triturado',
    potato: 'patata', potatoes: 'patatas', 'sweet potato': 'boniato', 'sweet potatoes': 'boniatos',
    carrot: 'zanahoria', carrots: 'zanahorias', 'bell pepper': 'pimiento', 'bell peppers': 'pimientos',
    'red pepper': 'pimiento rojo', 'green pepper': 'pimiento verde',
    'chili pepper': 'guindilla', 'chilli pepper': 'guindilla', chili: 'chile', chilli: 'chile',
    'chili flakes': 'copos de chile', 'chilli flakes': 'copos de chile', zucchini: 'calabacín',
    courgette: 'calabacín', courgettes: 'calabacines', eggplant: 'berenjena', aubergine: 'berenjena',
    broccoli: 'brócoli', cauliflower: 'coliflor', spinach: 'espinacas', lettuce: 'lechuga',
    rocket: 'rúcula', arugula: 'rúcula', cucumber: 'pepino', celery: 'apio', peas: 'guisantes',
    mangetout: 'tirabeques', 'green beans': 'judías verdes', 'broad beans': 'habas',
    corn: 'maíz', sweetcorn: 'maíz dulce', mushroom: 'champiñón', mushrooms: 'champiñones',
    cabbage: 'col', 'red cabbage': 'lombarda', 'brussels sprouts': 'coles de bruselas',
    beetroot: 'remolacha', radish: 'rábano', asparagus: 'espárragos', artichoke: 'alcachofa',
    leek: 'puerro', leeks: 'puerros', ginger: 'jengibre', avocado: 'aguacate', pumpkin: 'calabaza',
    swede: 'colinabo', turnip: 'nabo', parsnip: 'chirivía',
    // Legumbres y cereales
    rice: 'arroz', lentils: 'lentejas', chickpeas: 'garbanzos', beans: 'alubias', 'kidney beans': 'alubias rojas',
    'black beans': 'alubias negras', pasta: 'pasta', spaghetti: 'espaguetis', macaroni: 'macarrones',
    noodles: 'fideos', flour: 'harina', 'plain flour': 'harina de trigo', 'self-raising flour': 'harina con levadura',
    'self raising flour': 'harina con levadura', cornflour: 'maicena', cornstarch: 'maicena', bread: 'pan',
    breadcrumbs: 'pan rallado', 'panko breadcrumbs': 'panko', oats: 'avena', quinoa: 'quinoa',
    couscous: 'cuscús',
    // Frutas
    lemon: 'limón', lemons: 'limones', 'lemon juice': 'zumo de limón', 'lemon zest': 'ralladura de limón',
    lime: 'lima', limes: 'limas', orange: 'naranja', oranges: 'naranjas', apple: 'manzana', apples: 'manzanas',
    banana: 'plátano', bananas: 'plátanos', strawberry: 'fresa', strawberries: 'fresas', grape: 'uva',
    grapes: 'uvas', pineapple: 'piña', mango: 'mango', watermelon: 'sandía', melon: 'melón', pear: 'pera',
    peach: 'melocotón', peaches: 'melocotones', cherry: 'cereza', cherries: 'cerezas', plum: 'ciruela',
    coconut: 'coco', kiwi: 'kiwi', blueberries: 'arándanos', blackberry: 'mora', blackberries: 'moras',
    pomegranate: 'granada', fig: 'higo', raisins: 'pasas', dates: 'dátiles',
    // Especias y hierbas
    salt: 'sal', 'sea salt': 'sal marina', pepper: 'pimienta', 'black pepper': 'pimienta negra',
    oregano: 'orégano', basil: 'albahaca', 'basil leaves': 'hojas de albahaca', parsley: 'perejil',
    coriander: 'cilantro', cilantro: 'cilantro', cumin: 'comino', cinnamon: 'canela',
    'cinnamon stick': 'rama de canela', paprika: 'pimentón', 'smoked paprika': 'pimentón ahumado',
    'nutmeg': 'nuez moscada', 'bay leaf': 'hoja de laurel', 'bay leaves': 'hojas de laurel',
    thyme: 'tomillo', rosemary: 'romero', turmeric: 'cúrcuma', curry: 'curry', saffron: 'azafrán',
    vanilla: 'vainilla', 'vanilla extract': 'extracto de vainilla', 'vanilla essence': 'esencia de vainilla',
    'cayenne pepper': 'pimienta de cayena', cayenne: 'cayena',
    // Aceites, salsas y condimentos
    oil: 'aceite', 'olive oil': 'aceite de oliva', 'vegetable oil': 'aceite vegetal',
    'sesame oil': 'aceite de sésamo', vinegar: 'vinagre', 'balsamic vinegar': 'vinagre balsámico',
    'soy sauce': 'salsa de soja', 'fish sauce': 'salsa de pescado', 'oyster sauce': 'salsa de ostras',
    'worcestershire sauce': 'salsa worcestershire', mustard: 'mostaza', mayonnaise: 'mayonesa',
    ketchup: 'kétchup', honey: 'miel', sugar: 'azúcar', 'brown sugar': 'azúcar moreno',
    'caster sugar': 'azúcar extrafino', 'icing sugar': 'azúcar glas', 'powdered sugar': 'azúcar glas',
    'peanut butter': 'mantequilla de cacahuete', tahini: 'tahini', stock: 'caldo', broth: 'caldo',
    'chicken stock': 'caldo de pollo', 'beef stock': 'caldo de carne', 'vegetable stock': 'caldo de verduras',
    'stock cube': 'pastilla de caldo', wine: 'vino', 'white wine': 'vino blanco', 'red wine': 'vino tinto',
    beer: 'cerveza', water: 'agua', 'sesame seeds': 'semillas de sésamo',
    // Frutos secos
    almonds: 'almendras', walnuts: 'nueces', hazelnuts: 'avellanas', pistachios: 'pistachos',
    peanuts: 'cacahuetes', 'pine nuts': 'piñones', cashews: 'anacardos',
    // Panadería / repostería
    chocolate: 'chocolate', 'dark chocolate': 'chocolate negro', 'milk chocolate': 'chocolate con leche',
    'white chocolate': 'chocolate blanco', cocoa: 'cacao', 'cocoa powder': 'cacao en polvo',
    yeast: 'levadura', 'baking powder': 'levadura en polvo', 'baking soda': 'bicarbonato de sodio',
    'bicarbonate of soda': 'bicarbonato de sodio', gelatin: 'gelatina', gelatine: 'gelatina',
    'golden syrup': 'sirope dorado', 'maple syrup': 'sirope de arce', 'puff pastry': 'hojaldre',
    'shortcrust pastry': 'masa quebrada', 'filo pastry': 'pasta filo'
  };

  // English -> Spanish measurement/unit vocabulary, used to translate the free-text
  // "measure" field TheMealDB returns (e.g. "2 tbsp", "1 cup", "a pinch").
  const EN_ES_UNITS = {
    cup: 'taza', cups: 'tazas', tablespoon: 'cucharada', tablespoons: 'cucharadas', tbsp: 'cucharada',
    tbsps: 'cucharadas', tbs: 'cucharada', teaspoon: 'cucharadita', teaspoons: 'cucharaditas',
    tsp: 'cucharadita', tsps: 'cucharaditas', ounce: 'onza', ounces: 'onzas', oz: 'onza',
    pound: 'libra', pounds: 'libras', lb: 'libra', lbs: 'libras', gram: 'gramo', grams: 'gramos',
    g: 'g', kilogram: 'kilogramo', kilograms: 'kilogramos', kg: 'kg', milliliter: 'mililitro',
    milliliters: 'mililitros', millilitre: 'mililitro', millilitres: 'mililitros', ml: 'ml',
    liter: 'litro', liters: 'litros', litre: 'litro', litres: 'litros', l: 'l', pinch: 'pizca',
    pinches: 'pizcas', clove: 'diente', cloves: 'dientes', slice: 'rodaja', slices: 'rodajas',
    can: 'lata', cans: 'latas', package: 'paquete', packages: 'paquetes', packet: 'paquete',
    packets: 'paquetes', pkg: 'paquete', stick: 'barra', sticks: 'barras', handful: 'puñado',
    handfuls: 'puñados', sprig: 'ramita', sprigs: 'ramitas', bunch: 'manojo', bunches: 'manojos',
    quart: 'cuarto de galón', quarts: 'cuartos de galón', pint: 'pinta', pints: 'pintas',
    dash: 'pizca', dashes: 'pizcas', drop: 'gota', drops: 'gotas', piece: 'trozo', pieces: 'trozos',
    rasher: 'loncha', rashers: 'lonchas', fillet: 'filete', fillets: 'filetes', sheet: 'lámina',
    sheets: 'láminas', knob: 'nuez', splash: 'chorrito', large: 'grande', medium: 'mediano',
    small: 'pequeño', whole: 'entero', half: 'medio', quarter: 'cuarto', third: 'tercio',
    fresh: 'fresco', dried: 'seco', frozen: 'congelado', canned: 'en lata', tinned: 'en lata',
    chopped: 'picado', diced: 'en cubos', sliced: 'en rodajas', minced: 'picado', grated: 'rallado',
    shredded: 'desmenuzado', crushed: 'triturado', ground: 'molido', peeled: 'pelado',
    deseeded: 'sin semillas', seeded: 'sin semillas', deveined: 'sin venas', boneless: 'sin hueso',
    skinless: 'sin piel', cooked: 'cocido', uncooked: 'crudo', raw: 'crudo', ripe: 'maduro',
    softened: 'ablandado', melted: 'derretido', beaten: 'batido', sifted: 'tamizado',
    crumbled: 'desmenuzado', zest: 'ralladura', juice: 'zumo', rind: 'corteza', optional: 'opcional',
    'to taste': 'al gusto', 'as needed': 'según se necesite', 'for garnish': 'para decorar',
    'room temperature': 'a temperatura ambiente', 'finely chopped': 'picado fino',
    'roughly chopped': 'picado grueso'
  };

  const EN_ES_CATEGORIES = {
    beef: 'Ternera', chicken: 'Pollo', dessert: 'Postre', lamb: 'Cordero', miscellaneous: 'Variado',
    pasta: 'Pasta', pork: 'Cerdo', seafood: 'Marisco', side: 'Guarnición', starter: 'Entrante',
    vegan: 'Vegano', vegetarian: 'Vegetariano', breakfast: 'Desayuno', goat: 'Cabra'
  };

  const EN_ES_AREAS = {
    american: 'Estadounidense', british: 'Británica', canadian: 'Canadiense', chinese: 'China',
    croatian: 'Croata', dutch: 'Holandesa', egyptian: 'Egipcia', filipino: 'Filipina',
    french: 'Francesa', greek: 'Griega', indian: 'India', irish: 'Irlandesa', italian: 'Italiana',
    jamaican: 'Jamaicana', japanese: 'Japonesa', kenyan: 'Keniana', malaysian: 'Malaya',
    mexican: 'Mexicana', moroccan: 'Marroquí', polish: 'Polaca', portuguese: 'Portuguesa',
    russian: 'Rusa', spanish: 'Española', thai: 'Tailandesa', tunisian: 'Tunecina',
    turkish: 'Turca', unknown: 'Desconocida', vietnamese: 'Vietnamita'
  };

  // Translate a short English phrase (ingredient name, category, area) using a static
  // dictionary. Tries the whole phrase first, then falls back to per-word matching so
  // partially-known phrases ("fresh coriander leaves") still get partially translated.
  function translateWithDictionary(text, dict) {
    const trimmed = (text || '').trim();
    if (!trimmed) return null;
    const norm = trimmed.toLowerCase().replace(/\s+/g, ' ');
    if (dict[norm]) return dict[norm];
    const whole = longestPhraseMatch(norm.split(' '), dict);
    if (whole) return whole;
    const words = norm.split(' ');
    let anyMatched = false;
    const translatedWords = words.map((w) => {
      const cleaned = w.replace(/[(),.]/g, '');
      let t = dict[cleaned];
      if (!t && cleaned.endsWith('s') && dict[cleaned.slice(0, -1)]) t = dict[cleaned.slice(0, -1)];
      if (t) { anyMatched = true; return t; }
      return w;
    });
    return anyMatched ? translatedWords.join(' ') : null;
  }

  // Translate a free-text measure ("2 tbsp", "1/2 tsp", "a pinch") word by word,
  // keeping numbers/fractions/unknown words untouched.
  function translateMeasureToSpanish(measure) {
    const trimmed = (measure || '').trim();
    if (!trimmed) return trimmed;
    const norm = trimmed.toLowerCase().replace(/\s+/g, ' ');
    // Only accept a whole-phrase dictionary hit when the phrase has no leading
    // quantity (e.g. "to taste", "a pinch") - otherwise word-by-word below keeps numbers intact.
    if (EN_ES_UNITS[norm] && !/\d/.test(norm)) return EN_ES_UNITS[norm];
    const tokens = trimmed.split(/(\s+)/);
    return tokens.map((tok) => {
      if (!tok || /^\s+$/.test(tok)) return tok;
      const cleaned = tok.replace(/[(),.]/g, '').toLowerCase();
      if (!cleaned) return tok;
      let translated = EN_ES_UNITS[cleaned];
      if (!translated && cleaned.endsWith('s') && EN_ES_UNITS[cleaned.slice(0, -1)]) translated = EN_ES_UNITS[cleaned.slice(0, -1)];
      return translated || tok;
    }).join('');
  }

  async function translateToEnglish(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return trimmed;
    const dictHit = lookupIngredientTranslation(trimmed);
    if (dictHit) return dictHit;
    try {
      return await translateText(trimmed, 'es|en');
    } catch (err) {
      return trimmed;
    }
  }

  function extractCookTimeMinutes(text) {
    if (!text) return null;
    const matches = text.matchAll(/(\d+)\s*(?:hours?|hrs?|hr)\b|(\d+)\s*(?:minutes?|mins?|min)\b/gi);
    let total = 0;
    let found = false;
    for (const m of matches) {
      if (m[1]) { total += parseInt(m[1], 10) * 60; found = true; }
      else if (m[2]) { total += parseInt(m[2], 10); found = true; }
    }
    if (!found || total <= 0 || total > 480) return null;
    return total;
  }

  function buildIngredientPairs(meal) {
    const pairs = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) pairs.push({ ing: ing.trim(), measure: (measure || '').trim() });
    }
    return pairs;
  }

  async function translateMealToSpanish(meal) {
    const pairs = buildIngredientPairs(meal);
    const cookTimeMin = extractCookTimeMinutes(meal.strInstructions);

    // Category and area come from a small, fixed TheMealDB vocabulary, so they're
    // always resolved statically - no network call, no chance of failure.
    const categoryEs = translateWithDictionary(meal.strCategory, EN_ES_CATEGORIES) || meal.strCategory || '';
    const areaEs = translateWithDictionary(meal.strArea, EN_ES_AREAS) || meal.strArea || '';

    // Ingredient names + measures: try the static dictionary first (instant, reliable).
    // Only ingredients the dictionary doesn't recognize fall back to the live API,
    // and only for that one ingredient - not the whole recipe.
    const ingredientStatic = pairs.map((p) => translateWithDictionary(p.ing, EN_ES_INGREDIENTS));
    const measuresEs = pairs.map((p) => translateMeasureToSpanish(p.measure));
    const pendingIngredientIndexes = pairs.reduce((acc, p, i) => {
      if (!ingredientStatic[i]) acc.push(i);
      return acc;
    }, []);

    const settled = await Promise.allSettled([
      translateToSpanish(meal.strMeal || ''),
      translateToSpanish(meal.strInstructions || ''),
      ...pendingIngredientIndexes.map((i) => translateToSpanish(pairs[i].ing))
    ]);
    const [nameSettled, instructionsSettled, ...ingredientApiSettled] = settled;

    const nameEs = nameSettled.status === 'fulfilled' ? nameSettled.value : '';
    const instructionsEs = instructionsSettled.status === 'fulfilled' ? instructionsSettled.value : '';

    const ingredientNamesEs = ingredientStatic.slice();
    pendingIngredientIndexes.forEach((idx, j) => {
      const r = ingredientApiSettled[j];
      ingredientNamesEs[idx] = (r && r.status === 'fulfilled' && r.value) ? r.value : null;
    });

    const allIngredientsTranslated = ingredientNamesEs.every(Boolean);
    const fullyTranslated = Boolean(nameEs) && Boolean(instructionsEs) && allIngredientsTranslated;

    return {
      meal,
      name: nameEs || meal.strMeal || 'Receta',
      instructions: instructionsEs || meal.strInstructions || '',
      category: categoryEs,
      area: areaEs,
      cookTimeMin,
      ingredientsList: pairs.map((p, i) => `${measuresEs[i]} ${ingredientNamesEs[i] || p.ing}`.trim()),
      translated: fullyTranslated
    };
  }

  const ingredientChipList = document.getElementById('ingredientChipList');
  const newIngredientInput = document.getElementById('newIngredientInput');
  const addIngredientBtn = document.getElementById('addIngredientBtn');
  const searchRecipesBtn = document.getElementById('searchRecipesBtn');
  const recipeResults = document.getElementById('recipeResults');
  let searchIngredients = [];

  function renderIngredientChips() {
    ingredientChipList.innerHTML = searchIngredients.length ? searchIngredients.map((ing, i) => `
      <li class="task-manage-item" data-ingredient-index="${i}">
        <span class="task-manage-label">${escapeHtml(ing)}</span>
        <button type="button" class="task-remove-btn" data-remove-ingredient="${i}" aria-label="Eliminar ${escapeHtml(ing)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">Añade al menos un ingrediente.</li>';
    searchRecipesBtn.disabled = searchIngredients.length === 0;
  }

  function addIngredient() {
    const val = newIngredientInput.value.trim();
    if (!val) return;
    searchIngredients.push(val);
    newIngredientInput.value = '';
    renderIngredientChips();
  }

  addIngredientBtn.addEventListener('click', addIngredient);
  newIngredientInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addIngredient(); });

  ingredientChipList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-ingredient]');
    if (!btn) return;
    searchIngredients.splice(parseInt(btn.dataset.removeIngredient, 10), 1);
    renderIngredientChips();
  });

  let lastDisplayMeals = [];

  function renderRecipeResults(displayMeals) {
    lastDisplayMeals = displayMeals;
    if (displayMeals.length === 0) {
      recipeResults.innerHTML = '<p class="hint-text">No se encontraron recetas con esos ingredientes. Prueba con menos ingredientes o escritos en inglés.</p>';
      return;
    }
    recipeResults.innerHTML = displayMeals.map((d, idx) => {
      const meal = d.meal;
      const sourceUrl = safeUrl(meal.strSource) || safeUrl(meal.strYoutube);
      const sourceLabel = safeUrl(meal.strSource) ? 'Receta original ↗' : 'Ver vídeo ↗';
      const sourceLink = sourceUrl ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="link-btn">${sourceLabel}</a>` : '';
      const thumb = safeUrl(meal.strMealThumb);
      const untranslatedBadge = d.translated ? '' : ' <span class="recipe-untranslated">(sin traducir)</span>';
      const metaBits = [d.category, d.area, d.cookTimeMin ? `~${d.cookTimeMin} min` : ''].filter(Boolean);
      const metaLine = metaBits.length ? `<span class="recipe-meta-inline">${escapeHtml(metaBits.join(' · '))}</span>` : '';
      const badges = [
        d.cookTimeMin ? `<span class="recipe-badge">⏱ ~${d.cookTimeMin} min (estimado)</span>` : '',
        d.category ? `<span class="recipe-badge">🍽 ${escapeHtml(d.category)}</span>` : '',
        d.area ? `<span class="recipe-badge">🌍 ${escapeHtml(d.area)}</span>` : '',
        `<span class="recipe-badge">🧂 ${d.ingredientsList.length} ingredientes</span>`
      ].filter(Boolean).join('');
      const isSaved = (store.settings.savedRecipes || []).some((r) => r.meal && r.meal.idMeal === meal.idMeal);
      return `
      <div class="card recipe-card">
        <button type="button" class="recipe-card-header" data-recipe-toggle aria-expanded="false">
          ${thumb ? `<img class="recipe-thumb" src="${thumb}" alt="" loading="lazy" />` : '<span class="recipe-thumb"></span>'}
          <span class="recipe-header-text">
            <span class="recipe-name">${escapeHtml(d.name)}${untranslatedBadge}</span>
            ${metaLine}
          </span>
          <span class="accordion-chevron">›</span>
        </button>
        <div class="recipe-card-body" hidden>
          <div class="recipe-meta">${badges}</div>
          <button type="button" class="secondary-btn recipe-save-btn" data-save-recipe="${idx}" aria-pressed="${isSaved}">${isSaved ? `<span class="btn-icon">${RIBBON_FILLED_SVG}</span>Guardada` : `<span class="btn-icon">${RIBBON_OUTLINE_SVG}</span>Guardar receta`}</button>
          <h3 class="recipe-section-title">Ingredientes</h3>
          <ul class="recipe-ingredient-list">${d.ingredientsList.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
          <h3 class="recipe-section-title">Instrucciones</h3>
          <p class="recipe-instructions">${escapeHtml(d.instructions)}</p>
          ${sourceLink}
        </div>
      </div>`;
    }).join('');
  }

  recipeResults.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-save-recipe]');
    if (!saveBtn) return;
    const d = lastDisplayMeals[parseInt(saveBtn.dataset.saveRecipe, 10)];
    if (!d) return;
    const idx = store.settings.savedRecipes.findIndex((r) => r.meal && r.meal.idMeal === d.meal.idMeal);
    if (idx === -1) {
      store.settings.savedRecipes.push(d);
    } else {
      store.settings.savedRecipes.splice(idx, 1);
    }
    saveStore();
    renderRecipeResults(lastDisplayMeals);
    renderComidas();
  });

  searchRecipesBtn.addEventListener('click', async () => {
    if (searchIngredients.length === 0) return;
    recipeResults.innerHTML = '<p class="hint-text recipe-loading"><span class="stitch-line" aria-hidden="true"></span>Buscando recetas…</p>';
    searchRecipesBtn.disabled = true;
    try {
      const englishIngredients = await Promise.all(searchIngredients.map((ing) => translateToEnglish(ing)));
      const meals = await searchRecipesByIngredients(englishIngredients);
      if (meals.length === 0) {
        renderRecipeResults([]);
        return;
      }
      recipeResults.innerHTML = '<p class="hint-text recipe-loading"><span class="stitch-line" aria-hidden="true"></span>Traduciendo recetas…</p>';
      const displayMeals = [];
      for (const meal of meals) {
        displayMeals.push(await translateMealToSpanish(meal));
      }
      renderRecipeResults(displayMeals);
    } catch (err) {
      recipeResults.innerHTML = '<p class="hint-text">No se pudo conectar con el buscador de recetas. Comprueba tu conexión a internet.</p>';
    } finally {
      searchRecipesBtn.disabled = searchIngredients.length === 0;
    }
  });

  recipeResults.addEventListener('click', (e) => {
    const header = e.target.closest('[data-recipe-toggle]');
    if (!header) return;
    const body = header.nextElementSibling;
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!isOpen));
    body.hidden = isOpen;
  });

  /* ============ CONSUMO panel ============ */
  const cigarettesValueEl = document.getElementById('cigarettesValue');
  const jointsValueEl = document.getElementById('jointsValue');
  const purchaseRows = document.getElementById('purchaseRows');
  const purchaseEmptyHint = document.getElementById('purchaseEmptyHint');

  document.querySelectorAll('[data-stepper="cigarettes"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.cigarettes = Math.max(0, (entry.cigarettes || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderConsumo();
    });
  });

  document.querySelectorAll('[data-stepper="joints"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.joints = Math.max(0, (entry.joints || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderConsumo();
    });
  });

  purchaseRows.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const itemId = btn.closest('[data-stepper]').dataset.stepper;
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    entry.purchases = entry.purchases || {};
    entry.purchases[itemId] = Math.max(0, (entry.purchases[itemId] || 0) + parseInt(btn.dataset.step, 10));
    saveStore();
    renderConsumo();
  });

  function renderPurchaseRows() {
    const key = dateKey(currentDate);
    const entry = getEntry(key) || emptyEntry();
    const items = store.settings.purchaseItems;
    purchaseEmptyHint.hidden = items.length > 0;
    purchaseRows.innerHTML = items.map((item, i) => {
      const color = purchaseColor(i);
      return `
      <div class="consumo-row consumo-row--item" style="background:color-mix(in srgb, ${color} 13%, var(--surface))">
        <div class="consumo-label">
          <span class="consumo-name"><span class="consumo-swatch" style="background:${color}"></span>${escapeHtml(item.label)}</span>
          <span class="consumo-price">${formatEuro(item.price)}/unidad</span>
        </div>
        <div class="stepper stepper--lg" data-stepper="${item.id}">
          <button class="stepper-btn" data-step="-1" aria-label="Restar ${escapeHtml(item.label)}">–</button>
          <span class="stepper-value">${(entry.purchases && entry.purchases[item.id]) || 0}</span>
          <button class="stepper-btn" data-step="1" aria-label="Sumar ${escapeHtml(item.label)}">+</button>
        </div>
      </div>`;
    }).join('');
  }

  function monthPurchaseSpend(itemId, price, year, monthIndex, lastDay) {
    let sum = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry) continue;
      sum += ((entry.purchases && entry.purchases[itemId]) || 0) * price;
    }
    return sum;
  }

  function yearPurchaseSpend(itemId, price, year) {
    let sum = 0;
    for (let m = 0; m <= 11; m++) {
      sum += monthPurchaseSpend(itemId, price, year, m, monthDayRange(year, m));
    }
    return sum;
  }

  function jointPricePer4() {
    return store.settings.jointPricePer4 || 0;
  }

  function updateJointPriceHints() {
    const priceLabel = formatEuro(jointPricePer4());
    const jointsPriceHint = document.getElementById('jointsPriceHint');
    if (jointsPriceHint) jointsPriceHint.textContent = `${priceLabel}/4 porros`;
    const parts = store.settings.purchaseItems.map((item) => `${item.label} ${formatEuro(item.price)} por unidad`);
    if (jointsEnabled()) parts.push(`Joints ${priceLabel} cada 4 porros`);
    const spendHint = parts.length ? parts.join(' · ') + '.' : 'Añade artículos de compra en Ajustes para ver su gasto aquí.';
    const spendHintConsumo = document.getElementById('spendHintConsumo');
    if (spendHintConsumo) spendHintConsumo.textContent = spendHint;
    const spendHintStats = document.getElementById('spendHintStats');
    if (spendHintStats) spendHintStats.textContent = spendHint;
  }

  function monthJointsSpend(year, monthIndex, lastDay) {
    let joints = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry) continue;
      joints += entry.joints || 0;
    }
    return (joints / 4) * jointPricePer4();
  }

  function yearJointsSpend(year) {
    let sum = 0;
    for (let m = 0; m <= 11; m++) {
      sum += monthJointsSpend(year, m, monthDayRange(year, m));
    }
    return sum;
  }

  function monthConsumoAverage(year, monthIndex, field) {
    const today = startOfDay(new Date());
    const isCurrentMonth = (year === today.getFullYear() && monthIndex === today.getMonth());
    const isFutureMonth = new Date(year, monthIndex, 1) > today;
    if (isFutureMonth) return { avg: 0, count: 0 };
    const lastDay = isCurrentMonth ? today.getDate() : daysInMonth(year, monthIndex);
    let sum = 0, count = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (entry) { sum += entry[field] || 0; count++; }
    }
    return { avg: count > 0 ? sum / count : 0, count };
  }

  function renderConsumo() {
    const key = dateKey(currentDate);
    const entry = getEntry(key) || emptyEntry();
    cigarettesValueEl.textContent = entry.cigarettes || 0;
    jointsValueEl.textContent = entry.joints || 0;
    renderPurchaseRows();

    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const cig = monthConsumoAverage(y, m, 'cigarettes');
    const joint = monthConsumoAverage(y, m, 'joints');
    const prevDate = new Date(y, m - 1, 1);
    const cigPrev = monthConsumoAverage(prevDate.getFullYear(), prevDate.getMonth(), 'cigarettes');
    const jointPrev = monthConsumoAverage(prevDate.getFullYear(), prevDate.getMonth(), 'joints');

    document.getElementById('avgCigarettes').textContent = cig.avg.toFixed(1);
    document.getElementById('avgJoints').textContent = joint.avg.toFixed(1);
    setDelta('deltaCigarettes', cig.avg, cigPrev.avg, cigPrev.count > 0);
    setDelta('deltaJoints', joint.avg, jointPrev.avg, jointPrev.count > 0);

    document.getElementById('consumoTodayCard').hidden = !jointsEnabled();
    document.getElementById('mediaMensualCard').hidden = !jointsEnabled();
    document.getElementById('jointsRow').hidden = !jointsEnabled();
    document.getElementById('jointsAvgTile').hidden = !jointsEnabled();
    document.getElementById('mediaMensualGrid').classList.toggle('single', !jointsEnabled());

    updateJointPriceHints();
    renderSpendGroups(document.getElementById('spendGroups'), y, m, monthDayRange(y, m), 'este mes', 'este año');
  }

  function setDelta(elId, current, previous, hasPrevious) {
    const el = document.getElementById(elId);
    if (!hasPrevious) { el.textContent = 'sin datos del mes anterior'; el.className = 'avg-delta'; return; }
    const diff = current - previous;
    if (Math.abs(diff) < 0.05) { el.textContent = '= igual que el mes anterior'; el.className = 'avg-delta'; return; }
    if (diff < 0) {
      el.textContent = `↓ ${Math.abs(diff).toFixed(1)} menos que el mes anterior`;
      el.className = 'avg-delta down';
    } else {
      el.textContent = `↑ ${diff.toFixed(1)} más que el mes anterior`;
      el.className = 'avg-delta up';
    }
  }

  /* ============ STATS panel ============ */
  const monthLabel = document.getElementById('monthLabel');
  const ringsGrid = document.getElementById('ringsGrid');
  const weeklyBars = document.getElementById('weeklyBars');
  const consumoChart = document.getElementById('consumoChart');
  const compareList = document.getElementById('compareList');

  document.getElementById('prevMonth').addEventListener('click', () => {
    statsMonth = new Date(statsMonth.getFullYear(), statsMonth.getMonth() - 1, 1);
    renderStats();
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    statsMonth = new Date(statsMonth.getFullYear(), statsMonth.getMonth() + 1, 1);
    renderStats();
  });

  const ICONS = {
    exercise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 9v6M2 8v8M20 9v6M22 8v8M6 12h12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    read: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5ZM20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0V5Z" stroke-linejoin="round"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M12 6v4M6.8 15.2 9.6 13M17.2 15.2 14.4 13" stroke-linecap="round"/></svg>',
    teeth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3C9.2 3 7 5 7 7.8C7 9.7 7.8 10.8 8.1 12.8C8.5 15.3 9.3 18.6 10.3 20.2C10.7 20.8 11.3 20.6 11.4 19.8L11.7 17.2C11.8 16.3 12.2 16.3 12.3 17.2L12.6 19.8C12.7 20.6 13.3 20.8 13.7 20.2C14.7 18.6 15.5 15.3 15.9 12.8C16.2 10.8 17 9.7 17 7.8C17 5 14.8 3 12 3Z" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M6.5 6.5l11 11" stroke-linecap="round"/></svg>',
    pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="9" width="18" height="6.5" rx="3.25"/><line x1="12" y1="9" x2="12" y2="15.5"/></svg>',
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.6 2.6L16.2 9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9v6M2 8v8M20 9v6M22 8v8M6 12h12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5ZM20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0V5Z" stroke-linejoin="round"/></svg>',
    water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12,3 C7,8 5,11.5 5,14.5 C5,18.6 8.1,21 12,21 C15.9,21 19,18.6 19,14.5 C19,11.5 17,8 12,3 Z"/></svg>',
    apple: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12,10 C10,7 6,7.5 5,10.5 C4,13.5 6,18 9,19.5 C10.5,20.2 11,19.5 12,19.5 C13,19.5 13.5,20.2 15,19.5 C18,18 20,13.5 19,10.5 C18,7.5 14,7 12,10 Z"/><path d="M12,9.5 C12,7.5 13,6 15,5.5" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20,13.5 A8,8 0 1 1 10.5,4 A6.3,6.3 0 0 0 20,13.5 Z" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12,20 C12,20 4,14.5 4,9 C4,6.2 6.2,4.5 8.5,4.5 C10,4.5 11.3,5.3 12,6.5 C12.7,5.3 14,4.5 15.5,4.5 C17.8,4.5 20,6.2 20,9 C20,14.5 12,20 12,20 Z" stroke-linejoin="round"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12,3.5 L13.6,9 L19,9 L14.7,12.3 L16.3,18 L12,14.5 L7.7,18 L9.3,12.3 L5,9 L10.4,9 Z" stroke-linejoin="round"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9,17 A2.5,2.5 0 1 1 9,12 A2.5,2.5 0 0 1 9,17 Z M19,15 A2.5,2.5 0 1 1 19,10 A2.5,2.5 0 0 1 19,15 Z"/><path d="M11.5,14.5 L11.5,5.5 L21.5,4 L21.5,12.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M8.5,7.5 L8.5,5.5 C8.5,4.7 9.2,4 10,4 L14,4 C14.8,4 15.5,4.7 15.5,5.5 L15.5,7.5" stroke-linecap="round"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5,19 C5,10 10,4 20,4 C20,14 14,19 5,19 Z" stroke-linejoin="round"/><path d="M5,19 L13,11" stroke-linecap="round"/></svg>'
  };

  // Curated subset offered when a user picks an icon for a custom task/hábito.
  const ICON_PICKER_KEYS = ['dumbbell', 'book', 'water', 'apple', 'moon', 'heart', 'star', 'music', 'briefcase', 'leaf', 'pill', 'default'];

  function renderIconPicker(container, selectedKey, onSelect) {
    container.innerHTML = ICON_PICKER_KEYS.map((key) => `
      <button type="button" class="icon-picker-btn${key === selectedKey ? ' is-selected' : ''}" data-icon-key="${key}" aria-pressed="${key === selectedKey}" aria-label="Icono ${key}">${ICONS[key]}</button>
    `).join('');
    container.querySelectorAll('.icon-picker-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.icon-picker-btn').forEach((b) => {
          b.classList.toggle('is-selected', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        onSelect(btn.dataset.iconKey);
      });
    });
  }

  function buildHabitsList() {
    const list = store.settings.dailyTasks.map((t) => ({
      field: t.id, icon: (t.icon && ICONS[t.icon]) || ICONS.default, name: t.label
    }));
    if (teethEnabled()) list.push({ field: 'teeth', icon: ICONS.teeth, name: 'Dientes' });
    store.settings.badHabits.forEach((b) => {
      list.push({ field: b.id, icon: (b.icon && ICONS[b.icon]) || ICONS.ban, name: b.label, invert: true });
    });
    return list;
  }

  function monthDayRange(year, monthIndex) {
    const today = startOfDay(new Date());
    const isCurrentMonth = (year === today.getFullYear() && monthIndex === today.getMonth());
    const isFutureMonth = new Date(year, monthIndex, 1) > today;
    if (isFutureMonth) return 0;
    return isCurrentMonth ? today.getDate() : daysInMonth(year, monthIndex);
  }

  function ringTicks(cx, cy, r, pct, totalTicks, majorEvery, minorLen, majorLen, minorWidth, majorWidth) {
    const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * totalTicks);
    let ticks = '';
    for (let i = 0; i < totalTicks; i++) {
      const angle = (i / totalTicks) * Math.PI * 2 - Math.PI / 2;
      const isMajor = i % majorEvery === 0;
      const len = isMajor ? majorLen : minorLen;
      const width = isMajor ? majorWidth : minorWidth;
      const x1 = cx + (r - len / 2) * Math.cos(angle);
      const y1 = cy + (r - len / 2) * Math.sin(angle);
      const x2 = cx + (r + len / 2) * Math.cos(angle);
      const y2 = cy + (r + len / 2) * Math.sin(angle);
      const color = i < filled ? 'var(--claret)' : 'var(--border)';
      ticks += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
    }
    return ticks;
  }

  function ringSVG(pct) {
    const ticks = ringTicks(32, 32, 26, pct, 36, 9, 5, 8, 1.5, 2.2);
    return `
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" stroke-width="1" opacity="0.4"/>
        ${ticks}
      </svg>`;
  }

  function ringSVGLarge(pct) {
    const ticks = ringTicks(46, 46, 37, pct, 48, 12, 6, 10, 1.7, 2.6);
    return `
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r="37" fill="none" stroke="var(--border)" stroke-width="1" opacity="0.4"/>
        ${ticks}
      </svg>`;
  }

  function miniBarChartSVG(values, labels, color) {
    const w = 260, h = 64, pad = 4;
    const nums = values.filter((v) => v != null);
    const max = Math.max(1, ...nums);
    const barW = (w - pad * 2) / values.length;
    const bars = values.map((v, i) => {
      if (v == null) return '';
      const barH = Math.max(2, (v / max) * (h - pad * 2 - 12));
      const x = pad + i * barW;
      const y = h - pad - barH;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(barW * 0.62).toFixed(1)}" height="${barH.toFixed(1)}" rx="2" fill="${color}"/>
        <text x="${(x + barW * 0.31).toFixed(1)}" y="${(y - 3).toFixed(1)}" text-anchor="middle" font-size="8" fill="var(--text-muted)">${v}</text>`;
    }).join('');
    const labelRow = labels ? `<div class="bar-chart-labels">${labels.map((l) => `<span>${escapeHtml(String(l))}</span>`).join('')}</div>` : '';
    return `<svg viewBox="0 0 ${w} ${h}" class="mini-bar-svg" preserveAspectRatio="none">${bars}</svg>${labelRow}`;
  }

  function renderSupplementRings(year, monthIndex, lastDay) {
    const card = document.getElementById('supplementsStatsCard');
    const grid = document.getElementById('supplementRingsGrid');
    if (!card || !grid) return;
    if (!supplementsEnabled()) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    const supplements = store.settings.supplements;
    if (supplements.length === 0) {
      grid.innerHTML = '<p class="task-empty-hint">No tienes suplementos registrados. Añade uno en Ajustes.</p>';
      return;
    }
    grid.innerHTML = '';
    supplements.forEach((s) => {
      let done = 0;
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        if (!entry) continue;
        if (entry.supplements && entry.supplements[s.id]) done++;
      }
      const pct = lastDay > 0 ? (done / lastDay) * 100 : 0;
      const tile = document.createElement('div');
      tile.className = 'ring-tile ring-tile--lg';
      tile.innerHTML = `${ringSVGLarge(pct)}<span class="ring-pct ring-pct--lg">${Math.round(pct)}%</span><span class="ring-name"><span class="ring-icon">${(s.icon && ICONS[s.icon]) || ICONS.pill}</span>${escapeHtml(s.label)}</span>`;
      grid.appendChild(tile);
    });
  }

  function renderAguaStats(year, monthIndex, lastDay) {
    const card = document.getElementById('aguaStatsCard');
    if (!aguaEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    const grid = document.getElementById('aguaRingGrid');
    const goal = aguaGoal();
    let daysMet = 0, sum = 0, count = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry) continue;
      const v = entry.agua || 0;
      if (v > 0) { sum += v; count++; }
      if (v >= goal) daysMet++;
    }
    const pct = lastDay > 0 ? (daysMet / lastDay) * 100 : 0;
    grid.innerHTML = `<div class="ring-tile ring-tile--lg">${ringSVGLarge(pct)}<span class="ring-pct ring-pct--lg">${Math.round(pct)}%</span><span class="ring-name">días con objetivo cumplido</span></div>`;
    document.getElementById('aguaAvgHint').textContent = count > 0 ? `Media: ${(sum / count).toFixed(1)} vasos/día registrado.` : 'Sin datos todavía este mes.';
  }

  function renderSuenoStats(year, monthIndex, lastDay) {
    const card = document.getElementById('suenoStatsCard');
    if (!suenoEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    let sumHours = 0, countHours = 0, sumQuality = 0, countQuality = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry) continue;
      if (entry.sleepHours) { sumHours += entry.sleepHours; countHours++; }
      if (entry.sleepQuality) { sumQuality += entry.sleepQuality; countQuality++; }
    }
    document.getElementById('avgSleepHours').textContent = countHours > 0 ? (sumHours / countHours).toFixed(1) : '0.0';
    document.getElementById('avgSleepQuality').textContent = countQuality > 0 ? (sumQuality / countQuality).toFixed(1) : '–';

    const goal = store.settings.sleepGoalHours || 8;
    const today = startOfDay(new Date());
    let debt = 0, loggedDays = 0;
    for (let i = 0; i < 14; i++) {
      const d = new Date(today.getTime() - i * DAY_MS);
      const entry = getEntry(dateKey(d));
      if (entry && entry.sleepHours) {
        loggedDays++;
        if (entry.sleepHours < goal) debt += goal - entry.sleepHours;
      }
    }
    const debtHint = document.getElementById('sleepDebtHint');
    debtHint.textContent = loggedDays > 0
      ? `Deuda de sueño (últimos 14 días): ${debt.toFixed(1)} h por debajo de tu objetivo de ${goal} h.`
      : 'Registra tus horas de sueño para ver tu deuda acumulada de los últimos 14 días.';
  }

  function renderPesoStats(year, monthIndex, lastDay) {
    const card = document.getElementById('pesoStatsCard');
    if (!pesoEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    const chart = document.getElementById('weightChart');
    const hint = document.getElementById('weightChangeHint');
    const points = [];
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (entry && entry.weight != null) points.push({ d, w: entry.weight });
    }
    if (points.length === 0) {
      chart.innerHTML = '<p class="hint-text" style="margin-top:0">Sin datos de peso todavía este mes.</p>';
      hint.textContent = '';
      return;
    }
    const totalDays = daysInMonth(year, monthIndex);
    const W = 340, H = 150, padL = 32, padR = 8, padT = 10, padB = 20;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const weights = points.map((p) => p.w);
    const minW = Math.min(...weights), maxW = Math.max(...weights);
    const range = Math.max(0.5, maxW - minW);
    const yFor = (w) => padT + plotH - ((w - minW) / range) * plotH;
    const xFor = (d) => padL + ((d - 0.5) / totalDays) * plotW;

    let yAxis = '';
    [minW, (minW + maxW) / 2, maxW].forEach((val) => {
      const y = yFor(val);
      yAxis += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`;
      yAxis += `<text x="${(padL - 5).toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="8" text-anchor="end" fill="var(--text-muted)">${val.toFixed(1)}</text>`;
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(p.d).toFixed(1)},${yFor(p.w).toFixed(1)}`).join(' ');
    const dots = points.map((p) => `<circle cx="${xFor(p.d).toFixed(1)}" cy="${yFor(p.w).toFixed(1)}" r="2.5" fill="var(--accent)"/>`).join('');

    chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${yAxis}<path d="${linePath}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;

    const first = points[0].w, last = points[points.length - 1].w;
    const diff = last - first;
    if (Math.abs(diff) < 0.05) {
      hint.textContent = `Peso actual: ${last.toFixed(1)} kg. Sin cambios este mes.`;
    } else {
      hint.textContent = `Peso actual: ${last.toFixed(1)} kg (${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg este mes).`;
    }
  }

  function renderAyunoStats(year, monthIndex, lastDay) {
    const card = document.getElementById('ayunoStatsCard');
    if (!ayunoEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    let sum = 0, count = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry) continue;
      const fh = fastingHours(entry);
      if (fh > 0) { sum += fh; count++; }
    }
    document.getElementById('avgFastingHours').textContent = count > 0 ? (sum / count).toFixed(1) : '0.0';
  }

  function renderMenteStats(year, monthIndex, lastDay) {
    const card = document.getElementById('menteStatsCard');
    const showMed = meditacionEnabled(), showRead = lecturaEnabled();
    if (!showMed && !showRead) { card.hidden = true; return; }
    card.hidden = false;
    document.getElementById('meditationAvgTile').hidden = !showMed;
    document.getElementById('lecturaAvgTile').hidden = !showRead;
    let sumMed = 0, countMed = 0, sumRead = 0, countRead = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry) continue;
      if (entry.meditationMin) { sumMed += entry.meditationMin; countMed++; }
      if (entry.readingMin) { sumRead += entry.readingMin; countRead++; }
    }
    document.getElementById('avgMeditationMin').textContent = countMed > 0 ? Math.round(sumMed / countMed) : 0;
    document.getElementById('avgReadingMin').textContent = countRead > 0 ? Math.round(sumRead / countRead) : 0;
  }

  function mondayOf(d) {
    const day = (d.getDay() + 6) % 7;
    const m = new Date(d);
    m.setDate(d.getDate() - day);
    return startOfDay(m);
  }

  function computeWeekStats(mondayDate) {
    const today = startOfDay(new Date());
    const dailyTotal = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    let done = 0, possible = 0, cigarettes = 0, joints = 0, spend = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      if (d > today) continue;
      const entry = getEntry(dateKey(d));
      possible += dailyTotal;
      if (!entry) continue;
      store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) done++; });
      if (teethEnabled() && entry.teeth > 0) done++;
      cigarettes += entry.cigarettes || 0;
      joints += entry.joints || 0;
      store.settings.purchaseItems.forEach((item) => {
        spend += ((entry.purchases && entry.purchases[item.id]) || 0) * item.price;
      });
      if (jointsEnabled()) spend += ((entry.joints || 0) / 4) * jointPricePer4();
    }
    return { habitsPct: possible > 0 ? (done / possible) * 100 : 0, cigarettes, joints, spend };
  }

  function renderWeekCompare() {
    const card = document.getElementById('weekCompareCard');
    const list = document.getElementById('weekCompareList');
    if (store.settings.dailyTasks.length === 0 && !consumoEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    const thisMonday = mondayOf(new Date());
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    const thisWeek = computeWeekStats(thisMonday);
    const lastWeek = computeWeekStats(lastMonday);

    const rows = [];
    if (store.settings.dailyTasks.length > 0) {
      rows.push({ label: 'Hábitos diarios completados', a: thisWeek.habitsPct, b: lastWeek.habitsPct, fmt: (v) => `${Math.round(v)}%`, lowerIsBetter: false });
    }
    if (consumoEnabled()) {
      rows.push({ label: 'Cigarros', a: thisWeek.cigarettes, b: lastWeek.cigarettes, fmt: (v) => `${v}`, lowerIsBetter: true });
      if (jointsEnabled()) rows.push({ label: 'Joints', a: thisWeek.joints, b: lastWeek.joints, fmt: (v) => `${v}`, lowerIsBetter: true });
      rows.push({ label: 'Gasto', a: thisWeek.spend, b: lastWeek.spend, fmt: (v) => formatEuro(v), lowerIsBetter: true });
    }

    list.innerHTML = rows.map((r) => {
      const diff = r.a - r.b;
      const better = r.lowerIsBetter ? diff < 0 : diff > 0;
      const worse = r.lowerIsBetter ? diff > 0 : diff < 0;
      const arrow = diff === 0 ? '·' : (diff > 0 ? '↑' : '↓');
      const cls = diff === 0 ? '' : (better ? 'week-compare-good' : (worse ? 'week-compare-bad' : ''));
      return `
      <div class="week-compare-row">
        <span class="week-compare-label">${r.label}</span>
        <span class="week-compare-values"><strong>${r.fmt(r.a)}</strong> <span class="hint-text" style="display:inline">vs ${r.fmt(r.b)} sem. pasada</span></span>
        <span class="week-compare-arrow ${cls}">${arrow}</span>
      </div>`;
    }).join('');
  }

  function renderCicloStats(year, monthIndex, lastDay) {
    const card = document.getElementById('cicloStatsCard');
    if (!cicloEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    let count = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (entry && entry.periodDay) count++;
    }
    document.getElementById('periodDaysCount').textContent = count;
    document.getElementById('cicloAvgLengthValue').textContent = `${cycleAvgLength()} d`;

    const predictionLine = document.getElementById('cyclePredictionLine');
    const info = cycleInfo(startOfDay(new Date()));
    if (!info) {
      predictionLine.textContent = 'Marca tu primer día de regla para ver una estimación.';
    } else {
      const late = info.daysUntilNext < 0;
      const dueText = late ? `con ${Math.abs(info.daysUntilNext)} días de retraso` : `en ${info.daysUntilNext} días`;
      predictionLine.textContent = `Próxima regla estimada: ${fmtShortDate(info.nextPeriodDate)} (${dueText}). Duración media de la regla: ${cycleAvgPeriodLength()} días.`;
    }

    const chartWrap = document.getElementById('cycleLengthChartWrap');
    const starts = getPeriodStartDates();
    if (starts.length >= 2) {
      const diffs = [];
      for (let i = 1; i < starts.length; i++) diffs.push(Math.round((starts[i] - starts[i - 1]) / DAY_MS));
      const recent = diffs.slice(-8);
      chartWrap.hidden = false;
      document.getElementById('cycleLengthChart').innerHTML = miniBarChartSVG(recent, null, 'var(--h-ciclo)');
    } else {
      chartWrap.hidden = true;
    }
  }

  function renderWorkoutStats(year, monthIndex, lastDay) {
    const card = document.getElementById('workoutStatsCard');
    if (!workoutsEnabled()) { card.hidden = true; return; }
    card.hidden = false;
    const grid = document.getElementById('workoutRingGrid');
    const list = document.getElementById('exerciseStatsList');

    let trainedDays = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry || !entry.workout) continue;
      const w = entry.workout;
      const anyExercise = w.exercises && Object.values(w.exercises).some((log) => log.reps > 0 || (log.weight != null && log.weight > 0));
      if ((w.durationMin > 0) || anyExercise) trainedDays++;
    }
    const pct = lastDay > 0 ? (trainedDays / lastDay) * 100 : 0;
    grid.innerHTML = `<div class="ring-tile ring-tile--lg">${ringSVGLarge(pct)}<span class="ring-pct ring-pct--lg">${Math.round(pct)}%</span><span class="ring-name">días entrenados</span></div>`;

    const exercises = store.settings.exercises;
    if (exercises.length === 0) {
      list.innerHTML = '';
      return;
    }
    list.innerHTML = exercises.map((ex) => {
      let sessions = 0, maxWeight = null, totalReps = 0, failureCount = 0;
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        const log = entry && entry.workout && entry.workout.exercises && entry.workout.exercises[ex.id];
        if (!log) continue;
        const hasData = log.reps > 0 || (log.weight != null && log.weight > 0);
        if (!hasData) continue;
        sessions++;
        if (log.weight != null && (maxWeight === null || log.weight > maxWeight)) maxWeight = log.weight;
        totalReps += log.reps || 0;
        if (log.failure) failureCount++;
      }
      const parts = [`${sessions} ${sessions === 1 ? 'vez' : 'veces'}`];
      if (maxWeight != null) parts.push(`máx ${maxWeight} kg`);
      if (totalReps > 0) parts.push(`${totalReps} reps totales`);
      if (failureCount > 0) parts.push(`${failureCount} al fallo`);
      return `
      <div class="exercise-stat-row">
        <div class="exercise-stat-name">${escapeHtml(ex.label)}</div>
        <div class="exercise-stat-detail">${sessions > 0 ? parts.join(' · ') : 'Sin datos este mes'}</div>
      </div>`;
    }).join('');

    const progressList = document.getElementById('exerciseProgressList');
    progressList.innerHTML = exercises.map((ex, i) => {
      const weights = [];
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        const log = entry && entry.workout && entry.workout.exercises && entry.workout.exercises[ex.id];
        weights.push(log && log.weight != null && log.weight > 0 ? log.weight : null);
      }
      if (weights.every((v) => v == null)) return '';
      return `
      <div class="exercise-progress-row">
        <p class="chart-subtitle">${escapeHtml(ex.label)} — progresión de peso (kg) este mes</p>
        ${miniBarChartSVG(weights, null, exerciseColor(i))}
      </div>`;
    }).join('');
  }

  function renderGoalsStats(year, monthIndex, lastDay) {
    const card = document.getElementById('goalsStatsCard');
    const goals = store.settings.goals;
    if (goals.length === 0) { card.hidden = true; return; }
    card.hidden = false;
    const bars = document.getElementById('goalsBars');
    bars.innerHTML = '';
    goals.forEach((g) => {
      let done = 0;
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        if (entry && entry.goals && entry.goals[g.id]) done++;
      }
      const pct = g.target > 0 ? Math.min(100, (done / g.target) * 100) : 0;
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <div class="bar-row-top">
          <span class="bar-name">${escapeHtml(g.label)}</span>
          <span class="bar-frac">${done}/${g.target}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>`;
      bars.appendChild(row);
    });
  }

  /* ---- Health color gradient (nada saludable -> muy saludable) ---- */
  function currentTheme() {
    const override = document.documentElement.dataset.theme;
    if (override === 'dark' || override === 'black') return 'dark';
    if (override === 'light') return 'light';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function healthColor(value) {
    const clamped = Math.max(1, Math.min(5, value));
    const hue = ((clamped - 1) / 4) * 120; // 0 = red, 60 = amber, 120 = green
    const dark = currentTheme() === 'dark';
    return `hsl(${hue.toFixed(0)}, ${dark ? 68 : 62}%, ${dark ? 58 : 46}%)`;
  }

  /* ---- Monthly heatmap ---- */
  const heatmapLegend = document.getElementById('heatmapLegend');
  const heatmapWrap = document.getElementById('heatmapWrap');
  const heatmapTableWrap = document.getElementById('heatmapTableWrap');
  const toggleHeatmapBtn = document.getElementById('toggleHeatmapView');
  let heatmapView = 'grid';

  function weeklyTaskColor(index) {
    const hue = (index * 47) % 360;
    const dark = currentTheme() === 'dark';
    return `hsl(${hue}, ${dark ? 55 : 50}%, ${dark ? 62 : 45}%)`;
  }

  function dailyTaskColor(index) {
    const hue = (index * 67 + 200) % 360;
    const dark = currentTheme() === 'dark';
    return `hsl(${hue}, ${dark ? 55 : 50}%, ${dark ? 62 : 45}%)`;
  }

  function purchaseColor(index) {
    const hue = (index * 53 + 340) % 360;
    const dark = currentTheme() === 'dark';
    return `hsl(${hue}, ${dark ? 55 : 50}%, ${dark ? 62 : 45}%)`;
  }

  function supplementColor(index) {
    const hue = (index * 41 + 265) % 360;
    const dark = currentTheme() === 'dark';
    return `hsl(${hue}, ${dark ? 55 : 50}%, ${dark ? 62 : 45}%)`;
  }

  function exerciseColor(index) {
    const hue = (index * 61 + 20) % 360;
    const dark = currentTheme() === 'dark';
    return `hsl(${hue}, ${dark ? 55 : 50}%, ${dark ? 62 : 45}%)`;
  }

  function buildHeatmapRows() {
    const dailyRows = store.settings.dailyTasks.map((t, i) => ({
      key: t.id, label: t.label, type: 'daily', color: dailyTaskColor(i), section: 'Hábitos diarios'
    }));
    const weeklyRows = store.settings.weeklyTasks.map((t, i) => ({
      key: t.id, label: t.label, type: 'weekly', color: weeklyTaskColor(i), groupStart: i === 0, section: 'Tareas semanales'
    }));
    const badHabitRows = store.settings.badHabits.map((b, i) => ({
      key: b.id, label: b.label, type: 'badHabit', color: 'var(--danger)', groupStart: i === 0, section: 'Malos hábitos'
    }));
    const supplementRows = supplementsEnabled() ? store.settings.supplements.map((s, i) => ({
      key: s.id, label: s.label, type: 'daily', color: supplementColor(i), groupStart: i === 0, section: 'Suplementos'
    })) : [];
    const exerciseRows = workoutsEnabled() ? store.settings.exercises.map((ex, i) => ({
      key: ex.id, label: ex.label, type: 'daily', color: exerciseColor(i), groupStart: i === 0, section: 'Ejercicio'
    })) : [];
    return [
      ...dailyRows,
      ...(teethEnabled() ? [{ key: 'teeth', label: 'Dientes', type: 'daily', color: 'var(--h-teeth)', section: 'Hábitos diarios' }] : []),
      ...supplementRows,
      ...exerciseRows,
      ...(cicloEnabled() ? [{ key: 'periodDay', label: 'Ciclo', type: 'daily', color: 'var(--h-ciclo)', groupStart: true, section: 'Ciclo' }] : []),
      { key: 'health', label: 'Alimentación', type: 'health', groupStart: true, section: 'Alimentación' },
      ...weeklyRows,
      ...badHabitRows,
      { key: 'total', label: 'Total', type: 'total', color: 'var(--h-total)', groupStart: true, section: 'Total' },
      ...(consumoEnabled() ? [
        ...(jointsEnabled() ? [
          { key: 'cigarettes', label: 'Cigarros', type: 'consumo', color: 'var(--h-cig)', groupStart: true, section: 'Consumo' },
          { key: 'joints', label: 'Joints', type: 'consumo', color: 'var(--h-joint)', section: 'Consumo' }
        ] : []),
        ...store.settings.purchaseItems.map((item, i) => ({
          key: item.id, label: item.label, type: 'consumo', color: purchaseColor(i), groupStart: (!jointsEnabled() && i === 0), section: 'Consumo'
        }))
      ] : [])
    ];
  }

  toggleHeatmapBtn.addEventListener('click', () => {
    heatmapView = heatmapView === 'grid' ? 'table' : 'grid';
    toggleHeatmapBtn.textContent = heatmapView === 'grid' ? 'Ver tabla' : 'Ver mapa';
    heatmapWrap.hidden = heatmapView !== 'grid';
    heatmapTableWrap.hidden = heatmapView !== 'table';
  });

  heatmapWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.heatmap-cell');
    if (!btn || btn.disabled) return;
    const day = parseInt(btn.dataset.day, 10);
    const year = parseInt(btn.dataset.year, 10);
    const monthIndex = parseInt(btn.dataset.month, 10);
    currentDate = new Date(year, monthIndex, day);
    switchTab('hoy');
    renderAll();
  });

  function buildDayData(year, monthIndex, totalDays) {
    const days = [];
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, monthIndex, d);
      const entry = getEntry(dateKey(date));
      const wk = isoWeekKey(date);
      const week = getWeek(wk);
      const teethDone = !!(entry && entry.teeth > 0);
      let total = (teethEnabled() && teethDone) ? 1 : 0;
      const healthVals = [];
      if (entry && entry.meals) {
        ['desayuno', 'comida', 'cena'].forEach((meal) => {
          const h = entry.meals[meal] && entry.meals[meal].health;
          if (h) healthVals.push(h);
        });
      }
      const health = healthVals.length ? healthVals.reduce((a, b) => a + b, 0) / healthVals.length : 0;
      const dayEntry = {
        day: d,
        teeth: teethDone,
        health,
        cigarettes: entry ? (entry.cigarettes || 0) : 0,
        joints: entry ? (entry.joints || 0) : 0
      };
      store.settings.purchaseItems.forEach((item) => {
        dayEntry[item.id] = entry && entry.purchases ? (entry.purchases[item.id] || 0) : 0;
      });
      store.settings.supplements.forEach((s) => {
        dayEntry[s.id] = !!(entry && entry.supplements && entry.supplements[s.id]);
      });
      store.settings.exercises.forEach((ex) => {
        const log = entry && entry.workout && entry.workout.exercises && entry.workout.exercises[ex.id];
        dayEntry[ex.id] = !!(log && (log.reps > 0 || (log.weight != null && log.weight > 0)));
      });
      dayEntry.periodDay = !!(entry && entry.periodDay);
      store.settings.dailyTasks.forEach((t) => {
        const done = !!(entry && entry[t.id]);
        dayEntry[t.id] = done;
        if (done) total++;
      });
      let badCount = 0;
      store.settings.badHabits.forEach((b) => {
        const triggered = !!(entry && entry.badHabits && entry.badHabits[b.id]);
        dayEntry[b.id] = triggered;
        if (triggered) badCount++;
      });
      dayEntry.total = Math.max(0, total - badCount);
      store.settings.weeklyTasks.forEach((t) => { dayEntry[t.id] = !!week[t.id]; });
      days.push(dayEntry);
    }
    return days;
  }

  function heatmapCellStyle(row, dayInfo, maxByKey) {
    if (row.type === 'daily' || row.type === 'weekly' || row.type === 'badHabit') {
      return dayInfo[row.key] ? `background-color:${row.color}` : '';
    }
    if (row.type === 'total') {
      if (dayInfo.total === 0) return '';
      const totalMax = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
      const pct = 25 + (dayInfo.total / totalMax) * 75;
      return `background-color:color-mix(in srgb, ${row.color} ${pct.toFixed(0)}%, var(--surface-alt))`;
    }
    if (row.type === 'health') {
      if (!dayInfo.health) return '';
      return `background-color:${healthColor(dayInfo.health)}`;
    }
    // consumo
    const max = maxByKey[row.key] || 0;
    const val = dayInfo[row.key];
    if (!val || max <= 0) return '';
    const pct = 25 + (val / max) * 75;
    return `background-color:color-mix(in srgb, ${row.color} ${pct.toFixed(0)}%, var(--surface-alt))`;
  }

  function heatmapCellText(row, dayInfo) {
    if (row.type === 'badHabit') return dayInfo[row.key] ? '✗' : '';
    if (row.type === 'daily' || row.type === 'weekly') return dayInfo[row.key] ? '✓' : '';
    if (row.type === 'total') return dayInfo.total > 0 ? String(dayInfo.total) : '';
    if (row.type === 'health') return dayInfo.health > 0 ? dayInfo.health.toFixed(1) : '';
    return dayInfo[row.key] > 0 ? String(dayInfo[row.key]) : '';
  }

  // GitHub-style annual overview: one square per day of the year, colored by the
  // fraction of daily tasks completed that day. Weeks run Monday-Sunday and the grid
  // is padded with invisible filler cells so every week column has exactly 7 rows.
  function renderYearHeatmap(year) {
    const card = document.getElementById('yearHeatmapCard');
    const scroll = document.getElementById('yearHeatmapScroll');
    const dailyTotal = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    const today = startOfDay(new Date());
    const jan1 = new Date(year, 0, 1);
    const dec31 = new Date(year, 11, 31);
    const startDow = (jan1.getDay() + 6) % 7; // Mon=0
    const gridStart = new Date(jan1.getTime() - startDow * DAY_MS);
    const endDow = (dec31.getDay() + 6) % 7;
    const gridEnd = new Date(dec31.getTime() + (6 - endDow) * DAY_MS);

    let anyData = false;
    const weeks = [];
    let cursor = new Date(gridStart);
    while (cursor <= gridEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(cursor);
        const inYear = d.getFullYear() === year;
        const isFuture = d > today;
        let pct = null;
        if (inYear && !isFuture) {
          const entry = getEntryForDay(d.getFullYear(), d.getMonth(), d.getDate());
          if (entry) {
            anyData = true;
            if (dailyTotal > 0) {
              let done = 0;
              store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) done++; });
              if (teethEnabled() && entry.teeth > 0) done++;
              pct = (done / dailyTotal) * 100;
            } else {
              pct = 100;
            }
          } else {
            pct = 0;
          }
        }
        week.push({ date: d, inYear, isFuture, pct, isMonthStart: inYear && d.getDate() === 1 });
        cursor = new Date(cursor.getTime() + DAY_MS);
      }
      weeks.push(week);
    }

    if (!anyData) { card.hidden = true; return; }
    card.hidden = false;
    document.getElementById('yearHeatmapYear').textContent = String(year);

    scroll.innerHTML = weeks.map((week) => {
      const monthStart = week.find((d) => d.isMonthStart);
      const label = monthStart ? MONTHS_SHORT[monthStart.date.getMonth()] : '';
      const cells = week.map((d) => {
        if (!d.inYear) return '<span class="year-heatmap-cell is-filler"></span>';
        if (d.isFuture || d.pct === null) return '<span class="year-heatmap-cell"></span>';
        const style = d.pct > 0 ? ` style="background-color:color-mix(in srgb, var(--h-total) ${Math.max(20, d.pct).toFixed(0)}%, var(--surface-alt))"` : '';
        return `<span class="year-heatmap-cell" title="${fmtKeyDate(dateKey(d.date))}"${style}></span>`;
      }).join('');
      return `<div class="year-heatmap-week"><div class="year-heatmap-month-label">${label}</div>${cells}</div>`;
    }).join('');
  }

  // Simple two-bucket averages over this month's data (e.g. "days you slept enough"
  // vs "days you didn't") — intentionally basic (no real statistical significance
  // testing), gated behind a minimum sample size per bucket so a single lucky day
  // can't produce a misleading claim.
  function avgOf(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

  function renderInsights(year, monthIndex, lastDay) {
    const card = document.getElementById('insightsCard');
    const list = document.getElementById('insightsList');
    const MIN_SAMPLE = 4;
    const insights = [];

    if (suenoEnabled() && store.settings.dailyTasks.length > 0) {
      const goal = store.settings.sleepGoalHours || 8;
      const met = [], notMet = [];
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        if (!entry || !entry.sleepHours) continue;
        let done = 0;
        store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) done++; });
        const pct = (done / store.settings.dailyTasks.length) * 100;
        (entry.sleepHours >= goal ? met : notMet).push(pct);
      }
      if (met.length >= MIN_SAMPLE && notMet.length >= MIN_SAMPLE) {
        const diff = avgOf(met) - avgOf(notMet);
        if (Math.abs(diff) >= 5) {
          insights.push(diff > 0
            ? `Los días que duermes ${goal}h o más completas de media un ${Math.round(diff)}% más de tus hábitos diarios.`
            : `Los días que duermes menos de ${goal}h completas de media un ${Math.round(-diff)}% más de tus hábitos diarios — puede que estés compensando con más energía, o valga la pena vigilarlo.`);
        }
      }
    }

    if (workoutsEnabled()) {
      const trained = [], rest = [];
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        if (!entry || !entry.meals) continue;
        const healths = ['desayuno', 'comida', 'cena'].map((m) => entry.meals[m] && entry.meals[m].health).filter(Boolean);
        if (healths.length === 0) continue;
        const avgHealth = avgOf(healths);
        const didWorkout = entry.workout && ((entry.workout.durationMin > 0) || (entry.workout.exercises && Object.values(entry.workout.exercises).some((l) => l.reps > 0 || (l.weight != null && l.weight > 0))));
        (didWorkout ? trained : rest).push(avgHealth);
      }
      if (trained.length >= MIN_SAMPLE && rest.length >= MIN_SAMPLE) {
        const diff = avgOf(trained) - avgOf(rest);
        if (Math.abs(diff) >= 0.3) {
          insights.push(diff > 0
            ? `Los días que entrenas, tu alimentación es de media ${diff.toFixed(1)} puntos más saludable (sobre 5).`
            : `Los días que no entrenas, tu alimentación es de media ${(-diff).toFixed(1)} puntos más saludable (sobre 5).`);
        }
      }
    }

    if (aguaEnabled() && energiaEnabled()) {
      const goal = aguaGoal();
      const met = [], notMet = [];
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        if (!entry || !entry.energyLevel) continue;
        (entry.agua >= goal ? met : notMet).push(entry.energyLevel);
      }
      if (met.length >= MIN_SAMPLE && notMet.length >= MIN_SAMPLE) {
        const diff = avgOf(met) - avgOf(notMet);
        if (Math.abs(diff) >= 0.4) {
          insights.push(diff > 0
            ? `Los días que llegas a tu objetivo de agua, tu energía media es ${diff.toFixed(1)} puntos más alta (sobre 5).`
            : `Los días que no llegas a tu objetivo de agua, tu energía media es ${(-diff).toFixed(1)} puntos más alta (sobre 5) — la relación no es la esperada, puede haber otros factores.`);
        }
      }
    }

    if (insights.length === 0) { card.hidden = true; return; }
    card.hidden = false;
    list.innerHTML = insights.map((i) => `<li>${escapeHtml(i)}</li>`).join('');
  }

  function renderHeatmap(year, monthIndex, lastDay) {
    const totalDays = daysInMonth(year, monthIndex);
    const days = buildDayData(year, monthIndex, totalDays);
    const HEATMAP_ROWS = buildHeatmapRows();

    const heatmapHint = document.getElementById('heatmapHint');
    heatmapHint.textContent = consumoEnabled()
      ? 'Toca un día para abrirlo. Las tareas semanales se marcan en toda la semana al cumplirse. Alimentación es la media de salud (1-5) de las comidas registradas ese día. En Cigarros, Joints y paquetes, cuanto más intenso el color, mayor fue el consumo ese día.'
      : 'Toca un día para abrirlo. Las tareas semanales se marcan en toda la semana al cumplirse. Alimentación es la media de salud (1-5) de las comidas registradas ese día.';
    const maxByKey = {};
    HEATMAP_ROWS.filter((r) => r.type === 'consumo').forEach((r) => {
      maxByKey[r.key] = Math.max(0, ...days.slice(0, lastDay).map((d) => d[r.key]));
    });

    // Legend
    const legendRows = HEATMAP_ROWS.filter((r) => r.type !== 'total');
    let legendHtml = '';
    legendRows.forEach((r, i) => {
      let itemHtml;
      if (r.type === 'health') {
        const gradient = `linear-gradient(to right, ${healthColor(1)}, ${healthColor(3)}, ${healthColor(5)})`;
        itemHtml = `<span class="legend-item"><span class="legend-gradient" style="background:${gradient}"></span>${escapeHtml(r.label)} (nada → muy saludable)</span>`;
      } else {
        const suffix = r.type === 'weekly' ? ' (semanal)' : '';
        itemHtml = `<span class="legend-item"><span class="dot" style="background-color:${r.color}"></span>${escapeHtml(r.label)}${suffix}</span>`;
      }
      if (i === 0) legendHtml += '<div class="legend-group">';
      else if (r.groupStart) legendHtml += '</div><div class="legend-group legend-group--gap">';
      legendHtml += itemHtml;
    });
    legendHtml += '</div>';
    heatmapLegend.innerHTML = legendHtml;

    // Grid
    let lastGridSection = null;
    let labelsHtml = '';
    let rowsHtml = '';
    HEATMAP_ROWS.forEach((r) => {
      if (r.section && r.section !== lastGridSection) {
        labelsHtml += `<div class="heatmap-section-label">${escapeHtml(r.section)}</div>`;
        rowsHtml += `<div class="heatmap-section-spacer"></div>`;
        lastGridSection = r.section;
      }
      labelsHtml += `<div class="heatmap-label" title="${escapeHtml(r.label)}">${escapeHtml(r.label)}</div>`;
      rowsHtml += `
        <div class="heatmap-row">
          ${days.map((d) => {
            const isFuture = d.day > lastDay;
            const style = isFuture ? '' : heatmapCellStyle(r, d, maxByKey);
            return `<button type="button" class="heatmap-cell${isFuture ? ' is-future' : ''}" style="${style}" data-type="${r.type}" data-day="${d.day}" data-year="${year}" data-month="${monthIndex}" ${isFuture ? 'disabled' : ''} aria-label="${escapeHtml(r.label)} día ${d.day}"></button>`;
          }).join('')}
        </div>`;
    });
    heatmapWrap.innerHTML = `
      <div class="heatmap-labels">${labelsHtml}</div>
      <div class="heatmap-scroll">
        ${rowsHtml}
        <div class="heatmap-daynums">
          ${days.map((d) => `<span class="heatmap-daynum">${d.day % 5 === 0 || d.day === 1 ? d.day : ''}</span>`).join('')}
        </div>
      </div>`;

    // Table
    const theadDays = days.map((d) => `<th>${d.day}</th>`).join('');
    let lastSection = null;
    let tableSectionIndex = 0;
    const tbodyRows = HEATMAP_ROWS.map((r) => {
      let sectionHtml = '';
      if (r.section && r.section !== lastSection) {
        tableSectionIndex++;
        sectionHtml = `<tr class="heatmap-table-section"><th colspan="${days.length + 1}">Pieza ${pad2(tableSectionIndex)} — ${escapeHtml(r.section)}</th></tr>`;
        lastSection = r.section;
      }
      const cellsHtml = days.map((d) => {
        const isFuture = d.day > lastDay;
        const style = isFuture ? '' : heatmapCellStyle(r, d, maxByKey);
        return `<td class="heatmap-table-cell${isFuture ? ' is-future' : ''}" style="${style}" data-type="${r.type}">${isFuture ? '' : heatmapCellText(r, d)}</td>`;
      }).join('');
      return `${sectionHtml}<tr><th>${escapeHtml(r.label)}</th>${cellsHtml}</tr>`;
    }).join('');
    heatmapTableWrap.innerHTML = `
      <table class="heatmap-table">
        <thead><tr><th></th>${theadDays}</tr></thead>
        <tbody>${tbodyRows}</tbody>
      </table>`;
  }

  const foodAvgTile = document.getElementById('foodAvgTile');
  const foodAvgValue = document.getElementById('foodAvgValue');
  const foodScaleGradient = document.getElementById('foodScaleGradient');
  const foodScaleMarker = document.getElementById('foodScaleMarker');

  function monthFoodHealthAverage(year, monthIndex, lastDay) {
    let sum = 0, count = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntryForDay(year, monthIndex, d);
      if (!entry || !entry.meals) continue;
      ['desayuno', 'comida', 'cena'].forEach((meal) => {
        const h = entry.meals[meal] && entry.meals[meal].health;
        if (h) { sum += h; count++; }
      });
    }
    return count > 0 ? sum / count : 0;
  }

  function renderFoodAvg(year, monthIndex, lastDay) {
    foodScaleGradient.style.background = `linear-gradient(to right, ${healthColor(1)}, ${healthColor(3)}, ${healthColor(5)})`;
    const avg = monthFoodHealthAverage(year, monthIndex, lastDay);
    if (avg === 0) {
      foodAvgValue.textContent = '–';
      foodAvgTile.style.background = 'var(--surface-alt)';
      foodAvgTile.style.color = 'var(--text-muted)';
      foodAvgTile.style.textShadow = 'none';
      foodScaleMarker.style.display = 'none';
      return;
    }
    foodAvgValue.textContent = `${avg.toFixed(1)} / 5`;
    foodAvgTile.style.background = healthColor(avg);
    foodAvgTile.style.color = '#fff';
    foodAvgTile.style.textShadow = '';
    foodScaleMarker.style.display = '';
    foodScaleMarker.style.left = `${((avg - 1) / 4) * 100}%`;
  }

  function renderStats() {
    statsEntryCache = new Map();
    const year = statsMonth.getFullYear(), monthIndex = statsMonth.getMonth();
    monthLabel.textContent = `${MONTHS_LONG[monthIndex]} ${year}`;

    const lastDay = monthDayRange(year, monthIndex);

    renderHeatmap(year, monthIndex, lastDay);
    renderYearHeatmap(year);
    renderFoodAvg(year, monthIndex, lastDay);

    // Habit rings
    ringsGrid.innerHTML = '';
    const habitsList = buildHabitsList();
    if (habitsList.length === 0) {
      ringsGrid.innerHTML = '<p class="task-empty-hint">No tienes tareas diarias. Añade una en Ajustes.</p>';
    }
    habitsList.forEach((h) => {
      let done = 0;
      for (let d = 1; d <= lastDay; d++) {
        const entry = getEntryForDay(year, monthIndex, d);
        if (!entry) continue;
        let ok;
        if (h.field === 'teeth') ok = entry.teeth > 0;
        else if (h.invert) ok = !(entry.badHabits && entry.badHabits[h.field]);
        else if (h.nested) ok = !!(entry[h.nested] && entry[h.nested][h.field]);
        else ok = !!entry[h.field];
        if (ok) done++;
      }
      const pct = lastDay > 0 ? (done / lastDay) * 100 : 0;
      const tile = document.createElement('div');
      tile.className = 'ring-tile';
      tile.innerHTML = `${ringSVG(pct)}<span class="ring-pct">${Math.round(pct)}%</span><span class="ring-name"><span class="ring-icon">${h.icon}</span>${escapeHtml(h.name)}</span>`;
      ringsGrid.appendChild(tile);
    });

    renderSupplementRings(year, monthIndex, lastDay);
    renderAguaStats(year, monthIndex, lastDay);
    renderSuenoStats(year, monthIndex, lastDay);
    renderPesoStats(year, monthIndex, lastDay);
    renderAyunoStats(year, monthIndex, lastDay);
    renderMenteStats(year, monthIndex, lastDay);
    renderCicloStats(year, monthIndex, lastDay);
    renderWorkoutStats(year, monthIndex, lastDay);
    renderGoalsStats(year, monthIndex, lastDay);
    renderWeekCompare();
    renderInsights(year, monthIndex, lastDay);
    renderMonthWrapped(year, monthIndex, lastDay);
    renderYearWrapped(year);
    reflectionSearchCard.hidden = !Object.keys(store.entries).some((key) => (store.entries[key].reflection || '').trim());

    // Weekly tasks bars
    const weekKeys = new Set();
    for (let d = 1; d <= daysInMonth(year, monthIndex); d++) {
      const day = new Date(year, monthIndex, d);
      if (day > startOfDay(new Date())) continue;
      weekKeys.add(isoWeekKey(day));
    }
    weeklyBars.innerHTML = store.settings.weeklyTasks.length ? '' : '<p class="task-empty-hint">No tienes tareas semanales. Añade una en Ajustes.</p>';
    store.settings.weeklyTasks.forEach((w) => {
      let done = 0;
      weekKeys.forEach((wk) => { if (getWeek(wk)[w.id]) done++; });
      const total = weekKeys.size;
      const pct = total > 0 ? (done / total) * 100 : 0;
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <div class="bar-row-top">
          <span class="bar-name">${escapeHtml(w.label)}</span>
          <span class="bar-frac">${done}/${total}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>`;
      weeklyBars.appendChild(row);
    });

    const showConsumo = consumoEnabled();
    const showSmoking = showConsumo && jointsEnabled();
    document.getElementById('consumoChartCard').hidden = !showSmoking;
    document.getElementById('compareCard').hidden = !showSmoking;
    document.getElementById('statsSpendCard').hidden = !showConsumo;
    if (showSmoking) {
      renderConsumoChart(year, monthIndex, lastDay);
      renderCompare(year, monthIndex);
    } else {
      document.getElementById('consumoChartTitle').textContent = '';
      consumoChart.innerHTML = '';
      compareList.innerHTML = '';
    }
    if (showConsumo) {
      renderTobaccoSpendStats(year, monthIndex, lastDay);
    } else {
      document.getElementById('statsSpendGroups').innerHTML = '';
      document.getElementById('spendHintStats').textContent = '';
      document.getElementById('budgetGroup').hidden = true;
    }
  }

  function renderTobaccoSpendStats(year, monthIndex, lastDay) {
    updateJointPriceHints();
    renderSpendGroups(
      document.getElementById('statsSpendGroups'),
      year, monthIndex, lastDay,
      `en ${MONTHS_LONG[monthIndex]}`, `en ${year}`
    );

    const budgetGroup = document.getElementById('budgetGroup');
    const budget = store.settings.monthlyBudget;
    if (budget == null || budget <= 0) {
      budgetGroup.hidden = true;
      return;
    }
    let totalMonth = store.settings.purchaseItems.reduce((s, item) => s + monthPurchaseSpend(item.id, item.price, year, monthIndex, lastDay), 0);
    if (jointsEnabled()) totalMonth += monthJointsSpend(year, monthIndex, lastDay);
    budgetGroup.hidden = false;
    const pct = Math.min(100, (totalMonth / budget) * 100);
    const over = totalMonth > budget;
    const fill = document.getElementById('budgetBarFill');
    fill.style.width = `${pct}%`;
    fill.classList.toggle('budget-bar-fill--over', over);
    const hint = document.getElementById('budgetHint');
    hint.textContent = over
      ? `Has superado tu presupuesto de ${formatEuro(budget)}: llevas ${formatEuro(totalMonth)} este mes.`
      : `Llevas ${formatEuro(totalMonth)} de tu presupuesto de ${formatEuro(budget)} este mes.`;
  }

  function computeWrappedStats(rangeStart, rangeEnd) {
    const today = startOfDay(new Date());
    const end = rangeEnd > today ? today : rangeEnd;
    const habitCounts = {};
    store.settings.dailyTasks.forEach((t) => { habitCounts[t.id] = 0; });
    let daysCount = 0, loggedDays = 0, completeDays = 0, longestStreak = 0, curStreak = 0;
    let foodSum = 0, foodCount = 0;
    let cig = 0, joints = 0, spend = 0;
    let workoutDays = 0;
    let sleepSum = 0, sleepCount = 0;
    let weightFirst = null, weightLast = null;
    let periodDays = 0;

    for (let d = new Date(rangeStart); d <= end; d = new Date(d.getTime() + DAY_MS)) {
      daysCount++;
      const entry = getEntry(dateKey(d));
      if (!entry) { curStreak = 0; continue; }
      if (entry.paused) continue;
      loggedDays++;
      if (isDayComplete(entry)) {
        completeDays++;
        curStreak++;
        if (curStreak > longestStreak) longestStreak = curStreak;
      } else {
        curStreak = 0;
      }
      store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) habitCounts[t.id]++; });
      if (entry.meals) {
        ['desayuno', 'comida', 'cena'].forEach((meal) => {
          const h = entry.meals[meal] && entry.meals[meal].health;
          if (h) { foodSum += h; foodCount++; }
        });
      }
      if (consumoEnabled()) {
        cig += entry.cigarettes || 0;
        if (jointsEnabled()) joints += entry.joints || 0;
        store.settings.purchaseItems.forEach((item) => {
          spend += ((entry.purchases && entry.purchases[item.id]) || 0) * item.price;
        });
        if (jointsEnabled()) spend += ((entry.joints || 0) / 4) * jointPricePer4();
      }
      if (workoutsEnabled() && entry.workout) {
        const w = entry.workout;
        const anyExercise = w.exercises && Object.values(w.exercises).some((log) => log.reps > 0 || (log.weight != null && log.weight > 0));
        if ((w.durationMin > 0) || anyExercise) workoutDays++;
      }
      if (suenoEnabled() && entry.sleepHours) { sleepSum += entry.sleepHours; sleepCount++; }
      if (pesoEnabled() && entry.weight != null) {
        if (weightFirst == null) weightFirst = entry.weight;
        weightLast = entry.weight;
      }
      if (cicloEnabled() && entry.periodDay) periodDays++;
    }

    let bestHabit = null;
    store.settings.dailyTasks.forEach((t) => {
      if (habitCounts[t.id] > 0 && (!bestHabit || habitCounts[t.id] > bestHabit.count)) {
        bestHabit = { label: t.label, count: habitCounts[t.id] };
      }
    });

    return {
      daysCount, loggedDays, completeDays, longestStreak,
      completePct: daysCount > 0 ? (completeDays / daysCount) * 100 : 0,
      bestHabit,
      foodAvg: foodCount > 0 ? foodSum / foodCount : 0,
      cig, joints, spend,
      workoutDays,
      sleepAvg: sleepCount > 0 ? sleepSum / sleepCount : 0,
      weightDiff: (weightFirst != null && weightLast != null) ? weightLast - weightFirst : null,
      periodDays
    };
  }

  function wrappedTileData(color, value, label, kind, raw) {
    return { color, value, label, kind: kind || null, raw: raw != null ? raw : null };
  }

  function buildWrappedTileList(stats) {
    const tiles = [];
    if (store.settings.dailyTasks.length > 0) {
      tiles.push(wrappedTileData('var(--accent)', `${Math.round(stats.completePct)}%`, 'días completos', 'completePct', stats.completePct));
      if (stats.longestStreak > 0) {
        tiles.push(wrappedTileData('var(--claret)', `${stats.longestStreak}`, stats.longestStreak === 1 ? 'día de racha máxima' : 'días de racha máxima', 'streak', stats.longestStreak));
      }
      if (stats.bestHabit) {
        tiles.push(wrappedTileData('var(--accent-2)', escapeHtml(stats.bestHabit.label), 'tu hábito más constante', 'bestHabit', stats.bestHabit.count));
      }
    }
    if (stats.foodAvg > 0) {
      tiles.push(wrappedTileData(healthColor(stats.foodAvg), `${stats.foodAvg.toFixed(1)} / 5`, 'alimentación media', 'foodAvg', stats.foodAvg));
    }
    if (suenoEnabled() && stats.sleepAvg > 0) {
      tiles.push(wrappedTileData('var(--h-total)', `${stats.sleepAvg.toFixed(1)} h`, 'sueño medio', 'sleepAvg', stats.sleepAvg));
    }
    if (workoutsEnabled() && stats.workoutDays > 0) {
      tiles.push(wrappedTileData('var(--h-teeth)', `${stats.workoutDays}`, stats.workoutDays === 1 ? 'día entrenado' : 'días entrenados', 'workoutDays', stats.workoutDays));
    }
    if (pesoEnabled() && stats.weightDiff != null && Math.abs(stats.weightDiff) >= 0.1) {
      tiles.push(wrappedTileData('var(--accent)', `${stats.weightDiff > 0 ? '+' : ''}${stats.weightDiff.toFixed(1)} kg`, 'cambio de peso', 'weightDiff', stats.weightDiff));
    }
    if (consumoEnabled() && (stats.cig > 0 || stats.joints > 0)) {
      tiles.push(wrappedTileData('var(--h-cig)', formatEuro(stats.spend), 'gasto en consumo', 'spend', stats.spend));
    }
    if (cicloEnabled() && stats.periodDays > 0) {
      tiles.push(wrappedTileData('var(--h-ciclo)', `${stats.periodDays}`, stats.periodDays === 1 ? 'día de regla' : 'días de regla', 'periodDays', stats.periodDays));
    }
    if (tiles.length === 0) {
      tiles.push(wrappedTileData('var(--surface-alt)', '–', 'Todavía sin datos suficientes'));
    }
    return tiles;
  }

  // A short, encouraging line per stat tile, tiered by how good the number actually
  // is — this is what turns "48%" into something that explains why it matters.
  function wrappedInsightMessage(t) {
    switch (t.kind) {
      case 'completePct':
        if (t.raw >= 90) return 'Casi perfecto. Muy pocas personas mantienen este nivel de constancia — enhorabuena.';
        if (t.raw >= 70) return 'Un ritmo sólido: la mayoría de los días le ganaste a la pereza.';
        if (t.raw >= 40) return 'Vas a mitad de camino — cada día que sumas cuenta más de lo que parece.';
        return 'Un periodo difícil, pero está registrado — y eso ya es el primer paso para el que viene.';
      case 'streak':
        if (t.raw >= 14) return 'Dos semanas seguidas sin fallar. Así es como un hábito se vuelve automático.';
        if (t.raw >= 7) return 'Una semana entera de racha — la constancia empieza a notarse.';
        return 'El primer tramo de una racha siempre es el más difícil de sostener. Ya lo tienes.';
      case 'bestHabit':
        return `Fue el hábito que menos te costó mantener — ${t.raw} ${t.raw === 1 ? 'día marcado' : 'días marcados'} en total.`;
      case 'foodAvg':
        if (t.raw >= 4) return 'Alimentación muy saludable de media. Se nota en el resto de tus datos.';
        if (t.raw >= 3) return 'Un equilibrio razonable, con margen para subir un punto más.';
        return 'Un periodo flojo en alimentación — los datos ya te lo están diciendo.';
      case 'sleepAvg':
        if (t.raw >= 7.5) return 'Duermes lo que tu cuerpo necesita. La base de todo lo demás.';
        if (t.raw >= 6) return 'Cerca del objetivo — un poco más de sueño y notarás la diferencia.';
        return 'Menos horas de las recomendadas. El sueño es la palanca más infravalorada.';
      case 'workoutDays':
        if (t.raw >= 20) return 'Entrenaste la mayoría de los días. Un nivel de compromiso poco común.';
        if (t.raw >= 8) return 'Más de un entreno cada tres días — un ritmo que se puede mantener en el tiempo.';
        return 'Empezaste a moverte. Lo difícil ya está hecho, ahora toca sumar constancia.';
      case 'weightDiff':
        return t.raw < 0
          ? `Bajaste ${Math.abs(t.raw).toFixed(1)} kg en este periodo, siguiendo tu tendencia.`
          : `Subiste ${t.raw.toFixed(1)} kg — dato a tener en cuenta según tu objetivo.`;
      case 'spend':
        return 'Esto es lo que costó tu consumo este periodo. Mirarlo de frente ya es el primer cambio.';
      case 'periodDays':
        return 'Días de regla registrados — así tu ciclo se estima cada vez con más precisión.';
      default:
        return 'Sigue registrando tus días — cuantos más datos, más útil se vuelve este resumen.';
    }
  }

  function wrappedTilesHtml(tileList) {
    return tileList
      .map((t) => `<div class="wrapped-tile" style="background:${t.color}"><span class="wrapped-tile-value">${t.value}</span><span class="wrapped-tile-label">${t.label}</span></div>`)
      .join('');
  }

  // Renders a wrapped summary as a portrait share-card image (canvas), then uses the
  // Web Share API when available (native share sheet) or falls back to a download.
  function resolveColor(cssVarExpr) {
    const m = /var\((--[\w-]+)\)/.exec(cssVarExpr);
    if (!m) return cssVarExpr;
    return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || '#8a1f31';
  }

  // Draws a scaled-up version of the brand-mark SVG (circle + necktie) so the share
  // card reads as unmistakably "Suit Up" rather than a generic stats screenshot.
  function drawBrandMark(ctx, cx, cy, r) {
    const s = r / 9.5; // brand-mark SVG viewBox uses a r=9.5 circle
    const pt = (px, py) => ({ x: cx + (px - 12) * s, y: cy + (py - 12) * s });
    const poly = (pts) => {
      ctx.beginPath();
      pts.forEach((p, i) => { const c = pt(p[0], p[1]); if (i === 0) ctx.moveTo(c.x, c.y); else ctx.lineTo(c.x, c.y); });
      ctx.closePath();
    };
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(1.5, r * 0.09);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#c1495b';
    poly([[10.3, 7.2], [13.7, 7.2], [12.9, 9.4], [11.1, 9.4]]);
    ctx.fill();
    poly([[11.1, 9.4], [12.9, 9.4], [13.6, 13.4], [12, 17.3], [10.4, 13.4]]);
    ctx.fill();
    ctx.restore();
  }

  // Fine diagonal crosshatch, echoing the same subtle texture used across the app's
  // own backgrounds, so the share card doesn't read as a plain flat gradient.
  function drawCrosshatch(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - h, h); ctx.stroke();
    }
    ctx.restore();
  }

  function drawStitchLine(ctx, x1, y, x2, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.restore();
  }

  // Tape-measure tick strip along a tile's left edge, matching the .card::before
  // ticks used throughout the app — minor ticks every 6px, a longer one every 18px.
  function drawTapeTicks(ctx, x, top, bottom, minorColor, majorColor) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    for (let y = top, i = 0; y <= bottom; y += 6, i++) {
      const major = i % 3 === 0;
      ctx.strokeStyle = major ? majorColor : minorColor;
      ctx.lineWidth = major ? 3 : 1.5;
      const len = major ? 14 : 7;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  async function shareWrappedImage(title, tiles) {
    const W = 1080, H = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const navy = resolveColor('var(--accent)');
    const navyStrong = resolveColor('var(--accent-strong)');
    const surface = resolveColor('var(--surface)');
    const text = resolveColor('var(--text)');
    const textMuted = resolveColor('var(--text-muted)');
    const brass = resolveColor('var(--accent-2)');

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, navyStrong);
    grad.addColorStop(1, navy);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    drawCrosshatch(ctx, W, H);

    ctx.textBaseline = 'alphabetic';
    drawBrandMark(ctx, 96, 92, 40);
    ctx.fillStyle = brass;
    ctx.font = '700 26px -apple-system, sans-serif';
    ctx.fillText('S U I T   U P', 156, 82);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 52px Georgia, "Iowan Old Style", "Palatino Linotype", serif';
    ctx.fillText(title, 156, 132);
    drawStitchLine(ctx, 60, 176, W - 60, brass);

    const cols = 2;
    const gap = 24;
    const marginX = 60;
    const gridTop = 220;
    const tileW = (W - marginX * 2 - gap * (cols - 1)) / cols;
    const tileH = 200;
    tiles.forEach((t, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = marginX + col * (tileW + gap);
      const y = gridTop + row * (tileH + gap);
      ctx.fillStyle = surface;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, tileW, tileH, 18);
      else ctx.rect(x, y, tileW, tileH);
      ctx.fill();
      drawTapeTicks(ctx, x + 6, y + 18, y + tileH - 18, textMuted, resolveColor(t.color));
      ctx.fillStyle = text;
      ctx.font = '700 50px Georgia, "Iowan Old Style", "Palatino Linotype", serif';
      const valueText = String(t.value).length > 10 ? `${String(t.value).slice(0, 10)}…` : String(t.value);
      ctx.fillText(valueText, x + 34, y + 100);
      ctx.fillStyle = textMuted;
      ctx.font = '400 24px -apple-system, sans-serif';
      ctx.fillText(t.label.toUpperCase(), x + 34, y + 138, tileW - 66);
    });

    drawStitchLine(ctx, 60, H - 80, W - 60, brass);
    ctx.fillStyle = brass;
    ctx.font = '400 24px -apple-system, sans-serif';
    ctx.fillText(`Generado el ${new Date().toLocaleDateString('es-ES')}`, 60, H - 46);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const fileName = `suit-up-resumen-${dateKey(new Date())}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Suit Up — ${title}` });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  let lastMonthWrappedShare = null;
  let lastYearWrappedShare = null;

  /* ============ Resumen animado (stories) ============ */
  const storyOverlay = document.getElementById('storyOverlay');
  const storySlideEl = document.getElementById('storySlide');
  const storyProgressEl = document.getElementById('storyProgress');
  const storyTapZonesEl = document.querySelector('.story-tap-zones');
  const STORY_LOGO_MS = 3000;
  const STORY_STAT_MS = 5000;
  let storySlides = [];
  let storyIndex = 0;
  let storyTimer = null;
  let storyCurrentShare = null;

  function storySlideDurationMs(slide) {
    if (slide.type === 'logo') return STORY_LOGO_MS;
    if (slide.type === 'stat') return STORY_STAT_MS;
    return 0; // final slide: no auto-advance
  }

  function storyLogoSlideHtml(title) {
    return `
      <svg class="story-logo-mark" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="story-logo-circle" cx="12" cy="12" r="9.5" />
        <path class="story-logo-tie" d="M10.3,7.2 L13.7,7.2 L12.9,9.4 L11.1,9.4 Z" />
        <path class="story-logo-tie" d="M11.1,9.4 L12.9,9.4 L13.6,13.4 L12,17.3 L10.4,13.4 Z" />
      </svg>
      <div class="story-wordmark">S U I T&nbsp;&nbsp;U P</div>
      <div class="story-logo-title">${escapeHtml(title)}</div>
      <div class="story-logo-sub">Tu resumen, en detalle</div>`;
  }

  function storyStatSlideHtml(tile) {
    return `
      <div class="story-stat-swatch" style="background:${tile.color}"></div>
      <div class="story-stat-value">${tile.value}</div>
      <div class="story-stat-label">${escapeHtml(tile.label)}</div>
      <div class="story-stat-why">${escapeHtml(wrappedInsightMessage(tile))}</div>`;
  }

  function storyFinalSlideHtml(title, tileList) {
    const rows = tileList.map((t) => `<li><span>${escapeHtml(t.label)}</span><span class="story-final-value">${t.value}</span></li>`).join('');
    return `
      <div class="story-final-title">Eso ha sido ${escapeHtml(title)}</div>
      <ul class="story-final-list">${rows}</ul>
      <div class="story-final-actions">
        <button type="button" class="story-final-share" id="storyFinalShareBtn">Compartir imagen</button>
        <button type="button" class="story-final-close" id="storyFinalCloseBtn">Cerrar</button>
      </div>`;
  }

  function updateStoryProgress() {
    storyProgressEl.innerHTML = storySlides.map((s, i) => {
      const dur = storySlideDurationMs(s);
      const cls = i < storyIndex ? 'is-done' : (i === storyIndex ? 'is-active' : '');
      return `<div class="story-progress-seg ${cls}"><div class="story-progress-fill" style="--story-duration:${dur}ms"></div></div>`;
    }).join('');
  }

  function showStorySlide(index) {
    clearTimeout(storyTimer);
    storyIndex = index;
    const slide = storySlides[index];
    let html;
    if (slide.type === 'logo') html = storyLogoSlideHtml(slide.title);
    else if (slide.type === 'stat') html = storyStatSlideHtml(slide.tile);
    else html = storyFinalSlideHtml(slide.title, slide.tileList);
    storySlideEl.innerHTML = `<div class="story-slide-inner">${html}</div>`;
    // The final slide has its own real buttons (share/close), so the invisible
    // prev/next tap zones — which otherwise sit above the slide content to catch
    // taps anywhere — must step aside instead of swallowing those clicks.
    storyTapZonesEl.style.pointerEvents = slide.type === 'final' ? 'none' : '';
    updateStoryProgress();
    const duration = storySlideDurationMs(slide);
    if (duration > 0) {
      storyTimer = setTimeout(() => advanceStory(1), duration);
    }
  }

  function advanceStory(delta) {
    const next = storyIndex + delta;
    if (next < 0) return;
    if (next >= storySlides.length) { closeStory(); return; }
    showStorySlide(next);
  }

  function openStory(title, tileList) {
    storyCurrentShare = { title, tiles: tileList };
    storySlides = [{ type: 'logo', title }, ...tileList.map((t) => ({ type: 'stat', tile: t })), { type: 'final', title, tileList }];
    storyOverlay.hidden = false;
    showStorySlide(0);
  }

  function closeStory() {
    clearTimeout(storyTimer);
    storyOverlay.hidden = true;
  }

  document.getElementById('playMonthWrappedBtn').addEventListener('click', () => {
    if (lastMonthWrappedShare) openStory(lastMonthWrappedShare.title, lastMonthWrappedShare.tiles);
  });
  document.getElementById('playYearWrappedBtn').addEventListener('click', () => {
    if (lastYearWrappedShare) openStory(lastYearWrappedShare.title, lastYearWrappedShare.tiles);
  });
  document.getElementById('storyPrevZone').addEventListener('click', () => advanceStory(-1));
  document.getElementById('storyNextZone').addEventListener('click', () => advanceStory(1));
  document.getElementById('storyCloseBtn').addEventListener('click', closeStory);
  document.getElementById('storyShareBtn').addEventListener('click', () => {
    if (storyCurrentShare) shareWrappedImage(storyCurrentShare.title, storyCurrentShare.tiles);
  });
  document.addEventListener('keydown', (e) => {
    if (storyOverlay.hidden) return;
    if (e.key === 'Escape') closeStory();
    else if (e.key === 'ArrowLeft') advanceStory(-1);
    else if (e.key === 'ArrowRight') advanceStory(1);
  });
  // The final slide's buttons are re-created on every render, so they're handled
  // via delegation instead of a direct listener that would be lost each time.
  storySlideEl.addEventListener('click', (e) => {
    if (e.target.closest('#storyFinalShareBtn')) {
      if (storyCurrentShare) shareWrappedImage(storyCurrentShare.title, storyCurrentShare.tiles);
    } else if (e.target.closest('#storyFinalCloseBtn')) {
      closeStory();
    }
  });

  function renderMonthWrapped(year, monthIndex, lastDay) {
    const card = document.getElementById('monthWrappedCard');
    const today = startOfDay(new Date());
    let wrapYear = year, wrapMonth = monthIndex, wrapLastDay = lastDay;

    const isViewingCurrentMonth = (year === today.getFullYear() && monthIndex === today.getMonth());
    if (isViewingCurrentMonth) {
      if (today.getDate() <= 7) {
        // First week of the month: still show last month's recap.
        const prevMonthDate = new Date(year, monthIndex - 1, 1);
        wrapYear = prevMonthDate.getFullYear();
        wrapMonth = prevMonthDate.getMonth();
        wrapLastDay = daysInMonth(wrapYear, wrapMonth);
      } else if (today.getDate() === daysInMonth(year, monthIndex)) {
        // Last day of the month: show this month's own recap.
        wrapLastDay = daysInMonth(year, monthIndex);
      } else {
        card.hidden = true;
        return;
      }
    } else {
      const monthComplete = lastDay > 0 && lastDay === daysInMonth(year, monthIndex);
      if (!monthComplete) { card.hidden = true; return; }
    }

    const stats = computeWrappedStats(new Date(wrapYear, wrapMonth, 1), new Date(wrapYear, wrapMonth, wrapLastDay));
    if (stats.loggedDays === 0) { card.hidden = true; return; }
    card.hidden = false;
    const tileList = buildWrappedTileList(stats);
    const title = `Resumen de ${MONTHS_LONG[wrapMonth]}`;
    document.getElementById('monthWrappedTitle').textContent = title;
    document.getElementById('monthWrappedTiles').innerHTML = wrappedTilesHtml(tileList);
    lastMonthWrappedShare = { title: `${MONTHS_LONG[wrapMonth]} ${wrapYear}`, tiles: tileList };
  }

  function renderYearWrapped(year) {
    const card = document.getElementById('yearWrappedCard');
    const today = startOfDay(new Date());
    let wrapYear = year;

    const isViewingCurrentYear = (year === today.getFullYear());
    if (isViewingCurrentYear) {
      if (today.getMonth() === 0 && today.getDate() <= 7) {
        // First week of January: still show last year's recap.
        wrapYear = year - 1;
      } else if (today.getMonth() === 11 && today.getDate() === 31) {
        // Last day of the year: show this year's own recap.
        wrapYear = year;
      } else {
        card.hidden = true;
        return;
      }
    } else if (year >= today.getFullYear()) {
      card.hidden = true;
      return;
    }

    const stats = computeWrappedStats(new Date(wrapYear, 0, 1), new Date(wrapYear, 11, 31));
    if (stats.loggedDays === 0) { card.hidden = true; return; }
    card.hidden = false;
    const tileList = buildWrappedTileList(stats);
    document.getElementById('yearWrappedTitle').textContent = `Resumen de ${wrapYear}`;
    document.getElementById('yearWrappedTiles').innerHTML = wrappedTilesHtml(tileList);
    lastYearWrappedShare = { title: `${wrapYear}`, tiles: tileList };
  }

  function renderConsumoChart(year, monthIndex, lastDay) {
    const showJoints = jointsEnabled();
    document.getElementById('consumoChartTitle').textContent = showJoints ? 'Cigarros y Joints' : 'Cigarros';
    document.getElementById('legendJointsItem').hidden = !showJoints;

    const totalDays = daysInMonth(year, monthIndex);
    if (lastDay === 0) {
      consumoChart.innerHTML = '<p class="hint-text" style="margin-top:0">Sin datos todavía para este mes.</p>';
      return;
    }
    const data = [];
    let sumTotal = 0, countLogged = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (d > lastDay) { data.push(null); continue; }
      const entry = getEntryForDay(year, monthIndex, d);
      if (entry) {
        const cig = entry.cigarettes || 0, joint = showJoints ? (entry.joints || 0) : 0;
        data.push({ cig, joint });
        sumTotal += cig + joint;
        countLogged++;
      } else {
        data.push(undefined);
      }
    }
    const avg = countLogged > 0 ? sumTotal / countLogged : 0;
    const maxVal = Math.max(1, ...data.map((x) => (x ? x.cig + x.joint : 0)));

    const W = 340, H = 150, padL = 26, padR = 8, padT = 10, padB = 20;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const barGap = 2;
    const barW = Math.max(2, plotW / totalDays - barGap);

    let yAxis = '';
    const yStepCount = maxVal >= 4 ? 4 : maxVal;
    for (let i = 0; i <= yStepCount; i++) {
      const val = Math.round((maxVal / yStepCount) * i);
      const y = padT + plotH - (val / maxVal) * plotH;
      yAxis += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`;
      yAxis += `<text x="${(padL - 5).toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="8" text-anchor="end" fill="var(--text-muted)">${val}</text>`;
    }

    let bars = '';
    data.forEach((v, i) => {
      const x = padL + i * (plotW / totalDays);
      if (!v) return;
      const total = v.cig + v.joint;
      const totalH = (total / maxVal) * plotH;
      const jointH = (v.joint / maxVal) * plotH;
      const cigH = (v.cig / maxVal) * plotH;
      const yBase = padT + plotH;
      if (v.joint > 0) {
        bars += `<rect x="${x.toFixed(1)}" y="${(yBase - jointH).toFixed(1)}" width="${barW.toFixed(1)}" height="${jointH.toFixed(1)}" rx="1" fill="#4fae93"/>`;
      }
      if (v.cig > 0) {
        bars += `<rect x="${x.toFixed(1)}" y="${(yBase - jointH - cigH).toFixed(1)}" width="${barW.toFixed(1)}" height="${cigH.toFixed(1)}" rx="1" fill="#e08683"/>`;
      }
      if (total === 0) {
        bars += `<rect x="${x.toFixed(1)}" y="${(yBase - 2).toFixed(1)}" width="${barW.toFixed(1)}" height="2" rx="1" fill="var(--border)"/>`;
      }
    });

    const avgY = padT + plotH - (avg / maxVal) * plotH;
    const avgLine = `<line x1="${padL}" y1="${avgY.toFixed(1)}" x2="${W - padR}" y2="${avgY.toFixed(1)}" stroke="#9aa6a1" stroke-width="1.5" stroke-dasharray="4 3"/>`;

    let ticks = '';
    const tickStep = totalDays > 20 ? 5 : totalDays > 10 ? 5 : 2;
    for (let d = 1; d <= totalDays; d += tickStep) {
      const x = padL + (d - 0.5) * (plotW / totalDays);
      ticks += `<text x="${x.toFixed(1)}" y="${H - 5}" font-size="8" text-anchor="middle" fill="var(--text-muted)">${d}</text>`;
    }

    consumoChart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${yAxis}${bars}${avgLine}${ticks}</svg>`;
  }

  function renderCompare(year, monthIndex) {
    const cur = {
      cig: monthConsumoAverage(year, monthIndex, 'cigarettes'),
      joint: monthConsumoAverage(year, monthIndex, 'joints')
    };
    const prevDate = new Date(year, monthIndex - 1, 1);
    const prev = {
      cig: monthConsumoAverage(prevDate.getFullYear(), prevDate.getMonth(), 'cigarettes'),
      joint: monthConsumoAverage(prevDate.getFullYear(), prevDate.getMonth(), 'joints')
    };

    compareList.innerHTML = '';
    const compareItems = [{ label: 'Cigarros / día', cur: cur.cig, prev: prev.cig }];
    if (jointsEnabled()) compareItems.push({ label: 'Joints / día', cur: cur.joint, prev: prev.joint });
    compareItems.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'compare-row';
      let arrow = '', arrowClass = 'flat';
      if (item.prev.count > 0) {
        const diff = item.cur.avg - item.prev.avg;
        if (diff < -0.05) { arrow = '↓'; arrowClass = 'down'; }
        else if (diff > 0.05) { arrow = '↑'; arrowClass = 'up'; }
        else { arrow = '='; arrowClass = 'flat'; }
      }
      row.innerHTML = `
        <span class="compare-name">${item.label}</span>
        <span class="compare-values">
          <span>${item.prev.count > 0 ? item.prev.avg.toFixed(1) : '–'}</span>
          <span class="compare-arrow ${arrowClass}">→</span>
          <span>${item.cur.avg.toFixed(1)}</span>
          <span class="compare-arrow ${arrowClass}">${arrow}</span>
        </span>`;
      compareList.appendChild(row);
    });
  }

  /* ============ AJUSTES panel / Daily task management ============ */
  const dailyTaskManageList = document.getElementById('dailyTaskManageList');
  const newDailyTaskInput = document.getElementById('newDailyTaskInput');
  const addDailyTaskBtn = document.getElementById('addDailyTaskBtn');

  function generateTaskId() {
    return `tk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function renderDailyTaskManageList() {
    const tasks = store.settings.dailyTasks;
    dailyTaskManageList.innerHTML = tasks.length ? tasks.map((t) => `
      <li class="task-manage-item" data-task-id="${t.id}">
        <span class="task-manage-label">${escapeHtml(t.label)}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${t.id}" aria-label="Eliminar ${escapeHtml(t.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes tareas diarias todavía.</li>';
  }

  let selectedDailyTaskIcon = null;
  renderIconPicker(document.getElementById('dailyTaskIconPicker'), selectedDailyTaskIcon, (key) => { selectedDailyTaskIcon = key; });

  function addDailyTask() {
    const label = newDailyTaskInput.value.trim();
    if (!label) return;
    store.settings.dailyTasks.push({ id: generateTaskId(), label, icon: selectedDailyTaskIcon });
    saveStore();
    newDailyTaskInput.value = '';
    renderDailyTaskManageList();
    renderHoy();
  }

  const tracksTeethToggle = document.getElementById('tracksTeethToggle');
  tracksTeethToggle.checked = teethEnabled();
  tracksTeethToggle.addEventListener('change', () => {
    store.settings.tracksTeeth = tracksTeethToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  addDailyTaskBtn.addEventListener('click', addDailyTask);
  newDailyTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addDailyTask();
  });

  dailyTaskManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const taskId = btn.dataset.removeTask;
    const label = btn.closest('.task-manage-item').querySelector('.task-manage-label').textContent;
    deleteWithUndo(store.settings.dailyTasks, taskId, label, () => {
      renderDailyTaskManageList();
      renderHoy();
    });
  });

  renderDailyTaskManageList();

  /* ============ AJUSTES panel / Weekly task management ============ */
  const weeklyTaskManageList = document.getElementById('weeklyTaskManageList');
  const newWeeklyTaskInput = document.getElementById('newWeeklyTaskInput');
  const addWeeklyTaskBtn = document.getElementById('addWeeklyTaskBtn');

  function renderWeeklyTaskManageList() {
    const tasks = store.settings.weeklyTasks;
    weeklyTaskManageList.innerHTML = tasks.length ? tasks.map((t) => `
      <li class="task-manage-item" data-task-id="${t.id}">
        <span class="task-manage-label">${escapeHtml(t.label)}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${t.id}" aria-label="Eliminar ${escapeHtml(t.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes tareas semanales todavía.</li>';
  }

  function addWeeklyTask() {
    const label = newWeeklyTaskInput.value.trim();
    if (!label) return;
    store.settings.weeklyTasks.push({ id: generateTaskId(), label });
    saveStore();
    newWeeklyTaskInput.value = '';
    renderWeeklyTaskManageList();
    renderHoy();
  }

  addWeeklyTaskBtn.addEventListener('click', addWeeklyTask);
  newWeeklyTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addWeeklyTask();
  });

  weeklyTaskManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const taskId = btn.dataset.removeTask;
    const label = btn.closest('.task-manage-item').querySelector('.task-manage-label').textContent;
    deleteWithUndo(store.settings.weeklyTasks, taskId, label, () => {
      renderWeeklyTaskManageList();
      renderHoy();
    });
  });

  renderWeeklyTaskManageList();

  /* ============ AJUSTES panel / Bad habit management ============ */
  const badHabitManageList = document.getElementById('badHabitManageList');
  const newBadHabitInput = document.getElementById('newBadHabitInput');
  const addBadHabitBtn = document.getElementById('addBadHabitBtn');

  function renderBadHabitManageList() {
    const habits = store.settings.badHabits;
    badHabitManageList.innerHTML = habits.length ? habits.map((h) => `
      <li class="task-manage-item" data-task-id="${h.id}">
        <span class="task-manage-label">${escapeHtml(h.label)}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${h.id}" aria-label="Eliminar ${escapeHtml(h.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes malos hábitos todavía.</li>';
  }

  let selectedBadHabitIcon = null;
  renderIconPicker(document.getElementById('badHabitIconPicker'), selectedBadHabitIcon, (key) => { selectedBadHabitIcon = key; });

  function addBadHabit() {
    const label = newBadHabitInput.value.trim();
    if (!label) return;
    store.settings.badHabits.push({ id: generateTaskId(), label, icon: selectedBadHabitIcon });
    saveStore();
    newBadHabitInput.value = '';
    renderBadHabitManageList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  }

  addBadHabitBtn.addEventListener('click', addBadHabit);
  newBadHabitInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBadHabit();
  });

  badHabitManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const taskId = btn.dataset.removeTask;
    const label = btn.closest('.task-manage-item').querySelector('.task-manage-label').textContent;
    deleteWithUndo(store.settings.badHabits, taskId, label, () => {
      renderBadHabitManageList();
      renderHoy();
      if (activeTab === 'stats') renderStats();
    });
  });

  renderBadHabitManageList();

  /* ============ AJUSTES panel / Supplement management ============ */
  const tracksSupplementsToggle = document.getElementById('tracksSupplementsToggle');
  const supplementManageList = document.getElementById('supplementManageList');
  const newSupplementInput = document.getElementById('newSupplementInput');
  const addSupplementBtn = document.getElementById('addSupplementBtn');

  tracksSupplementsToggle.checked = supplementsEnabled();
  tracksSupplementsToggle.addEventListener('change', () => {
    store.settings.tracksSupplements = tracksSupplementsToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  function renderSupplementManageList() {
    const supplements = store.settings.supplements;
    supplementManageList.innerHTML = supplements.length ? supplements.map((s) => `
      <li class="task-manage-item" data-task-id="${s.id}">
        <span class="task-manage-label">${escapeHtml(s.label)}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${s.id}" aria-label="Eliminar ${escapeHtml(s.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes suplementos todavía.</li>';
  }

  let selectedSupplementIcon = null;
  renderIconPicker(document.getElementById('supplementIconPicker'), selectedSupplementIcon, (key) => { selectedSupplementIcon = key; });

  function addSupplement() {
    const label = newSupplementInput.value.trim();
    if (!label) return;
    store.settings.supplements.push({ id: generateTaskId(), label, icon: selectedSupplementIcon });
    saveStore();
    newSupplementInput.value = '';
    renderSupplementManageList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  }

  addSupplementBtn.addEventListener('click', addSupplement);
  newSupplementInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addSupplement();
  });

  supplementManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const supId = btn.dataset.removeTask;
    const label = btn.closest('.task-manage-item').querySelector('.task-manage-label').textContent;
    deleteWithUndo(store.settings.supplements, supId, label, () => {
      renderSupplementManageList();
      renderHoy();
      if (activeTab === 'stats') renderStats();
    });
  });

  renderSupplementManageList();

  /* ============ AJUSTES panel / Consumption preferences ============ */
  const tracksConsumoToggle = document.getElementById('tracksConsumoToggle');
  const jointsPrefsGroup = document.getElementById('jointsPrefsGroup');
  tracksConsumoToggle.checked = consumoEnabled();
  jointsPrefsGroup.hidden = !consumoEnabled();
  tracksConsumoToggle.addEventListener('change', () => {
    store.settings.tracksConsumo = tracksConsumoToggle.checked;
    saveStore();
    jointsPrefsGroup.hidden = !consumoEnabled();
    updateConsumoTabVisibility();
    if (activeTab === 'stats') renderStats();
  });

  const tracksJointsToggle = document.getElementById('tracksJointsToggle');
  const jointPriceGroup = document.getElementById('jointPriceGroup');
  tracksJointsToggle.checked = jointsEnabled();
  jointPriceGroup.hidden = !jointsEnabled();
  tracksJointsToggle.addEventListener('change', () => {
    store.settings.tracksJoints = tracksJointsToggle.checked;
    saveStore();
    jointPriceGroup.hidden = !jointsEnabled();
    updateConsumoTabIcon();
    renderConsumo();
    if (activeTab === 'stats') renderStats();
  });

  const jointPriceInput = document.getElementById('jointPriceInput');
  jointPriceInput.value = jointPricePer4().toFixed(2);
  jointPriceInput.addEventListener('change', () => {
    const value = parseFloat(jointPriceInput.value);
    store.settings.jointPricePer4 = (!isNaN(value) && value >= 0) ? value : 0;
    jointPriceInput.value = store.settings.jointPricePer4.toFixed(2);
    saveStore();
    renderConsumo();
    if (activeTab === 'stats') renderStats();
  });

  const purchaseManageList = document.getElementById('purchaseManageList');
  const newPurchaseLabelInput = document.getElementById('newPurchaseLabelInput');
  const newPurchasePriceInput = document.getElementById('newPurchasePriceInput');
  const addPurchaseBtn = document.getElementById('addPurchaseBtn');

  function renderPurchaseManageList() {
    const items = store.settings.purchaseItems;
    purchaseManageList.innerHTML = items.length ? items.map((p) => `
      <li class="task-manage-item" data-task-id="${p.id}">
        <span class="task-manage-label">${escapeHtml(p.label)}</span>
        <input type="number" class="purchase-price-input" data-price-item="${p.id}" value="${p.price.toFixed(2)}" min="0" step="0.01" />
        <button type="button" class="task-remove-btn" data-remove-task="${p.id}" aria-label="Eliminar ${escapeHtml(p.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes artículos de compra todavía.</li>';
  }

  function addPurchaseItem() {
    const label = newPurchaseLabelInput.value.trim();
    if (!label) return;
    const price = parseFloat(newPurchasePriceInput.value);
    store.settings.purchaseItems.push({ id: generateTaskId(), label, price: (!isNaN(price) && price >= 0) ? price : 0 });
    saveStore();
    newPurchaseLabelInput.value = '';
    newPurchasePriceInput.value = '';
    renderPurchaseManageList();
    updateJointPriceHints();
    renderConsumo();
    if (activeTab === 'stats') renderStats();
  }

  addPurchaseBtn.addEventListener('click', addPurchaseItem);
  newPurchaseLabelInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPurchaseItem();
  });
  newPurchasePriceInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPurchaseItem();
  });

  purchaseManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const itemId = btn.dataset.removeTask;
    const label = btn.closest('.task-manage-item').querySelector('.task-manage-label').textContent;
    deleteWithUndo(store.settings.purchaseItems, itemId, label, () => {
      renderPurchaseManageList();
      updateJointPriceHints();
      renderConsumo();
      if (activeTab === 'stats') renderStats();
    });
  });

  purchaseManageList.addEventListener('change', (e) => {
    const input = e.target.closest('[data-price-item]');
    if (!input) return;
    const itemId = input.dataset.priceItem;
    const item = store.settings.purchaseItems.find((p) => p.id === itemId);
    if (!item) return;
    const value = parseFloat(input.value);
    item.price = (!isNaN(value) && value >= 0) ? value : 0;
    input.value = item.price.toFixed(2);
    saveStore();
    updateJointPriceHints();
    renderConsumo();
    if (activeTab === 'stats') renderStats();
  });

  renderPurchaseManageList();

  const monthlyBudgetInput = document.getElementById('monthlyBudgetInput');
  monthlyBudgetInput.value = store.settings.monthlyBudget != null ? store.settings.monthlyBudget : '';
  monthlyBudgetInput.addEventListener('change', () => {
    const value = parseFloat(monthlyBudgetInput.value);
    store.settings.monthlyBudget = (!isNaN(value) && value > 0) ? value : null;
    monthlyBudgetInput.value = store.settings.monthlyBudget != null ? store.settings.monthlyBudget : '';
    saveStore();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Apariencia ============ */
  const themeColorMetas = Array.from(document.querySelectorAll('meta[name="theme-color"]'));
  const themeColorMetaDefaults = themeColorMetas.map((m) => m.getAttribute('content'));

  function applyThemeMode() {
    if (store.settings.themeMode === 'auto') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = store.settings.themeMode;
    }
    // Both <meta name="theme-color"> tags in index.html are gated by a
    // prefers-color-scheme media query for the automatic case; when the user picks
    // an explicit theme here, both get the same resolved color so whichever one the
    // browser honors still matches what's on screen (status bar / browser chrome).
    // Switching back to "auto" restores their original media-driven values.
    if (store.settings.themeMode === 'auto') {
      themeColorMetas.forEach((m, i) => m.setAttribute('content', themeColorMetaDefaults[i]));
    } else {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      if (bg) themeColorMetas.forEach((m) => m.setAttribute('content', bg));
    }
  }

  function applyDensityMode() {
    document.documentElement.dataset.density = store.settings.densityMode === 'compact' ? 'compact' : '';
  }

  const themeModeSelect = document.getElementById('themeModeSelect');
  themeModeSelect.value = store.settings.themeMode;
  themeModeSelect.addEventListener('change', () => {
    store.settings.themeMode = themeModeSelect.value;
    saveStore();
    applyThemeMode();
  });

  const densityModeSelect = document.getElementById('densityModeSelect');
  densityModeSelect.value = store.settings.densityMode;
  densityModeSelect.addEventListener('change', () => {
    store.settings.densityMode = densityModeSelect.value;
    saveStore();
    applyDensityMode();
  });

  /* ============ AJUSTES panel / Profile ============ */
  const profileNameInput = document.getElementById('profileNameInput');
  const profileSexInput = document.getElementById('profileSexInput');
  const profileBirthdateInput = document.getElementById('profileBirthdateInput');
  const profileAgeHint = document.getElementById('profileAgeHint');
  const profileHeightInput = document.getElementById('profileHeightInput');
  const profileWeightInput = document.getElementById('profileWeightInput');

  function calcAge(birthdateStr) {
    if (!birthdateStr) return null;
    const b = new Date(birthdateStr);
    if (isNaN(b.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age >= 0 ? age : null;
  }

  function updateProfileAgeHint() {
    const age = calcAge(store.settings.profile.birthdate);
    if (age === null) {
      profileAgeHint.hidden = true;
      return;
    }
    profileAgeHint.hidden = false;
    profileAgeHint.textContent = `Edad actual: ${age} ${age === 1 ? 'año' : 'años'}.`;
  }

  profileNameInput.value = store.settings.profile.name || '';
  profileSexInput.value = store.settings.profile.sex || '';
  profileBirthdateInput.value = store.settings.profile.birthdate || '';
  profileHeightInput.value = store.settings.profile.height != null ? store.settings.profile.height : '';
  profileWeightInput.value = store.settings.profile.weight != null ? store.settings.profile.weight : '';
  updateProfileAgeHint();

  profileNameInput.addEventListener('change', () => {
    store.settings.profile.name = profileNameInput.value.trim();
    saveStore();
    renderHoy();
  });
  profileSexInput.addEventListener('change', () => {
    store.settings.profile.sex = profileSexInput.value;
    saveStore();
  });
  profileBirthdateInput.addEventListener('change', () => {
    store.settings.profile.birthdate = profileBirthdateInput.value;
    saveStore();
    updateProfileAgeHint();
  });
  profileHeightInput.addEventListener('change', () => {
    const value = parseFloat(profileHeightInput.value);
    store.settings.profile.height = !isNaN(value) && value >= 0 ? value : null;
    saveStore();
  });
  profileWeightInput.addEventListener('change', () => {
    const value = parseFloat(profileWeightInput.value);
    store.settings.profile.weight = !isNaN(value) && value >= 0 ? value : null;
    saveStore();
  });

  /* ============ AJUSTES panel / Agua ============ */
  const tracksAguaToggle = document.getElementById('tracksAguaToggle');
  const aguaGoalInput = document.getElementById('aguaGoalInput');
  tracksAguaToggle.checked = aguaEnabled();
  aguaGoalInput.value = aguaGoal();
  tracksAguaToggle.addEventListener('change', () => {
    store.settings.tracksAgua = tracksAguaToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });
  aguaGoalInput.addEventListener('change', () => {
    const value = parseInt(aguaGoalInput.value, 10);
    store.settings.aguaGoal = (!isNaN(value) && value > 0) ? value : 8;
    aguaGoalInput.value = store.settings.aguaGoal;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Sueño ============ */
  const tracksSuenoToggle = document.getElementById('tracksSuenoToggle');
  tracksSuenoToggle.checked = suenoEnabled();
  tracksSuenoToggle.addEventListener('change', () => {
    store.settings.tracksSueno = tracksSuenoToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  const sleepGoalInput = document.getElementById('sleepGoalInput');
  sleepGoalInput.value = store.settings.sleepGoalHours;
  sleepGoalInput.addEventListener('change', () => {
    const value = parseFloat(sleepGoalInput.value);
    store.settings.sleepGoalHours = (!isNaN(value) && value > 0) ? value : 8;
    sleepGoalInput.value = store.settings.sleepGoalHours;
    saveStore();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Peso corporal ============ */
  const tracksPesoToggle = document.getElementById('tracksPesoToggle');
  tracksPesoToggle.checked = pesoEnabled();
  tracksPesoToggle.addEventListener('change', () => {
    store.settings.tracksPeso = tracksPesoToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Ayuno intermitente ============ */
  const tracksAyunoToggle = document.getElementById('tracksAyunoToggle');
  tracksAyunoToggle.checked = ayunoEnabled();
  tracksAyunoToggle.addEventListener('change', () => {
    store.settings.tracksAyuno = tracksAyunoToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Mente ============ */
  const tracksMeditacionToggle = document.getElementById('tracksMeditacionToggle');
  const tracksLecturaToggle = document.getElementById('tracksLecturaToggle');
  tracksMeditacionToggle.checked = meditacionEnabled();
  tracksLecturaToggle.checked = lecturaEnabled();
  tracksMeditacionToggle.addEventListener('change', () => {
    store.settings.tracksMeditacion = tracksMeditacionToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });
  tracksLecturaToggle.addEventListener('change', () => {
    store.settings.tracksLectura = tracksLecturaToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Snacks, Gratitud, Energía, Ropa ============ */
  const tracksSnacksToggle = document.getElementById('tracksSnacksToggle');
  tracksSnacksToggle.checked = snacksEnabled();
  tracksSnacksToggle.addEventListener('change', () => {
    store.settings.tracksSnacks = tracksSnacksToggle.checked;
    saveStore();
    renderHoy();
  });

  const tracksGratitudToggle = document.getElementById('tracksGratitudToggle');
  tracksGratitudToggle.checked = gratitudEnabled();
  tracksGratitudToggle.addEventListener('change', () => {
    store.settings.tracksGratitud = tracksGratitudToggle.checked;
    saveStore();
    renderHoy();
  });

  const tracksEnergiaToggle = document.getElementById('tracksEnergiaToggle');
  tracksEnergiaToggle.checked = energiaEnabled();
  tracksEnergiaToggle.addEventListener('change', () => {
    store.settings.tracksEnergia = tracksEnergiaToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  const tracksRopaToggle = document.getElementById('tracksRopaToggle');
  tracksRopaToggle.checked = ropaEnabled();
  tracksRopaToggle.addEventListener('change', () => {
    store.settings.tracksRopa = tracksRopaToggle.checked;
    saveStore();
    renderHoy();
  });

  /* ============ AJUSTES panel / Ciclo menstrual ============ */
  const tracksCicloToggle = document.getElementById('tracksCicloToggle');
  tracksCicloToggle.checked = cicloEnabled();
  tracksCicloToggle.addEventListener('change', () => {
    store.settings.tracksCiclo = tracksCicloToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  const cicloAvgLengthInput = document.getElementById('cicloAvgLengthInput');
  cicloAvgLengthInput.value = store.settings.cicloAvgLength;
  cicloAvgLengthInput.addEventListener('change', () => {
    const value = parseInt(cicloAvgLengthInput.value, 10);
    store.settings.cicloAvgLength = (!isNaN(value) && value >= 15 && value <= 60) ? value : 28;
    cicloAvgLengthInput.value = store.settings.cicloAvgLength;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  const cicloAvgPeriodInput = document.getElementById('cicloAvgPeriodInput');
  cicloAvgPeriodInput.value = store.settings.cicloAvgPeriodLength;
  cicloAvgPeriodInput.addEventListener('change', () => {
    const value = parseInt(cicloAvgPeriodInput.value, 10);
    store.settings.cicloAvgPeriodLength = (!isNaN(value) && value >= 1 && value <= 15) ? value : 5;
    cicloAvgPeriodInput.value = store.settings.cicloAvgPeriodLength;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  /* ============ AJUSTES panel / Ejercicio ============ */
  const tracksWorkoutsToggle = document.getElementById('tracksWorkoutsToggle');
  const exerciseManageList = document.getElementById('exerciseManageList');
  const newExerciseInput = document.getElementById('newExerciseInput');
  const newExerciseGroupSelect = document.getElementById('newExerciseGroupSelect');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  newExerciseGroupSelect.innerHTML = EXERCISE_GROUPS.map((g) => `<option value="${g.id}">${g.label}</option>`).join('');

  tracksWorkoutsToggle.checked = workoutsEnabled();
  tracksWorkoutsToggle.addEventListener('change', () => {
    store.settings.tracksWorkouts = tracksWorkoutsToggle.checked;
    saveStore();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  function renderExerciseManageList() {
    const exercises = store.settings.exercises;
    exerciseManageList.innerHTML = exercises.length ? exercises.map((ex) => `
      <li class="task-manage-item" data-task-id="${ex.id}">
        <span class="task-manage-label">${escapeHtml(ex.label)}</span>
        <select class="template-select exercise-group-select" data-exercise-group="${ex.id}">
          ${EXERCISE_GROUPS.map((g) => `<option value="${g.id}" ${(ex.group || '') === g.id ? 'selected' : ''}>${g.label}</option>`).join('')}
        </select>
        <button type="button" class="task-remove-btn" data-remove-task="${ex.id}" aria-label="Eliminar ${escapeHtml(ex.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes ejercicios todavía.</li>';
  }

  function addExercise() {
    const label = newExerciseInput.value.trim();
    if (!label) return;
    store.settings.exercises.push({ id: generateTaskId(), label, group: newExerciseGroupSelect.value });
    saveStore();
    newExerciseInput.value = '';
    renderExerciseManageList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  }

  addExerciseBtn.addEventListener('click', addExercise);
  newExerciseInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addExercise(); });

  exerciseManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const exerciseId = btn.dataset.removeTask;
    store.settings.exercises = store.settings.exercises.filter((ex) => ex.id !== exerciseId);
    store.settings.workoutTemplates.forEach((t) => { t.exerciseIds = t.exerciseIds.filter((id) => id !== exerciseId); });
    saveStore();
    renderExerciseManageList();
    renderTemplateManageList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });
  exerciseManageList.addEventListener('change', (e) => {
    const select = e.target.closest('[data-exercise-group]');
    if (!select) return;
    const ex = store.settings.exercises.find((x) => x.id === select.dataset.exerciseGroup);
    if (ex) {
      ex.group = select.value;
      saveStore();
      renderHoy();
      if (activeTab === 'stats') renderStats();
    }
  });

  renderExerciseManageList();

  const restTimerSecondsInput = document.getElementById('restTimerSecondsInput');
  restTimerSecondsInput.value = store.settings.restTimerSeconds;
  restTimerSecondsInput.addEventListener('change', () => {
    const value = parseInt(restTimerSecondsInput.value, 10);
    store.settings.restTimerSeconds = (!isNaN(value) && value >= 10 && value <= 600) ? value : 90;
    restTimerSecondsInput.value = store.settings.restTimerSeconds;
    saveStore();
  });

  const templateManageList = document.getElementById('templateManageList');
  const newTemplateInput = document.getElementById('newTemplateInput');
  const addTemplateBtn = document.getElementById('addTemplateBtn');
  const templateExercisePicker = document.getElementById('templateExercisePicker');
  let editingTemplateId = null;

  function renderTemplateManageList() {
    const templates = store.settings.workoutTemplates;
    templateManageList.innerHTML = templates.length ? templates.map((t) => `
      <li class="task-manage-item" data-task-id="${t.id}">
        <button type="button" class="task-manage-label template-edit-btn" data-edit-template="${t.id}" style="text-align:left;background:none;border:none;padding:0;color:inherit;font:inherit">${escapeHtml(t.label)} <span class="hint-text" style="display:inline">(${t.exerciseIds.length})</span></button>
        <button type="button" class="task-remove-btn" data-remove-template="${t.id}" aria-label="Eliminar ${escapeHtml(t.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes rutinas todavía.</li>';
    renderTemplateExercisePicker();
  }

  function renderTemplateExercisePicker() {
    if (!editingTemplateId) {
      templateExercisePicker.innerHTML = '';
      return;
    }
    const template = store.settings.workoutTemplates.find((t) => t.id === editingTemplateId);
    if (!template) {
      templateExercisePicker.innerHTML = '';
      return;
    }
    const exercises = store.settings.exercises;
    templateExercisePicker.innerHTML = `
      <p class="hint-text" style="margin-bottom:6px">Ejercicios en "${escapeHtml(template.label)}":</p>
      <div class="cycle-symptom-list">
        ${exercises.length ? exercises.map((ex) => `
          <button type="button" class="symptom-chip" data-template-exercise="${ex.id}" aria-pressed="${template.exerciseIds.includes(ex.id)}">${escapeHtml(ex.label)}</button>
        `).join('') : '<span class="hint-text">Añade ejercicios arriba primero.</span>'}
      </div>`;
  }

  function addTemplate() {
    const label = newTemplateInput.value.trim();
    if (!label) return;
    const id = generateTaskId();
    store.settings.workoutTemplates.push({ id, label, exerciseIds: [] });
    editingTemplateId = id;
    newTemplateInput.value = '';
    saveStore();
    renderTemplateManageList();
    renderHoy();
  }
  addTemplateBtn.addEventListener('click', addTemplate);
  newTemplateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTemplate(); });

  templateManageList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove-template]');
    const editBtn = e.target.closest('[data-edit-template]');
    if (removeBtn) {
      store.settings.workoutTemplates = store.settings.workoutTemplates.filter((t) => t.id !== removeBtn.dataset.removeTemplate);
      if (editingTemplateId === removeBtn.dataset.removeTemplate) editingTemplateId = null;
      saveStore();
      renderTemplateManageList();
      renderHoy();
    } else if (editBtn) {
      editingTemplateId = editingTemplateId === editBtn.dataset.editTemplate ? null : editBtn.dataset.editTemplate;
      renderTemplateExercisePicker();
    }
  });

  templateExercisePicker.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-template-exercise]');
    if (!btn) return;
    const template = store.settings.workoutTemplates.find((t) => t.id === editingTemplateId);
    if (!template) return;
    const exId = btn.dataset.templateExercise;
    const idx = template.exerciseIds.indexOf(exId);
    if (idx === -1) template.exerciseIds.push(exId);
    else template.exerciseIds.splice(idx, 1);
    saveStore();
    renderTemplateManageList();
    renderHoy();
  });

  renderTemplateManageList();

  /* ============ AJUSTES panel / Metas ============ */
  const goalManageList = document.getElementById('goalManageList');
  const newGoalLabelInput = document.getElementById('newGoalLabelInput');
  const newGoalTargetInput = document.getElementById('newGoalTargetInput');
  const addGoalBtn = document.getElementById('addGoalBtn');

  function renderGoalManageList() {
    const goals = store.settings.goals;
    goalManageList.innerHTML = goals.length ? goals.map((g) => `
      <li class="task-manage-item" data-task-id="${g.id}">
        <span class="task-manage-label">${escapeHtml(g.label)}${g.dueDate ? ` <span class="hint-text" style="display:inline">· hasta ${fmtKeyDate(g.dueDate)}</span>` : ''}</span>
        <input type="number" class="purchase-price-input" data-target-goal="${g.id}" value="${g.target}" min="1" step="1" />
        <button type="button" class="task-remove-btn" data-remove-task="${g.id}" aria-label="Eliminar ${escapeHtml(g.label)}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes metas todavía.</li>';
  }

  const newGoalDateInput = document.getElementById('newGoalDateInput');

  function addGoal() {
    const label = newGoalLabelInput.value.trim();
    if (!label) return;
    const target = parseInt(newGoalTargetInput.value, 10);
    const dueDate = newGoalDateInput.value || null;
    store.settings.goals.push({ id: generateTaskId(), label, target: (!isNaN(target) && target > 0) ? target : 20, dueDate });
    saveStore();
    newGoalLabelInput.value = '';
    newGoalTargetInput.value = '';
    newGoalDateInput.value = '';
    renderGoalManageList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  }

  addGoalBtn.addEventListener('click', addGoal);
  newGoalLabelInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addGoal(); });
  newGoalTargetInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addGoal(); });

  goalManageList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const goalId = btn.dataset.removeTask;
    const label = btn.closest('.task-manage-item').querySelector('.task-manage-label').textContent;
    deleteWithUndo(store.settings.goals, goalId, label, () => {
      renderGoalManageList();
      renderHoy();
      if (activeTab === 'stats') renderStats();
    });
  });

  goalManageList.addEventListener('change', (e) => {
    const input = e.target.closest('[data-target-goal]');
    if (!input) return;
    const goalId = input.dataset.targetGoal;
    const goal = store.settings.goals.find((g) => g.id === goalId);
    if (!goal) return;
    const value = parseInt(input.value, 10);
    goal.target = (!isNaN(value) && value > 0) ? value : 1;
    input.value = goal.target;
    saveStore();
    if (activeTab === 'stats') renderStats();
  });

  renderGoalManageList();

  /* ============ AJUSTES panel / Modo viaje ============ */
  const travelModeToggle = document.getElementById('travelModeToggle');
  travelModeToggle.checked = store.settings.travelModeActive;
  travelModeToggle.addEventListener('change', () => {
    store.settings.travelModeActive = travelModeToggle.checked;
    saveStore();
    renderHoy();
  });

  /* ============ AJUSTES panel / Notifications ============ */
  const reminderToggle = document.getElementById('reminderToggle');
  const reminderTime = document.getElementById('reminderTime');
  const enableNotifBtn = document.getElementById('enableNotifBtn');
  const notifStatus = document.getElementById('notifStatus');

  reminderToggle.checked = !!store.settings.reminderEnabled;
  reminderTime.value = store.settings.reminderTime || '21:00';

  reminderToggle.addEventListener('change', () => {
    store.settings.reminderEnabled = reminderToggle.checked;
    saveStore();
  });
  reminderTime.addEventListener('change', () => {
    store.settings.reminderTime = reminderTime.value;
    saveStore();
  });

  function updateNotifStatus() {
    if (!('Notification' in window)) {
      notifStatus.textContent = 'Estado: las notificaciones no están soportadas en este navegador.';
      return;
    }
    const map = {
      granted: 'Estado: permiso concedido.',
      denied: 'Estado: permiso denegado. Actívalo desde los ajustes del sistema.',
      default: 'Estado: sin permiso solicitado.'
    };
    notifStatus.textContent = map[Notification.permission];
  }
  updateNotifStatus();

  enableNotifBtn.addEventListener('click', () => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(() => updateNotifStatus());
  });

  function isTodayComplete() {
    const entry = getEntry(dateKey(startOfDay(new Date())));
    if (!entry) return false;
    return store.settings.dailyTasks.every((t) => entry[t.id]) && (!teethEnabled() || entry.teeth > 0);
  }

  function checkReminder() {
    if (!store.settings.reminderEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const [h, m] = (store.settings.reminderTime || '21:00').split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    const todayKey = dateKey(now);
    if (now < target || store.lastNotifiedDate === todayKey || isTodayComplete()) return;
    const title = 'Bitácora Diaria';
    const body = 'No olvides rellenar tu bitácora de hoy.';
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, { body, icon: 'icons/icon-192.png' }));
    } else {
      new Notification(title, { body, icon: 'icons/icon-192.png' });
    }
    store.lastNotifiedDate = todayKey;
    saveStore();
  }

  function checkCycleNotice() {
    if (!cicloEnabled() || !store.settings.reminderEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const info = cycleInfo(startOfDay(new Date()));
    if (!info) return;
    const todayKey = dateKey(new Date());
    if (store.lastCycleNotifiedDate === todayKey) return;
    let body = null;
    if (info.daysUntilNext === 2 || info.daysUntilNext === 1) {
      body = `Tu próxima regla está prevista en ${info.daysUntilNext} ${info.daysUntilNext === 1 ? 'día' : 'días'}.`;
    } else if (info.daysUntilNext === 0) {
      body = 'Tu regla debería empezar hoy, según tu ciclo.';
    }
    if (!body) return;
    const title = 'Bitácora Diaria';
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, { body, icon: 'icons/icon-192.png' }));
    } else {
      new Notification(title, { body, icon: 'icons/icon-192.png' });
    }
    store.lastCycleNotifiedDate = todayKey;
    saveStore();
  }

  setInterval(checkReminder, 60000);
  setInterval(checkCycleNotice, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkReminder();
      checkCycleNotice();
    }
  });

  /* ============ Exportar CSV / PDF ============ */
  // Prevents CSV formula injection: a cell whose value starts with = + - @ (or a tab/CR)
  // can be interpreted as a live formula by Excel/Sheets when the file is opened, so a
  // literal apostrophe is prepended to force it to be read as plain text.
  function csvSafeCell(v) {
    let s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  }

  // One column per tracked feature that's actually enabled, so the export always
  // mirrors whatever is switched on in Ajustes instead of a fixed subset of fields.
  function buildExportColumns() {
    const cols = [];
    const dailyTotal = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    cols.push({ header: 'Hábitos', get: (e) => {
      if (dailyTotal === 0) return '';
      let done = 0;
      store.settings.dailyTasks.forEach((t) => { if (e[t.id]) done++; });
      if (teethEnabled() && e.teeth > 0) done++;
      return `${done}/${dailyTotal}`;
    } });
    if (store.settings.supplements.length > 0) {
      cols.push({ header: 'Suplementos', get: (e) => {
        const es = e.supplements || {};
        let done = 0;
        store.settings.supplements.forEach((s) => { if (es[s.id]) done++; });
        return `${done}/${store.settings.supplements.length}`;
      } });
    }
    if (store.settings.badHabits.length > 0) {
      cols.push({ header: 'Malos hábitos', get: (e) => {
        const eb = e.badHabits || {};
        let count = 0;
        store.settings.badHabits.forEach((b) => { if (eb[b.id]) count++; });
        return String(count);
      } });
    }
    if (aguaEnabled()) cols.push({ header: 'Agua (vasos)', get: (e) => e.agua || 0 });
    if (suenoEnabled()) {
      cols.push({ header: 'Horas sueño', get: (e) => e.sleepHours || '' });
      cols.push({ header: 'Calidad sueño', get: (e) => e.sleepQuality || '' });
    }
    if (pesoEnabled()) cols.push({ header: 'Peso (kg)', get: (e) => (e.weight != null ? e.weight : '') });
    if (ayunoEnabled()) cols.push({ header: 'Ayuno (h)', get: (e) => { const h = fastingHours(e); return h > 0 ? h.toFixed(1) : ''; } });
    if (meditacionEnabled()) cols.push({ header: 'Meditación (min)', get: (e) => e.meditationMin || 0 });
    if (lecturaEnabled()) cols.push({ header: 'Lectura (min)', get: (e) => e.readingMin || 0 });
    if (workoutsEnabled()) cols.push({ header: 'Ejercicio (min)', get: (e) => (e.workout && e.workout.durationMin) || 0 });
    if (cicloEnabled()) cols.push({ header: 'Día de regla', get: (e) => (e.periodDay ? 'Sí' : '') });
    if (gratitudEnabled()) cols.push({ header: 'Gratitud', get: (e) => (e.gratitude || []).filter(Boolean).join(' | ') });
    if (energiaEnabled()) {
      cols.push({ header: 'Energía', get: (e) => e.energyLevel || '' });
      cols.push({ header: 'Estrés', get: (e) => e.stressLevel || '' });
    }
    if (ropaEnabled()) cols.push({ header: 'Ropa preparada', get: (e) => (e.outfitPlanned ? 'Sí' : '') });
    if (snacksEnabled()) cols.push({ header: 'Snacks', get: (e) => (e.snacks || []).join(' | ') });
    if (consumoEnabled()) {
      cols.push({ header: 'Cigarrillos', get: (e) => e.cigarettes || 0 });
      if (jointsEnabled()) cols.push({ header: 'Joints', get: (e) => e.joints || 0 });
      store.settings.purchaseItems.forEach((item) => {
        cols.push({ header: item.label || 'Artículo', get: (e) => (e.purchases && e.purchases[item.id]) || 0 });
      });
      cols.push({ header: 'Gasto (€)', get: (e) => {
        let spend = 0;
        store.settings.purchaseItems.forEach((item) => { spend += ((e.purchases && e.purchases[item.id]) || 0) * item.price; });
        if (jointsEnabled()) spend += ((e.joints || 0) / 4) * jointPricePer4();
        return spend.toFixed(2);
      } });
    }
    if (store.settings.goals.length > 0) {
      cols.push({ header: 'Metas cumplidas', get: (e) => {
        const eg = e.goals || {};
        let count = 0;
        store.settings.goals.forEach((g) => { if (eg[g.id]) count++; });
        return `${count}/${store.settings.goals.length}`;
      } });
    }
    cols.push({ header: 'Reflexión', get: (e) => (e.reflection || '').replace(/[\r\n]+/g, ' ') });
    return cols;
  }

  function buildExportData() {
    const cols = buildExportColumns();
    const rows = Object.keys(store.entries).sort().map((key) => ({
      fecha: key,
      values: cols.map((c) => c.get(store.entries[key]))
    }));
    return { cols, rows };
  }

  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const { cols, rows } = buildExportData();
    const header = ['Fecha', ...cols.map((c) => c.header)];
    const lines = [header, ...rows.map((r) => [r.fecha, ...r.values])];
    const csv = lines.map((r) => r.map((v) => csvSafeCell(v)).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-datos-${dateKey(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  document.getElementById('exportPdfBtn').addEventListener('click', () => {
    const { cols, rows } = buildExportData();
    const headerCells = ['Fecha', ...cols.map((c) => c.header)].map((h) => `<th>${escapeHtml(h)}</th>`).join('');
    const bodyRows = rows.map((r) => `<tr><td>${escapeHtml(r.fecha)}</td>${r.values.map((v) => `<td>${escapeHtml(String(v))}</td>`).join('')}</tr>`).join('');
    const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>Bitácora Diaria — resumen</title>
<style>
  @page { size: landscape; margin: 12mm; }
  body{font-family:-apple-system,sans-serif;padding:24px;color:#171b26;}
  h1{font-size:20px;margin-bottom:4px;}
  p{color:#5b6270;font-size:13px;}
  table{border-collapse:collapse;width:100%;font-size:10px;margin-top:16px;}
  th,td{border:1px solid #ccc;padding:4px 6px;text-align:left;white-space:nowrap;}
  th{background:#eee;}
  @media print { body{padding:0;} }
</style></head><body>
<h1>Bitácora Diaria — resumen de datos</h1>
<p>Generado el ${new Date().toLocaleDateString('es-ES')} · ${rows.length} días registrados</p>
<table><thead><tr>${headerCells}</tr></thead>
<tbody>${bodyRows}</tbody></table>
</body></html>`;
    const win = window.open('', '_blank');
    if (!win) { alert('Permite ventanas emergentes para ver la vista de impresión.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  });

  /* ============ Backup / restore ============ */
  const backupReminderHint = document.getElementById('backupReminderHint');
  function updateBackupReminderHint() {
    const last = store.settings.lastBackupDate;
    if (!last) {
      backupReminderHint.hidden = false;
      backupReminderHint.textContent = 'Todavía no has hecho ninguna copia de seguridad. Como todo se guarda solo en este dispositivo, exporta tus datos para no perderlos.';
      return;
    }
    const daysSince = Math.round((startOfDay(new Date()) - startOfDay(new Date(last))) / DAY_MS);
    if (daysSince >= 30) {
      backupReminderHint.hidden = false;
      backupReminderHint.textContent = `Llevas ${daysSince} días sin hacer una copia de seguridad. Exporta tus datos para no perder tu historial.`;
    } else {
      backupReminderHint.hidden = true;
    }
  }

  document.getElementById('exportBtn').addEventListener('click', () => {
    store.settings.lastBackupDate = dateKey(new Date());
    saveStore();
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-backup-${dateKey(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    updateBackupReminderHint();
  });

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = normalizeStore(JSON.parse(reader.result));
        if (!confirm('Esto reemplazará los datos actuales por los del archivo importado. ¿Continuar?')) return;
        store.entries = data.entries;
        store.weeks = data.weeks;
        store.settings = data.settings;
        saveStore();
        renderAll();
        reminderToggle.checked = !!store.settings.reminderEnabled;
        reminderTime.value = store.settings.reminderTime || '21:00';
        updateBackupReminderHint();
        alert('Datos importados correctamente.');
      } catch (e) {
        alert('El archivo no es válido.');
      }
    };
    reader.readAsText(file);
    importFile.value = '';
  });
  updateBackupReminderHint();

  /* ============ Init ============ */
  function renderAll() {
    updateConsumoTabVisibility();
    updateConsumoTabIcon();
    updateDayLabel();
    renderHoy();
    renderComidas();
    renderConsumo();
    if (activeTab === 'stats') renderStats();
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  /* ============ Orden de tarjetas (arrastrar) ============ */
  function applyStoredCardOrder(panel, panelKey) {
    const order = store.settings.cardOrder[panelKey];
    const cards = Array.from(panel.querySelectorAll(':scope > .card[id]'));
    if (!order || !order.length) return;
    const byId = {};
    cards.forEach((c) => { byId[c.id] = c; });
    order.forEach((id) => { if (byId[id]) panel.appendChild(byId[id]); });
    cards.forEach((c) => { if (!order.includes(c.id)) panel.appendChild(c); });
  }

  function attachCardDragHandlers(handle, card, panel, panelKey) {
    let dragging = false;

    function onPointerMove(e) {
      if (!dragging) return;
      const siblings = Array.from(panel.querySelectorAll(':scope > .card[id]')).filter((c) => c !== card);
      const pointerY = e.clientY;
      for (const sib of siblings) {
        const rect = sib.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const cardIsAfter = !!(sib.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING);
        if (pointerY < mid && cardIsAfter) {
          panel.insertBefore(card, sib);
          break;
        } else if (pointerY > mid && !cardIsAfter) {
          panel.insertBefore(card, sib.nextSibling);
          break;
        }
      }
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', endDrag);
      document.removeEventListener('pointercancel', endDrag);
      const newOrder = Array.from(panel.querySelectorAll(':scope > .card[id]')).map((c) => c.id);
      store.settings.cardOrder[panelKey] = newOrder;
      saveStore();
    }

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dragging = true;
      card.classList.add('is-dragging');
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', endDrag);
      document.addEventListener('pointercancel', endDrag);
    });

    // Keyboard alternative to pointer-drag: arrow keys move the card one slot at a
    // time and persist the new order the same way a completed drag does.
    function moveCard(direction) {
      const siblings = Array.from(panel.querySelectorAll(':scope > .card[id]'));
      const idx = siblings.indexOf(card);
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= siblings.length) return;
      if (direction < 0) panel.insertBefore(card, siblings[targetIdx]);
      else panel.insertBefore(card, siblings[targetIdx].nextSibling);
      const newOrder = Array.from(panel.querySelectorAll(':scope > .card[id]')).map((c) => c.id);
      store.settings.cardOrder[panelKey] = newOrder;
      saveStore();
      handle.focus();
    }

    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); moveCard(-1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveCard(1); }
    });
  }

  function initCardReordering() {
    const REORDER_PANELS = ['hoy', 'objetivos', 'comidas', 'consumo', 'stats'];
    REORDER_PANELS.forEach((panelKey) => {
      const panel = document.querySelector(`.tab-panel[data-panel="${panelKey}"]`);
      if (!panel) return;
      applyStoredCardOrder(panel, panelKey);
      Array.from(panel.querySelectorAll(':scope > .card[id]')).forEach((card) => {
        if (card.querySelector(':scope > .card-drag-handle')) return;
        const handle = document.createElement('button');
        handle.type = 'button';
        handle.className = 'card-drag-handle';
        handle.setAttribute('aria-label', 'Reordenar tarjeta: arrastra, o usa las flechas arriba/abajo');
        handle.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="8" cy="6" r="1.4"/><circle cx="16" cy="6" r="1.4"/><circle cx="8" cy="12" r="1.4"/><circle cx="16" cy="12" r="1.4"/><circle cx="8" cy="18" r="1.4"/><circle cx="16" cy="18" r="1.4"/></svg>';
        card.insertBefore(handle, card.firstChild);
        attachCardDragHandlers(handle, card, panel, panelKey);
      });
    });
  }

  function applySeasonalAccent() {
    const month = new Date().getMonth();
    let season;
    if (month === 11 || month === 0 || month === 1) season = 'invierno';
    else if (month >= 2 && month <= 4) season = 'primavera';
    else if (month >= 5 && month <= 7) season = 'verano';
    else season = 'otono';
    document.documentElement.dataset.season = season;
  }

  /* ============ Check-in rápido ============ */
  const checkinOverlay = document.getElementById('checkinOverlay');
  const checkinList = document.getElementById('checkinList');
  const checkinOpenBtn = document.getElementById('checkinOpenBtn');
  const checkinCloseBtn = document.getElementById('checkinCloseBtn');
  let checkinRowsCache = [];

  // Reads the entry read-only (like renderHoy does) so merely opening the sheet
  // never silently creates a stored entry for today — only an actual tap does,
  // via ensureEntry() inside the click handler below.
  function buildCheckinRows() {
    const key = dateKey(currentDate);
    const entry = getEntry(key) || emptyEntry();
    const rows = [];
    store.settings.dailyTasks.forEach((t) => {
      rows.push({ name: t.label, icon: (t.icon && ICONS[t.icon]) || ICONS.default, done: !!entry[t.id], apply: (live) => { live[t.id] = !live[t.id]; } });
    });
    if (teethEnabled()) {
      rows.push({ name: 'Lavarme los dientes', icon: ICONS.teeth, done: (entry.teeth || 0) > 0, apply: (live) => { live.teeth = live.teeth > 0 ? 0 : 1; } });
    }
    store.settings.badHabits.forEach((b) => {
      const bad = entry.badHabits || {};
      rows.push({ name: b.label, icon: (b.icon && ICONS[b.icon]) || ICONS.ban, done: !!bad[b.id], apply: (live) => { live.badHabits = live.badHabits || {}; live.badHabits[b.id] = !live.badHabits[b.id]; } });
    });
    if (supplementsEnabled()) {
      store.settings.supplements.forEach((s) => {
        const sup = entry.supplements || {};
        rows.push({ name: s.label, icon: (s.icon && ICONS[s.icon]) || ICONS.pill, done: !!sup[s.id], apply: (live) => { live.supplements = live.supplements || {}; live.supplements[s.id] = !live.supplements[s.id]; } });
      });
    }
    store.settings.goals.forEach((g) => {
      const gls = entry.goals || {};
      rows.push({ name: g.label, icon: ICONS.star, done: !!gls[g.id], apply: (live) => { live.goals = live.goals || {}; live.goals[g.id] = !live.goals[g.id]; } });
    });
    return rows;
  }

  function renderCheckinList() {
    checkinRowsCache = buildCheckinRows();
    if (checkinRowsCache.length === 0) {
      checkinList.innerHTML = '<li class="checkin-empty">No tienes hábitos configurados todavía. Añádelos en Ajustes.</li>';
      return;
    }
    checkinList.innerHTML = checkinRowsCache.map((r, i) => `
      <li class="checkin-row${r.done ? ' is-done' : ''}">
        <button type="button" class="check-btn${r.done ? ' is-checked' : ''}" data-checkin-toggle="${i}" aria-pressed="${r.done}">
          <span class="check-icon">${CHECK_TICK_SVG}</span>
        </button>
        <span class="checkin-row-icon">${r.icon}</span>
        <span class="checkin-row-name">${escapeHtml(r.name)}</span>
      </li>`).join('');
  }

  checkinList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-checkin-toggle]');
    if (!btn) return;
    const row = checkinRowsCache[parseInt(btn.dataset.checkinToggle, 10)];
    if (!row) return;
    const liveEntry = ensureEntry(dateKey(currentDate));
    row.apply(liveEntry);
    saveStore();
    renderCheckinList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  function openCheckin() {
    renderCheckinList();
    checkinOverlay.hidden = false;
    // Unlike the habit checkboxes (rebuilt on every render, which naturally drops
    // focus), this button is static, so a lingering focus ring after a tap would
    // sit visibly on it indefinitely otherwise.
    checkinOpenBtn.blur();
  }
  function closeCheckin() {
    checkinOverlay.hidden = true;
  }
  checkinOpenBtn.addEventListener('click', openCheckin);
  checkinCloseBtn.addEventListener('click', closeCheckin);
  checkinOverlay.addEventListener('click', (e) => { if (e.target === checkinOverlay) closeCheckin(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !checkinOverlay.hidden) closeCheckin();
  });

  /* ============ Atajos de la app (manifest shortcuts) ============ */
  function applyLaunchShortcut() {
    const shortcut = new URLSearchParams(window.location.search).get('shortcut');
    if (shortcut === 'comidas') {
      switchTab('comidas');
    } else if (shortcut === 'checkin') {
      switchTab('hoy');
      openCheckin();
    } else if (shortcut === 'hoy') {
      switchTab('hoy');
    }
  }

  renderAll();
  checkReminder();
  checkCycleNotice();
  initCardReordering();
  applySeasonalAccent();
  applyThemeMode();
  applyDensityMode();
  applyLaunchShortcut();

  const splashEl = document.getElementById('splash');
  if (splashEl) {
    setTimeout(() => splashEl.classList.add('is-hidden'), 1600);
  }
})();
