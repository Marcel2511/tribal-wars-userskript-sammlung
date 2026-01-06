// ==UserScript==
// @name         TKK Build Bot
// @namespace    https://tikaykhan.net/
// @version      1.4
// @author       TiKayKhan
// @description  Tribal Wars - Build Bot
// @include      https://*.die-staemme.de/*screen=main
// @include      https://*.die-staemme.de/*screen=main*
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function(root, $) {
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
                target: container => { return new TargetSelection(container) }
            };

            const check = abc => {
                if ($('div#bot_check, div#popup_box_bot_protection').length) {
                    let html = '<h2 style="text-align: center; color: red;">' + Date() + '</h2>';

                    if ($('div#bot_check').length) {
                        $('div#bot_check').append(html);
                    } else {
                        $('div.popup_box_content').append(html);
                    }

                    // external Anti-Bot-Check
                    if (abc) {
                        $('div#bot_check, div#popup_box_bot_protection').find('iframe').css('padding', '4px 3px 2px 4px').css('background-color', '#abc');

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
                        { name: 'watchtower', image: '3', title: 'Wachturm', levels: 20 } // 17
                    ];

                    let count = 5;
                    let selected = GM_getValue('tkk.build.selectedTemplate.' + game.world + '.' + game.village.id) || 1;
                    if (selected > count) selected = 1;

                    let fallback = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback1 = ["5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","9","12","12","13","5","0","1","2","4","13","12","5","0","1","2","13","4","12","5","0","1","2","4","13","12","5","0","1","2","4","5","0","1","2","4","0","1","0","1","5","4","12","0","1","2","0","1","5","4","12","2","0","1","9","9","9","9","8","8","8","8","8","10","10","10","0","1","2","5","4","12","0","1","2","0","1","2","5","4","12","0","1","2","5","4","12","1","0","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","0","1","2","4","0","1","2","-","-","-","-","-","-","-","-","-"];
                    let fallback2 = ["5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","5","0","1","2","3","4","9","12","12","13","5","0","1","2","4","13","12","5","0","1","2","13","4","12","5","0","1","2","4","13","12","5","0","1","2","4","5","0","1","2","4","0","1","0","1","5","13","4","12","0","1","2","0","1","5","4","12","2","0","1","9","9","9","9","13","8","8","8","8","8","10","10","10","0","1","2","5","4","12","0","1","2","0","1","2","5","4","12","0","1","2","5","4","12","1","0","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","5","4","0","1","2","0","1","2","4","0","1","2","-","-","-","-","-","-","-"];
                    let fallback3 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback4 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback5 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback6 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback7 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback8 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback9 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback10 = ["13","13","13","13","13","13","13","13","13","13","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback11 = ["13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback12 = ["13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","13","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback13 = ["5","5","5","5","5","9","9","9","9","8","8","8","8","8","9","5","5","5","5","5","9","10","10","10","9","9","9","9","10","10","8","8","8","9","10","8","8","9","10","11","11","11","11","11","9","9","10","9","10","10","9","10","9","10","9","10","11","11","11","9","9","10","10","9","9","9","10","10","9","9","10","10","10","11","11","11","11","11","11","11","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback14 = ["5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","5","9","9","9","9","9","8","8","8","8","8","8","8","12","12","12","12","12","12","12","12","12","12","8","8","8","8","8","8","8","8","8","8","8","8","8","15","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                        let fallback15 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback16 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback17 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
                    let fallback18 = ["5","4","6","1","0","3","2","1","0","2","1","0","2","5","5","4","4","12","2","2","1","0","2","1","3","3","3","4","0","2","4","1","0","1","4","0","12","12","12","12","5","1","5","0","3","1","5","0","4","3","2","1","3","0","5","4","4","0","3","1","0","1","5","2","5","0","4","1","3","5","2","1","0","4","2","4","4","5","0","1","2","4","5","5","1","0","2","4","3","3","3","3","3","5","5","2","1","0","5","2","5","5","4","3","2","5","1","0","4","5","1","0","4","5","4","2","1","0","3","4","1","0","2","3","4","5","1","0","2","3","4","1","0","5","2","3","5","4","1","0","5","2","4","4","2","3","2","3","2","3","8","8","8","8","8","8","9","9","9","9","9","8","8","10","10","10","10","8","8","11","11","11","8","8","8","8","8","8","8","8","8","8","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];


                    let queue = JSON.parse(GM_getValue('tkk.build.buildQueue.' + game.world + '.' + selected) || null) || fallback;
                    let colors = { default: '', built: '#5a09', building: '#5af9', unbuildable: '#aaa9', error: '#a009' };
                    let state = GM_getValue('tkk.build.queueState.' + game.world + '.' + game.player.id) || 'minus';
                    let quests = GM_getValue('tkk.build.doQuests.' + game.world + '.' + game.player.id) || false;

                    let columns = 20;
                    let rerun = 5;
                    let wait = true;
                    let disable = false;

                    let icon = code => {
                        return '<i class="icon building-' + codes[code].name + '" style="height: 16px; vertical-align: -3px;"></i><b>00</b>';
                    };

                    let element = code => {
                        let html = '<td role="tkk-element"' + (isNaN(code) ? '' : ' data-code="' + code + '"') + ' style="text-align: center; white-space: nowrap;">';
                        return html + (isNaN(code) ? ('&#160;').repeat(8) : icon(code)) + '</td>';
                    };

                    let adjust = content => {
                        let levels = {};

                        $('td[role="tkk-element"]').each(function() {
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

                        let html = '<div id="tkk-queue"><br/><table class="vis" style="width: 100%;"><tr>';
                        html += '<th colspan="' + columns + '" style="text-align: center; background-color: #c1a264;">Bauvorlagen</th></tr><tr>';
                        html += '<td colspan="' + columns + '" style="text-align: center;"><input type="button" id="bauvorlage1" value="Vorlage 1" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="bauvorlage2" value="Vorlage 2" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="bauvorlage3" value="Vorlage 3" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage4" value="Vorlage 4" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage5" value="Vorlage 5" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage6" value="Vorlage 6" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage7" value="Vorlage 7" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage8" value="Vorlage 8" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage9" value="Vorlage 9" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/></td></tr><tr>';

     //                   html += '<td colspan="' + columns + '" style="text-align: center;">';
                        html += '<input type="button" id="wall10" value="Wall 10" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="wall15" value="Wall 15" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="wall20" value="Wall 20" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="kaserne_stall_werkstadt" value="Kaserne/Stall/Werkstadt" class="btn" style="width: 20%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="AHpush" value="AHpush" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage10" value="Vorlage 10" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage11" value="Vorlage 11" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
     //                   html += '<input type="button" id="bauvorlage12" value="Vorlage 12" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>;
                        html += '</td></tr><tr>';

                        html += '<th colspan="' + columns + '"><img id="tkk-toggle" src="graphic/' + state + '.png" style="vertical-align: -4px;"/>[TKK] Build Bot';
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
                        html += '<td colspan="' + columns + '" style="text-align: center; background-color: #c1a264;">&#8593; DK: Herausnehmen &#8593; DK + STRG: Entfernen &#8593;</td></tr>';

                        for (let i = 0; i < Math.ceil(codes.length / columns); i++) {
                            html += '<tr' + (state === 'plus' ? ' style="display: none;"' : '') + '>';

                            for (let ii = 0; ii < columns; ii++) {
                                let code = i * columns + ii;

                                if (codes[code]) {
                                    html += '<td id="tkk-drag-' + code + '" data-code="' + code + '" title="' + codes[code].title + '" style="text-align: center;" draggable="true">';
                                    html += '<img src="https://dsde.innogamescdn.com/asset/f1821a7a/graphic/buildings/mid/' + codes[code].name + codes[code].image + '.png" style="max-width: 25px; max-height: 25px;"/></td>';
                                } else {
                                    html += '<td></td>';
                                }
                            }

                            html += '</tr>';
                        }

                        html += '</tr><tr' + (state === 'plus' ? ' style="display: none;"' : '') + '>';
                        html += '<td colspan="' + columns + '" style="text-align: center; background-color: #c1a264;">&#8593; DK: Hinzuf&uuml;gen &#8593; D&D: Dazwischenschieben &#8593; D&D + STRG: Ersetzen &#8593;</td></tr><tr>';
                        html += '<td colspan="' + columns + '" style="text-align: center;"><select id="tkk-template" style="margin-right: 3px; vertical-align: 1px;">';

                        for (let i = 1; i <= count; i++) {
                            html += '<option value="' + i + '"' + (selected === i ? ' selected' : '') + '>Vorlage ' + i + '</option>';
                        }

                        html += '</select><input type="button" id="tkk-add" value="+" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="tkk-remove" value="-" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="tkk-clear" value="X" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="file" id="tkk-file" style="width: 13%; margin-left: 3px; vertical-align: 1px;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="tkk-import" value="&#8593;" class="btn" style="width: 3%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<a id="tkk-export" href="data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(queue)) + '" download="queue.json" class="btn" style="width: 2%;' + (state === 'plus' ? ' display: none;' : '') + '">&#8595;</a>';
                        html += '<input type="checkbox" id="tkk-safety" style="vertical-align: -2.5px;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="tkk-default" value="Standard" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '" disabled/>';
                        html += '<input type="button" id="tkk-save" value="Speichern" class="btn" style="width: 10%;' + (state === 'plus' ? ' display: none;' : '') + '"/>';
                        html += '<input type="button" id="tkk-start" value="Starten" class="btn" style="width: 10%;"' + (disable ? ' disabled' : '') + '/></td></tr></table></div>';

                        $('td#content_value table:first').after(html);

                        adjust(true);

                        return display;
                    })();

                    let update = setInterval(() => {
                        check() ? $('div#tkk-queue').length ? adjust(false) : display() : clearInterval(update);
                    }, 1000);

                    $('body').on('click', 'img#tkk-toggle', function(event) {
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

                    $('body').on('dblclick', 'td[role="tkk-element"]', function(event) {
                        if (event.ctrlKey) {
                            $(this).replaceWith(element());
                        } else {
                            let html = this;
                            let skip = true;
                            let last = null;

                            $(this).closest('table').find('td[role="tkk-element"]').each(function() {
                                if (this === html) skip = false;
                                if (skip) return true;

                                if (last !== null) $(last).replaceWith($(this).prop('outerHTML'));

                                last = this;
                            });

                            $(last).replaceWith(element());
                        }

                        adjust(true);
                    });

                    $('body').on('dblclick', 'td[id^="tkk-drag"]', function(event) {
                        let code = $(this).data('code');

                        let $last = $('td[role="tkk-element"]:has(i):last');
                        let $next = $last.next('td[role="tkk-element"]');
                        if (!$next.length) $next = $last.parent().next('tr[role="tkk-row"]').children(':first');
                        if (!$next.length) $next = $('td[role="tkk-element"]:first:not(:has(i))');

                        $next.replaceWith(element(code));

                        adjust(true);
                    });

                    $('body').on('dragstart', 'td[id^="tkk-drag"]', function(event) {
                        event.originalEvent.dataTransfer.setData('id', $(this).attr('id'));
                    });

                    $('body').on('dragenter dragover drop', 'td[role="tkk-element"]', function(event) {
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

                                $(this).closest('table').find('td[role="tkk-element"]').each(function() {
                                    if (this === html) skip = false;
                                    if (skip) return true;

                                    $(this).replaceWith(last === null ? element(code) : last);

                                    last = this;
                                });
                            }

                            adjust(true);
                        }
                    });

                    $('body').on('change', '#tkk-template', function(event) {
                        selected = parseInt($(this).val());
                        queue = JSON.parse(GM_getValue('tkk.build.buildQueue.' + game.world + '.' + selected) || null) || fallback;

                        GM_setValue('tkk.build.selectedTemplate.' + game.world + '.' + game.village.id, selected);

                        display();
                    });

                    $('body').on('click', 'input#tkk-add', function(event) {
                        $('tr#tkk-separator').before('<tr role="tkk-row">' + element().repeat(columns) + '</tr>');
                    });

                    $('body').on('click', 'input#tkk-remove', function(event) {
                        $('tr[role="tkk-row"]:last').remove();
                    });

                    $('body').on('click', 'input#tkk-clear', function(event) {
                        $('td[role="tkk-element"]').replaceWith(element());
                    });

                    $('body').on('click', 'input#tkk-import', function(event) {
                        let file = $('input#tkk-file')[0].files[0];
                        let reader = new FileReader();

                        if (!file) return false;

                        reader.readAsText(file);
                        reader.onload = function(event) {
                            queue = JSON.parse(event.target.result || null) || [];

                            display();
                        };
                    });

                    $('body').on('click', 'input#tkk-safety', function(event) {
                        $('input#tkk-default').prop('disabled', !$(this).prop('checked'));
                    });

                    $('body').on('click', 'input#tkk-default', function(event) {
                        queue = fallback;

                        GM_deleteValue('tkk.build.buildQueue.' + game.world + '.' + selected);

                        display();
                    });

                    $('body').on('click', 'input#tkk-quests', function(event) {
                        quests = $(this).prop('checked');

                        GM_setValue('tkk.build.doQuests.' + game.world + '.' + game.player.id, quests);
                    });

                    $('body').on('click', 'input#tkk-save', function(event) {
                        let data = [];

                        $('td[role="tkk-element"]').each(function() {
                            let code = $(this).data('code');

                            data.push(isNaN(code) ? '-' : code + '');
                        });

                        queue = data;

                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(data));

                        display();
                    });

                    $('body').on('click', 'input#tkk-start', function(event) {
                        $(this).prop('disabled', true);

                        disable = true;

                        run();
                    });

                    $('body').on('click', 'input#bauvorlage1', function(event) {
                        queue = fallback1;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback1));

                        display();
                    });

                    $('body').on('click', 'input#bauvorlage2', function(event) {
                        queue = fallback2;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback2));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage3', function(event) {
                        queue = fallback3;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback3));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage4', function(event) {
                        queue = fallback4;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback4));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage5', function(event) {
                        queue = fallback5;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback5));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage6', function(event) {
                        queue = fallback6;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback6));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage7', function(event) {
                        queue = fallback7;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback7));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage8', function(event) {
                        queue = fallback8;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback8));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage9', function(event) {
                        queue = fallback9;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback9));
                        display();
                    });

                    $('body').on('click', 'input#wall10', function(event) {
                        queue = fallback10;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback10));

                        display();
                    });

                    $('body').on('click', 'input#wall15', function(event) {
                        queue = fallback11;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback11));
                        display();
                    });

                    $('body').on('click', 'input#wall20', function(event) {
                        queue = fallback12;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback12));
                        display();
                    });

                    $('body').on('click', 'input#kaserne_stall_werkstadt', function(event) {
                        queue = fallback13;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback13));
                        display();
                    });

                    $('body').on('click', 'input#AHpush', function(event) {
                        queue = fallback14;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback14));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage10', function(event) {
                        queue = fallback15;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback15));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage11', function(event) {
                        queue = fallback16;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback16));
                        display();
                    });

                    $('body').on('click', 'input#bauvorlage12', function(event) {
                        queue = fallback17;
                        GM_setValue('tkk.build.buildQueue.' + game.world + '.' + selected, JSON.stringify(fallback17));
                        display();
                    });

                    let quest = (id, screen) => {
                        GM_setValue('tkk.quest.do.' + game.world + '.' + game.village.id + '.' + id, true);

                        root.location.href = root.location.href.replace('main', screen).replace('&village=' + game.village.id, '');
                    };

                    let run = () => {
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

                                    if (warn || !$button.length || skip && $popup.find('a[onclick^="Quests.getQuest(1091)"]').length) {
                                        $button = $popup.find('a.popup_box_close');
                                    }

                                    $button.mousedown().click().mouseup();

                                    setTimeout(bot, 1000);
                                } else {
                                    let $finished = $('div[id^="quest"].finished');
                                    if (skip) $finished = $finished.not('#quest_1091');

                                    if ($finished.length) {
                                        $finished.first().mousedown().click().mouseup();

                                        setTimeout(run, 1000);
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
                                        } else if ($('div#quest_1920').length && false) { // deactivated
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
                        let additional = game.features.Premium.active ? 4 : 1;

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
                                } else if (wait && game.village.buildings[codes[code].name] === "0" && $('table#buildings_unmet a[href$="' + codes[code].name + '"]').length) {
                                    break;
                                }

                                levels[code] = level + 1;
                            }
                        }

                        setTimeout(run, rerun * 1000);
                    };
                });
            }

            ready('div#questlog', () => {
                let quests = GM_getValue('tkk.build.doQuests.' + game.world + '.' + game.player.id) || false;

                if (quests && $('div#questlog > div.quest').length) {
                    let quest = id => {
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

                    let letter = length => {
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
                        [47, 48].forEach(id => {
                            if (quest(id)) done(id, 'mentor');
                        });
                    }

                    if (root.location.href.match('screen=premium')) {
                        if (quest(1111)) done(1111, 'premium');
                    }

                    if (root.location.href.match('screen=train')) {
                        [1140, 1150].forEach(id => {
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
                        [1820, 1821].forEach(id => {
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
                        [1820, 1821].forEach(id => {
                            if (quest(id)) {
                                ready('input#troop_confirm_go', () => {
                                    $('input#troop_confirm_go').mousedown().click().mouseup();
                                });
                            }
                        });
                    }

                    if (root.location.href.match('screen=place&village=' + game.village.id)) {
                        [1820, 1821].forEach(id => {
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
                                    done(1860, 'farm')
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


//Führt den Starten Button aus und läd die Seite alle 5 Min neu
setTimeout(refresh, 2000);

function refresh() {
    population();
    document.getElementById("tkk-start").click();
    open_quests_rewards();
    reload();
}


//Öffnet das Popup der Quests und der Belohnungen
function open_quests_rewards() {
    setTimeout(function() {
        document.querySelector("#new_quest").click();
        go_to_tab_reward();
    }, 1000);
}

//Schließt das Popup der Quests und der Belohnungen
function close_quests_rewards() {
    setTimeout(function() {
        document.querySelector("#popup_box_quest a[class='popup_box_close tooltip-delayed']").click();
    }, 1000);
}

//Gehe in den Tab "Belohnungen
    function go_to_tab_reward() {
    setTimeout(function() {
        document.querySelector("a[data-tab='reward-tab']").click();
        if (document.querySelector("#reward-system-badge").innerText == "") {
            close_quests_rewards()
        } else {
            let i = 1;
            let rewards_number = parseInt(document.querySelector("#reward-system-badge").innerHTML.split("(")[1].split(")")[0]);
            reward();
            close_quests_rewards();
        }
    }, 1000);
}

function reward(i, r) {
  setTimeout(function() {
        let rewards_number = r;
        let storage = parseInt(document.querySelector("#storage").innerText);
        let wood = parseInt(document.querySelector("#wood").innerText);
        let stone = parseInt(document.querySelector("#stone").innerText);
        let iron = parseInt(document.querySelector("#iron").innerText);

        let reward_wood = parseInt(document.querySelector("#reward-system-rewards tr:nth-child(1) td:nth-child(3)").innerText);
        let reward_stone = parseInt(document.querySelector("#reward-system-rewards tr:nth-child(1) td:nth-child(4)").innerText);
        let reward_iron = parseInt(document.querySelector("#reward-system-rewards tr:nth-child(1) td:nth-child(5)").innerText);

        if ((wood + reward_wood <= storage) && (stone + reward_stone <= storage) && (iron + reward_iron <= storage)) {
            document.querySelector("#reward-system-rewards tr:nth-child(1) td:nth-child(6) a").click();
            i++;
        } else {
        i = rewards_number+1;
        }


    if (i <= rewards_number) {
      reward(i, rewards_number);
    }
  }, 1000)
}

function reload() {
    if (document.querySelector("#main_buildrow_stone span").innerText == "nicht vorhanden") {
         reload_setTimeout(5000);
    } else {
        let lehmgrube = parseInt(document.querySelector("#main_buildrow_stone span").innerText.split(" ")[1]);

        if(document.querySelector("#buildqueue")) {
            if (lehmgrube < 2) {
                reload_setTimeout(Math.min(8000, queue_remaining_time()));
            } else if ((lehmgrube >= 2) && (lehmgrube <=4)) {
                reload_setTimeout(Math.min(30000, queue_remaining_time()));
            } else if (lehmgrube > 4) {
                reload_setTimeout(Math.min(300000, queue_remaining_time()));
            }
        } else {
            if (lehmgrube < 2) {
                reload_setTimeout(8000);
            } else if ((lehmgrube >= 2) && (lehmgrube <=4)) {
                reload_setTimeout(30000);
            } else if (lehmgrube > 4) {
                reload_setTimeout(300000);
            }
        }
    }
}

function reload_setTimeout(time) {
    setTimeout(function() {
        location.reload();
    }, time);
}


function queue_remaining_time() {
let queue_hours = parseInt(document.querySelector("#buildqueue td:nth-child(2)").innerText.split(":")[0]);
let queue_minutes = parseInt(document.querySelector("#buildqueue td:nth-child(2)").innerText.split(":")[1]);
let queue_seconds = parseInt(document.querySelector("#buildqueue td:nth-child(2)").innerText.split(":")[2]);
let queue_delta_time = 2000;
let remaining_time = queue_hours*60*60*1000 + queue_minutes*60*1000 + queue_seconds*1000 + queue_delta_time;
return remaining_time;
}

function population() {
    let current_population = parseInt(document.querySelector("#pop_current_label").innerText);
    let max_population = parseInt(document.querySelector("#pop_max_label").innerText);

    if (premium) {
    // if-Abfrage: Liegt eine Bauschleife bereits vor?
        if (document.querySelector("#buildqueue")) {
            // if-Abfrage: (1) Bauschleife liegt vor
            //           + (2) 90% Auslastung der Bevölkerung liegt vor
            //           + (3) Bauernhof könnte gebaut werden (genug Rohstoffe)
            //           + (4) Bauernhof kommt nicht bereits in der Bauschleife vor
            //           + (5) Keine 5 Aufträge in der Bauschleife
            if ((current_population >= 0.9*max_population) && (document.querySelector("#main_buildrow_farm td:nth-child(7) a")) && (!document.querySelector("#buildqueue").innerText.match("Bauernhof")) && (!document.querySelector("#buildqueue").innerHTML.match("buildorder_4"))) {
                document.querySelector("#main_buildrow_farm td:nth-child(7) a").click();
            }
        } else {
            // if-Abfrage: (1)keine Bauschleife + (2)90% Auslastung der Bevölkerung liegt vor + (3)Bauernhof könnte gebaut werden (genug Rohstoffe)
            if ((current_population >= 0.9*max_population) && (document.querySelector("#main_buildrow_farm td:nth-child(7) a"))) {
                document.querySelector("#main_buildrow_farm td:nth-child(7) a").click();
            }
        }
    } else {
        // if-Abfrage: Liegt eine Bauschleife bereits vor?
        if (document.querySelector("#buildqueue")) {
            // if-Abfrage: (1) Bauschleife liegt vor
            //           + (2) 90% Auslastung der Bevölkerung liegt vor
            //           + (3) Bauernhof könnte gebaut werden (genug Rohstoffe)
            //           + (4) Bauernhof kommt nicht bereits in der Bauschleife vor
            //           + (5) Keine 2 Aufträge in der Bauschleife
            if ((current_population >= 0.9*max_population) && (document.querySelector("#main_buildrow_farm td:nth-child(7) a")) && (!document.querySelector("#buildqueue").innerText.match("Bauernhof")) && (!document.querySelector("#buildqueue").innerHTML.match("buildorder_1"))) {
                document.querySelector("#main_buildrow_farm td:nth-child(7) a").click();
            }
        } else {
            // if-Abfrage: (1)keine Bauschleife + (2)90% Auslastung der Bevölkerung liegt vor + (3)Bauernhof könnte gebaut werden (genug Rohstoffe)
            if ((current_population >= 0.9*max_population) && (document.querySelector("#main_buildrow_farm td:nth-child(7) a"))) {
                document.querySelector("#main_buildrow_farm td:nth-child(7) a").click();
            }
        }
    }


}