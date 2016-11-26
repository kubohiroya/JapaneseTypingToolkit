'use strict';

var kana = require('./kana');

function DummyTextSource(){
    this.index = -1;
    this.src = [
        {
            kanji:"千葉商科大学",
            kana:'ちばしょうかだいがく'
        },
        {
            kanji:"出張お疲れ様でっす",
            kana:'しゅっちょうおつかれさまでっす'
        }
    ];

    this.next = function(){
        this.index++;
        if(this.index == this.src.length) {
            this.index = 0;
        }
        return this.src[this.index];
    };

    this.getCurrent = function(){
        return this.src[this.index];
    };

    this.getCurrentKanjiText = function(){
        return this.getCurrent().kanji;
    };

    this.getCurrentKanaText = function(){
        return this.getCurrent().kana;
    };

    this.getCurrentRomanCode = function(){
        return kana.romanize(this.getCurrent().kana);
    };
}

var TextSourceFactory = {
    newInstance: function(){
        return new DummyTextSource();
    }
};

module.exports = {
    TextSourceFactory:TextSourceFactory
};
