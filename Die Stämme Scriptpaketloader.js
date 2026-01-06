// ==UserScript==
// @name         Die Stämme Scriptpaket Loader + Settings-Seite (Gruppen/Tabellen + optionale Infos)
// @namespace    https://github.com/Marcel2511
// @version      0.8.5
// @description  Lädt mehrere Userscripts als „Paket“. Auswahl über Ingame-Settings-Seite (screen=settings&mode=scriptpack). Module werden in Gruppen (Tabellen) dargestellt; „Mehr Infos“ erscheint nur, wenn info vorhanden ist.
// @match        https://*.die-staemme.de/game.php?*
// @match        https://*.tribalwars.*/*game.php?*
// @match        https://ds-ultimate.de/tools/*
// @author       Marcel Wollbaum
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      media.innogamescdn.com
// @connect      userscripts-mirror.org
// ==/UserScript==

(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Compatibility Layer (Legacy GM_* + unsafeWindow)
  // Ziel: Alte Scripts/Libraries erwarten "GM_getValue(...)" als freien Identifier.
  // Lösung: Wir stellen Fallback-Implementierungen bereit und injizieren diese
  // zusätzlich als Parameter beim Ausführen der Module.
  // ---------------------------------------------------------------------------

  const __LS_PREFIX__ = "__twpack_";

  // eslint-disable-next-line no-var
  var GM_addStyle =
    (typeof GM_addStyle !== "undefined" && GM_addStyle) ||
    ((typeof GM !== "undefined" && typeof GM.addStyle === "function")
      ? (css) => GM.addStyle(css)
      : (css) => {
          const style = document.createElement("style");
          style.textContent = String(css ?? "");
          (document.head || document.documentElement).appendChild(style);
          return style;
        });

  // eslint-disable-next-line no-var
  var GM_getValue =
    (typeof GM_getValue !== "undefined" && GM_getValue) ||
    ((key, def) => {
      try {
        const v = localStorage.getItem(__LS_PREFIX__ + key);
        return v === null ? def : JSON.parse(v);
      } catch {
        return def;
      }
    });

  // eslint-disable-next-line no-var
  var GM_setValue =
    (typeof GM_setValue !== "undefined" && GM_setValue) ||
    ((key, value) => {
      try {
        localStorage.setItem(__LS_PREFIX__ + key, JSON.stringify(value));
      } catch {
        // ignore
      }
    });

  // eslint-disable-next-line no-var
  var GM_deleteValue =
    (typeof GM_deleteValue !== "undefined" && GM_deleteValue) ||
    ((key) => {
      try {
        localStorage.removeItem(__LS_PREFIX__ + key);
      } catch {
        // ignore
      }
    });

  // eslint-disable-next-line no-var
  var unsafeWindow =
    (typeof unsafeWindow !== "undefined" && unsafeWindow) ||
    (typeof globalThis.unsafeWindow !== "undefined" && globalThis.unsafeWindow) ||
    window;

  // Optional: auch als property anbieten (hilft einigen Scripts)
  try {
    globalThis.unsafeWindow = unsafeWindow;
    window.unsafeWindow = unsafeWindow;

    globalThis.GM_addStyle = GM_addStyle;
    window.GM_addStyle = GM_addStyle;

    globalThis.GM_getValue = GM_getValue;
    window.GM_getValue = GM_getValue;

    globalThis.GM_setValue = GM_setValue;
    window.GM_setValue = GM_setValue;

    globalThis.GM_deleteValue = GM_deleteValue;
    window.GM_deleteValue = GM_deleteValue;
  } catch (_) {}

  // --------- Konfiguration ---------
  const PREF_KEY = "tw_pack_prefs_v8";
  const SETTINGS_SCREEN = "settings";
  const PACK_MODE = "scriptpack";

  const MODULES = [
    {
      id: "inc_dc_reminder",
      group: "Tabelle 1",
      name: "Inc DC Reminder via Webhook",
      description: "Erinnert / meldet Inc/DC (Webhook).",
      url: "https://raw.githubusercontent.com/Marcel2511/tribal-wars-userskript-sammlung/refs/heads/main/own/incdcreminder.js",
      defaultEnabled: false,
      matches: [],
      excludes: ["*screen=settings*"],
      info: `
        <div>
          <p><strong>Was macht das Modul?</strong><br>
          Erkennt relevante Ereignisse (je nach Script-Logik) und sendet Benachrichtigungen an einen Webhook.</p>

          <p><strong>Typische Einrichtung</strong></p>
          <ol style="margin:0; padding-left:18px;">
            <li>Webhook-URL im Script konfigurieren.</li>
            <li>Testlauf und Konsole (F12) prüfen.</li>
          </ol>

          <p style="margin-top:8px;"><strong>Hinweise</strong></p>
          <ul style="margin:0; padding-left:18px;">
            <li>Fehler/Timeouts: Konsole prüfen.</li>
            <li>Webhook-Auth/CORS kann Anpassungen erfordern.</li>
          </ul>
        </div>
      `,
    },
    {
      id: "massrekru",
      group: "Tabelle 1",
      name: "Tribal Wars Mass Rekru",
      description: "Massenrekrutierung (train/mass + train/success&action=train_mass).",
      url: "https://raw.githubusercontent.com/Marcel2511/tribal-wars-userskript-sammlung/refs/heads/main/own/massrekru.user.js",
      defaultEnabled: false,
      matches: [
        "game.php*screen=train&mode=mass*",
        "game.php*screen=train&mode=success&action=train_mass*",
      ],
      excludes: ["*screen=settings*"],
    },
    {
      id: "dsu_attackplanner",
      group: "Tabelle 2",
      name: "DS-Ultimate AttackPlanner Helper (Beispiel)",
      description: "Hilfsscript für DS-Ultimate AttackPlanner.",
      url: "https://raw.githubusercontent.com/Marcel2511/tribal-wars-userskript-sammlung/refs/heads/main/own/dsutokumin.js",
      defaultEnabled: false,
      matches: ["*ds-ultimate.de/tools/attackPlanner/*"],
      excludes: [],
    },
    {
      id: "tkk_buildbot",
      group: "Tabelle 2",
      name: "TKKs / Marcels Buildbot",
      description: "Baubot für DS mit verbessertem Questhandling",
      url: "https://raw.githubusercontent.com/Marcel2511/tribal-wars-userskript-sammlung/main/own/advancedtkkbuildbot.js",
      defaultEnabled: false,
      matches: ["*game.php*screen=main*"],
      excludes: ["*screen=settings*"],
      requires: ["https://userscripts-mirror.org/scripts/source/107941.user.js"],
    },
    {
      id: "2-Klick_Gruppenwechsel",
      group: "Tabelle 2",
      name: "2-Klick Gruppenwechsel",
      description: "2-Klick Gruppenwechsel",
      url: "https://media.innogamescdn.com/com_DS_DE/Scriptdatenbank/userscript/700.user.js",
      defaultEnabled: false,
      matches: [],
      excludes: [],
    },
    {
      id: "Kuminsabschickbot",
      group: "Tabelle 2",
      name: "Kuminsabschickbot",
      description: "Kuminsabschickbot - Discord @imkumin",
      url: "https://gistcdn.githack.com/ImKumin/fee6950e8236760a35d8447586235f78/raw/Kumin%2520Mint%2520Loader%2520T.js",
      defaultEnabled: false,
      matches: [],
      excludes: [],
    },

    
  ];

  const GROUPS = ["Tabelle 1", "Tabelle 2"];

  // --------- Utilities ---------
  function getParam(key) {
    return new URL(location.href).searchParams.get(key) || "";
  }

  function buildPackSettingsUrl() {
    const url = new URL(location.href);
    url.searchParams.set("screen", SETTINGS_SCREEN);
    url.searchParams.set("mode", PACK_MODE);
    return url.toString();
  }

  function notifySuccess(msg) {
    if (typeof UI !== "undefined" && UI.SuccessMessage) UI.SuccessMessage(msg);
    else alert(msg);
  }

  function notifyError(msg) {
    if (typeof UI !== "undefined" && UI.ErrorMessage) UI.ErrorMessage(msg);
    else alert(msg);
  }

  function cacheBust(url) {
    const bucket = Math.floor(Date.now() / (10 * 60 * 1000)); // 10 Minuten
    return url + (url.includes("?") ? "&" : "?") + "_cb=" + bucket;
  }

  function httpGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (r) => {
          if (r.status >= 200 && r.status < 300) resolve(r.responseText);
          else reject(new Error(`HTTP ${r.status} for ${url}`));
        },
        onerror: () => reject(new Error(`Network error for ${url}`)),
      });
    });
  }

  /**
   * Ausführen mit "Injected Locals":
   * Viele Greasemonkey-Libraries erwarten GM_getValue/GM_setValue als freie Identifier.
   * new Function(...) läuft global -> sieht nicht deine IIFE-vars.
   * Daher: wir geben die APIs als Parameter rein.
   */
  function safeEval(code, moduleName) {
    try {
      const fn = new Function(
        "GM_getValue",
        "GM_setValue",
        "GM_deleteValue",
        "GM_addStyle",
        "unsafeWindow",
        code
      );

      fn.call(
        unsafeWindow,
        GM_getValue,
        GM_setValue,
        GM_deleteValue,
        GM_addStyle,
        unsafeWindow
      );

      console.info(`[TW-Pack] geladen: ${moduleName}`);
    } catch (e) {
      console.error(`[TW-Pack] Fehler in Modul: ${moduleName}`, e);
      notifyError(`TW-Pack: Fehler beim Ausführen von "${moduleName}". Details: Konsole (F12).`);
    }
  }

  function wildcardIncludes(href, pattern) {
    const parts = String(pattern).split("*");
    let pos = 0;
    for (const part of parts) {
      if (!part) continue;
      const idx = href.indexOf(part, pos);
      if (idx === -1) return false;
      pos = idx + part.length;
    }
    return true;
  }

  function moduleMatchesUrl(module, href) {
    const matches = Array.isArray(module.matches) ? module.matches : [];
    const excludes = Array.isArray(module.excludes) ? module.excludes : [];

    for (const ex of excludes) {
      if (wildcardIncludes(href, ex)) return false;
    }

    if (matches.length === 0) return true;
    return matches.some((m) => wildcardIncludes(href, m));
  }

  function hasInfo(module) {
    return typeof module.info === "string" && module.info.trim().length > 0;
  }

  // --------- Storage (Loader-eigene Settings)
  async function loadPrefs() {
    const saved = await GM.getValue(PREF_KEY, null);
    if (saved && typeof saved === "object" && saved.modules) return saved;

    const init = { modules: {} };
    for (const m of MODULES) {
      init.modules[m.id] = { enabled: !!m.defaultEnabled };
    }
    await GM.setValue(PREF_KEY, init);
    return init;
  }

  async function savePrefs(prefs) {
    await GM.setValue(PREF_KEY, prefs);
  }

  function injectMenuEntryIfPresent() {
    const screen = getParam("screen");
    if (screen !== SETTINGS_SCREEN) return;

    const menu = document.querySelector("table.vis.modemenu tbody");
    if (!menu) return;
    if (menu.querySelector('a[data-tw-pack="1"]')) return;

    const isSelected = getParam("mode") === PACK_MODE;

    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.style.minWidth = "80px";
    if (isSelected) td.classList.add("selected");

    const a = document.createElement("a");
    a.href = buildPackSettingsUrl();
    a.textContent = "Scriptpaket";
    a.setAttribute("data-tw-pack", "1");

    td.appendChild(a);
    tr.appendChild(td);

    const selectedRow = menu.querySelector("tr td.selected")?.parentElement;
    if (selectedRow && selectedRow.parentElement === menu) selectedRow.insertAdjacentElement("afterend", tr);
    else menu.appendChild(tr);
  }

  function findTarget() {
    return (
      document.querySelector("#content_value") ||
      document.querySelector("#contentContainer") ||
      document.querySelector("#content") ||
      document.querySelector("body")
    );
  }

  function createModulesTable(modulesInGroup, prefs) {
    const table = document.createElement("table");
    table.className = "vis";
    table.style.width = "100%";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th style="width:70px">Aktiv</th>
        <th style="width:280px">Modul</th>
        <th>Beschreibung / Infos</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (const m of modulesInGroup) {
      const state = prefs.modules?.[m.id] ?? { enabled: false };
      const tr = document.createElement("tr");

      const tdEnabled = document.createElement("td");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = `tw_pack_en_${m.id}`;
      cb.checked = !!state.enabled;
      tdEnabled.appendChild(cb);

      const tdName = document.createElement("td");
      const label = document.createElement("label");
      label.setAttribute("for", cb.id);
      label.textContent = m.name;
      tdName.appendChild(label);

      const tdDesc = document.createElement("td");
      const descWrap = document.createElement("div");
      descWrap.textContent = m.description || "";
      tdDesc.appendChild(descWrap);

      if (hasInfo(m)) {
        const details = document.createElement("details");
        details.style.marginTop = "6px";

        const summary = document.createElement("summary");
        summary.textContent = "Mehr Infos anzeigen";
        summary.style.cursor = "pointer";

        const infoDiv = document.createElement("div");
        infoDiv.style.marginTop = "6px";
        infoDiv.innerHTML = m.info;

        details.appendChild(summary);
        details.appendChild(infoDiv);
        tdDesc.appendChild(details);
      }

      tr.appendChild(tdEnabled);
      tr.appendChild(tdName);
      tr.appendChild(tdDesc);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    return table;
  }

  function renderPackSettingsPage(prefs) {
    const target = findTarget();

    if (target && (target.id === "content_value" || target.id === "contentContainer")) {
      target.innerHTML = "";
    }

    const title = document.createElement("h2");
    title.textContent = "Scriptpaket – Module verwalten";

    const info = document.createElement("div");
    info.className = "info_box";
    info.style.marginBottom = "10px";
    info.innerHTML = `
      <strong>Hinweis:</strong> Änderungen wirken nach Neuladen der Seite.<br>
      Module sind in Gruppen (Tabellen) organisiert. Die Laufbereiche werden im Loader pro Modul über <code>matches</code>/<code>excludes</code> gepflegt.
    `;

    const wrap = document.createElement("div");
    wrap.appendChild(title);
    wrap.appendChild(info);

    for (const groupName of GROUPS) {
      const groupModules = MODULES.filter((m) => (m.group || "Tabelle 1") === groupName);

      const h3 = document.createElement("h3");
      h3.textContent = groupName;
      h3.style.marginTop = "14px";

      wrap.appendChild(h3);
      wrap.appendChild(createModulesTable(groupModules, prefs));
    }

    const actions = document.createElement("div");
    actions.style.marginTop = "12px";
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.alignItems = "center";

    const btnSave = document.createElement("button");
    btnSave.className = "btn";
    btnSave.type = "button";
    btnSave.textContent = "Speichern";

    const btnAllOn = document.createElement("button");
    btnAllOn.className = "btn";
    btnAllOn.type = "button";
    btnAllOn.textContent = "Alle aktivieren";

    const btnAllOff = document.createElement("button");
    btnAllOff.className = "btn";
    btnAllOff.type = "button";
    btnAllOff.textContent = "Alle deaktivieren";

    const hint = document.createElement("span");
    hint.style.marginLeft = "8px";
    hint.textContent = "Nach dem Speichern: Seite neu laden.";

    btnAllOn.addEventListener("click", () => {
      for (const m of MODULES) {
        const el = document.getElementById(`tw_pack_en_${m.id}`);
        if (el) el.checked = true;
      }
    });

    btnAllOff.addEventListener("click", () => {
      for (const m of MODULES) {
        const el = document.getElementById(`tw_pack_en_${m.id}`);
        if (el) el.checked = false;
      }
    });

    btnSave.addEventListener("click", async () => {
      const next = { modules: {} };
      for (const m of MODULES) {
        const en = document.getElementById(`tw_pack_en_${m.id}`);
        next.modules[m.id] = { enabled: !!en?.checked };
      }
      await savePrefs(next);
      notifySuccess("TW-Pack: Einstellungen gespeichert. Bitte Seite neu laden.");
    });

    actions.appendChild(btnSave);
    actions.appendChild(btnAllOn);
    actions.appendChild(btnAllOff);
    actions.appendChild(hint);

    wrap.appendChild(actions);
    target.appendChild(wrap);
  }

  // --------- Main ---------
  async function run() {
    injectMenuEntryIfPresent();

    const screen = getParam("screen");
    const mode = getParam("mode");
    const prefs = await loadPrefs();

    if (screen === SETTINGS_SCREEN && mode === PACK_MODE) {
      renderPackSettingsPage(prefs);
      return;
    }

    if (screen === SETTINGS_SCREEN) return;

    for (const m of MODULES) {
      const state = prefs.modules?.[m.id];
      if (!state?.enabled) continue;

      if (!moduleMatchesUrl(m, location.href)) continue;

      try {
        // Dependencies zuerst laden
        if (Array.isArray(m.requires)) {
          for (const depUrl of m.requires) {
            const depCode = await httpGet(cacheBust(depUrl));
            safeEval(depCode, `${m.name} (dependency)`);
          }
        }

        // Hauptmodul laden
        const code = await httpGet(cacheBust(m.url));
        safeEval(code, m.name);
      } catch (e) {
        console.error("[TW-Pack] Fehler beim Laden:", m.name, e);
        notifyError(`TW-Pack: Konnte "${m.name}" nicht laden. Details: Konsole (F12).`);
      }
    }
  }

  run();
})();
