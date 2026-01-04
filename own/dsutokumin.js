// ==UserScript==
// @name         DSU -> Kumin Converter (GUI)
// @namespace    dsu-kumin-learning
// @version      1.1
// @description  Konvertiert eine DSU / Workbenchplan in einen Kumin State inklusive Importfunkltion
// @match        https://ds-ultimate.de/tools/attackPlanner*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "dsu_kumin_gui_state_v3";

  // ====== BASE EXPORT (exakt 1 Command) ======
  const BASE_KUMIN_EXPORT_1CMD =
    `%7B%22focused%22:true,%22settings%22:%7B%22currentCatapultTarget%22:%22wall%22,%22currentAttackTemplate%22:%22default_attack%22,%22currentSupportTemplate%22:%22default_support%22,%22timing_offset%22:0,%22autoTimingOffset%22:true,%22autoTimingOffsetMultiplier%22:0.25,%22openTabDelay%22:60,%22setMSWholePlane%22:0,%22toUse%22:100,%22sigil%22:0,%22leaveCats%22:0,%22leaveSpies%22:0,%22leaveRams%22:0,%22launchTime_offset%22:0,%22autoFillNt%22:true,%22autoSendInTime%22:true,%22autoSendNobles%22:true,%22readMSFromPlan%22:false,%22running%22:false,%22ntTemplates%22:%7B%22splitSecondThirdNobleNT%22:%7B%22name%22:%22Split%20in%202nd&3rd%20Noble%20NT%22,%22id%22:%22NT_2ND&3RD_NOBLE_BUFF%22,%22fillFunction%22:%22fill2nd3rdNoblesNT%22,%22noblesQnt%22:4,%22brownNoble%22:true,%22onlyNobles%22:true,%22selected%22:false%7D,%22secondNobleBuffNT%22:%7B%22name%22:%222nd%20Noble%20Buff%20NT%22,%22id%22:%22NT_2ND_NOBLE_BUFF%22,%22fillFunction%22:%22fill2ndNobleBuffNT%22,%22noblesQnt%22:4,%22brownNoble%22:true,%22onlyNobles%22:true,%22selected%22:false%7D,%22thirdNobleBuffNT%22:%7B%22name%22:%223rd%20Noble%20Buff%20NT%22,%22id%22:%22NT_3RD_NOBLE_BUFF%22,%22fillFunction%22:%22fill3rdNobleBuffNT%22,%22noblesQnt%22:4,%22brownNoble%22:true,%22onlyNobles%22:true,%22selected%22:false%7D,%22secondNobleBuffWith5NoblesNT%22:%7B%22name%22:%222nd%20Noble%20Buff%20With%205%20Nobles%20NT%22,%22id%22:%22NT_2ND_NOBLE_BUFF_WITH_5_NOBLES%22,%22fillFunction%22:%22fill2ndNobleBuffWith5NoblesNT%22,%22noblesQnt%22:5,%22brownNoble%22:true,%22onlyNobles%22:true,%22selected%22:false%7D,%22secondNobleBuffWith2NoblesNT%22:%7B%22name%22:%222nd%20Noble%20Buff%20With%202%20Nobles%20NT%22,%22id%22:%22NT_2ND_NOBLE_BUFF_WITH_2_NOBLES%22,%22fillFunction%22:%22fill2ndNobleBuffWith2NoblesNT%22,%22noblesQnt%22:2,%22brownNoble%22:true,%22onlyNobles%22:true,%22selected%22:false%7D,%22secondNobleWithRest%22:%7B%22name%22:%222%20Nobles%20Selected/Rest%22,%22id%22:%222NoblesSelectedRest%22,%22fillFunction%22:%22fill2NobleSelectedRest%22,%22noblesQnt%22:2,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22thirdNobleWithRest%22:%7B%22name%22:%223%20Nobles%20Selected/Rest%22,%22id%22:%223NoblesSelectedRest%22,%22fillFunction%22:%22fill3NobleSelectedRest%22,%22noblesQnt%22:3,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22fourNobleWithRest%22:%7B%22name%22:%224%20Nobles%20Selected/Rest%22,%22id%22:%224NoblesSelectedRest%22,%22fillFunction%22:%22fill4NobleSelectedRest%22,%22noblesQnt%22:4,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22fiveNobleWithRest%22:%7B%22name%22:%225%20Nobles%20Selected/Rest%22,%22id%22:%225NoblesSelectedRest%22,%22fillFunction%22:%22fill5NobleSelectedRest%22,%22noblesQnt%22:5,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22twoNoblesSame%22:%7B%22name%22:%222%20Commands%20Same%20of%20Selected%22,%22id%22:%222CommandsSame%22,%22fillFunction%22:%22fill2NoblesSame%22,%22noblesQnt%22:2,%22brownNoble%22:false,%22onlyNobles%22:false,%22selected%22:false%7D,%22threeNoblesSame%22:%7B%22name%22:%223%20Commands%20Same%20of%20Selected%22,%22id%22:%223CommandsSame%22,%22fillFunction%22:%22fill3NoblesSame%22,%22noblesQnt%22:3,%22brownNoble%22:false,%22onlyNobles%22:false,%22selected%22:false%7D,%22fourNoblesSame%22:%7B%22name%22:%224%20Commands%20Same%20of%20Selected%22,%22id%22:%224CommandsSame%22,%22fillFunction%22:%22fill4NoblesSame%22,%22noblesQnt%22:4,%22brownNoble%22:false,%22onlyNobles%22:false,%22selected%22:false%7D,%22fiveNoblesSame%22:%7B%22name%22:%225%20Commands%20Same%20of%20Selected%22,%22id%22:%225CommandsSame%22,%22fillFunction%22:%22fill5NoblesSame%22,%22noblesQnt%22:5,%22brownNoble%22:false,%22onlyNobles%22:false,%22selected%22:false%7D,%22firstNobleRedNT%22:%7B%22name%22:%221st%20Noble%20Red%20NT%22,%22id%22:%22NT_1ST_NOBLE_RED%22,%22fillFunction%22:%22fill1stNobleRedNT%22,%22noblesQnt%22:4,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:true%7D,%22secondNobleRedNT%22:%7B%22name%22:%222nd%20Noble%20Red%20NT%22,%22id%22:%22NT_2ND_NOBLE_RED%22,%22fillFunction%22:%22fill2ndNobleRedNT%22,%22noblesQnt%22:4,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22thirdNobleRedNT%22:%7B%22name%22:%223rd%20Noble%20Red%20NT%22,%22id%22:%22NT_3RD_NOBLE_RED%22,%22fillFunction%22:%22fill3rdNobleRedNT%22,%22noblesQnt%22:4,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22fourthNobleRedNT%22:%7B%22name%22:%224th%20Noble%20Red%20NT%22,%22id%22:%22NT_4TH_NOBLE_RED%22,%22fillFunction%22:%22fill4thNobleRedNT%22,%22noblesQnt%22:4,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22firstNobleRed5NT%22:%7B%22name%22:%221st%20Noble%20Red%205NT%22,%22id%22:%22NT_1ST_5NOBLE_RED%22,%22fillFunction%22:%22fill1stNobleRedNT%22,%22noblesQnt%22:5,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22secondNobleRed5NT%22:%7B%22name%22:%222nd%20Noble%20Red%205NT%22,%22id%22:%22NT_2ND_5NOBLE_RED%22,%22fillFunction%22:%22fill2ndNobleRed5NT%22,%22noblesQnt%22:5,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22thirdNobleRed5NT%22:%7B%22name%22:%223rd%20Noble%20Red%205NT%22,%22id%22:%22NT_3RD_5NOBLE_RED%22,%22fillFunction%22:%22fill3rdNobleRed5NT%22,%22noblesQnt%22:5,%22brownNoble%22:false,%22onlyNobles%22:true,%22selected%22:false%7D,%22noNT%22:%7B%22name%22:%22no%20NT%22,%22id%22:%22NO_NT%22,%22fillFunction%22:%22noNT%22,%22noblesQnt%22:1,%22brownNoble%22:false,%22selected%22:false%7D%7D,%22map%22:%7B%22showAlly%22:true,%22showEnemy%22:true%7D,%22allowPopups%22:true%7D,%22commands%22:%7B%2236%22:%7B%22id%22:36,%22name%22:%22egal%22,%22sourceVillageId%22:%2210761%22,%22targetVillageId%22:%2211230%22,%22source%22:%22588%7C555%22,%22target%22:%22588%7C553%22,%22launchTime%22:%222025-12-22T22:01:52.269Z%22,%22arrivalTime%22:%222025-12-22T23:01:52.269Z%22,%22slowestUnit%22:%22ram%22,%22units%22:%7B%22spear%22:0,%22sword%22:0,%22axe%22:-1,%22archer%22:0,%22spy%22:-1,%22light%22:-1,%22marcher%22:-1,%22heavy%22:-1,%22ram%22:-1,%22catapult%22:-1,%22knight%22:-1,%22snob%22:0%7D,%22type%22:%22Attack%22,%22done%22:false,%22toUse%22:%22100%22,%22autoSend%22:true,%22preparedByBot%22:false,%22randomOffset%22:0,%22randomOffsetTime%22:%222025-12-22T22:01:52.269Z%22,%22sigil%22:0,%22leaveCats%22:0,%22leaveSpies%22:0,%22leaveRams%22:0,%22ntTemplate%22:%22firstNobleRedNT%22,%22catapultTarget%22:%22wall%22,%22duplicateError%22:false%7D%7D,%22commandIdCounter%22:37%7D`;

  // ===== Split/Assemble (generic) =====
  function splitKuminExport(encoded) {
    const markerStart = "%22commands%22:%7B";
    const idxStart = encoded.indexOf(markerStart);
    if (idxStart === -1) throw new Error("Kumin-Export: commands-Startmarker nicht gefunden.");
    const contentStart = idxStart + markerStart.length;

    const markerEnd = "%7D,%22commandIdCounter%22:";
    const idxEnd = encoded.indexOf(markerEnd, contentStart);
    if (idxEnd === -1) throw new Error("Kumin-Export: commands-Endmarker nicht gefunden.");

    const prefix = encoded.slice(0, contentStart);
    const commandsContent = encoded.slice(contentStart, idxEnd); // may be empty
    const suffixFromEndMarker = encoded.slice(idxEnd);

    const m = suffixFromEndMarker.match(/^%7D,%22commandIdCounter%22:(\d+)%7D$/);
    if (!m) throw new Error("Kumin-Export: commandIdCounter-Suffix hat unerwartetes Format.");

    const counter = Number(m[1]);
    if (!Number.isFinite(counter)) throw new Error("Kumin-Export: commandIdCounter ist keine Zahl.");

    return { prefix, commandsContent, suffixFromEndMarker, counter };
  }

  function replaceCommandIdCounter(suffixFromEndMarker, newCounter) {
    const m = suffixFromEndMarker.match(/^%7D,%22commandIdCounter%22:(\d+)%7D$/);
    if (!m) throw new Error("Kumin-Export: commandIdCounter-Suffix hat unerwartetes Format.");
    return `%7D,%22commandIdCounter%22:${newCounter}%7D`;
  }

  function assembleExport(prefix, commandsBlock, suffixFromEndMarker, newCounter) {
    return prefix + commandsBlock + replaceCommandIdCounter(suffixFromEndMarker, newCounter);
  }

  // ===== UI/CSS =====
  GM_addStyle(`
    #dkc-panel{position:fixed;right:16px;bottom:16px;width:520px;max-width:calc(100vw - 32px);background:#fff;border:1px solid rgba(0,0,0,0.15);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.15);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;z-index:999999;overflow:hidden;}
    #dkc-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(0,0,0,0.10);background:#f7f7f7;}
    #dkc-title{font-size:14px;font-weight:700;margin:0;}
    #dkc-actions{display:flex;gap:8px;}
    .dkc-btn{font-size:12px;padding:6px 8px;border:1px solid rgba(0,0,0,0.18);background:#fff;border-radius:8px;cursor:pointer;user-select:none;}
    .dkc-btn:hover{background:#f2f2f2;}
    .dkc-btn:disabled{opacity:0.55;cursor:not-allowed;}
    #dkc-body{padding:10px 12px 12px 12px;display:grid;gap:10px;}
    .dkc-row{display:grid;gap:6px;}
    .dkc-label{font-size:12px;font-weight:600;color:rgba(0,0,0,0.75);}
    .dkc-input,.dkc-textarea{width:100%;box-sizing:border-box;font-size:12px;padding:8px;border:1px solid rgba(0,0,0,0.18);border-radius:8px;outline:none;}
    .dkc-textarea{min-height:90px;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
    #dkc-export{min-height:110px;background:#fafafa;}
    #dkc-footer{display:flex;gap:8px;flex-wrap:wrap;}
    #dkc-panel.dkc-collapsed #dkc-body{display:none;}
  `);

  function loadState() {
    try {
      const raw = GM_getValue(STORAGE_KEY, null);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  function saveState(state) {
    GM_setValue(STORAGE_KEY, JSON.stringify(state));
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "value") node.value = v;
      else node.setAttribute(k, v);
    }
    for (const child of children) node.appendChild(child);
    return node;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = el("textarea", { class: "dkc-textarea" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  // ===== DSU Parser (DSU ts = ARRIVAL) =====
  function b64ToInt(b64) {
    if (!b64) return null;
    try {
      const n = Number(atob(b64));
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }

  function parseUnitsBlob(blob) {
    const units = {};
    const parts = String(blob || "").split("/");
    for (const part of parts) {
      if (!part) continue;
      const [k, v] = part.split("=");
      if (!k) continue;
      units[k] = b64ToInt(v);
    }
    return units;
  }

  function parseDsuLineStrict(line) {
    const parts = String(line || "").split("&");
    if (parts.length < 8) return null;

    const [srcId, tgtId, slowestUnit, tsMs, unk, flagA, flagB, unitsBlob] = parts;

    const ts = Number(tsMs);
    if (!Number.isFinite(ts)) return null;
    if (!slowestUnit) return null;

    const unkNum = Number(unk);
    if (!Number.isFinite(unkNum)) return null;

    return {
      sourceVillageId: String(srcId),
      targetVillageId: String(tgtId),
      slowestUnit: String(slowestUnit).trim(),
      arrivalTimeUtc: new Date(ts),
      unk: unkNum,
      flagA: String(flagA) === "true",
      flagB: String(flagB) === "true",
      units: parseUnitsBlob(unitsBlob || ""),
    };
  }

  // ===== GM HTTP =====
  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: resolve,
        onerror: reject,
        timeout: 20000,
        ontimeout: reject,
      });
    });
  }

  function normalizeWorld(raw) {
    const w = (raw || "").trim().toLowerCase();
    return w || null;
  }
  function makeVillageTxtUrl(worldNorm) { return `https://${worldNorm}.die-staemme.de/map/village.txt`; }
  function makeSettingsUrl(worldNorm) { return `https://${worldNorm}.die-staemme.de/page/settings`; }

  // ===== Lazy village.txt loader =====
  const villageIdToCoord = new Map(); // "id" -> "x|y"
  let villagesLoadedForWorld = null;
  let villagesLoadingPromise = null;

  async function ensureVillagesLoaded(worldRaw) {
    const worldNorm = normalizeWorld(worldRaw);
    if (!worldNorm) throw new Error("Welt ist leer (bitte z. B. 'de170' eintragen).");

    if (villagesLoadedForWorld === worldNorm && villageIdToCoord.size > 0) return;
    if (villagesLoadingPromise) { await villagesLoadingPromise; return; }

    villageIdToCoord.clear();
    villagesLoadedForWorld = null;

    const url = makeVillageTxtUrl(worldNorm);

    villagesLoadingPromise = (async () => {
      const resp = await gmGet(url);
      if (resp.status !== 200) throw new Error(`village.txt konnte nicht geladen werden (${resp.status}): ${resp.statusText || url}`);

      const lines = String(resp.responseText || "").split("\n");
      for (const line of lines) {
        if (!line) continue;
        const parts = line.split(",");
        if (parts.length < 4) continue;

        const id = parts[0];
        const x = parts[2];
        const y = parts[3];
        if (!id || !x || !y) continue;

        villageIdToCoord.set(id, `${x}|${y}`);
      }

      villagesLoadedForWorld = worldNorm;
    })();

    try { await villagesLoadingPromise; }
    finally { villagesLoadingPromise = null; }
  }

  function enrichWithCoordsOrNull(dsuObj) {
    const source = villageIdToCoord.get(dsuObj.sourceVillageId);
    const target = villageIdToCoord.get(dsuObj.targetVillageId);
    if (!source || !target) return null;
    return { ...dsuObj, sourceCoord: source, targetCoord: target };
  }

  // ===== Speeds aus /page/settings (lazy) =====
  const speedCache = {
    worldNorm: null,
    weltSpeed: null,
    einheitenSpeed: null,
    loadingPromise: null,
  };

  function parseGermanFloat(s) {
    return Number(String(s).trim().replace(",", "."));
  }

  function extractSpeedFromSettingsHtml(htmlText) {
    const doc = new DOMParser().parseFromString(String(htmlText || ""), "text/html");
    const tds = Array.from(doc.querySelectorAll("td"));

    function findValue(label) {
      const td = tds.find(x => (x.textContent || "").trim() === label);
      if (!td) return null;
      const sib = td.nextElementSibling;
      if (!sib) return null;
      return (sib.textContent || "").trim();
    }

    const welt = findValue("Spielgeschwindigkeit");
    const einheit = findValue("Einheitengeschwindigkeit");
    if (!welt || !einheit) return null;

    const weltSpeed = parseGermanFloat(welt);
    const einheitenSpeed = parseGermanFloat(einheit);
    if (!Number.isFinite(weltSpeed) || !Number.isFinite(einheitenSpeed)) return null;

    return { weltSpeed, einheitenSpeed };
  }

  async function ensureSpeedsLoaded(worldRaw) {
    const worldNorm = normalizeWorld(worldRaw);
    if (!worldNorm) throw new Error("Welt ist leer (bitte z. B. 'de170' eintragen).");

    if (speedCache.worldNorm === worldNorm && Number.isFinite(speedCache.weltSpeed) && Number.isFinite(speedCache.einheitenSpeed)) {
      return { weltSpeed: speedCache.weltSpeed, einheitenSpeed: speedCache.einheitenSpeed };
    }
    if (speedCache.loadingPromise) {
      await speedCache.loadingPromise;
      return { weltSpeed: speedCache.weltSpeed, einheitenSpeed: speedCache.einheitenSpeed };
    }

    speedCache.worldNorm = worldNorm;
    speedCache.weltSpeed = null;
    speedCache.einheitenSpeed = null;

    const url = makeSettingsUrl(worldNorm);

    speedCache.loadingPromise = (async () => {
      const resp = await gmGet(url);
      if (resp.status !== 200) throw new Error(`settings-Seite nicht ladbar (${resp.status}): ${resp.statusText || url}`);

      const extracted = extractSpeedFromSettingsHtml(resp.responseText || "");
      if (!extracted) throw new Error("Konnte Spiel-/Einheitengeschwindigkeit nicht aus settings-Seite extrahieren.");

      speedCache.weltSpeed = extracted.weltSpeed;
      speedCache.einheitenSpeed = extracted.einheitenSpeed;
    })();

    try { await speedCache.loadingPromise; }
    finally { speedCache.loadingPromise = null; }

    return { weltSpeed: speedCache.weltSpeed, einheitenSpeed: speedCache.einheitenSpeed };
  }

  // ===== Unit-Zeiten pro Feld (Grundwerte) =====
  const UNIT_SECONDS_PER_FIELD = Object.freeze({
    spear: 18 * 60,
    sword: 22 * 60,
    axe: 18 * 60,
    archer: 18 * 60,
    spy: 9 * 60,
    light: 10 * 60,
    marcher: 10 * 60,
    heavy: 11 * 60,
    ram: 30 * 60,
    catapult: 30 * 60,
    knight: 10 * 60,
    snob: 35 * 60,
  });

  function parseCoord(coord) {
    const [xStr, yStr] = String(coord || "").split("|");
    const x = Number(xStr), y = Number(yStr);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  }

  function distanceFields(srcCoord, tgtCoord) {
    const a = parseCoord(srcCoord);
    const b = parseCoord(tgtCoord);
    if (!a || !b) return null;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function computeTravelMsFromTable(slowestUnit, distFields, weltSpeed, einheitenSpeed) {
    const baseSecPerField = UNIT_SECONDS_PER_FIELD[slowestUnit];
    if (!Number.isFinite(distFields) || distFields === null) return null;
    if (!Number.isFinite(weltSpeed) || !Number.isFinite(einheitenSpeed)) return null;
    if (!Number.isFinite(baseSecPerField)) return null;

    const sec = (distFields * baseSecPerField) / (weltSpeed * einheitenSpeed);
    return Math.round(sec * 1000);
  }

  // ===== Encoding helpers =====
  function escapeStrForEncodedJson(value) {
    return String(value)
      .replace(/%/g, "%25")
      .replace(/"/g, "%22")
      .replace(/\|/g, "%7C");
  }
  function encodeIsoString(iso) { return escapeStrForEncodedJson(iso); }
  function encodeCoord(coord) { return escapeStrForEncodedJson(coord); }

  function unitsToEncodedBlockLikeBase(units) {
    const keys = ["spear","sword","axe","archer","spy","light","marcher","heavy","ram","catapult","knight","snob"];
    const parts = [];
    for (const k of keys) {
      const v = (units && Object.prototype.hasOwnProperty.call(units, k)) ? units[k] : null;
      const num = (typeof v === "number" && Number.isFinite(v)) ? v : 0;
      parts.push(`%22${k}%22:${num}`);
    }
    return `%7B${parts.join(",")}%7D`;
  }

  // ===== Sonderfälle über unk =====
  function isSupportByUnknownInt(unk) {
    // unk=0 => Support, sonst Attack
    return unk === 0;
  }

  function catapultTargetFromUnknownInt(unk) {
    // unk 30..44 => building, default wall
    switch (unk) {
      case 30: return "main";
      case 31: return "barracks";
      case 32: return "stable";
      case 33: return "garage";
      case 34: return "church";
      case 35: return "snob";
      case 36: return "smith";
      case 37: return "place";
      case 39: return "market";
      case 40: return "wood";
      case 41: return "stone";
      case 42: return "iron";
      case 43: return "farm";
      case 44: return "storage";
      default: return "wall";
    }
  }

  // ===== Build Commands (encoded) =====
  function buildEncodedCommandEntry(cmdId, cmd) {
    const id = cmdId;

    const name = "%22egal%22";
    const sourceVillageId = `%22${escapeStrForEncodedJson(cmd.sourceVillageId)}%22`;
    const targetVillageId = `%22${escapeStrForEncodedJson(cmd.targetVillageId)}%22`;
    const source = `%22${encodeCoord(cmd.sourceCoord)}%22`;
    const target = `%22${encodeCoord(cmd.targetCoord)}%22`;

    const launchIso = cmd.launchTimeUtc.toISOString();
    const arrivalIso = cmd.arrivalTimeUtc.toISOString();

    const launchTime = `%22${encodeIsoString(launchIso)}%22`;
    const arrivalTime = `%22${encodeIsoString(arrivalIso)}%22`;

    const slowestUnit = `%22${escapeStrForEncodedJson(cmd.slowestUnit)}%22`;
    const unitsBlock = unitsToEncodedBlockLikeBase(cmd.units);

    const type = isSupportByUnknownInt(cmd.unk) ? "%22Support%22" : "%22Attack%22";

    const done = "false";
    const toUse = "%22100%22";
    const autoSend = "true";
    const preparedByBot = "false";
    const randomOffset = "0";
    const randomOffsetTime = launchTime;
    const sigil = "0";
    const leaveCats = "0";
    const leaveSpies = "0";
    const leaveRams = "0";
    const ntTemplate = "%22firstNobleRedNT%22";

    const catapultTargetValue = catapultTargetFromUnknownInt(cmd.unk);
    const catapultTarget = `%22${escapeStrForEncodedJson(catapultTargetValue)}%22`;

    const duplicateError = "false";

    const obj =
      `%7B` +
      `%22id%22:${id},` +
      `%22name%22:${name},` +
      `%22sourceVillageId%22:${sourceVillageId},` +
      `%22targetVillageId%22:${targetVillageId},` +
      `%22source%22:${source},` +
      `%22target%22:${target},` +
      `%22launchTime%22:${launchTime},` +
      `%22arrivalTime%22:${arrivalTime},` +
      `%22slowestUnit%22:${slowestUnit},` +
      `%22units%22:${unitsBlock},` +
      `%22type%22:${type},` +
      `%22done%22:${done},` +
      `%22toUse%22:${toUse},` +
      `%22autoSend%22:${autoSend},` +
      `%22preparedByBot%22:${preparedByBot},` +
      `%22randomOffset%22:${randomOffset},` +
      `%22randomOffsetTime%22:${randomOffsetTime},` +
      `%22sigil%22:${sigil},` +
      `%22leaveCats%22:${leaveCats},` +
      `%22leaveSpies%22:${leaveSpies},` +
      `%22leaveRams%22:${leaveRams},` +
      `%22ntTemplate%22:${ntTemplate},` +
      `%22catapultTarget%22:${catapultTarget},` +
      `%22duplicateError%22:${duplicateError}` +
      `%7D`;

    return `%22${id}%22:${obj}`;
  }

  function buildCommandsBlock(commands, startId) {
    const entries = [];
    let id = startId;
    for (const cmd of commands) {
      entries.push(buildEncodedCommandEntry(id, cmd));
      id++;
    }
    return { block: entries.join(","), nextCounter: id };
  }

  // ===== GUI =====
  const initial = loadState() || { collapsed: true, world: "", importText: "", existingStateText: "", exportText: "" };

  const panel = el("div", { id: "dkc-panel" });

  const header = el("div", { id: "dkc-header" });
  const actions = el("div", { id: "dkc-actions" });
  const btnToggle = el("button", { class: "dkc-btn", type: "button", text: initial.collapsed ? "Öffnen" : "Zuklappen" });
  const btnClose = el("button", { class: "dkc-btn", type: "button", text: "Schließen" });
  actions.append(btnToggle, btnClose);
  header.append(el("div", { id: "dkc-title", text: "DSU → Kumin Converter" }), actions);

  const body = el("div", { id: "dkc-body" });

  const worldRow = el("div", { class: "dkc-row" });
  worldRow.append(
    el("div", { class: "dkc-label", text: "Welt:" }),
    el("input", { class: "dkc-input", type: "text", placeholder: "z. B. de170", value: initial.world })
  );
  const worldInput = worldRow.querySelector("input");

  const importRow = el("div", { class: "dkc-row" });
  const importTa = el("textarea", { class: "dkc-textarea", placeholder: "DSU-Zeilen hier einfügen (eine pro Zeile) …" });
  importTa.value = initial.importText;
  importRow.append(el("div", { class: "dkc-label", text: "Import (DSU-Exportzeilen):" }), importTa);

  const existingRow = el("div", { class: "dkc-row" });
  const existingTa = el("textarea", { class: "dkc-textarea", placeholder: "Optional: aktuellen Kumin-Export hier einfügen (für Merge) …" });
  existingTa.value = initial.existingStateText || "";
  existingRow.append(el("div", { class: "dkc-label", text: "Aktueller Kumin-State (optional, für Merge):" }), existingTa);

  const exportRow = el("div", { class: "dkc-row" });
  const exportTa = el("textarea", { id: "dkc-export", class: "dkc-textarea", readonly: "readonly" });
  exportTa.value = initial.exportText;
  exportRow.append(el("div", { class: "dkc-label", text: "Export (encoded, direkt in Kumin importierbar):" }), exportTa);

  const footer = el("div", { id: "dkc-footer" });
  const btnConvert = el("button", { class: "dkc-btn", type: "button", text: "Konvertieren" });
  const btnCopy = el("button", { class: "dkc-btn", type: "button", text: "Export kopieren" });
  const btnClearExport = el("button", { class: "dkc-btn", type: "button", text: "Export leeren" });
  footer.append(btnConvert, btnCopy, btnClearExport);

  body.append(worldRow, importRow, existingRow, exportRow, footer);
  panel.append(header, body);
  document.body.appendChild(panel);

  function persist() {
    saveState({
      collapsed: panel.classList.contains("dkc-collapsed"),
      world: worldInput.value.trim(),
      importText: importTa.value,
      existingStateText: existingTa.value,
      exportText: exportTa.value,
    });
  }

  function setCollapsed(collapsed) {
    panel.classList.toggle("dkc-collapsed", collapsed);
    btnToggle.textContent = collapsed ? "Öffnen" : "Zuklappen";
    persist();
  }

  btnToggle.addEventListener("click", () => setCollapsed(!panel.classList.contains("dkc-collapsed")));
  btnClose.addEventListener("click", () => panel.remove());
  worldInput.addEventListener("input", persist);
  importTa.addEventListener("input", persist);
  existingTa.addEventListener("input", persist);

  btnClearExport.addEventListener("click", () => {
    exportTa.value = "";
    persist();
  });

  btnCopy.addEventListener("click", async () => {
    const ok = await copyToClipboard(exportTa.value);
    btnCopy.textContent = ok ? "Kopiert" : "Kopieren fehlgeschlagen";
    setTimeout(() => (btnCopy.textContent = "Export kopieren"), 900);
  });

  // ===== Convert =====
  btnConvert.addEventListener("click", async () => {
    btnConvert.disabled = true;
    try {
      const world = worldInput.value.trim();
      const worldNorm = normalizeWorld(world);
      if (!worldNorm) throw new Error("Bitte eine Welt angeben (z. B. de170).");

      // Base: entweder bestehender State (Merge) oder unser Base-Template (Replace)
      const existingStateRaw = (existingTa.value || "").trim();
      const doMerge = existingStateRaw.length > 0;
      const baseEncoded = doMerge ? existingStateRaw : BASE_KUMIN_EXPORT_1CMD;

      const { prefix, commandsContent: existingCommandsContent, suffixFromEndMarker, counter } = splitKuminExport(baseEncoded);

      // 1) Parse DSU lines
      const rawLines = importTa.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const parsed = [];
      for (const line of rawLines) {
        const p = parseDsuLineStrict(line);
        if (p) parsed.push(p);
      }
      if (!parsed.length) {
        exportTa.value = "Keine gültigen DSU-Zeilen gefunden.";
        persist();
        return;
      }

      exportTa.value = `OK: ${parsed.length} DSU-Zeile(n).\nLade villages…`;
      persist();

      // 2) villages (lazy)
      await ensureVillagesLoaded(worldNorm);

      exportTa.value = `Villages geladen.\nLade Geschwindigkeiten aus settings…`;
      persist();

      // 3) speeds (lazy)
      const { weltSpeed, einheitenSpeed } = await ensureSpeedsLoaded(worldNorm);

      exportTa.value = `OK: Spiel=${weltSpeed}, Einheit=${einheitenSpeed}\nBerechne Launch/Arrival…`;
      persist();

      // 4) Enrich coords + compute launch (Fehlerzeilen fliegen raus)
      const enriched = [];
      for (const p of parsed) {
        const e = enrichWithCoordsOrNull(p);
        if (!e) continue;

        const dist = distanceFields(e.sourceCoord, e.targetCoord);
        const travelMs = computeTravelMsFromTable(e.slowestUnit, dist, weltSpeed, einheitenSpeed);
        if (travelMs === null) continue;

        const launch = new Date(e.arrivalTimeUtc.getTime() - travelMs);

        // LaunchTime immer auf .500ms setzen
        launch.setMilliseconds(500);

        enriched.push({ ...e, launchTimeUtc: launch });
      }

      if (!enriched.length) {
        exportTa.value = "Alle Zeilen rausgefiltert (IDs/Timing konnten nicht berechnet werden).";
        persist();
        return;
      }

      exportTa.value = `OK: ${enriched.length} Zeile(n).\nBaue Commands + Export…`;
      persist();

      // 5) Build commands & assemble
      // - Merge: IDs starten beim bestehenden counter (next free id)
      // - Replace: IDs starten wie gehabt bei 36 und ersetzen den Dummy-Command
      const startId = doMerge ? counter : 36;

      const { block: newCommandsBlock, nextCounter } = buildCommandsBlock(enriched, startId);

      const mergedCommandsBlock = doMerge
        ? (existingCommandsContent ? (existingCommandsContent + "," + newCommandsBlock) : newCommandsBlock)
        : newCommandsBlock;

      const finalExport = assembleExport(prefix, mergedCommandsBlock, suffixFromEndMarker, nextCounter);

      exportTa.value = finalExport;
      persist();
    } catch (e) {
      exportTa.value = `Fehler: ${e && e.message ? e.message : String(e)}`;
      persist();
    } finally {
      btnConvert.disabled = false;
    }
  });

  // Init
  setCollapsed(Boolean(initial.collapsed));
})();
