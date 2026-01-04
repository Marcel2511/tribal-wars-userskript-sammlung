// ==UserScript==
// @name         Inc DC Reminder via Webhook (UI)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Sendet Discord-Nachricht bei Inc-Erhöhung über Wehhook
// @author       Marcel Wollbaum
// @match        https://*.die-staemme.de/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // -----------------------------
  // Persistente Settings
  // -----------------------------
  const SETTINGS = {
    webhookURL: { key: 'webhookURL', def: '' },
    intervalMs: { key: 'intervalMs', def: 10000 },
    autoStart:  { key: 'autoStart',  def: false },
    uiVisible:  { key: '__ui_visible', def: true },
    uiMin:      { key: '__ui_minimized', def: true }, // default minimiert
  };

  const Store = {
    get(n) { return GM_getValue(SETTINGS[n].key, SETTINGS[n].def); },
    set(n, v) { GM_setValue(SETTINGS[n].key, v); },
  };

  // -----------------------------
  // Runtime
  // -----------------------------
  let intervalId = null;
  let lastSentValue = 0;

  function getSpielerName() {
    const el = document.querySelector('a[href*="screen=ranking"]');
    return el ? el.textContent.trim() : 'Unbekannt';
  }

  function isValidDiscordWebhook(url) {
    return typeof url === 'string' && url.startsWith('https://discord.com/api/webhooks/');
  }

  async function sendToDiscord(value, { isTest = false } = {}) {
    const webhookURL = Store.get('webhookURL');
    if (!webhookURL || !isValidDiscordWebhook(webhookURL)) {
      setStatus('Webhook fehlt oder ungültig.');
      return;
    }

    const spielerName = getSpielerName();
    const payload = {
      content: isTest
        ? `Testnachricht – ${spielerName}`
        : `Neuer Inc – ${spielerName} – Gesamtanzahl: ${value}`,
      username: 'Incs-Bot',
      avatar_url: 'https://i.imgur.com/4M34hi2.png'
    };

    try {
      const res = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus(isTest ? 'Testnachricht gesendet.' : `Gesendet: Inc=${value}`);
    } catch (e) {
      setStatus(`Fehler beim Senden: ${String(e.message || e)}`);
    }
  }

  function checkValue() {
    const p = document.getElementById('incomings_amount');
    if (!p) return;

    const x = parseInt(p.textContent.trim(), 10);
    if (Number.isNaN(x)) return;

    if (x > 0 && x > lastSentValue) {
      sendToDiscord(x);
      lastSentValue = x;
      updateLastSeen(x);
    } else if (x < lastSentValue) {
      lastSentValue = x;
      updateLastSeen(x);
    }
  }

  function startInterval() {
    const webhookURL = Store.get('webhookURL');
    if (!webhookURL) {
      setStatus('Bitte Webhook setzen.');
      return;
    }
    if (!isValidDiscordWebhook(webhookURL)) {
      setStatus('Webhook wirkt ungültig (prüfe URL).');
      return;
    }

    stopInterval();
    intervalId = setInterval(checkValue, Store.get('intervalMs'));
    updateRunningState(true);
    setStatus(`Läuft (${Math.round(Store.get('intervalMs') / 1000)}s)`);
  }

  function stopInterval() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    updateRunningState(false);
    setStatus('Gestoppt');
  }

  // -----------------------------
  // Scoped Dark UI Styles (WICHTIG: alles unter #incbot-panel / #incbot-toggle)
  // -----------------------------
  GM_addStyle(`
    /* Panel-scope Variablen */
    #incbot-panel, #incbot-toggle {
      --inc-bg: #1e1f22;
      --inc-surface: #2b2d31;
      --inc-surface2: #313338;
      --inc-border: #3f4147;
      --inc-text: #e6e6e6;
      --inc-muted: #a0a3a8;
      --inc-input: #202225;
      --inc-hover: #3a3d42;

      /* sehr dezente Status-Unterscheidung */
      --inc-run: #26322a;   /* dunkles grün-grau */
      --inc-stop: #2a2424;  /* dunkles rot-grau */
    }

    /* Toggle */
    #incbot-toggle {
      position: fixed;
      right: 12px;
      bottom: 12px;
      padding: 6px 10px;
      border-radius: 8px;
      background: var(--inc-surface) !important;
      border: 1px solid var(--inc-border) !important;
      color: var(--inc-text) !important;
      font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif !important;
      cursor: pointer;
      z-index: 2147483647;
      user-select: none;
    }

    /* Panel */
    #incbot-panel {
      position: fixed;
      right: 12px;
      bottom: 48px;
      width: 330px;
      background: var(--inc-bg) !important;
      border: 1px solid var(--inc-border) !important;
      border-radius: 10px;
      color: var(--inc-text) !important;
      font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif !important;
      z-index: 2147483647;
      overflow: hidden;
    }

    /* Alles im Panel neutralisieren, damit Seite nicht reinfunkt */
    #incbot-panel * {
      box-sizing: border-box !important;
      font-family: inherit !important;
      letter-spacing: normal !important;
      text-shadow: none !important;
    }

    #incbot-header {
      padding: 8px 10px;
      background: var(--inc-surface) !important;
      border-bottom: 1px solid var(--inc-border) !important;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    #incbot-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700 !important;
      color: var(--inc-text) !important;
    }

    #incbot-statuspill {
      font-weight: 600 !important;
      font-size: 11px !important;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid var(--inc-border) !important;
      background: var(--inc-surface2) !important;
      color: var(--inc-muted) !important;
    }

    /* Minimiert: Header bekommt leichte Tönung */
    #incbot-panel.min.state-running #incbot-header { background: var(--inc-run) !important; }
    #incbot-panel.min.state-stopped #incbot-header { background: var(--inc-stop) !important; }

    #incbot-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    #incbot-actions button {
      appearance: none !important;
      background: transparent !important;
      border: 1px solid var(--inc-border) !important;
      color: var(--inc-text) !important;
      padding: 3px 7px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      font-size: 12px !important;
      line-height: 1.1 !important;
    }
    #incbot-actions button:hover { background: var(--inc-hover) !important; }

    #incbot-body { padding: 10px; }
    #incbot-panel.min #incbot-body { display: none; }

    .incbot-row {
      display: grid;
      grid-template-columns: 1fr 160px;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }

    .incbot-label {
      color: var(--inc-muted) !important;
    }

    /* Inputs (SCOPED) */
    #incbot-panel input[type="text"],
    #incbot-panel input[type="number"] {
      appearance: none !important;
      background: var(--inc-input) !important;
      border: 1px solid var(--inc-border) !important;
      color: var(--inc-text) !important;
      padding: 6px 8px !important;
      border-radius: 7px !important;
      width: 100% !important;
      box-shadow: none !important;
    }

    #incbot-panel input[type="text"]::placeholder { color: rgba(230,230,230,.40) !important; }

    #incbot-panel input[type="text"]:focus,
    #incbot-panel input[type="number"]:focus {
      outline: none !important;
      border-color: rgba(230,230,230,.35) !important;
    }

    #incbot-panel input[type="checkbox"] {
      width: 16px !important;
      height: 16px !important;
      accent-color: #8b8f97; /* neutral */
    }

    .incbot-btnbar { display: flex; gap: 8px; margin-top: 8px; }

    /* Buttons (SCOPED) – keine .btn Klasse mehr */
    #incbot-panel button.incbot-btn {
      flex: 1;
      appearance: none !important;
      background: var(--inc-surface) !important;
      border: 1px solid var(--inc-border) !important;
      color: var(--inc-text) !important;
      padding: 7px 8px !important;
      border-radius: 7px !important;
      cursor: pointer !important;
      font-weight: 600 !important;
    }
    #incbot-panel button.incbot-btn:hover { background: var(--inc-hover) !important; }

    #incbot-status {
      margin-top: 10px;
      font-size: 12px;
      color: var(--inc-muted) !important;
    }

    #incbot-meta {
      font-size: 12px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      color: var(--inc-muted) !important;
      gap: 10px;
    }
  `);

  // -----------------------------
  // UI
  // -----------------------------
  let ui = null;

  function mountUI() {
    const toggle = document.createElement('div');
    toggle.id = 'incbot-toggle';
    toggle.textContent = 'Inc Bot';

    const panel = document.createElement('div');
    panel.id = 'incbot-panel';

    // Default minimiert, aber respektiere gespeicherten Zustand
    let minimized = GM_getValue(SETTINGS.uiMin.key, null);
    if (minimized === null) minimized = true;
    Store.set('uiMin', minimized);
    if (minimized) panel.classList.add('min');

    panel.classList.add('state-stopped');

    panel.innerHTML = `
      <div id="incbot-header">
        <div id="incbot-title">
          <span>Inc DC Reminder</span>
          <span id="incbot-statuspill">STOP</span>
        </div>
        <div id="incbot-actions">
          <button type="button" id="incbot-min" title="Minimieren/Maximieren">${minimized ? '+' : '–'}</button>
          <button type="button" id="incbot-close" title="Schließen">x</button>
        </div>
      </div>

      <div id="incbot-body">
        <div class="incbot-row">
          <div class="incbot-label">Webhook</div>
          <input type="text" id="incbot-webhook" placeholder="https://discord.com/api/webhooks/..." />
        </div>

        <div class="incbot-row">
          <div class="incbot-label">Intervall (s)</div>
          <input type="number" id="incbot-interval" min="1" step="1" />
        </div>

        <div class="incbot-row">
          <div class="incbot-label">Auto-Start</div>
          <div style="display:flex; justify-content:flex-end;">
            <input type="checkbox" id="incbot-autostart" />
          </div>
        </div>

        <div class="incbot-btnbar">
          <button class="incbot-btn" id="incbot-start" type="button">Start</button>
          <button class="incbot-btn" id="incbot-stop" type="button">Stop</button>
        </div>

        <div class="incbot-btnbar">
          <button class="incbot-btn" id="incbot-test" type="button" title="Sendet eine Testnachricht an den Webhook">Test senden</button>
          <button class="incbot-btn" id="incbot-reset" type="button" title="Setzt den internen Vergleichswert zurück">Reset</button>
        </div>

        <div id="incbot-status">Bereit</div>
        <div id="incbot-meta">
          <span>Letzter Wert: <span id="incbot-last">—</span></span>
          <span>Running: <span id="incbot-running">nein</span></span>
        </div>
      </div>
    `;

    document.body.append(toggle, panel);

    // Sichtbarkeit (optional)
    let visible = !!Store.get('uiVisible');
    panel.style.display = visible ? 'block' : 'none';

    toggle.addEventListener('click', () => {
      visible = !visible;
      panel.style.display = visible ? 'block' : 'none';
      Store.set('uiVisible', visible);
    });

    panel.querySelector('#incbot-close').addEventListener('click', () => {
      visible = false;
      panel.style.display = 'none';
      Store.set('uiVisible', visible);
    });

    // Minimieren
    const minBtn = panel.querySelector('#incbot-min');
    minBtn.addEventListener('click', () => {
      panel.classList.toggle('min');
      const isMin = panel.classList.contains('min');
      Store.set('uiMin', isMin);
      minBtn.textContent = isMin ? '+' : '–';
    });

    // Init Values
    panel.querySelector('#incbot-webhook').value = Store.get('webhookURL');
    panel.querySelector('#incbot-interval').value = Math.max(1, Math.round(Store.get('intervalMs') / 1000));
    panel.querySelector('#incbot-autostart').checked = !!Store.get('autoStart');

    // Persistenz
    panel.querySelector('#incbot-webhook').addEventListener('change', (e) => {
      Store.set('webhookURL', (e.target.value || '').trim());
      setStatus('Webhook gespeichert.');
    });

    panel.querySelector('#incbot-interval').addEventListener('change', (e) => {
      const sec = parseInt(e.target.value, 10);
      if (!Number.isFinite(sec) || sec <= 0) {
        e.target.value = Math.max(1, Math.round(Store.get('intervalMs') / 1000));
        setStatus('Ungültiges Intervall.');
        return;
      }
      Store.set('intervalMs', sec * 1000);
      setStatus(`Intervall gespeichert: ${sec}s`);
      if (intervalId) startInterval();
    });

    panel.querySelector('#incbot-autostart').addEventListener('change', (e) => {
      Store.set('autoStart', !!e.target.checked);
      setStatus(`Auto-Start: ${e.target.checked ? 'an' : 'aus'}`);
    });

    // Buttons
    panel.querySelector('#incbot-start').addEventListener('click', startInterval);
    panel.querySelector('#incbot-stop').addEventListener('click', stopInterval);
    panel.querySelector('#incbot-test').addEventListener('click', () => sendToDiscord(0, { isTest: true }));
    panel.querySelector('#incbot-reset').addEventListener('click', () => {
      lastSentValue = 0;
      updateLastSeen(0);
      setStatus('Reset: interner Wert = 0');
    });

    ui = panel;

    updateLastSeen(lastSentValue);
    updateRunningState(false);
    setStatus('Bereit');

    // Auto-Start optional
    if (Store.get('autoStart')) {
      const webhookURL = Store.get('webhookURL');
      if (webhookURL) startInterval();
      else setStatus('Auto-Start aktiv, aber kein Webhook gesetzt.');
    }
  }

  function setStatus(text) {
    if (!ui) return;
    const el = ui.querySelector('#incbot-status');
    if (el) el.textContent = text;
  }

  function updateLastSeen(v) {
    if (!ui) return;
    const el = ui.querySelector('#incbot-last');
    if (el) el.textContent = String(v);
  }

  function updateRunningState(running) {
    if (!ui) return;

    const runText = ui.querySelector('#incbot-running');
    if (runText) runText.textContent = running ? 'ja' : 'nein';

    ui.classList.toggle('state-running', !!running);
    ui.classList.toggle('state-stopped', !running);

    const pill = ui.querySelector('#incbot-statuspill');
    if (pill) pill.textContent = running ? 'RUN' : 'STOP';
  }

  mountUI();
})();
