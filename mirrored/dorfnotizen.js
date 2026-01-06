//==UserScript==
// @name            Dorfnotiz-Vorlagen
// @namespace       http://tampermonkey.net/
// @version         1.1
// @description     Dorfnotizen einfacher gemacht oder so
// @author          ners, TheHebel97
// @match           https://*.die-staemme.de/*&screen=info_village*
// ==/UserScript==

let win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

//Konfiguration vom Nutzer:
win.config = "Bruch"
win.defaultOverwriteCheckbox = false
win.defaultPointsCheckbox = false
win.useHotkeys = true
win.useCustom = true
win.showHotkeysonButton = true

// Hotkeys
//Hotkeys die evtl häufiger benutzt werden:
win.openEditHotkey = "e"
win.swapNoteCheckHotkey ="x"
win.offHotkey = "r"
win.offtotHotkey = "t"
win.offvollHotkey = "z"
win.deffHotkey = "f"
win.vmtldeffHotkey="g"
win.flexHotkey = "h"
win.cleanHotkey = "n"
win.bunkerHotkey = "b"

//Hotkeys, die nach der Meinung des Autors eher nebensächlich sind, aber ofc trotzdem mit drin :)
win.swapPointsCheckHotkey = ""
win.bhplusHotkey = ""
win.vmtloffHotkey = ""
win.wallbreakHotkey= ""
win.kataoffHotkey= ""
win.skavoffHotkey= ""
win.off25Hotkey= ""
win.off50Hotkey= ""
win.off75Hotkey= ""
win.flexvollHotkey= ""
win.katasplitHotkey= ""
win.spyHotkey= ""
win.churchHotkey= ""
win.watchHotkey= ""
win.AHHotkey= ""
win.AGHotkey= ""
win.startHotkey= ""

//custom Buttons:
win.custom = [
    {title:'Beispiel', note: 'DsBbCodes und Text hier einfügen der in der Notiz stehen soll', unit:'zusätzlicher Text (zB ein bild (mit img tags))', hotkey:''}
]

//Ende Eingaben vom Nutzer


win.$.ajaxSetup({ cache: true });
win.$.getScript('https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/350_dorfnotiz-vorlagen_thehebel97.js');