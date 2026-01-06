// ==UserScript==
// @name         [TKK] Build Bot (Quest/Reward Patch + Debug + Human-Speed)
// @namespace    https://tikaykhan.net/
// @version      1.3.6-debug-human-popfarm-lock-ui
// @author       TiKayKhan + Patch
// @downloadURL  https://tikaykhan.net/tw/build.user.js
// @include      https://*.die-staemme.de/game.php?*
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function (root, $) {
  'use strict';

  const ready = (selector, callback) => {
    $(selector).length ? callback() : setTimeout(() => ready(selector, callback), 100);
  };

  (function inject() {
    if (typeof game_data === 'undefined') {
      setTimeout(inject, 100);
    } else {
      const game = {
        world: game_data.world,
        player: game_data.player,
        village: game_data.village,
        features: game_data.features,
        target: (container) => {
          return new TargetSelection(container);
        },
      };

      const check = (abc) => {
        if ($('div#bot_check, div#popup_box_bot_protection').length) {
          let html = '<h2 style="text-align: center; color: red;">' + Date() + '</h2>';
          if ($('div#bot_check').length) {
            $('div#bot_check').append(html);
          } else {
            $('div.popup_box_content').append(html);
          }
          // external Anti-Bot-Check
          if (abc) {
            $('div#bot_check, div#popup_box_bot_protection')
              .find('iframe')
              .css('padding', '4px 3px 2px 4px')
              .css('background-color', '#abc');
            root.document.title = 'TKK ABC';
          }
          return false;
        } else {
          return true;
        }
      };

      if (root.location.href.match('screen=main')) {
        ready('td#content_value table:first', () => {
          let codes = [
            { name: 'wood', image: '3', title: 'Holzf&auml;llerlager', levels: 30 }, // 0
            { name: 'stone', image: '3', title: 'Lehmgrube', levels: 30 }, // 1
            { name: 'iron', image: '3', title: 'Eisenmine', levels: 30 }, // 2
            { name: 'farm', image: '3', title: 'Bauernhof', levels: 30 }, // 3
            { name: 'storage', image: '3', title: 'Speicher', levels: 30 }, // 4
            { name: 'main', image: '3', title: 'Hauptgeb&auml;ude', levels: 30 }, // 5
            { name: 'place', image: '1', title: 'Versammlungsplatz', levels: 1 }, // 6
            { name: 'statue', image: '1', title: 'Statue', levels: 1 }, // 7
            { name: 'smith', image: '3', title: 'Schmiede', levels: 20 }, // 8
            { name: 'barracks', image: '3', title: 'Kaserne', levels: 25 }, // 9
            { name: 'stable', image: '3', title: 'Stall', levels: 20 }, // 10
            { name: 'garage', image: '3', title: 'Werkstatt', levels: 15 }, // 11
            { name: 'market', image: '3', title: 'Marktplatz', levels: 25 }, // 12
            { name: 'wall', image: '3', title: 'Wall', levels: 20 }, // 13
            { name: 'hide', image: '1', title: 'Versteck', levels: 10 }, // 14
            { name: 'snob', image: '1', title: 'Adelshof', levels: 1 }, // 15
            { name: 'church', image: '3', title: 'Kirche', levels: 3 }, // 16
            { name: 'watchtower', image: '3', title: 'Wachturm', levels: 20 }, // 17
          ];

          // === 8 Quick-Templates (Buttons 1..8) ===
          const tkkPresetTemplates = {
            1: ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"],
            2: ["5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","9","12","12","13","5","0","1","2","4","13","12","5","0","1","2","13","4","12","5","0","1","2","4","13","12","5","0","1","2","4","5","0","1","2","4","0","1","0","1","5","13","4","12","0","1","2","0","1","5","4","12","2","0","1","9","9","9","9","13","8","8","8","8","8","10","10","10","0","1","2","5","4","12","0","1","2","0","1","2","5","4","12","0","1","2","5","4","12","1","0","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","0","1","2","4","0","1","2","2","2","2","-","-","-","-"],
            3: ["2","1","0","1","0","1","0","2","1","0","2","1","0","2","1","0","2","1","0","5","5","5","5","5","4","4","4","2","1","0","2","1","0","2","1","9","9","9","9","9","0","2","1","0","2","1","0","4","4","4","5","5","5","5","5","12","12","12","12","12","4","4","4","4","4","8","8","8","8","8","3","3","3","3","3","2","1","0","2","1","0","5","5","4","4","3","3","2","1","0","4","2","1","0","5","0","4","1","1","3","4","5","0","0","1","1","0","5","2","1","0","2","4","5","2","2","1","5","5","5","5","0","9","9","9","9","4","4","4","8","8","8","8","8","10","10","10","9","2","1","0","4","5","4","5","5","5","4","5","4","3","3","3","13","13","13","13","13","3","3","3","3","2","1","0","2","1","0","2","1","0","2","1","0","9","9","9","9","10","10","4","9","2","1","0","2","0","2","2","1","8","8","8","8","8","11","11","4","4","4","8","8","8","8","8","8","8","8","8","8","12","12","12","12","12","15","13","13","13","13","13","10","10","10","0","2","1","0","9","9","9","9","9","1","2","0","1","2","9","9","9","9","9"],
            4: ['13', '13', '13', '13', '13', '13', '13','13','13','13'],
            5: ['13', '13', '13', '13', '13', '13', '13','13','13','13','13','13','13','13','13'],
            6: ['13', '13', '13', '13', '13', '13', '13','13','13','13','13', '13', '13', '13', '13', '13', '13','13','13','13'],
            7: ["5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","9","9","9","9","9","8","8","8","8","8","8","8","12","12","12","12","12","12","12","12","12","12","8","8","8","8","8","8","8","8","8","8","8","8","8","15"],
            8: ["5","5","5","5","5","9","9","9","9","8","8","8","8","8","9","5","5","5","5","5","9","10","10","10","9","9","9","9","10","10","8","8","8","9","10","8","8","9","10","11","11","11","11","11","9","9","10","9","10","10","9","10","9","10","9","10","11","11","11","9","9","10","10","9","9","9","10","10","9","9","10","10","10"],
          };

          // === Button labels (hier umbenennen) ===
          const tkkPresetButtonLabels = {
            1: 'Standard 1',
            2: 'Standard 2',
            3: 'Standard 3',
            4: 'Wall 10',
            5: 'Wall 15',
            6: 'Wall 20',
            7: 'Ah Push',
            8: 'Truppen Push',
          };

          let count = 8;
          let selected =
            GM_getValue('tkk.build.selectedTemplate.' + game.world + '.' + game.village.id) || 1;
          if (selected > count) selected = 1;

          let fallback = [
            '2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0',
            '5','5','5','5','5','4','4','4','4','4','3','3','3','3','3','2','1','0','2','1','0','5','5','4','4','3','3','2','1','0',
            '4','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','3','2','1','0','2','1','0','2','1','0',
            '2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2','1','0','2'
          ];

          let queue =
            JSON.parse(GM_getValue('tkk.build.buildQueue.' + game.world + '.' + selected) || null) ||
            fallback;

          let colors = {
            default: '',
            built: '#5a09',
            building: '#5af9',
            unbuildable: '#aaa9',
            error: '#a009',
          };
          let state =
            GM_getValue('tkk.build.queueState.' + game.world + '.' + game.player.id) || 'minus';
          let quests = GM_getValue('tkk.build.doQuests.' + game.world + '.' + game.player.id) || false;

          // === Farm-Lock Einstellungen (neu) ===
          const tkkFarmLockEnabledKey = 'tkk.build.farmLock.enabled.' + game.world + '.' + game.player.id;
          const tkkFarmLockThresholdKey = 'tkk.build.farmLock.threshold.' + game.world + '.' + game.player.id;

          let tkkFarmLockEnabled = GM_getValue(tkkFarmLockEnabledKey);
          if (typeof tkkFarmLockEnabled !== 'boolean') tkkFarmLockEnabled = true; // Default: aktiv

          let tkkFarmLockThresholdPct = parseFloat(GM_getValue(tkkFarmLockThresholdKey));
          if (!isFinite(tkkFarmLockThresholdPct) || tkkFarmLockThresholdPct <= 0 || tkkFarmLockThresholdPct >= 100) {
            tkkFarmLockThresholdPct = 10; // Default: 10%
          }

          let columns = 20;
          let rerun = 5;
          let wait = true;
          let disable = false;

          // Start/Stop Toggle State
          let tkkRunning = false;
          let tkkRunTimer = null;

          const tkkSetStartButtonUi = () => {
            const $btn = $('input#tkk-start');
            if (!$btn.length) return;
            $btn.prop('disabled', false);
            $btn.val(tkkRunning ? 'Stoppen' : 'Starten');
          };

          const tkkStop = () => {
            tkkRunning = false;
            disable = false;
            if (tkkRunTimer) {
              try { clearTimeout(tkkRunTimer); } catch (e) {}
              tkkRunTimer = null;
            }
            tkkSetStartButtonUi();
          };

          const tkkStart = () => {
            if (!check()) {
              tkkRunning = false;
              tkkSetStartButtonUi();
              return;
            }
            tkkRunning = true;
            disable = true;
            tkkSetStartButtonUi();
            run();
          };

          // ===== Pop-Logic (Farm Lock + UI) =====
          const tkkGetPopStats = () => {
            const curTxt = ($('#pop_current_label').text() || '').trim();
            const maxTxt = ($('#pop_max_label').text() || '').trim();

            const current = parseInt(curTxt.replace(/[^\d]/g, ''), 10);
            const max = parseInt(maxTxt.replace(/[^\d]/g, ''), 10);
            if (!isFinite(current) || !isFinite(max) || max <= 0) return null;

            const free = Math.max(0, max - current);
            const freeRatio = free / max; // 0..1
            return { current, max, free, freeRatio };
          };

          const tkkGetFarmThresholdRatio = () => {
            let v = parseFloat($('#tkk-farmthreshold').val());
            if (!isFinite(v)) v = tkkFarmLockThresholdPct;
            v = Math.max(1, Math.min(99, v));
            return v / 100;
          };

          const tkkIsLowPop = () => {
            if (!tkkFarmLockEnabled) return false;
            const stats = tkkGetPopStats();
            if (!stats) return false;
            const thr = tkkGetFarmThresholdRatio();
            return stats.freeRatio < thr;
          };

          const tkkFarmPriorityStep = () => {
            // Wenn Farm bereits in der Bauqueue ist => warten
            if ($('tr.buildorder_farm').length) return false;

            const cur = parseInt(game.village.buildings.farm || '0', 10) || 0;
            const nextLevel = cur + 1;

            const $farmLink = $('a#main_buildlink_farm_' + nextLevel);

            // Wenn klickbar/visible => klicken
            if ($farmLink.length && $farmLink.filter(':visible').length) {
              $farmLink.mousedown().click().mouseup();
              return true;
            }

            // Falls unmet -> warten
            const $unmetLink = $('table#buildings_unmet a[href$="farm"]');
            if (wait && $unmetLink.length) return false;

            // Sonst: Hard-Lock = ebenfalls warten
            return false;
          };

          const tkkEnsureFarmLockUi = () => {
            if ($('#tkk-farmlockwrap').length) return;
            const $start = $('input#tkk-start');
            if (!$start.length) return;

            const checked = tkkFarmLockEnabled ? ' checked' : '';
            const val = (isFinite(tkkFarmLockThresholdPct) ? tkkFarmLockThresholdPct : 10);

            const html =
              '<span id="tkk-farmlockwrap" style="margin-left: 10px; white-space: nowrap;">' +
                '<label style="margin-right: 6px;">' +
                  '<input type="checkbox" id="tkk-farmforce"' + checked + ' style="vertical-align: -2px; margin-right: 4px;"/>' +
                  'Farm erzwingen' +
                '</label>' +
                '<input type="number" id="tkk-farmthreshold" min="1" max="99" step="0.1" value="' + val + '" ' +
                  'style="width: 55px; margin-right: 4px;"/>' +
                '<span>%</span>' +
              '</span>';

            $start.after($(html));
          };

          const tkkEnsurePopUi = () => {
            const $start = $('input#tkk-start');
            if (!$start.length) return;
            if ($('#tkk-popfree').length) return;

            const $span = $(
              '<span id="tkk-popfree" style="margin-left: 10px; font-weight: bold; vertical-align: middle;">Pop frei: --</span>'
            );
            // Pop-Anzeige soll NACH Farm-Lock-UI stehen, wenn vorhanden
            if ($('#tkk-farmlockwrap').length) $('#tkk-farmlockwrap').after($span);
            else $start.after($span);
          };

          const tkkUpdatePopUi = () => {
            const $el = $('#tkk-popfree');
            if (!$el.length) return;

            const stats = tkkGetPopStats();
            if (!stats) {
              $el.text('Pop frei: --');
              $el.css('cssText', 'color: inherit !important;');
              $el.removeAttr('title');
              return;
            }

            const pct = Math.round(stats.freeRatio * 1000) / 10; // 1 Nachkommastelle
            $el.text('        Bauernhof Frei: ' + pct + '%');

            const thrPct = parseFloat($('#tkk-farmthreshold').val());
            const effectiveThr = isFinite(thrPct) ? thrPct : tkkFarmLockThresholdPct;

            if (tkkFarmLockEnabled && stats.freeRatio < (effectiveThr / 100)) {
              $el.css('cssText', 'color: red !important;');
              $el.attr(
                'title',
                'Farm-Lock aktiv: freier Pop < ' + effectiveThr + '% (' + stats.free + '/' + stats.max + ')'
              );
            } else {
              $el.css('cssText', 'color: green !important;');
              $el.attr('title', 'Freier Pop: ' + stats.free + '/' + stats.max);
            }
          };

          let icon = (code) => {
            return (
              '<i class="icon building-' +
              codes[code].name +
              '" style="height: 16px; vertical-align: -3px;"></i><b>00</b>'
            );
          };

          let element = (code) => {
            let html =
              '<td role="tkk-element"' +
              (isNaN(code) ? '' : ' data-code="' + code + '"') +
              ' style="text-align: center; white-space: nowrap;">';
            return html + (isNaN(code) ? '&#160;'.repeat(8) : icon(code)) + '</td>';
          };

          let adjust = (content) => {
            let levels = {};
            $('td[role="tkk-element"]').each(function () {
              let code = $(this).data('code');
              if (!isNaN(code)) {
                let level = levels[code] || 1;
                let current = game.village.buildings[codes[code].name];
                let next = $('a.btn-build[data-building="' + codes[code].name + '"]').data('level-next');
                if (!next && $('tr.buildorder_' + codes[code].name).length) next = codes[code].levels + 1;

                if (content) $(this).children('b').html(('0' + level).slice(-2));
                if (!current) {
                  $(this).css('background-color', colors.unbuildable);
                } else if (parseInt(current) >= level) {
                  $(this).css('background-color', colors.built);
                } else if (level > codes[code].levels) {
                  $(this).css('background-color', colors.error);
                } else if (level < next) {
                  $(this).css('background-color', colors.building);
                } else {
                  $(this).css('background-color', colors.default);
                }
                levels[code] = ++level;
              }
            });
          };

          let display = (function display() {
            $('div#tkk-queue').remove();

            // Buttons above the table
            let presetHtml = '<div id="tkk-presets" style="margin: 6px 0; text-align: center;">';
            for (let i = 1; i <= 8; i++) {
              const label = tkkPresetButtonLabels[i] || 'Preset ' + i;
              presetHtml +=
                '<input type="button" class="btn tkk-preset" data-preset="' +
                i +
                '" value="' +
                label +
                '" style="margin: 0 3px;"/>';
            }
            presetHtml += '</div>';

            let html =
              '<div id="tkk-queue">' +
              presetHtml +
              '<br/><table class="vis" style="width: 100%;"><tr><th colspan="' +
              columns +
              '">';
            html +=
              '<img id="tkk-toggle" src="graphic/' +
              state +
              '.png" style="vertical-align: -4px;"/>[TKK] Build Bot';
            html += '</th></tr><tr role="tkk-row"' + (state === 'plus' ? ' style="display: none;"' : '') + '>';

            if (queue.length) {
              for (let i = 0; i < queue.length; i++) {
                let code = queue[i];
                if (i && i % columns === 0) {
                  html += '</tr><tr role="tkk-row" ' + (state === 'plus' ? ' style="display: none;"' : '') + '>';
                }
                html += isNaN(code) ? element() : element(code);
                if (i + 1 === queue.length) {
                  html += element().repeat(columns - ((i + 1) % columns || columns));
                }
              }
            } else {
              html += element().repeat(columns);
            }

            html += '</tr><tr id="tkk-separator"' + (state === 'plus' ? ' style="display: none;"' : '') + '>';
            html +=
              '<td colspan="' +
              columns +
              '" style="text-align: center; background-color: #c1a264;">&#8593; DK: Herausnehmen &#8593; DK + STRG: Entfernen &#8593;</td></tr>';

            for (let i = 0; i < Math.ceil(codes.length / columns); i++) {
              html += '<tr' + (state === 'plus' ? ' style="display: none;"' : '') + '>';
              for (let ii = 0; ii < columns; ii++) {
                let code = i * columns + ii;
                if (codes[code]) {
                  html +=
                    '<td id="tkk-drag-' +
                    code +
                    '" data-code="' +
                    code +
                    '" title="' +
                    codes[code].title +
                    '" style="text-align: center;" draggable="true">';
                  html +=
                    '<img src="https://dsde.innogamescdn.com/asset/f1821a7a/graphic/buildings/mid/' +
                    codes[code].name +
                    codes[code].image +
                    '.png" style="max-width: 25px; max-height: 25px;"/></td>';
                } else {
                  html += '<td></td>';
                }
              }
              html += '</tr>';
            }

            html += '</tr><tr' + (state === 'plus' ? ' style="display: none;"' : '') + '>';
            html +=
              '<td colspan="' +
              columns +
              '" style="text-align: center; background-color: #c1a264;">&#8593; DK: Hinzuf&uuml;gen &#8593; D&D: Dazwischenschieben &#8593; D&D + STRG: Ersetzen &#8593;</td></tr><tr>';

            html +=
              '<td colspan="' +
              columns +
              '" style="text-align: center;"><select id="tkk-template" style="margin-right: 3px; vertical-align: 1px;">';
            for (let i = 1; i <= count; i++) {
              html += '<option value="' + i + '"' + (selected === i ? ' selected' : '') + '>Vorlage ' + i + '</option>';
            }
            html += '</select>';
            html += '<input type="button" id="tkk-add" value="+" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<input type="button" id="tkk-remove" value="-" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<input type="button" id="tkk-clear" value="X" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<input type="file" id="tkk-file" style="width: 13%; margin-left: 3px; vertical-align: 1px;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<input type="button" id="tkk-import" value="&#8593;" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<a id="tkk-export" href="data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(queue)) + '" download="queue.json" class="btn" style="width: 2%;' + (state === 'plus' ? ' display: none;' : '') + '">&#8595;</a>';
            html += '<input type="checkbox" id="tkk-safety" style="vertical-align: -2.5px;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<input type="button" id="tkk-default" value="Standard" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '" disabled/>';
            html += '<input type="button" id="tkk-save" value="Speichern" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
            html += '<input type="checkbox" id="tkk-quests" style="width: 15px; vertical-align: -2px;"' + (quests ? ' checked' : '') + '/>Quests ';
            html += '<input type="button" id="tkk-start" value="Starten" class="btn" style="width: 10%;"' + (disable ? ' disabled' : '') + '/>';
            html += '</td></tr></table></div>';

            $('td#content_value table:first').after(html);

            tkkSetStartButtonUi();

            // Ensure UI elements exist after render
            tkkEnsureFarmLockUi();
            tkkEnsurePopUi();
            tkkUpdatePopUi();

            adjust(true);
            return display;
          })();

          let update = setInterval(() => {
            if (!check()) return clearInterval(update);
            $('div#tkk-queue').length ? adjust(false) : display();

            // Keep UI alive and up-to-date
            tkkEnsureFarmLockUi();
            tkkEnsurePopUi();
            tkkUpdatePopUi();
          }, 1000);

          // ==== UI Events ====
          $('body').on('change', '#tkk-farmforce', function () {
            tkkFarmLockEnabled = !!$(this).prop('checked');
            GM_setValue(tkkFarmLockEnabledKey, tkkFarmLockEnabled);
            tkkUpdatePopUi();
          });

          $('body').on('change keyup', '#tkk-farmthreshold', function () {
            let v = parseFloat($(this).val());
            if (!isFinite(v)) v = 10;
            v = Math.max(1, Math.min(99, v));
            tkkFarmLockThresholdPct = v;
            GM_setValue(tkkFarmLockThresholdKey, v);
            tkkUpdatePopUi();
          });

          $('body').on('click', 'img#tkk-toggle', function () {
            if ($(this).attr('src').match('minus')) {
              state = 'plus';
              $(this).attr('src', 'graphic/plus.png');
              $(this).closest('table').find('tr:not(:first):not(:last)').hide();
              $('input#tkk-add, input#tkk-remove, input#tkk-clear, input#tkk-file, input#tkk-import, a#tkk-export, input#tkk-safety, input#tkk-default, input#tkk-save').hide();
              GM_setValue('tkk.build.queueState.' + game.world + '.' + game.player.id, state);
            } else {
              state = 'minus';
              $(this).attr('src', 'graphic/minus.png');
              $(this).closest('table').find('tr').show();
              $('input#tkk-add, input#tkk-remove, input#tkk-clear, input#tkk-file, input#tkk-import, a#tkk-export, input#tkk-safety, input#tkk-default, input#tkk-save').show();
              GM_setValue('tkk.build.queueState.' + game.world + '.' + game.player.id, state);
            }
          });

          $('body').on('dblclick', 'td[role="tkk-element"]', function (event) {
            if (event.ctrlKey) {
              $(this).replaceWith(element());
            } else {
              let html = this;
              let skip = true;
              let last = null;
              $(this).closest('table').find('td[role="tkk-element"]').each(function () {
                if (this === html) skip = false;
                if (skip) return true;
                if (last !== null) $(last).replaceWith($(this).prop('outerHTML'));
                last = this;
              });
              $(last).replaceWith(element());
            }
            adjust(true);
          });

          $('body').on('dblclick', 'td[id^="tkk-drag"]', function () {
            let code = $(this).data('code');
            let $last = $('td[role="tkk-element"]:has(i):last');
            let $next = $last.next('td[role="tkk-element"]');
            if (!$next.length) $next = $last.parent().next('tr[role="tkk-row"]').children(':first');
            if (!$next.length) $next = $('td[role="tkk-element"]:first:not(:has(i))');
            $next.replaceWith(element(code));
            adjust(true);
          });

          $('body').on('dragstart', 'td[id^="tkk-drag"]', function (event) {
            event.originalEvent.dataTransfer.setData('id', $(this).attr('id'));
          });

          $('body').on('dragenter dragover drop', 'td[role="tkk-element"]', function (event) {
            event.preventDefault();
            if (event.type === 'drop') {
              let id = event.originalEvent.dataTransfer.getData('id');
              let code = $('td#' + id).data('code');
              if (event.ctrlKey) {
                $(this).replaceWith(element(code));
              } else {
                let html = this;
                let skip = true;
                let last = null;
                $(this).closest('table').find('td[role="tkk-element"]').each(function () {
                  if (this === html) skip = false;
                  if (skip) return true;
                  $(this).replaceWith(last === null ? element(code) : last);
                  last = this;
                });
              }
              adjust(true);
            }
          });

          $('body').on('change', '#tkk-template', function () {
            selected = parseInt($(this).val(), 10);
            queue =
              JSON.parse(GM_getValue('tkk.build.buildQueue.' + game.world + '.' + selected) || null) ||
              fallback;
            GM_setValue('tkk.build.selectedTemplate.' + game.world + '.' + game.village.id, selected);
            display();
          });

          $('body').on('click', 'input#tkk-add', function () {
            $('tr#tkk-separator').before('<tr role="tkk-row">' + element().repeat(columns) + '</tr>');
          });

          $('body').on('click', 'input#tkk-remove', function () {
            $('tr[role="tkk-row"]:last').remove();
          });

          $('body').on('click', 'input#tkk-clear', function () {
            $('td[role="tkk-element"]').replaceWith(element());
          });

          $('body').on('click', 'input#tkk-import', function () {
            let file = $('input#tkk-file')[0].files[0];
            let reader = new FileReader();
            if (!file) return false;
            reader.readAsText(file);
            reader.onload = function (event) {
              queue = JSON.parse(event.target.result || null) || [];
              display();
            };
          });

          $('body').on('click', 'input#tkk-safety', function () {
            $('input#tkk-default').prop('disabled', !$(this).prop('checked'));
          });

          $('body').on('click', 'input#tkk-default', function () {
            queue = fallback;
            GM_deleteValue('tkk.build.buildQueue.' + game.world + '.' + selected);
            display();
          });

          $('body').on('click', 'input#tkk-quests', function () {
            quests = $(this).prop('checked');
            GM_setValue('tkk.build.doQuests.' + game.world + '.' + game.player.id, quests);
          });

          $('body').on('click', 'input#tkk-save', function () {
            let data = [];
            $('td[role="tkk-element"]').each(function () {
              let code = $(this).data('code');
              data.push(isNaN(code) ? '-' : code + '');
            });
            queue = data;
            GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(data));
            display();
          });

          $('body').on('click', 'input.tkk-preset', function () {
            const preset = parseInt($(this).data('preset'), 10) || 1;

            selected = preset;
            GM_setValue('tkk.build.selectedTemplate.' + game.world + '.' + game.village.id, selected);

            const presetQueue = (tkkPresetTemplates[preset] || tkkPresetTemplates[1] || []).slice();
            queue = presetQueue;

            GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(queue));
            display();
          });

          $('body').on('click', 'input#tkk-start', function () {
            if (tkkRunning) tkkStop();
            else tkkStart();
          });

          let quest = (id, screen) => {
            GM_setValue('tkk.quest.do.' + game.world + '.' + game.village.id + '.' + id, true);
            root.location.href = root.location.href.replace('main', screen).replace('&village=' + game.village.id, '');
          };

          let run = () => {
            if (!tkkRunning) {
              tkkSetStartButtonUi();
              return;
            }

            if (check()) {
              // use free complete
              if ($('a.btn-instant-free:visible').length) {
                $('a.btn-instant-free:visible').mousedown().click().mouseup();
              }

              // deny browser notification
              if ($('input#browser_notification_enable').length) {
                $('input#browser_notification_enable').prop('checked', false);
                $('a#browser_notification_enabled_button').mousedown().click().mouseup();
              }

              if (quests && $('div#questlog > div.quest').length) {
                let skip = true;
                let $popup = $('div#popup_box_quest');
                if ($popup.length) {
                  let warn = $popup.find('span.warn').length;
                  let $button = $popup.find('a.btn-confirm-yes');
                  if (
                    warn ||
                    !$button.length ||
                    (skip && $popup.find('a[onclick^="Quests.getQuest(1091)"]').length)
                  ) {
                    $button = $popup.find('a.popup_box_close');
                  }
                  $button.mousedown().click().mouseup();
                  setTimeout(() => {
                    if (tkkRunning) bot();
                  }, 1000);
                } else {
                  let $finished = $('div[id^="quest"].finished');
                  if (skip) $finished = $finished.not('#quest_1091');
                  if ($finished.length) {
                    $finished.first().mousedown().click().mouseup();
                    setTimeout(() => {
                      if (tkkRunning) run();
                    }, 1000);
                  } else {
                    if ($('div#quest_47').length) {
                      quest(47, 'mentor');
                    } else if ($('div#quest_48').length) {
                      quest(48, 'mentor');
                    } else if ($('div#quest_1111').length) {
                      quest(1111, 'premium');
                    } else if ($('div#quest_1140').length) {
                      quest(1140, 'train');
                    } else if ($('div#quest_1150 div.quest_progress[style]').length) {
                      quest(1150, 'train');
                    } else if ($('div#quest_1220').length && parseInt(game.player.email_valid)) {
                      quest(1220, 'market&mode=own_offer');
                    } else if ($('div#quest_1610').length) {
                      quest(1610, 'main');
                    } else if ($('div#quest_1620').length) {
                      quest(1620, 'info_player&edit=1');
                    } else if ($('div#quest_1630').length && parseInt(game.player.email_valid)) {
                      quest(1630, 'mail&mode=new');
                    } else if ($('div#quest_1640').length) {
                      quest(1640, 'ally');
                    } else if ($('div#quest_1650').length) {
                      quest(1650, 'forum&mode=new_thread');
                    } else if ($('div#quest_1660').length) {
                      quest(1660, 'forum');
                    } else if ($('div#quest_1820').length) {
                      quest(1820, 'place');
                    } else if ($('div#quest_1821').length) {
                      quest(1821, 'place');
                    } else if ($('div#quest_1860').length) {
                      quest(1860, 'farm');
                    } else if ($('div#quest_1840').length) {
                      quest(1840, 'flags');
                    } else if ($('div#quest_1890').length) {
                      quest(1890, 'settings&mode=ref');
                    } else if ($('div#quest_1920').length && false) {
                      quest(1920, 'statue');
                    } else if ($('div#quest_2020').length) {
                      quest(2020, 'place&mode=sim');
                    } else if ($('div#quest_8000').length) {
                      quest(8000, 'ranking&mode=dominance');
                    } else {
                      bot();
                    }
                  }
                }
              } else {
                bot();
              }
            }
          };

          let bot = () => {
            if (!tkkRunning) {
              tkkSetStartButtonUi();
              return;
            }

            // keep UI refreshed during run
            tkkUpdatePopUi();

            let additional = game.features.Premium.active ? 4 : 1;

            // If queue is full, just wait
            if ($('tr.sortable_row').length >= additional) {
              if (tkkRunTimer) {
                try { clearTimeout(tkkRunTimer); } catch (e) {}
                tkkRunTimer = null;
              }
              tkkRunTimer = setTimeout(() => {
                tkkRunTimer = null;
                if (tkkRunning) run();
              }, rerun * 1000);
              return;
            }

            // ===== HARD Farm Lock when free pop < threshold% (and enabled) =====
            if (tkkIsLowPop()) {
              // Attempt farm; if not possible yet => do NOTHING else (wait)
              tkkFarmPriorityStep();

              if (tkkRunTimer) {
                try { clearTimeout(tkkRunTimer); } catch (e) {}
                tkkRunTimer = null;
              }
              tkkRunTimer = setTimeout(() => {
                tkkRunTimer = null;
                if (tkkRunning) run();
              }, rerun * 1000);
              return;
            }

            // ===== Normal queue logic =====
            if ($('tr.sortable_row').length < additional) {
              let levels = {};
              for (let i = 0; i < queue.length; i++) {
                let code = queue[i];
                if (isNaN(code)) continue;
                let level = levels[code] || 1;
                let $build = $('a#main_buildlink_' + codes[code].name + '_' + level);
                if ($build.length) {
                  if ($build.filter(':visible').length) {
                    $build.mousedown().click().mouseup();
                  }
                  break;
                } else if (
                  wait &&
                  game.village.buildings[codes[code].name] === '0' &&
                  $('table#buildings_unmet a[href$="' + codes[code].name + '"]').length
                ) {
                  break;
                }
                levels[code] = level + 1;
              }
            }

            if (tkkRunTimer) {
              try { clearTimeout(tkkRunTimer); } catch (e) {}
              tkkRunTimer = null;
            }
            tkkRunTimer = setTimeout(() => {
              tkkRunTimer = null;
              if (tkkRunning) run();
            }, rerun * 1000);
          };

          // ============================================================
          // PATCH: Quest-/Reward-Handling bei abgeschlossenem Bauauftrag
          // - FIX: Queue Count via buildorder_* (statt sortable_row)
          // - DEBUG Logs
          // - Human-visible speed (slower but still quick)
          // - Rewards stop when warning is present in same cell (storage warning)
          // - Clean coupling to quests checkbox
          // ============================================================

          const TKK_DEBUG = true;

          const TKK_UI_OPEN_DELAY_MS = 650;
          const TKK_QUEST_STEP_DELAY_MS = 850;
          const TKK_COMPLETE_DELAY_MS = 950;
          const TKK_CLAIM_DELAY_MS = 900;
          const TKK_CLOSE_DELAY_MS = 650;
          const TKK_MONITOR_INTERVAL_MS = 500;

          const tkkNow = () => {
            try { return new Date().toISOString(); } catch (e) { return '' + Date(); }
          };

          const tkkLog = (...args) => {
            if (!TKK_DEBUG) return;
            try { console.log('[TKK][QR][' + tkkNow() + ']', ...args); } catch (e) {}
          };

          const tkkWarn = (...args) => {
            if (!TKK_DEBUG) return;
            try { console.warn('[TKK][QR][' + tkkNow() + ']', ...args); } catch (e) {}
          };

          const tkkErr = (...args) => {
            if (!TKK_DEBUG) return;
            try { console.error('[TKK][QR][' + tkkNow() + ']', ...args); } catch (e) {}
          };

          let tkkLastQueueCount = null;
          let tkkQuestBusy = false;
          let tkkLastCountsLogged = { buildorder: null, sortable: null };

          const tkkWaitFor = (condFn, timeoutMs, cb, intervalMs = 150, label = 'waitFor') => {
            const start = Date.now();
            tkkLog(label, 'start', { timeoutMs, intervalMs });
            (function poll() {
              let ok = false;
              try { ok = !!condFn(); } catch (e) { tkkErr(label, 'condFn threw', e); }
              if (ok) {
                tkkLog(label, 'success in', (Date.now() - start) + 'ms');
                return cb(true);
              }
              if (Date.now() - start >= timeoutMs) {
                tkkWarn(label, 'timeout after', (Date.now() - start) + 'ms');
                return cb(false);
              }
              setTimeout(poll, intervalMs);
            })();
          };

          const tkkClick = ($el, label = 'click') => {
            if (!$el || !$el.length) {
              tkkWarn(label, 'element not found');
              return false;
            }
            const el = $el.first();
            let descr = '';
            try {
              descr = el.prop('outerHTML');
              if (descr && descr.length > 220) descr = descr.slice(0, 220) + '...';
            } catch (e) {}
            tkkLog(label, 'mousedown/click/mouseup', descr);
            el.mousedown().click().mouseup();
            return true;
          };

          // FIX: "echte" Queue-Größe zählen (laufend + wartend)
          const tkkGetBuildQueueCount = () => {
            const $scope = $('#buildqueue, table#buildqueue').length ? $('#buildqueue, table#buildqueue') : $(document);
            return $scope.find('tr').filter(function () {
              return /(^|\s)buildorder_/.test(this.className || '');
            }).length;
          };

          const tkkDumpQuestDom = () => {
            if (!TKK_DEBUG) return;
            try {
              tkkLog('DOM dump', {
                hasNewQuest: $('#new_quest').length,
                hasLeftbar: $('#main-tab > div.quest-popup-leftbar').length,
                hasLeftbarUl: $('#main-tab > div.quest-popup-leftbar > ul').length,
                leftbarLiCount: $('#main-tab > div.quest-popup-leftbar > ul > li').length,
                finishedCount: $('#main-tab > div.quest-popup-leftbar > ul > li ul li').filter(function () {
                  return ((this.className || '').toLowerCase().includes('finished'));
                }).length,
                rewardBadgeRaw: ($('#reward-system-badge').text() || '').trim(),
                claimButtonsTotal: $('a.reward-system-claim-button').length
              });
            } catch (e) {
              tkkErr('DOM dump failed', e);
            }
          };

          const tkkCloseQuestPopup = (done) => {
            setTimeout(() => {
              const $close = $('a.popup_box_close.tooltip-delayed:visible, a.popup_box_close:visible').first();
              tkkClick($close, 'close quest popup');
              setTimeout(() => {
                if (typeof done === 'function') done();
              }, TKK_CLOSE_DELAY_MS);
            }, TKK_CLOSE_DELAY_MS);
          };

          const tkkClaimRewardsIfAny = (done) => {
            if (!tkkRunning || !quests) return done();

            const badgeText = ($('#reward-system-badge').text() || '');
            const badgeValue = parseInt(badgeText.replace(/[^\d]/g, ''), 10) || 0;

            tkkLog('reward badge parsed', { badgeText: badgeText.trim(), badgeValue });

            // Badge == 0 => direkt schließen
            if (badgeValue === 0) {
              tkkLog('reward badge is 0 => closing popup without claiming');
              return tkkCloseQuestPopup(done);
            }

            const $rewardTab = $('a.tab-link[data-tab="reward-tab"]').first();
            if ($rewardTab.length) {
              tkkClick($rewardTab, 'open reward-tab');
            } else {
              tkkWarn('reward-tab link not found; continuing anyway');
            }

            setTimeout(() => {
              tkkWaitFor(
                () => $('#reward-system-rewards').length > 0,
                10000,
                (ok) => {
                  if (!ok) {
                    tkkWarn('reward table not found => closing');
                    return tkkCloseQuestPopup(done);
                  }

                  const hasTdWarning = ($btn) => {
                    try { return $btn.closest('td').find('span.warn').length > 0; } catch (e) { return false; }
                  };

                  const claimNext = () => {
                    if (!tkkRunning || !quests) return done();

                    const $btn = $('a.btn.btn-confirm-yes.reward-system-claim-button:visible:not([disabled])').first();
                    if (!$btn.length) {
                      tkkLog('no more claim buttons => closing');
                      return tkkCloseQuestPopup(done);
                    }

                    // STOP: wenn in derselben Zelle eine Warnung steht (z.B. "Zu wenig Platz im Speicher")
                    if (hasTdWarning($btn)) {
                      const warnText = ($btn.closest('td').find('span.warn').first().text() || '').trim();
                      tkkWarn('warning detected in reward cell => stopping claims', { warnText });
                      return tkkCloseQuestPopup(done);
                    }

                    const rid = $btn.data('reward-id');
                    tkkLog('claiming reward', { rewardId: rid });

                    tkkClick($btn, 'click claim button');
                    setTimeout(claimNext, TKK_CLAIM_DELAY_MS);
                  };

                  tkkLog('claim buttons visible',
                    $('a.btn.btn-confirm-yes.reward-system-claim-button:visible:not([disabled])').length
                  );

                  setTimeout(claimNext, TKK_UI_OPEN_DELAY_MS);
                },
                200,
                'waitFor reward-system-rewards'
              );
            }, TKK_UI_OPEN_DELAY_MS);
          };

          const tkkCompleteFinishedQuests = (done) => {
            if (!tkkRunning || !quests) return done();

            const $ul = $('#main-tab > div.quest-popup-leftbar > ul');
            if (!$ul.length) {
              tkkWarn('leftbar UL not found => skipping quest completion');
              return done();
            }

            const ulLiCount = $ul.children('li').length;
            tkkLog('leftbar UL found', { ulLiCount });

            if (!ulLiCount) {
              tkkLog('leftbar UL empty => nothing to do');
              return done();
            }

            const findFinished = () =>
              $('#main-tab > div.quest-popup-leftbar > ul > li ul li').filter(function () {
                const cls = (this.className || '').toLowerCase();
                return cls.includes('finished');
              });

            const step = () => {
              if (!tkkRunning || !quests) return done();

              const $finished = findFinished();
              const n = $finished.length;
              tkkLog('finished quest entries found', n);

              if (!n) return done();

              const $li = $finished.first();
              const $link = $li.find('a.quest-link').first();

              if (!$link.length) {
                tkkWarn('quest-link missing inside finished li; aborting quest completion');
                return done();
              }

              const qid = $link.data('quest-id');
              const qline = $link.data('questline-id');
              const txt = ($link.text() || '').trim();

              tkkLog('click finished quest', { qid, qline, text: txt });
              tkkClick($link, 'click quest-link');

              setTimeout(() => {
                tkkWaitFor(
                  () => $('div.btn.btn-confirm-yes.status-btn.quest-complete-btn:visible').length > 0,
                  12000,
                  (ok) => {
                    if (!ok) {
                      tkkWarn('quest-complete-btn not found/visible after clicking quest', { qid, qline, text: txt });
                      return setTimeout(step, TKK_QUEST_STEP_DELAY_MS);
                    }

                    tkkClick($('div.btn.btn-confirm-yes.status-btn.quest-complete-btn:visible').first(), 'click quest-complete-btn');
                    setTimeout(step, TKK_COMPLETE_DELAY_MS);
                  },
                  200,
                  'waitFor quest-complete-btn'
                );
              }, TKK_QUEST_STEP_DELAY_MS);
            };

            setTimeout(step, TKK_UI_OPEN_DELAY_MS);
          };

          const tkkHandleQuestAfterBuild = () => {
            if (!tkkRunning || !quests) return;

            if (tkkQuestBusy) {
              tkkLog('handler skipped: already busy');
              return;
            }
            if (!check()) {
              tkkWarn('handler aborted: bot-check active');
              return;
            }
            if (!$('#new_quest').length) {
              tkkWarn('#new_quest not found => cannot open quest dialog');
              return;
            }

            tkkQuestBusy = true;
            tkkLog('handler started (after build finish)');

            setTimeout(() => {
              if (!$('#main-tab > div.quest-popup-leftbar').length) {
                tkkLog('quest popup not open -> clicking #new_quest');
                tkkClick($('#new_quest').first(), 'click #new_quest');
              } else {
                tkkLog('quest popup already open');
              }

              tkkWaitFor(
                () => $('#main-tab > div.quest-popup-leftbar').length > 0,
                12000,
                (ok) => {
                  tkkDumpQuestDom();

                  if (!ok) {
                    tkkWarn('quest leftbar did not appear => abort handler');
                    tkkQuestBusy = false;
                    return;
                  }

                  tkkCompleteFinishedQuests(() => {
                    tkkLog('finished quests processing done -> checking rewards');
                    tkkClaimRewardsIfAny(() => {
                      tkkLog('reward processing done -> handler finished');
                      tkkQuestBusy = false;
                    });
                  });
                },
                200,
                'waitFor quest leftbar'
              );
            }, TKK_UI_OPEN_DELAY_MS);
          };

          // Monitor: erkennt Bauabschluss über buildorder-Queue-Länge
          setInterval(() => {
            const ok = check();
            if (!ok) return;

            const buildorderCount = tkkGetBuildQueueCount();
            const sortableCount = $('tr.sortable_row').length;

            if (buildorderCount !== tkkLastCountsLogged.buildorder || sortableCount !== tkkLastCountsLogged.sortable) {
              tkkLog('counts changed', { buildorder: buildorderCount, sortable: sortableCount });
              tkkLastCountsLogged = { buildorder: buildorderCount, sortable: sortableCount };
            }

            if (tkkLastQueueCount === null) {
              tkkLastQueueCount = buildorderCount;
              tkkLog('monitor initialized', { buildorder: buildorderCount, sortable: sortableCount });
              return;
            }

            // Trigger: wenn Gesamt-Queue schrumpft => Bauauftrag abgeschlossen
            if (tkkRunning && quests && buildorderCount < tkkLastQueueCount) {
              tkkLog('BUILD FINISH DETECTED (buildorder shrank)', { from: tkkLastQueueCount, to: buildorderCount });
              tkkHandleQuestAfterBuild();
            }

            tkkLastQueueCount = buildorderCount;
          }, TKK_MONITOR_INTERVAL_MS);

          tkkLog('Quest/Reward debug patch active', {
            world: game.world,
            playerId: game.player.id,
            villageId: game.village.id,
            premium: !!(game.features && game.features.Premium && game.features.Premium.active),
            farmLock: { enabled: tkkFarmLockEnabled, thresholdPct: tkkFarmLockThresholdPct }
          });
        });
      }

      // ============================================================
      // Originaler Quest-Block (unverändert)
      // ============================================================
      ready('div#questlog', () => {
        let quests = GM_getValue('tkk.build.doQuests.' + game.world + '.' + game.player.id) || false;
        if (quests && $('div#questlog > div.quest').length) {
          let quest = (id) => {
            let flag = GM_getValue('tkk.quest.do.' + game.world + '.' + game.village.id + '.' + id);
            if (flag && !$('div#quest_' + id).length) {
              GM_deleteValue('tkk.quest.do.' + game.world + '.' + game.village.id + '.' + id);
              return false;
            } else {
              return flag;
            }
          };

          let done = (id, screen) => {
            GM_deleteValue('tkk.quest.do.' + game.world + '.' + game.village.id + '.' + id);
            GM_setValue('tkk.quest.done.' + game.world + '.' + game.village.id, true);
            setTimeout(() => {
              root.location.href = root.location.href.replace(screen, 'main');
            }, 1000);
          };

          let letter = (length) => {
            let salad = '';
            let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
              salad += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return salad;
          };

          if (root.location.href.match('screen=main')) {
            if (GM_getValue('tkk.quest.done.' + game.world + '.' + game.village.id)) {
              GM_deleteValue('tkk.quest.done.' + game.world + '.' + game.village.id);
              ready('input#tkk-start', () => {
                $('input#tkk-start').mousedown().click().mouseup();
              });
            }
          }

          if (root.location.href.match('screen=mentor')) {
            [47, 48].forEach((id) => {
              if (quest(id)) done(id, 'mentor');
            });
          }

          if (root.location.href.match('screen=premium')) {
            if (quest(1111)) done(1111, 'premium');
          }

          if (root.location.href.match('screen=train')) {
            [1140, 1150].forEach((id) => {
              if (quest(id)) {
                ready('input#spear_0:visible', () => {
                  $('input#spear_0').val(1);
                  $('input.btn-recruit').mousedown().click().mouseup();
                  done(id, 'train');
                });
              }
            });
          }

          if (root.location.href.match('screen=market&mode=own_offer(?!&village=' + game.village.id + ')')) {
            if (quest(1220)) {
              ready('input[type="submit"]', () => {
                $('input#res_sell_iron').click();
                $('input#res_buy_stone').click();
                $('input#res_sell_amount').val(10);
                $('input#res_buy_amount').val(10);
                $('input[name="multi"]').val(1);
                $('input[name="max_time"]').val(1);
                $('input[type="submit"]').mousedown().click().mouseup();
              });
            }
          }

          if (root.location.href.match('screen=market&mode=own_offer&village=' + game.village.id)) {
            if (quest(1220)) {
              ready('input[type="submit"]', () => {
                if ($('tr.offer_container').length) {
                  $('input[name="all"]').mousedown().click().mouseup();
                  $('input[name="delete"]').mousedown().click().mouseup();
                } else {
                  done(1220, 'market&mode=own_offer');
                }
              });
            }
          }

          if (root.location.href.match('screen=main')) {
            if (quest(1610)) {
              GM_deleteValue('tkk.quest.do.' + game.world + '.' + game.village.id + '.1610');
              GM_setValue('tkk.quest.done.' + game.world + '.' + game.village.id, true);
              setTimeout(() => {
                $('input[type="submit"]').mousedown().click().mouseup();
              }, 1000);
            }
          }

          if (root.location.href.match('screen=info_player&edit=1')) {
            if (quest(1620)) {
              ready('input[name="send"]', () => {
                $('input[name="send"]').mousedown().click().mouseup();
              });
            }
          }

          if (root.location.href.match('screen=info_player&village=' + game.village.id)) {
            if (quest(1620)) done(1620, 'info_player');
          }

          if (root.location.href.match('screen=mail&mode=new')) {
            if (quest(1630)) {
              ready('input[name="send"]', () => {
                $('input[name="to"]').val(game.player.name);
                $('input[name="subject"]').val('Quest');
                $('textarea[name="text"]').val('Quest');
                $('input[name="send"]').mousedown().click().mouseup();
              });
            }
          }

          if (root.location.href.match('screen=mail&mode=in')) {
            if (quest(1630)) done(1630, 'mail&mode=in');
          }

          if (root.location.href.match('screen=ally')) {
            if (quest(1640)) {
              if (parseInt(game.player.ally)) {
                done(1640, 'ally');
              } else {
                ready('input[type="submit"]', () => {
                  GM_setValue('tkk.quest.tribe.' + game.world + '.' + game.village.id, true);
                  $('input[name="name"]').val(letter(6));
                  $('input[name="tag"]').val(letter(6));
                  $('input[type="submit"]').mousedown().click().mouseup();
                });
              }
            }
          }

          if (root.location.href.match('screen=forum&mode=new_thread')) {
            if (quest(1650)) {
              ready('input[name="send"]', () => {
                $('input[name="subject"]').val('Quest');
                $('textarea[name="message"]').val('Quest');
                $('input[name="send"]').mousedown().click().mouseup();
              });
            }
          }

          if (root.location.href.match('screen=forum&screenmode=view_thread')) {
            if (quest(1650)) done(1650, 'forum&screenmode=view_thread');
          }

          if (root.location.href.match('screen=forum')) {
            if (quest(1660)) root.location.href = root.location.href.replace('forum', 'ally');
          }

          if (root.location.href.match('screen=ally')) {
            if (quest(1660)) {
              if (parseInt(game.player.ally)) {
                setTimeout(() => {
                  if ($('div#popup_box_feature_share').length) {
                    $('div#popup_box_feature_share a.btn-confirm-yes').mousedown().click().mouseup();
                  }
                  let tribe = GM_getValue('tkk.quest.tribe.' + game.world + '.' + game.village.id);
                  if (tribe) {
                    GM_deleteValue('tkk.quest.tribe.' + game.world + '.' + game.village.id);
                    $('a.evt-confirm').mousedown().click().mouseup();
                    ready('button.evt-confirm-btn', () => {
                      $('button.evt-confirm-btn').mousedown().click().mouseup();
                    });
                  } else {
                    done(1660, 'ally');
                  }
                }, 1000);
              } else {
                done(1660, 'ally');
              }
            }
          }

          if (root.location.href.match('screen=place(?!&village=' + game.village.id + ')')) {
            [1820, 1821].forEach((id) => {
              if (quest(id)) {
                ready('input#target_attack', () => {
                  $('a#selectAllUnits').mousedown().click().mouseup();
                  $('input[value="village_name"]').mousedown().click().mouseup();
                  $('input[name="input"]').val('Barbarendorf');
                  game.target($('div#command_target')[0]).fetchVillages();
                  ready('div.village-item:visible', () => {
                    $('div.village-item:has(span.village-info:contains(Barbaren)):first').mousedown().click().mouseup();
                    ready('div#place_target div.village-item', () => {
                      $('input#target_attack').mousedown().click().mouseup();
                    });
                  });
                });
              }
            });
          }

          if (root.location.href.match('screen=place&try=confirm')) {
            [1820, 1821].forEach((id) => {
              if (quest(id)) {
                ready('input#troop_confirm_go', () => {
                  $('input#troop_confirm_go').mousedown().click().mouseup();
                });
              }
            });
          }

          if (root.location.href.match('screen=place&village=' + game.village.id)) {
            [1820, 1821].forEach((id) => {
              if (quest(id)) done(id, 'place');
            });
          }

          if (root.location.href.match('screen=flags')) {
            if (quest(1840)) {
              ready('div#flags_container', () => {
                let $box = undefined;
                for (let i = 1; i <= 8; i++) {
                  if ($box) break;
                  for (let ii = 9; ii >= 1; ii--) {
                    if ($box) break;
                    if ($('div#flag_box_' + i + '_' + ii + '> span.flag_count').text()) {
                      $box = $('div#flag_box_' + i + '_' + ii);
                    }
                  }
                }
                if ($box) {
                  $box.mousedown().click().mouseup();
                  ready('div#confirmation-box:visible', () => {
                    $('div#confirmation-box button.btn-confirm-yes').mousedown().click().mouseup();
                    done(1840, 'flags');
                  });
                }
              });
            }
          }

          if (root.location.href.match('screen=farm')) {
            if (quest(1860)) {
              ready('a:contains(Miliz)', () => {
                let href = $('a:contains(Miliz)').attr('href');
                if (href.match('establish_militia')) {
                  root.location.href = href;
                } else {
                  done(1860, 'farm');
                }
              });
            }
          }

          if (root.location.href.match('screen=settings&mode=ref(?!&message=invitation_sent)')) {
            if (quest(1890)) {
              ready('input[type="submit"]', () => {
                $('input[name="email"]').val(letter(5) + '@' + letter(4) + '.de');
                $('textarea[name="text"]').val(letter(7));
                $('input[name="own_name"]').val(letter(5));
                $('input[name="friend_name"]').val(letter(5));
                $('input[name="consent"]').mousedown().click().mouseup();
                $('input[type="submit"]:first').mousedown().click().mouseup();
              });
            }
          }

          if (root.location.href.match('screen=settings&mode=ref&message=invitation_sent')) {
            if (quest(1890)) done(1890, 'settings&mode=ref&message=invitation_sent');
          }

          if (root.location.href.match('screen=statue')) {
            if (quest(1920)) {
              ready('a.knight_recruit_launch', () => {
                $('a.knight_recruit_launch').mousedown().click().mouseup();
                ready('input#knight_recruit_name', () => {
                  $('input#knight_recruit_name').val('Paladin');
                  $('a#knight_recruit_confirm').mousedown().click().mouseup();
                  ready('a.knight_recruit_abort', () => {
                    if ($('a.knight_recruit_rush').length) {
                      $('a.knight_recruit_rush').mousedown().click().mouseup();
                    }
                    done(1920, 'statue');
                  });
                });
              });
            }
          }

          if (root.location.href.match('screen=place&mode=sim')) {
            if (quest(2020)) done(2020, 'place&mode=sim');
          }

          if (root.location.href.match('screen=ranking&mode=dominance')) {
            if (quest(8000)) done(8000, 'ranking&mode=dominance');
          }
        }
      });
    }
  })();
})(this, jQuery);
