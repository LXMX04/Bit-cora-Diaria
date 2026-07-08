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
      tracksTeeth: true,
      jointPricePer4: 4.50,
      dailyTasks: [],
      weeklyTasks: [],
      badHabits: [],
      purchaseItems: []
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { entries: {}, weeks: {}, settings: defaultSettings(), lastNotifiedDate: null };
      const parsed = JSON.parse(raw);
      parsed.entries = parsed.entries || {};
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
      if (!Array.isArray(parsed.settings.purchaseItems)) {
        parsed.settings.purchaseItems = [
          { id: 'packRojo', label: 'Lucky rojo', price: 5.50 },
          { id: 'packBlanco', label: 'Lucky blanco', price: 6.30 }
        ];
        Object.keys(parsed.entries).forEach((key) => {
          const entry = parsed.entries[key];
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
      if (typeof parsed.settings.jointPricePer4 !== 'number' || parsed.settings.jointPricePer4 < 0) {
        parsed.settings.jointPricePer4 = 4.50;
      }
      return parsed;
    } catch (e) {
      return { entries: {}, weeks: {}, settings: defaultSettings(), lastNotifiedDate: null };
    }
  }

  function saveStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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
      meals: {
        desayuno: { time: '', desc: '', health: 0 },
        comida: { time: '', desc: '', health: 0 },
        cena: { time: '', desc: '', health: 0 }
      },
      cigarettes: 0,
      joints: 0,
      purchases: {}
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
        <div class="spend-group-label"${labelStyle}>${g.label}</div>
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
    activeTab = tab;
    tabButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tab));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== tab; });
    daySelector.style.display = (tab === 'stats' || tab === 'ajustes') ? 'none' : 'flex';
    if (tab === 'stats') renderStats();
  }

  tabButtons.forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  const tabBtnConsumo = document.getElementById('tabBtnConsumo');
  function updateConsumoTabVisibility() {
    tabBtnConsumo.hidden = !consumoEnabled();
    if (!consumoEnabled() && activeTab === 'consumo') switchTab('hoy');
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
  document.getElementById('panel-ajustes').addEventListener('click', (e) => {
    const header = e.target.closest('[data-accordion-toggle]');
    if (!header) return;
    const body = header.nextElementSibling;
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!isOpen));
    body.hidden = isOpen;
  });

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

  document.getElementById('prevDay').addEventListener('click', () => {
    currentDate = new Date(currentDate.getTime() - DAY_MS);
    renderAll();
  });
  document.getElementById('nextDay').addEventListener('click', () => {
    currentDate = new Date(currentDate.getTime() + DAY_MS);
    renderAll();
  });

  /* ============ HOY panel ============ */
  const reflectionInput = document.getElementById('reflectionInput');
  const reflectionHint = document.getElementById('reflectionHint');
  const weekRangeEl = document.getElementById('weekRange');
  const weeklyTaskList = document.getElementById('weeklyTaskList');
  const dailyTaskList = document.getElementById('dailyTaskList');

  dailyTaskList.addEventListener('click', (e) => {
    const key = dateKey(currentDate);
    const entry = ensureEntry(key);
    const checkBtn = e.target.closest('[data-check]');
    if (checkBtn) {
      const field = checkBtn.dataset.check;
      entry[field] = !entry[field];
      saveStore();
      renderHoy();
      return;
    }
    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      const delta = parseInt(stepBtn.dataset.step, 10);
      entry.teeth = Math.max(0, (entry.teeth || 0) + delta);
      saveStore();
      renderHoy();
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

  function updateGreeting(entry) {
    const greetingEl = document.getElementById('dayGreeting');
    const today = startOfDay(new Date());
    if (currentDate.getTime() !== today.getTime()) {
      greetingEl.textContent = '';
      return;
    }
    const hour = new Date().getHours();
    const salute = hour < 6 ? 'Buenas noches' : hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
    const dailyTotal = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
    if (dailyTotal === 0) {
      greetingEl.textContent = `${salute}.`;
      return;
    }
    let done = 0;
    store.settings.dailyTasks.forEach((t) => { if (entry[t.id]) done++; });
    if (teethEnabled() && entry.teeth > 0) done++;
    if (done >= dailyTotal) {
      greetingEl.innerHTML = `${salute} — <strong>ya has completado tu día</strong>.`;
    } else {
      const remaining = dailyTotal - done;
      greetingEl.innerHTML = `${salute} — te ${remaining === 1 ? 'falta' : 'faltan'} <strong>${remaining}</strong> ${remaining === 1 ? 'tarea' : 'tareas'} hoy.`;
    }
  }

  function renderHoy() {
    const key = dateKey(currentDate);
    const entry = getEntry(key) || emptyEntry();
    updateGreeting(entry);

    const dailyItemsHtml = store.settings.dailyTasks.map((t) => `
      <li class="habit-row" data-habit="${t.id}">
        <button class="check-btn" data-check="${t.id}" aria-pressed="${!!entry[t.id]}">
          <span class="check-icon">✓</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${t.label}</span>
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
          <span class="check-icon">✓</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${t.label}</span>
          <span class="habit-meta">esta semana</span>
        </div>
      </li>`).join('') : '<li class="task-empty-hint">No tienes tareas semanales. Añade una en Ajustes.</li>';
    weekRangeEl.textContent = weekRangeLabel(currentDate);

    const badHabits = store.settings.badHabits;
    const entryBadHabits = entry.badHabits || {};
    badHabitList.innerHTML = badHabits.length ? badHabits.map((b) => `
      <li class="habit-row" data-habit="${b.id}">
        <button class="check-btn check-btn--bad" data-check-bad="${b.id}" aria-pressed="${!!entryBadHabits[b.id]}">
          <span class="check-icon">✗</span>
        </button>
        <div class="habit-text">
          <span class="habit-name">${b.label}</span>
        </div>
      </li>`).join('') : '<li class="task-empty-hint">No tienes malos hábitos registrados. Añade uno en Ajustes.</li>';

    reflectionInput.value = entry.reflection || '';
    reflectionHint.textContent = 'Guardado automáticamente';
  }

  /* ============ COMIDAS panel ============ */
  const mealInputs = document.querySelectorAll('[data-meal-time], [data-meal-desc]');

  mealInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      const mealTime = input.dataset.mealTime;
      const mealDesc = input.dataset.mealDesc;
      if (mealTime) entry.meals[mealTime].time = input.value;
      if (mealDesc) entry.meals[mealDesc].desc = input.value;
      saveStore();
    });
  });

  const healthScales = document.querySelectorAll('.health-scale');

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
    });
  }

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
          <span class="consumo-name"><span class="consumo-swatch" style="background:${color}"></span>${item.label}</span>
          <span class="consumo-price">${formatEuro(item.price)}/unidad</span>
        </div>
        <div class="stepper stepper--lg" data-stepper="${item.id}">
          <button class="stepper-btn" data-step="-1" aria-label="Restar ${item.label}">–</button>
          <span class="stepper-value">${(entry.purchases && entry.purchases[item.id]) || 0}</span>
          <button class="stepper-btn" data-step="1" aria-label="Sumar ${item.label}">+</button>
        </div>
      </div>`;
    }).join('');
  }

  function monthPurchaseSpend(itemId, price, year, monthIndex, lastDay) {
    let sum = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntry(dateKey(new Date(year, monthIndex, d)));
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
      const entry = getEntry(dateKey(new Date(year, monthIndex, d)));
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
      const key = dateKey(new Date(year, monthIndex, d));
      const entry = getEntry(key);
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
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.6 2.6L16.2 9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function buildHabitsList() {
    const list = store.settings.dailyTasks.map((t) => ({
      field: t.id, icon: ICONS[t.id] || ICONS.default, name: t.label
    }));
    if (teethEnabled()) list.push({ field: 'teeth', icon: ICONS.teeth, name: 'Dientes' });
    store.settings.badHabits.forEach((b) => {
      list.push({ field: b.id, icon: ICONS.ban, name: b.label, invert: true });
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

  function ringSVG(pct) {
    const r = 26, c = 2 * Math.PI * r;
    const filled = (Math.max(0, Math.min(100, pct)) / 100) * c;
    return `
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--border)" stroke-width="6"/>
        <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--accent)" stroke-width="6"
          stroke-linecap="round" stroke-dasharray="${filled} ${c}"
          transform="rotate(-90 32 32)"/>
      </svg>`;
  }

  /* ---- Health color gradient (nada saludable -> muy saludable) ---- */
  function currentTheme() {
    const override = document.documentElement.dataset.theme;
    if (override === 'dark' || override === 'light') return override;
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

  function buildHeatmapRows() {
    const dailyRows = store.settings.dailyTasks.map((t, i) => ({
      key: t.id, label: t.label, type: 'daily', color: dailyTaskColor(i)
    }));
    const weeklyRows = store.settings.weeklyTasks.map((t, i) => ({
      key: t.id, label: t.label, type: 'weekly', color: weeklyTaskColor(i), groupStart: i === 0
    }));
    const badHabitRows = store.settings.badHabits.map((b, i) => ({
      key: b.id, label: b.label, type: 'badHabit', color: 'var(--danger)', groupStart: i === 0
    }));
    return [
      ...dailyRows,
      ...(teethEnabled() ? [{ key: 'teeth', label: 'Dientes', type: 'daily', color: 'var(--h-teeth)' }] : []),
      { key: 'health', label: 'Alimentación', type: 'health', groupStart: true },
      ...weeklyRows,
      ...badHabitRows,
      { key: 'total', label: 'Total', type: 'total', color: 'var(--h-total)', groupStart: true },
      ...(consumoEnabled() ? [
        { key: 'cigarettes', label: 'Cigarros', type: 'consumo', color: 'var(--h-cig)', groupStart: true },
        ...(jointsEnabled() ? [{ key: 'joints', label: 'Joints', type: 'consumo', color: 'var(--h-joint)' }] : []),
        ...store.settings.purchaseItems.map((item, i) => ({
          key: item.id, label: item.label, type: 'consumo', color: purchaseColor(i)
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
      return dayInfo[row.key] ? `background:${row.color}` : '';
    }
    if (row.type === 'total') {
      if (dayInfo.total === 0) return '';
      const totalMax = store.settings.dailyTasks.length + (teethEnabled() ? 1 : 0);
      const pct = 25 + (dayInfo.total / totalMax) * 75;
      return `background:color-mix(in srgb, ${row.color} ${pct.toFixed(0)}%, var(--surface-alt))`;
    }
    if (row.type === 'health') {
      if (!dayInfo.health) return '';
      return `background:${healthColor(dayInfo.health)}`;
    }
    // consumo
    const max = maxByKey[row.key] || 0;
    const val = dayInfo[row.key];
    if (!val || max <= 0) return '';
    const pct = 25 + (val / max) * 75;
    return `background:color-mix(in srgb, ${row.color} ${pct.toFixed(0)}%, var(--surface-alt))`;
  }

  function heatmapCellText(row, dayInfo) {
    if (row.type === 'badHabit') return dayInfo[row.key] ? '✗' : '';
    if (row.type === 'daily' || row.type === 'weekly') return dayInfo[row.key] ? '✓' : '';
    if (row.type === 'total') return dayInfo.total > 0 ? String(dayInfo.total) : '';
    if (row.type === 'health') return dayInfo.health > 0 ? dayInfo.health.toFixed(1) : '';
    return dayInfo[row.key] > 0 ? String(dayInfo[row.key]) : '';
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
        itemHtml = `<span class="legend-item"><span class="legend-gradient" style="background:${gradient}"></span>${r.label} (nada → muy saludable)</span>`;
      } else {
        const suffix = r.type === 'weekly' ? ' (semanal)' : '';
        itemHtml = `<span class="legend-item"><span class="dot" style="background:${r.color}"></span>${r.label}${suffix}</span>`;
      }
      if (i === 0) legendHtml += '<div class="legend-group">';
      else if (r.groupStart) legendHtml += '</div><div class="legend-group legend-group--gap">';
      legendHtml += itemHtml;
    });
    legendHtml += '</div>';
    heatmapLegend.innerHTML = legendHtml;

    // Grid
    const labelsHtml = HEATMAP_ROWS.map((r) => `<div class="heatmap-label${r.groupStart ? ' heatmap-label--gap' : ''}" title="${r.label}">${r.label}</div>`).join('');
    heatmapWrap.innerHTML = `
      <div class="heatmap-labels">${labelsHtml}</div>
      <div class="heatmap-scroll">
        ${HEATMAP_ROWS.map((r) => `
          <div class="heatmap-row${r.groupStart ? ' heatmap-row--gap' : ''}">
            ${days.map((d) => {
              const isFuture = d.day > lastDay;
              const style = isFuture ? '' : heatmapCellStyle(r, d, maxByKey);
              return `<button type="button" class="heatmap-cell${isFuture ? ' is-future' : ''}" style="${style}" data-day="${d.day}" data-year="${year}" data-month="${monthIndex}" ${isFuture ? 'disabled' : ''} aria-label="${r.label} día ${d.day}"></button>`;
            }).join('')}
          </div>`).join('')}
        <div class="heatmap-daynums">
          ${days.map((d) => `<span class="heatmap-daynum">${d.day % 5 === 0 || d.day === 1 ? d.day : ''}</span>`).join('')}
        </div>
      </div>`;

    // Table
    const theadDays = days.map((d) => `<th>${d.day}</th>`).join('');
    const tbodyRows = HEATMAP_ROWS.map((r) => `
      <tr><th>${r.label}</th>${days.map((d) => `<td>${heatmapCellText(r, d)}</td>`).join('')}</tr>`).join('');
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
      const key = dateKey(new Date(year, monthIndex, d));
      const entry = getEntry(key);
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
    const year = statsMonth.getFullYear(), monthIndex = statsMonth.getMonth();
    monthLabel.textContent = `${MONTHS_LONG[monthIndex]} ${year}`;

    const lastDay = monthDayRange(year, monthIndex);

    renderHeatmap(year, monthIndex, lastDay);
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
        const key = dateKey(new Date(year, monthIndex, d));
        const entry = getEntry(key);
        if (!entry) continue;
        let ok;
        if (h.field === 'teeth') ok = entry.teeth > 0;
        else if (h.invert) ok = !(entry.badHabits && entry.badHabits[h.field]);
        else ok = !!entry[h.field];
        if (ok) done++;
      }
      const pct = lastDay > 0 ? (done / lastDay) * 100 : 0;
      const tile = document.createElement('div');
      tile.className = 'ring-tile';
      tile.innerHTML = `${ringSVG(pct)}<span class="ring-pct">${Math.round(pct)}%</span><span class="ring-name"><span class="ring-icon">${h.icon}</span>${h.name}</span>`;
      ringsGrid.appendChild(tile);
    });

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
          <span class="bar-name">${w.label}</span>
          <span class="bar-frac">${done}/${total}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>`;
      weeklyBars.appendChild(row);
    });

    const showConsumo = consumoEnabled();
    document.getElementById('consumoChartCard').hidden = !showConsumo;
    document.getElementById('compareCard').hidden = !showConsumo;
    document.getElementById('statsSpendCard').hidden = !showConsumo;
    if (showConsumo) {
      renderConsumoChart(year, monthIndex, lastDay);
      renderCompare(year, monthIndex);
      renderTobaccoSpendStats(year, monthIndex, lastDay);
    }
  }

  function renderTobaccoSpendStats(year, monthIndex, lastDay) {
    updateJointPriceHints();
    renderSpendGroups(
      document.getElementById('statsSpendGroups'),
      year, monthIndex, lastDay,
      `en ${MONTHS_LONG[monthIndex]}`, `en ${year}`
    );
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
      const key = dateKey(new Date(year, monthIndex, d));
      const entry = getEntry(key);
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
        <span class="task-manage-label">${t.label}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${t.id}" aria-label="Eliminar ${t.label}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes tareas diarias todavía.</li>';
  }

  function addDailyTask() {
    const label = newDailyTaskInput.value.trim();
    if (!label) return;
    store.settings.dailyTasks.push({ id: generateTaskId(), label });
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
    store.settings.dailyTasks = store.settings.dailyTasks.filter((t) => t.id !== taskId);
    saveStore();
    renderDailyTaskManageList();
    renderHoy();
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
        <span class="task-manage-label">${t.label}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${t.id}" aria-label="Eliminar ${t.label}">×</button>
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
    store.settings.weeklyTasks = store.settings.weeklyTasks.filter((t) => t.id !== taskId);
    saveStore();
    renderWeeklyTaskManageList();
    renderHoy();
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
        <span class="task-manage-label">${h.label}</span>
        <button type="button" class="task-remove-btn" data-remove-task="${h.id}" aria-label="Eliminar ${h.label}">×</button>
      </li>`).join('') : '<li class="task-empty-hint">No tienes malos hábitos todavía.</li>';
  }

  function addBadHabit() {
    const label = newBadHabitInput.value.trim();
    if (!label) return;
    store.settings.badHabits.push({ id: generateTaskId(), label });
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
    store.settings.badHabits = store.settings.badHabits.filter((h) => h.id !== taskId);
    saveStore();
    renderBadHabitManageList();
    renderHoy();
    if (activeTab === 'stats') renderStats();
  });

  renderBadHabitManageList();

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
  tracksJointsToggle.checked = jointsEnabled();
  tracksJointsToggle.addEventListener('change', () => {
    store.settings.tracksJoints = tracksJointsToggle.checked;
    saveStore();
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
        <span class="task-manage-label">${p.label}</span>
        <input type="number" class="purchase-price-input" data-price-item="${p.id}" value="${p.price.toFixed(2)}" min="0" step="0.01" />
        <button type="button" class="task-remove-btn" data-remove-task="${p.id}" aria-label="Eliminar ${p.label}">×</button>
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
    store.settings.purchaseItems = store.settings.purchaseItems.filter((p) => p.id !== itemId);
    saveStore();
    renderPurchaseManageList();
    updateJointPriceHints();
    renderConsumo();
    if (activeTab === 'stats') renderStats();
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

  setInterval(checkReminder, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkReminder(); });

  /* ============ Backup / restore ============ */
  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-backup-${dateKey(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!confirm('Esto reemplazará los datos actuales por los del archivo importado. ¿Continuar?')) return;
        store.entries = data.entries || {};
        store.weeks = data.weeks || {};
        store.settings = data.settings || store.settings;
        saveStore();
        renderAll();
        reminderToggle.checked = !!store.settings.reminderEnabled;
        reminderTime.value = store.settings.reminderTime || '21:00';
        alert('Datos importados correctamente.');
      } catch (e) {
        alert('El archivo no es válido.');
      }
    };
    reader.readAsText(file);
    importFile.value = '';
  });

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

  renderAll();
  checkReminder();
})();
