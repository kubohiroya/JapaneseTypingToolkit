'use strict';

var kana = require('./kana');
var q = require('q');

function DummyTextSource() {
    this.index = -1;
    this.src = [
        {
            kanji: "千葉商科大学",
            kana: 'ちばしょうかだいがく'
        },
        {
            kanji: "出張お疲れ様でっす",
            kana: 'しゅっちょうおつかれさまでっす'
        }
    ];

    this.next = function () {
        this.index++;
        if (this.index == this.src.length) {
            this.index = 0;
        }
        return this.src[this.index];
    };

    this.getCurrent = function () {
        return this.src[this.index];
    };

    this.getCurrentKanjiText = function () {
        return this.getCurrent().kanji;
    };

    this.getCurrentKanaText = function () {
        return this.getCurrent().kana;
    };

    this.getCurrentRomanCode = function () {
        return kana.romanize(this.getCurrent().kana);
    };
}

function GooHiraganaConversionAPI(src, callback) {
    var applicationID = 'b71df2bf577afd3123566b551ecd3439cccadfdab8217dce6c95cfce2c9eead0'
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://labs.goo.ne.jp/api/hiragana', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function processResponse() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200 || xhr.status == 201) {
                // リクエストの処理
                var json = JSON.parse(xhr.responseText);
                callback(json.converted);
            } else {
                // エラー処理
            }
        }
    };
    xhr.send(JSON.stringify({
        "app_id": applicationID,
        "sentence": src,
        "output_type": "hiragana"
    }));
}

function WikipediaTextSource() {
    this.index = -1;
    this.src = [];

    this.init = function (callback) {
        var src = this.src;
        var xhr = new XMLHttpRequest();
        //xhr.open('GET', 'https://ja.wikipedia.org/w/api.php', true);
        xhr.open('GET', 'https://ja.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=10&format=json', true);//&callback=?
        //xhr.setRequestHeader('Content-Type', 'application/json');
        //xhr.setRequestHeader('Origin', 'http://localhost:8080');
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = function (e) {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 201) {
                    // リクエストの処理
                    var json = JSON.parse(this.responseText);
                    json.query.random.forEach(function (item) {
                        console.log(item.title);
                        GooHiraganaConversionAPI(item.title, function (converted) {
                            src.push({kanji: item.title, kana: converted});
                        });
                    });
                    callback(true);
                } else {
                    // エラー処理
                    console.log('ERROR', e);
                    callback(false);
                }
            }
        };
        xhr.send(null);
    }
    /*
     xhr.send({
     action:'query',
     list:'random',
     rnnamespace:0,
     rnlimit:10,
     format:'json'
     });
     */
    //&callback=test&prop=langlinks

    this.next = function () {
        this.index++;
        if (this.index == this.src.length) {
            this.index = 0;
        }
        return this.src[this.index];
    };

    this.getCurrent = function () {
        return this.src[this.index];
    };

    this.getCurrentKanjiText = function () {
        if (this.index < this.src.length) {
            return this.getCurrent().kanji;
        } else {
            return undefined;
        }
    };

    this.getCurrentKanaText = function () {
        if (this.index < this.src.length) {
            return this.getCurrent().kana;
        } else {
            return undefined;
        }
    };

    this.getCurrentRomanCode = function () {
        if (this.index < this.src.length) {
            return kana.romanize(this.getCurrent().kana);
        } else {
            return undefined;
        }
    };
}

var TextSourceFactory = {
    newInstance: function () {
        var instance = new DummyTextSource();//WikipediaTextSource();
        return instance;
        instance.init();

    }
};

module.exports = {
    TextSourceFactory: TextSourceFactory
};
