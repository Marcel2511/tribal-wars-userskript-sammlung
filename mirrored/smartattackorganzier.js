// ==UserScript==
// @name         Smart Attack Organizer based on Faze
// @version      1.2
// @author       Faze & Jay
// @include      https://*.die-staemme.de/**&screen=overview
// @include      https://*.die-staemme.de/**&mode=incomings*
// @include      https://*.die-staemme.de/**&screen=info_village&*
// @include      https://*.die-staemme.de/**&screen=place*
// @include      https://*.die-staemme.de/**?screen=place&t=*&village=*
// @include      https://*.die-staemme.de/**?screen=place&village=*
// @include      https://*.die-staemme.de/**?screen=overview&village=*
// @include      https://*.die-staemme.de/**?village=*&screen=overview*
// @include      https://*.die-staemme.de/**?t=*&village=*&screen=overview*
// ==/UserScript==

var font_size = 8;
var attack_layout = 'column'; //Possible layouts: 'column', 'line', 'nothing'
//{Number: ['Command name', 'button name', 'button color', 'text color']}
var settings = {
  0: [" | ???", "?", "white", "black"],
  1: [" | [Nachdeffen]", "N", "lime", "black"],
  2: [" | [mögl.Off]", "O", "dorange", "white"],
  3: [" | [Readel]", "R", "gray", "white"],
  4: [" | [Tabben]", "T", "blue", "white"],
  5: [" | [Fake]", "F", "pink", "black"],
  6: [" | [Raustellen]", "X", "yellow", "black"],
  7: [" | [Getabbt]", "GT", "lblue", "black"],
  8: [" | [Gedefft]", "G", "orange", "white"],
  9: [" | [DONE]", "D", "green", "white"],
  10: [" | [S.Off]", "0", "black", "white"],
  11: [" | [Katasplit]", "K", "dorange", "white"]
};
//{ColorName: ['theme color 1', 'theme color 2']}
var colors = {'red':['#e20606', '#b70707'], 'green':['#31c908', '#228c05'], 'blue':['#0d83dd', '#0860a3'], 'yellow':['#ffd91c', '#e8c30d'], 'orange':['#ef8b10', '#d3790a'], 'lblue':['#22e5db', '#0cd3c9'], 'lime':['#ffd400', '#ffd400'], 'white':['#ffffff', '#dbdbdb'], 'black':['#000000', '#2b2b2b'], 'gray':['#adb6c6', '#828891'], 'dorange':['#ff0000', '#ff0000'], 'pink':['#ff69b4', '#ff69b4']}

/*******************QUICBAR ENTRY*************
// name         Attack Organizer with colors
// version      3.0
// author       fmthemaster, Mau Maria (V3.0)
// author       PhilipsNostrum and Kirgonix (V2.0)
// author       Diogo Rocha and Bernas (V1.0)
//Runs in [screen=overview, screeen=place, screen=commands&mode=incomings]
var font_size = 8;
var attack_layout = 'column'; //Possible layouts: 'column', 'line', 'nothing'

//{Number: ['Command name', 'button name', 'button color', 'text color']}
var settings= {0:['[Dead]','D', 'green', 'white'], 1:['[Support]','S', 'lime', 'white'], 2:['[Dodged]','D!', 'orange', 'white'], 3:['[Dodge]','D', 'dorange', 'white'], 4:['[Reconquered]','R!', 'gray', 'white'], 5:['[Reconquer]','R', 'white', 'black'], 6:['[Sniped]','S!', 'lblue', 'black'], 7:['[Snipe]','S', 'blue', 'white'], 8:['[toFUBR]','F', 'black', 'white'], 9:['[FUBRdone]','F!', 'white', 'black'], 10:['[Fake]','Fk', 'pink', 'black'], 11:[' | Stay Alert','A!', 'yellow', 'black']};

//{ColorName: ['theme color 1', 'theme color 2']}
var colors = {'red':['#e20606', '#b70707'], 'green':['#31c908', '#228c05'], 'blue':['#0d83dd', '#0860a3'], 'yellow':['#ffd91c', '#e8c30d'], 'orange':['#ef8b10', '#d3790a'], 'lblue':['#22e5db', '#0cd3c9'], 'lime':['#ffd400', '#ffd400'], 'white':['#ffffff', '#dbdbdb'], 'black':['#000000', '#2b2b2b'], 'gray':['#adb6c6', '#828891'], 'dorange':['#ff0000', '#ff0000'], 'pink':['#ff69b4', '#ff69b4']}
$.getScript('https://gitcdn.xyz/cdn/filipemiguel97/076df367a5f0f3272abc90136749c121/raw/AttackRenamerColors.js')
****************************************/
/******************PROGRAM CODE*********/

function checkColors(color)
{
    if(!colors[color])
    {
        console.log("Please create settings for the color", color);
        throw("error");
    }
}

checkColors("red");
checkColors("yellow");
checkColors("white");
checkColors("black");

let buttonNames = $.map(settings, (obj)=> obj[0]);
let buttonIcons = $.map(settings, (obj)=> obj[1]);
let buttonColors = $.map(settings, (obj)=> obj[2]);
let buttonTextColors = $.map(settings, (obj)=> obj[3]);

function iT(nr, line) {
    var html = '';
    if (buttonNames)
        html += '<span style="float: right;">';
    buttonIcons.forEach(function(nome, num) {
        html += '<button type="button" id="opt' + nr + '_' + num + '" class="btn" title="' + buttonNames[num] + '" style="color: ' + getFon(num) + '; font-size: ' + getSize() + 'px !important; background: linear-gradient(to bottom, ' + getTop(num) + ' 30%, ' + getBot(num) + ' 10%)">' + nome + '</button>';
    })
    html += '</span>';
    $(line).find('.quickedit-content').append(html);
    getText(nr, line);
}

function iTshort(nr, line) {
    var html = '';
    if (buttonNames)
        html += '<td><span style="float: right;">';
    buttonIcons.forEach(function(nome, num) {
        if(buttonNames[num] == ' | [DONE]' || buttonNames[num] == ' | [Gedefft]' || buttonNames[num] == ' | [Getabbt]') {
        html += '<button type="button" id="opt' + nr + '_' + num + '" class="btn" title="' + buttonNames[num] + '" style="color: ' + getFon(num) + '; font-size: ' + getSize() + 'px !important; background: linear-gradient(to bottom, ' + getTop(num) + ' 30%, ' + getBot(num) + ' 10%)">' + nome + '</button>';
        }
    })
    html += '</span></td>';
    $(line).append(html);
    getText(nr, line);
}

function getText(nr, line) {
    buttonNames.forEach(function(nome, num) {
        if (nome.indexOf('|') == -1) {
            $('#opt' + nr + '_' + num).click(function() {
                $(line).find('.rename-icon').click();
                $(line).find('input[type=text]').val($(line).find('input[type=text]').val().split(" ")[0] + ' ' + buttonNames[num]);
                $(line).find('input[type=button]').click();
                iT(nr, line);
            });
        } else if (nome.indexOf('|')) {
            if (buttonNames[num] == ' | [Gedefft]') {
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"").replace(" | [Nachdeffen]","") + buttonNames[num]);
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
            else if (buttonNames[num] == ' | [Getabbt]'){
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"").replace(" | [Tabben]","") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
            else if (buttonNames[num] == ' | [mögl.Off]'){
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"").replace(" | [Fake]","").replace(" | [S.Off]","").replace(" | [Katasplit]","") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
            else if (buttonNames[num] == ' | [Fake]'){
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"").replace(" | [mögl.Off]","").replace(" | [S.Off]","").replace(" | [Katasplit]","") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
            else if (buttonNames[num] == ' | [S.Off]'){
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"").replace(" | [mögl.Off]","").replace(" | [Fake]","").replace(" | [Katasplit]","") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
            else if (buttonNames[num] == ' | [Katasplit]'){
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"").replace(" | [mögl.Off]","").replace(" | [S.Off]","").replace(" | [Fake]","") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
            else {
                $('#opt' + nr + '_' + num).click(function() {
                    $(line).find('.rename-icon').click();
                    $(line).find('input[type=text]').val($(line).find('input[type=text]').val().replace(buttonNames[num],"") + buttonNames[num]);
                    $(line).find('input[type=button]').click();
                    iT(nr, line);
                });
            }
        }
    });
}

function getTop(num) {
    if (buttonColors[num]) {
        if(colors[buttonColors[num]])
            return colors[buttonColors[num]][0];
    } else {
        return '#b69471';
    }
}

function getBot(num) {
    if (buttonColors[num]) {
        if(colors[buttonColors[num]])
            return colors[buttonColors[num]][1];
    } else {
        return '#6c4d2d';
    }
}

function getFon(num) {
    if (buttonTextColors[num]) {
        if(colors[buttonTextColors[num]])
            return colors[buttonTextColors[num]][0];
    } else {
        return '#ffffff';
    }
}

function getSize() {
    if (font_size) return font_size;
    else return 12;
}

if (location.href.indexOf("screen=overview_villages") == -1 && location.href.indexOf("mode=incomings&subtype=attacks") == -1) {
    $('#commands_incomings .command-row').each(function(nr, line) {
        if (!isSupport(line)) {
            iT(nr, line, true)
            var name = $.trim($(line).find('.quickedit-label').text())
            var settingindex = check(name);
            if (settingindex !== false) {
                var colorcode = buttonColors[settingindex];
                var color = colors[colorcode][1]
                if(!color)
                    color = '#6c4d2d';
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + color + ' !important; width: 60%;')
                        $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                    })
                } else if (attack_layout === 'column') {
                    $(line).find('td:eq(0)').attr('style', 'background: ' + color + ' !important; width: 60%;')
                    $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            } else {
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + colors['red'][1] + ' !important;')
                    })
                    $(line).find('a').each(function(nr, td) {
                        $(td).attr('style', 'color: ' + colors['white'][1] + ' !important;')
                    })
                } else if (attack_layout === 'column') {
                   $(line).find('td:eq(0)').attr('style', 'background: ' + colors['red'][1] + ' !important;')
                   $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            }
        }
    });
} else {
    const table = document.querySelector("#incomings_table");
    const lastRow = table.rows[table.rows.length - 1];

    // Create a new row to insert at the top of the table
    const newRow = document.createElement("tr");
    newRow.innerHTML = lastRow.innerHTML;

    // Insert the new row at the top of the table
    table.insertBefore(newRow, table.firstChild);

    $('#incomings_table tr.nowrap').each(function(nr, line) {
        if (!isSupport(line)) {
            iTshort(nr, line, true)
            var name = $.trim($(line).find('.quickedit-label').text())
            var settingindex = check(name);
            if (settingindex !== false) {
                var colorcode = buttonColors[settingindex];
                var color = colors[colorcode][1]
                if(!color)
                    color = '#6c4d2d';
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + color + ' !important; width: 60%;')
                        $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                    })
                } else if (attack_layout === 'column') {
                    $(line).find('td:eq(0)').attr('style', 'background: ' + color + ' !important; width: 60%;')
                    $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            } else {
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + colors['red'][1] + ' !important;')
                    })
                    $(line).find('a').each(function(nr, td) {
                        $(td).attr('style', 'color: ' + colors['white'][1] + ' !important;')
                    })
                } else if (attack_layout === 'column') {
                   $(line).find('td:eq(0)').attr('style', 'background: ' + colors['red'][1] + ' !important;')
                   $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            }
        } else {
            if (attack_layout === 'line') {
                $(line).find('td').each(function(nr, td) {
                    $(td).attr('style', 'background: ' + colors['yellow'][1] + ' !important;')
                })
                $(line).find('a').each(function(nr, td) {
                    $(td).attr('style', 'color: ' + colors['white'][1] + ' !important;')
                })
            } else if (attack_layout === 'column') {
                $(line).find('td:eq(0)').attr('style', 'background: ' + colors['yellow'][1] + ' !important;')
                $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
            }
        }
    })
}

function check(name) {
    var words = name.trim().split(" ");
    var lastWord = words[words.length - 1];

    var buttonNames = Object.keys(settings).map(function(key) {
        return settings[key][0].replace("| ", "").replace(" ", "");
    });

    var index = buttonNames.indexOf(lastWord);
    if (index !== -1) { // ÃœberprÃ¼fen, ob das letzte Wort in der Liste der buttonNames enthalten ist
        var id = Object.keys(settings)[index];
        return id;
    }
    return false;
}

function isSupport(line) {
    var scr = $(line).find('img:eq(0)').attr('src')
    if (scr.indexOf('support') >= 0) return true;
    return false;
}