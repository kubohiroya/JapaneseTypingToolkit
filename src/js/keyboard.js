/**
 * このファイルは、fujihiro_sn氏による
 * http://codepen.io/fujihiro_sn/pen/LGVKgx
 * （MITライセンス）をもとに作成したものです。
 *
 * fujihiro_sn氏によるQiita記事：「d3.j3で日本語配列キーボードを作る方法」
 * http://qiita.com/fujihiro_sn/items/00903195b4d1c8bafc58
 */

var d3 = require('d3');

// キーボードを生成するために必要な情報を定義する
var keymaps = {
    jp: {
        codes: [// キーコード
            [243, 112, 113,114,115,116,117,118,119,120,121,122,123],
            [0, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 222, 220, 8],
            [0, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 192, 219],
            [0, 65, 83, 68, 70, 71, 72, 74, 75, 76, 187, 186, 221],
            [16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 226, 16],
            [17, 91, 18, 29,   32,   28, 242, 93, 17]
        ],
        text: [// キーの文字
            ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
            ["半/全", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "^", "\\", "BS"],
            ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@", "["],
            ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":", "]"],
            ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "\\", "Shift"],
            ["Ctrl", "Win", "Alt", "無変換", "", "変換", "カナ", "Apps", "Ctrl"]
        ],
        shiftText: [// キーの文字(shift押下時)
            ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
            ["半/全", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "", "=", "~", "|", "BS"],
            ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "`", "{"],
            ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", "+", "*", "}"],
            ["Shift", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "_", "Shift"],
            ["Ctrl", "Win", "Alt", "無変換", "", "変換", "カナ","Apps", "Ctrl"]
        ],
        keyHeight: [// キーの高さを定義
            20,
            40,
            40,
            40,
            40,
            40
        ],
        keyWidth: {// キーの幅を定義
            w0: 48.4,
            w1: 40,
            w2: 64,
            w3: 76,
            w4: 104,
            w5: 188
        },
        keyVariety: [// キー幅を設定
            ["w1", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0"],
            ["w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1"],
            ["w2", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1"],
            ["w3", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1"],
            ["w4", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w3"],
            ["w1", "w1", "w1", "w1", "w5", "w1", "w1", "w1", "w1", "w2"]
        ],
        textAlign: [// 文字の印字場所を設定
            ["m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r"],
            ["l", "l", "l", "l", "r", "r", "r", "r", "r", "r"]
        ],

        customize: function(keyboard){
            // エンターキーは特別に別途生成する
            var enterKey = keyboard.append("g");
            var enterButton = enterKey.append("path");
            var enterText = enterKey.append("text").text("Enter");
            // enterキーは別途設定
            enterKey.attr("transform", "translate(694, 90)")
                .attr('class', "key13");

            enterButton.attr('d', "M61,0Q66,0,66,5V85Q66,90,61,90H19Q14,90,14,85V45Q14,40,9,40H5Q0,40,0,35V5Q0,0,5,0Z")
                .attr('fill', "#f5f5f5")
                .attr('stroke', "#aaa")
                .attr('filter', "url(#drop-shadow)");

            enterText.attr('x', 14)
                .attr('y', 27)
                .attr("font-size", 16)
                .attr('fill', "black");
            return enterKey;
        },
        topMargin: 10,
        leftMargin: 20,
        horizontalKeyMargin: 10,
        verticalKeyMargin: 10,
        arrowKeysX: 620,
        arrowKeysY: 238,
        rx:5,
        ry:5,
        tx : {
            l: 5,
            n: 20,
            m: 20,
            r: 40
        },
        ty : {
            l: 35,
            n: 27,
            m: 17,
            r: 35
        },
        fontSize:{
            normal:20,
            small:10
        }
    },

    en: {
        codes: [
            [243, 112, 113,114,115,116,117,118,119,120,121,122,123],
            [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8],
            [0, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220],
            [0, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13],
            [16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 16],
            [17, 91, 18, 32, 18, 93, 17]
        ],

        text: [
            ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
            ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BackSpace"],
            ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", '\\'],
            ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "return"],
            ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
            ["Ctrl", "Win", "Alt", "", "Alt", "Apps", "Ctrl"]
        ],

        shiftText: [
            ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
            ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "BackSpace"],
            ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|"],
            ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "return"],
            ["Shift", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "Shift"],
            ["Ctrl", "Win", "Alt", "", "Alt", "Apps", "Ctrl"]
        ],

        keyHeight: [
            20,
            40,
            40,
            40,
            40,
            40
        ],

        keyWidth: {
            w0: 46.2,
            w1: 40,
            w2: 64,
            w3: 76,
            w4: 104,
            w5: 240
        },

        keyVariety: [
            ["w1", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0"],
            ["w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", 65],
            ["w2", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1"],
            ["w3", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", 78],
            ["w4", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1", 100],
            ["w1", "w1", "w2", "w5", "w1", "w1", "w1"]
        ],

        textAlign: [
            ["m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m"],
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r"],
            ["l", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r"],
            ["l", "l", "l", "r", "r", "r", "r"]
        ],

        topMargin: 10,
        leftMargin: 35,
        horizontalKeyMargin: 10,
        verticalKeyMargin: 10,
        arrowKeysX: 605,
        arrowKeysY: 238,
        rx:5,
        ry:5,
        tx : {
            l: 5,
            n: 20,
            m: 20,
            r: 40
        },
        ty : {
            l: 35,
            n: 27,
            m: 17,
            r: 35
        },
        fontSize:{
            normal:20,
            small:10
        }
    }
};

function initialize(keymapCode, document, selector){

    var keymap = keymaps[keymapCode];

    var data = [0,1,2,3,4,5].map(function(i){
        return d3.zip(
            keymap.text[i],
            keymap.shiftText[i],
            keymap.codes[i],
            keymap.textAlign[i],
            keymap.keyVariety[i]).map(function(d, j){
            var offset = 0;
            for (var k = 0; k < j; k++) {
                if(keymap.keyVariety[i][k] instanceof Number){
                    offset += keymap.keyVariety[i][k] + keymap.horizontalKeyMargin;
                }else{
                    offset += keymap.keyWidth[keymap.keyVariety[i][k]] + keymap.horizontalKeyMargin;
                }
            }
            return {
                text:d[0],
                shiftText:d[1],
                code:d[2],
                textAlign:d[3],
                keyVariety:d[4],
                x: offset,
                y: 0,
                keyWidth: (typeof(d[4]) == 'number')? d[4]:keymap.keyWidth[d[4]],
                keyHeight:keymap.keyHeight[i],
                rowIndex:i,
                colIndex:j
            };
        });
    });

    function keydown(keyCode, keyTexts) {

        var elem = (keyCode == 13) ? " path" : " rect";
        if (keyCode == 16) {
            shift(keyTexts, 1);
        }
        var key = d3.selectAll(".key" + keyCode + elem).transition().duration(50)
            .attr('fill', "#d5d5d5")
            .attr('filter', null);

        var text = d3.selectAll(".key" + keyCode + " text").transition().duration(50)
            .attr('fill', "#E91E63");
    }

    function keyup(keyCode, keyTexts) {

        var elem = (keyCode == 13) ? " path" : " rect";
        if (keyCode == 16) {
            shift(keyTexts, 0);
        }
        var key = d3.selectAll(".key" + keyCode + elem).transition().duration(50)
            .attr('fill', "#eee")
            .attr('filter', "url(#drop-shadow)");

        var text = d3.selectAll(".key" + keyCode + " text").transition().duration(50)
            .attr('fill', "black");

    }

    function shift(keyTexts, num) {
        keyTexts.text(function (d) {
            if(num == 0 || ! d.shiftText){
                return d.text;
            }else{
                return d.shiftText;
            }
        });
    }

    function createKeyboard(svg){
// フィルターの作成
        var filter = svg.append("filter")
            .attr('id', "drop-shadow")
            .attr('width', "150%")
            .attr('height', "150%");

        filter.append("feGaussianBlur")
            .attr('in', "SourceAlpha")
            .attr('result', "blur")
            .attr('stdDeviation', 1);

        filter.append("feOffset")
            .attr('dx', 0.5)
            .attr('dy', 0.5)
            .attr('result', "offsetBlur");

        filter.append("feBlend")
            .attr('in', "SourceGraphic")
            .attr('in2', "offsetBlur")
            .attr('mode', "normal");

// ここから各要素のattributeを設定

        svg.attr('width', 800)
            .attr('height', 325)
            .attr('viewBox', "0 0 800 300");

// キーボードの要素はこのg要素に格納
        var keyboard = svg.append("g");

// キーボードを囲う枠
        var frame = keyboard.append("rect");
// キーボードの枠設定
        frame.attr('rx', keymap.rx)
            .attr('ry', keymap.ry)
            .attr('x', 5)
            .attr('y', 0)
            .attr('width', 780)
            .attr('height', 290)
            .attr('fill', "#ddd")
            .attr('filter', "url(#drop-shadow)");

        return keyboard;
    }

    function initializeKeys(keys){
//　キーを表す四角形と、印字されている文字をg要素の中に生成
        var keyButtons = keys.append("rect");
        var keyTexts = keys.append("text");

// キーの位置を設定していく
        keys.attr('transform', function(d) {
            return "translate(" + d.x + ", "+ ((d.y)? d.y:0) + ")";
        }).attr('class', function (d) {
            return "key" + d.code;
        });

// キー自体の幅をなどを設定
        keyButtons.attr('rx', keymap.rx)
            .attr('ry', keymap.rx)
            .attr('width', function (d) {
                return d.keyWidth;
            })
            .attr('height', function(d){
                return d.keyHeight;
            })
            .attr('fill',"#f5f5f5")
            .attr('stroke', "#aaa")
            .attr('filter', "url(#drop-shadow)");

// 束縛されている文字や文字位置などから文字を設定
// 文字の印字場所を設定
        keyTexts.attr('x', function (d) {
                if (d.textAlign == "r") {
                    return d.keyWidth - 5;
                }
                return keymap.tx[d.textAlign];
            })
            .attr('y', function (d) {
                return keymap.ty[d.textAlign];
            })
            .attr("text-anchor", function (d) {
                var ta = {
                    l: "start",
                    n: "middle",
                    m: "middle",
                    r: "end"
                };
                return ta[d.textAlign];
            })
            .attr("font-size", function (d) {
                if (d.textAlign != "n") {
                    return keymap.fontSize.small;
                }
                return keymap.fontSize.normal;
            })
            .attr('fill', "black");

        keyTexts.text(function (d) {
            return d.text;
        });

        return keyTexts;
    }

    function translateKeyLines(keyLines){
        // 各行を保持するg要素のyを設定していく
        var offset = 0;
        keyLines.attr('transform', function (d, i) {
            if(0 < i){
                offset += (keymap.keyHeight[i-1] + + keymap.verticalKeyMargin);
            }
            return "translate("+(keymap.leftMargin)+"," + (offset + keymap.topMargin) + ")";
        });
    }

    function createArrowKeys(keyboard) {
        var arrowData = [
            ['←', 37, 'm', 'w1', 0, 22],
            ['↑', 38, 'm', 'w1', 50, 0],
            ['→', 39, 'm', 'w1', 100, 22],
            ['↓', 40, 'm', 'w1', 50, 22]].map(function (d) {
            return {
                text: d[0],
                code: d[1],
                textAlign: d[2],
                keyVariety: d[3],
                x: d[4],
                y: d[5],
                keyWidth: 40,
                keyHeight: 19
            };
        });

        return keyboard.append("g").attr("transform", "translate("+
                keymap.arrowKeysX + ", "+keymap.arrowKeysY+")")
            .attr('class', 'arrows').selectAll('g')
            .data(arrowData).enter().append("g").attr('class', 'arrow');
    }

    var svg = d3.select(selector).append("svg");
    var keyboard = createKeyboard(svg);

// キーボードの各行を生成
// データとして先に作成した、3次元配列を渡す
// よって、ここでg要素が5個DOMに追加される
// それぞれのg要素には2次元配列が束縛される
// ちなみに、束縛される配列はdata[0]~data[5]がそれぞれ対応する
    var keyLines = keyboard.selectAll("g").data(data).enter().append("g");

// 各キー要素(この中にrectとtextを格納して１つのキーを表す)
// ここではデータとして親のg要素に束縛されているデータをそのまま渡す
// 親のg要素には2次元配列が束縛されているので、生成されるg要素にはそれぞれ1次元配列が束縛される
// よって、ここで束縛されるデータは、[文字, 文字, コード]である
    var keys = keyLines.selectAll("g").data(function (d) { return d; }).enter().append("g");

    var keyTexts = initializeKeys(keys);
    translateKeyLines(keyLines);

    initializeKeys(createArrowKeys(keyboard));
    if(keymap.customize){
        keymap.customize(keyboard, initializeKeys);
    }

    document.addEventListener('keydown', function (e) {
        keydown(e.keyCode, keyTexts);
    });

    document.addEventListener('keyup', function (e) {
        keyup(e.keyCode, keyTexts);
    });

}

module.exports = {
    initialize:initialize
};