(function () {
  'use strict';

  /* ============ Storage ============ */
  const STORAGE_KEY = 'bitacora_v1';

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { entries: {}, weeks: {}, settings: { reminderEnabled: false, reminderTime: '21:00' }, lastNotifiedDate: null };
      const parsed = JSON.parse(raw);
      parsed.entries = parsed.entries || {};
      parsed.weeks = parsed.weeks || {};
      parsed.settings = parsed.settings || { reminderEnabled: false, reminderTime: '21:00' };
      return parsed;
    } catch (e) {
      return { entries: {}, weeks: {}, settings: { reminderEnabled: false, reminderTime: '21:00' }, lastNotifiedDate: null };
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
      meals: {
        desayuno: { time: '', desc: '', health: 0 },
        comida: { time: '', desc: '', health: 0 },
        cena: { time: '', desc: '', health: 0 }
      },
      cigarettes: 0,
      joints: 0,
      packRojo: 0,
      packBlanco: 0
    };
  }

  const PACK_PRICES = { packRojo: 5.50, packBlanco: 6.30 };

  function formatEuro(n) {
    return `${n.toFixed(2).replace('.', ',')} €`;
  }

  function getEntry(key) {
    return store.entries[key] || null;
  }

  function ensureEntry(key) {
    if (!store.entries[key]) store.entries[key] = emptyEntry();
    return store.entries[key];
  }

  function getWeek(key) {
    return store.weeks[key] || { abuelos: false, abuela: false };
  }

  function ensureWeek(key) {
    if (!store.weeks[key]) store.weeks[key] = { abuelos: false, abuela: false };
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
  const checkBtns = document.querySelectorAll('[data-check]');
  const weekCheckBtns = document.querySelectorAll('[data-check-week]');
  const teethValueEl = document.getElementById('teethValue');
  const reflectionInput = document.getElementById('reflectionInput');
  const reflectionHint = document.getElementById('reflectionHint');
  const weekRangeEl = document.getElementById('weekRange');

  checkBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      const field = btn.dataset.check;
      entry[field] = !entry[field];
      saveStore();
      renderHoy();
    });
  });

  weekCheckBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const wk = isoWeekKey(currentDate);
      const week = ensureWeek(wk);
      const field = btn.dataset.checkWeek;
      week[field] = !week[field];
      saveStore();
      renderHoy();
    });
  });

  document.querySelectorAll('[data-stepper="teeth"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      const delta = parseInt(btn.dataset.step, 10);
      entry.teeth = Math.max(0, (entry.teeth || 0) + delta);
      saveStore();
      renderHoy();
    });
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

  function renderHoy() {
    const key = dateKey(currentDate);
    const entry = getEntry(key) || emptyEntry();
    checkBtns.forEach((btn) => {
      const field = btn.dataset.check;
      btn.setAttribute('aria-pressed', String(!!entry[field]));
    });
    teethValueEl.textContent = entry.teeth || 0;

    const wk = isoWeekKey(currentDate);
    const week = getWeek(wk);
    weekCheckBtns.forEach((btn) => {
      const field = btn.dataset.checkWeek;
      btn.setAttribute('aria-pressed', String(!!week[field]));
    });
    weekRangeEl.textContent = weekRangeLabel(currentDate);

    reflectionInput.value = entry.reflection || '';
    reflectionHint.textContent = 'Guardado automáticamente';

    renderReminderPreview();
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
  const packRojoValueEl = document.getElementById('packRojoValue');
  const packBlancoValueEl = document.getElementById('packBlancoValue');

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

  document.querySelectorAll('[data-stepper="packRojo"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.packRojo = Math.max(0, (entry.packRojo || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderConsumo();
    });
  });

  document.querySelectorAll('[data-stepper="packBlanco"] .stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = dateKey(currentDate);
      const entry = ensureEntry(key);
      entry.packBlanco = Math.max(0, (entry.packBlanco || 0) + parseInt(btn.dataset.step, 10));
      saveStore();
      renderConsumo();
    });
  });

  function monthPackSpend(year, monthIndex, lastDay) {
    let sum = 0;
    for (let d = 1; d <= lastDay; d++) {
      const entry = getEntry(dateKey(new Date(year, monthIndex, d)));
      if (!entry) continue;
      sum += (entry.packRojo || 0) * PACK_PRICES.packRojo + (entry.packBlanco || 0) * PACK_PRICES.packBlanco;
    }
    return sum;
  }

  function yearPackSpend(year) {
    let sum = 0;
    for (let m = 0; m <= 11; m++) {
      sum += monthPackSpend(year, m, monthDayRange(year, m));
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
    packRojoValueEl.textContent = entry.packRojo || 0;
    packBlancoValueEl.textContent = entry.packBlanco || 0;

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

    document.getElementById('spendMonth').textContent = formatEuro(monthPackSpend(y, m, monthDayRange(y, m)));
    document.getElementById('spendYear').textContent = formatEuro(yearPackSpend(y));
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

  const HABITS = [
    { field: 'exercise', icon: '🏋️', name: 'Ejercicio' },
    { field: 'read', icon: '📖', name: 'Leer' },
    { field: 'test', icon: '🚗', name: 'Test' },
    { field: 'teeth', icon: '🦷', name: 'Dientes' }
  ];

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

  const HEATMAP_ROWS = [
    { key: 'exercise', label: 'Ejercicio', type: 'daily', color: 'var(--h-exercise)' },
    { key: 'read', label: 'Leer', type: 'daily', color: 'var(--h-read)' },
    { key: 'test', label: 'Autoescuela', type: 'daily', color: 'var(--h-test)' },
    { key: 'teeth', label: 'Dientes', type: 'daily', color: 'var(--h-teeth)' },
    { key: 'health', label: 'Alimentación', type: 'health', groupStart: true },
    { key: 'abuelos', label: 'Abuelos', type: 'weekly', color: 'var(--h-abuelos)', groupStart: true },
    { key: 'abuela', label: 'Abuela', type: 'weekly', color: 'var(--h-abuela)' },
    { key: 'total', label: 'Total', type: 'total', color: 'var(--h-total)', groupStart: true },
    { key: 'cigarettes', label: 'Cigarros', type: 'consumo', color: 'var(--h-cig)', groupStart: true },
    { key: 'joints', label: 'Joints', type: 'consumo', color: 'var(--h-joint)' },
    { key: 'packRojo', label: 'Lucky rojo', type: 'consumo', color: 'var(--h-pack-rojo)' },
    { key: 'packBlanco', label: 'Lucky blanco', type: 'consumo', color: 'var(--h-pack-blanco)' }
  ];

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
      const daily = {
        exercise: !!(entry && entry.exercise),
        read: !!(entry && entry.read),
        test: !!(entry && entry.test),
        teeth: !!(entry && entry.teeth > 0)
      };
      const total = (daily.exercise ? 1 : 0) + (daily.read ? 1 : 0) + (daily.test ? 1 : 0) + (daily.teeth ? 1 : 0);
      const healthVals = [];
      if (entry && entry.meals) {
        ['desayuno', 'comida', 'cena'].forEach((meal) => {
          const h = entry.meals[meal] && entry.meals[meal].health;
          if (h) healthVals.push(h);
        });
      }
      const health = healthVals.length ? healthVals.reduce((a, b) => a + b, 0) / healthVals.length : 0;
      days.push({
        day: d,
        exercise: daily.exercise,
        read: daily.read,
        test: daily.test,
        teeth: daily.teeth,
        health,
        abuelos: !!week.abuelos,
        abuela: !!week.abuela,
        total,
        cigarettes: entry ? (entry.cigarettes || 0) : 0,
        joints: entry ? (entry.joints || 0) : 0,
        packRojo: entry ? (entry.packRojo || 0) : 0,
        packBlanco: entry ? (entry.packBlanco || 0) : 0
      });
    }
    return days;
  }

  function heatmapCellStyle(row, dayInfo, maxByKey) {
    if (row.type === 'daily' || row.type === 'weekly') {
      return dayInfo[row.key] ? `background:${row.color}` : '';
    }
    if (row.type === 'total') {
      if (dayInfo.total === 0) return '';
      const pct = 25 + (dayInfo.total / 4) * 75;
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
    if (row.type === 'daily' || row.type === 'weekly') return dayInfo[row.key] ? '✓' : '';
    if (row.type === 'total') return dayInfo.total > 0 ? String(dayInfo.total) : '';
    if (row.type === 'health') return dayInfo.health > 0 ? dayInfo.health.toFixed(1) : '';
    return dayInfo[row.key] > 0 ? String(dayInfo[row.key]) : '';
  }

  function renderHeatmap(year, monthIndex, lastDay) {
    const totalDays = daysInMonth(year, monthIndex);
    const days = buildDayData(year, monthIndex, totalDays);
    const maxByKey = {};
    HEATMAP_ROWS.filter((r) => r.type === 'consumo').forEach((r) => {
      maxByKey[r.key] = Math.max(0, ...days.slice(0, lastDay).map((d) => d[r.key]));
    });

    // Legend
    heatmapLegend.innerHTML = HEATMAP_ROWS.filter((r) => r.type !== 'total').map((r) => {
      if (r.type === 'health') {
        const gradient = `linear-gradient(to right, ${healthColor(1)}, ${healthColor(3)}, ${healthColor(5)})`;
        return `<span class="legend-item"><span class="legend-gradient" style="background:${gradient}"></span>${r.label} (nada → muy saludable)</span>`;
      }
      const suffix = r.type === 'weekly' ? ' (semanal)' : '';
      return `<span class="legend-item"><span class="dot" style="background:${r.color}"></span>${r.label}${suffix}</span>`;
    }).join('');

    // Grid
    const labelsHtml = HEATMAP_ROWS.map((r) => `<div class="heatmap-label${r.groupStart ? ' heatmap-label--gap' : ''}">${r.label}</div>`).join('');
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
    HABITS.forEach((h) => {
      let done = 0;
      for (let d = 1; d <= lastDay; d++) {
        const key = dateKey(new Date(year, monthIndex, d));
        const entry = getEntry(key);
        if (!entry) continue;
        if (h.field === 'teeth' ? entry.teeth > 0 : entry[h.field]) done++;
      }
      const pct = lastDay > 0 ? (done / lastDay) * 100 : 0;
      const tile = document.createElement('div');
      tile.className = 'ring-tile';
      tile.innerHTML = `${ringSVG(pct)}<span class="ring-pct">${Math.round(pct)}%</span><span class="ring-name">${h.icon} ${h.name}</span>`;
      ringsGrid.appendChild(tile);
    });

    // Weekly tasks bars
    const weekKeys = new Set();
    for (let d = 1; d <= daysInMonth(year, monthIndex); d++) {
      const day = new Date(year, monthIndex, d);
      if (day > startOfDay(new Date())) continue;
      weekKeys.add(isoWeekKey(day));
    }
    weeklyBars.innerHTML = '';
    [{ field: 'abuelos', name: 'Ver a mis abuelos' }, { field: 'abuela', name: 'Ver a mi abuela' }].forEach((w) => {
      let done = 0;
      weekKeys.forEach((wk) => { if (getWeek(wk)[w.field]) done++; });
      const total = weekKeys.size;
      const pct = total > 0 ? (done / total) * 100 : 0;
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <div class="bar-row-top">
          <span class="bar-name">${w.name}</span>
          <span class="bar-frac">${done}/${total}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>`;
      weeklyBars.appendChild(row);
    });

    renderConsumoChart(year, monthIndex, lastDay);
    renderCompare(year, monthIndex);
    renderTobaccoSpendStats(year, monthIndex, lastDay);
  }

  function renderTobaccoSpendStats(year, monthIndex, lastDay) {
    document.getElementById('statsSpendMonth').textContent = formatEuro(monthPackSpend(year, monthIndex, lastDay));
    document.getElementById('statsSpendMonthLabel').textContent = `en ${MONTHS_LONG[monthIndex]}`;
    document.getElementById('statsSpendYear').textContent = formatEuro(yearPackSpend(year));
    document.getElementById('statsSpendYearLabel').textContent = `en ${year}`;
  }

  function renderConsumoChart(year, monthIndex, lastDay) {
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
        const cig = entry.cigarettes || 0, joint = entry.joints || 0;
        data.push({ cig, joint });
        sumTotal += cig + joint;
        countLogged++;
      } else {
        data.push(undefined);
      }
    }
    const avg = countLogged > 0 ? sumTotal / countLogged : 0;
    const maxVal = Math.max(1, ...data.map((x) => (x ? x.cig + x.joint : 0)));

    const W = 340, H = 150, padL = 22, padR = 8, padT = 10, padB = 20;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const barGap = 2;
    const barW = Math.max(2, plotW / totalDays - barGap);

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

    consumoChart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${bars}${avgLine}${ticks}</svg>`;
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
    [{ label: 'Cigarros / día', cur: cur.cig, prev: prev.cig }, { label: 'Joints / día', cur: cur.joint, prev: prev.joint }].forEach((item) => {
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

  const DAILY_TASK_NOUNS = {
    exercise: 'hacer ejercicio',
    read: 'leer un rato',
    test: 'el test de autoescuela',
    teeth: 'lavarte los dientes'
  };

  const WEEKLY_REMINDERS = {
    abuelos: [
      'Félix y Carmina te echan de menos. Ve a verlos esta semana.',
      'Aún no has visto a Félix y Carmina esta semana.'
    ],
    abuela: [
      'Luchi te echa de menos esta semana.',
      'Aún no has visto a Luchi esta semana — ¿te pasas por allí?'
    ]
  };

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function joinSpanishList(items) {
    if (items.length <= 1) return items[0] || '';
    return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
  }

  function missingDailyTasks(entry) {
    return Object.keys(DAILY_TASK_NOUNS).filter((key) => {
      if (key === 'teeth') return !(entry && entry.teeth > 0);
      return !(entry && entry[key]);
    }).map((key) => DAILY_TASK_NOUNS[key]);
  }

  function buildDailyReminderMessage(missing) {
    if (missing.length === 0) return null;
    if (missing.length === 1) {
      const noun = missing[0];
      return pickRandom([
        `¡Vamos! Solo te queda ${noun} y completas tus tareas de hoy.`,
        `Estás a un paso: únicamente falta ${noun}.`,
        `Casi lo tienes — solo ${noun} y listo.`
      ]);
    }
    const list = joinSpanishList(missing);
    return pickRandom([
      `Aún no has completado tus tareas diarias. Te faltan: ${list}.`,
      `Hoy todavía tienes pendiente: ${list}. ¡A por ello!`,
      `Se acaba el día y aún tienes pendiente: ${list}.`
    ]);
  }

  function missingWeeklyMessages(week) {
    return Object.keys(WEEKLY_REMINDERS)
      .filter((key) => !week[key])
      .map((key) => pickRandom(WEEKLY_REMINDERS[key]));
  }

  function buildReminderBody() {
    const today = startOfDay(new Date());
    const entry = getEntry(dateKey(today));
    const dailyMsg = buildDailyReminderMessage(missingDailyTasks(entry));
    const week = getWeek(isoWeekKey(today));
    const weeklyLines = missingWeeklyMessages(week);
    const parts = [dailyMsg, ...weeklyLines].filter(Boolean);
    return parts.length ? parts.join('\n') : null;
  }

  const reminderPreview = document.getElementById('reminderPreview');

  function renderReminderPreview() {
    if (!reminderPreview) return;
    const body = buildReminderBody();
    reminderPreview.textContent = body || 'Todo listo por hoy — no hay recordatorios pendientes.';
  }

  function checkReminder() {
    if (!store.settings.reminderEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const [h, m] = (store.settings.reminderTime || '21:00').split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    const todayKey = dateKey(now);
    if (now < target || store.lastNotifiedDate === todayKey) return;
    const body = buildReminderBody();
    if (!body) return;
    const title = 'Bitácora Diaria';
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
