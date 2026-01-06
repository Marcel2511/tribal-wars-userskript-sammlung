// ==UserScript==
// @name        Produktionen zusammenzÃ¤hlen inkl. MÃ¼nzen
// @version     1.2
// @description Rechnet die Produktion der Minen zusammen
// @author      Osse
// @author      extended by Flink
// @match       https://*.die-staemme.de/game.php?*screen=overview_villages*
// ==/UserScript==
 
(function () {
    'use strict';
 
    var api = typeof unsafeWindow != 'undefined' ? unsafeWindow.ScriptAPI : window.ScriptAPI;
    api.register('510-Produktionen_zusammenzaehlen', true, 'osse', 'support-nur-im-forum@die-staemme.de');
 
    // Set default value in case none is set
    function setup(name, defaultValue) {
        if (typeof window[name] === 'undefined') {
            window[name] = defaultValue
        }
    }
    setup("bonusProd", 0.0);
    setup("useFlags", true);
 
    // Run if tech site is found
    if ($('#techs_table').length != 0) {
        // Remove old saved Flags if they exist
        if (localStorage.flagMap !== undefined) {
            localStorage.removeItem("flagMap");
        }
        getFlags();
    }
 
    function getFlags() {
        // create map for vilid -> flagValue
        let mapFlag = new Map();
 
        $('#techs_table tbody').children().each(function() {
            let vil = $(this).find(".flag_info").attr('id');
            if (vil !== undefined) {
                vil = vil.split("_");
                vil[2] = parseInt(vil[2]);
            }
            let flag = $(this).find(".flag_info").find("span").text().split(" ");
 
            // Find Flags of ressource typ
            if (flag[1] == "Rohstoffe") {
                mapFlag.set(vil[2], parseInt(flag[0]));
            }
        })
 
        // Save Map to localStorage
        localStorage.flagMap = JSON.stringify(Array.from(mapFlag.entries()));
    }
 
 
    if ($("#buildings_table").length < 1) {
        //wrong page
        return;
    }
 
    let SettingsHelper = {
        configConf: null,
        loadSettings() {
            var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
            var path = "config_settings_" + win.game_data.world;
            if (win.localStorage.getItem(path) == null) {
                var oRequest = new XMLHttpRequest();
                var sURL = 'https://' + window.location.hostname + '/interface.php?func=get_config';
                oRequest.open('GET', sURL, 0);
                oRequest.send(null);
                if (oRequest.status != 200) {
                    throw "Error executing XMLHttpRequest call to get Config! " + oRequest.status;
                }
                win.localStorage.setItem(path, JSON.stringify(this.xmlToJson(oRequest.responseXML).config))
            }
            return JSON.parse(win.localStorage.getItem(path))
        },
        //Helper deepXmlConverter method for easy acess of config values
        xmlToJson(xml) {
            // Create the return object
            var obj = {};
            if (xml.nodeType == 1) {
                // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = isNaN(parseFloat(attribute.nodeValue)) ? attribute.nodeValue : parseFloat(attribute.nodeValue);
                    }
                }
            } else if (xml.nodeType == 3) {
                // text
                obj = xml.nodeValue;
            }
            // do children
            // If all text nodes inside, get concatenated text from them.
            var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
                return node.nodeType === 3;
            });
            if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
                obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
                    return text + node.nodeValue;
                }, "");
            } else if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof obj[nodeName] == "undefined") {
                        obj[nodeName] = this.xmlToJson(item);
                    } else {
                        if (typeof obj[nodeName].push == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(this.xmlToJson(item));
                    }
                }
            }
            return obj;
        },
        getConf() {
            if (!this.configConf) {
                this.configConf = JSON.parse(window.localStorage.getItem('config_settings_' + game_data.world))
            }
            return this.configConf
        },
        checkConfigs() {
            const configConf = this.getConf()
            if (configConf == null) {
                SettingsHelper.loadSettings('config')
            }
        }
    }
    SettingsHelper.checkConfigs()
 
    if (localStorage.getItem("flagMap") !== null) {
        var flagMap = new Map(JSON.parse(localStorage.flagMap));
    } else {
        var flagMap = new Map();
    }
 
    let worldspeed = SettingsHelper.getConf()["speed"],
        base_production = SettingsHelper.getConf()["game"]["base_production"],
        totalwood = 0,
        totaliron = 0,
        totalstone = 0,
        totalWoodDaily,
        totalStoneDaily,
        totalIronDaily;
    $("#buildings_table tbody").children().each(function() {
        let vilId = $(this).find("span").data("id"),
            wood = $(this).find(".b_wood").text(),
            stone = $(this).find(".b_stone").text(),
            iron = $(this).find(".b_iron").text(),
            woodBase,
            stoneBase,
            ironBase,
            woodBonus = 0,
            stoneBonus = 0,
            ironBonus = 0,
            woodPrem = 0,
            stonePrem = 0,
            ironPrem = 0;
 
        woodBase = Math.round(Math.pow(1.163118, wood - 1) * worldspeed * base_production);
        stoneBase = Math.round(Math.pow(1.163118, stone - 1) * worldspeed * base_production);
        ironBase = Math.round(Math.pow(1.163118, iron - 1) * worldspeed * base_production);
 
        //check if user wants to use Flags
        if (useFlags === true){
 
            //check if village has a ressource flag set
            if (flagMap.get(vilId) !== undefined) {
                woodBonus = woodBase * (flagMap.get(vilId) / 100);
                stoneBonus = stoneBase * (flagMap.get(vilId) / 100);
                ironBonus = ironBase * (flagMap.get(vilId) / 100);
            }
        }
        if (bonusProd !== 0) {
            woodPrem = woodBase * bonusProd;
            stonePrem = stoneBase * bonusProd;
            ironPrem = ironBase * bonusProd;
        }
 
        // Holzbonusdorf
        if ($(this).find(".bonus_icon_1").length == 1) {
            woodBase = woodBase * 2;
        }
        // Lehmbonusdorf
        if ($(this).find(".bonus_icon_2").length == 1) {
            stoneBase = stoneBase * 2;
        }
        // Eisenbonusdorf
        if ($(this).find(".bonus_icon_3").length == 1) {
            ironBase = ironBase * 2;
        }
        // 30% Bonusdorf
        if ($(this).find(".bonus_icon_8").length == 1) {
            woodBase = Math.round(woodBase * 1.3);
            stoneBase = Math.round(stoneBase * 1.3);
            ironBase = Math.round(ironBase * 1.3);
        }
 
        totalwood += woodBase + woodBonus + woodPrem;
        totalstone += stoneBase + stoneBonus + stonePrem;
        totaliron += ironBase + ironBonus + ironPrem;
    });
    totalWoodDaily = Math.round(totalwood * 24);
    totalStoneDaily = Math.round(totalstone * 24);
    totalIronDaily = Math.round(totaliron * 24);
    totalwood = Math.round(totalwood);
    totalstone = Math.round(totalstone);
    totaliron = Math.round(totaliron);
 
    let coinCostWood = 28000;
    let coinCostStone = 30000;
    let coinCostIron = 25000;
 
    let coinsFromWood = Math.round(totalWoodDaily / coinCostWood);
    let coinsFromStone = Math.round(totalStoneDaily / coinCostStone);
    let coinsFromIron = Math.round(totalIronDaily / coinCostIron);
 
    let CleanTotalWoodDaily = getNumberWithCommas(totalWoodDaily);
    let CleanTotalStoneDaily = getNumberWithCommas(totalStoneDaily);
    let CleanTotalIronDaily = getNumberWithCommas(totalIronDaily);
    let CleantTotalwood = getNumberWithCommas(totalwood);
    let CleanTotalstone = getNumberWithCommas(totalstone);
    let CleanTotaliron = getNumberWithCommas(totaliron);
 
    let totalCoinsDaily = getNumberWithCommas(Math.min(coinsFromWood, coinsFromStone, coinsFromIron));
    let totalCoins = getNumberWithCommas(Math.round(Math.min(coinsFromWood, coinsFromStone, coinsFromIron) / 24));
 
    $("#buildings_table").before(
        `<br><span class='icon wood'></span> Holz \u03A3 = ${CleantTotalwood} pro/Stunde | ${CleanTotalWoodDaily} pro/Tag<br>` +
        `<span class='icon stone'></span> Lehm \u03A3 = ${CleanTotalstone} pro/Stunde | ${CleanTotalStoneDaily} pro/Tag<br>` +
        `<span class='icon iron'></span> Eisen \u03A3 = ${CleanTotaliron} pro/Stunde | ${CleanTotalIronDaily} pro/Tag` +
        `<br><img src="https://dsde.innogamescdn.com/asset/e405f2b5/graphic/gold.png" alt="Gold Icon"> T&aumlgliche M&uumlnzen \u03A3 = ${totalCoins} pro/Stunde | ${totalCoinsDaily} pro/Tag`
    );
    function getNumberWithCommas(number) {
        return Intl.NumberFormat().format(number);
    }
})();