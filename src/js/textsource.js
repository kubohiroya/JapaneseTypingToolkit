'use strict';

function DummyTextSource(){
    this.index = -1;
    this.src = ["hogehoge","abcdefg", "AAABBBCCC", "Japanese Touch-typing Practice"];

    this.getNextText = function(){
        this.index++;
        if(this.index == this.src.length) {
            this.index = 0;
        }
        return this.src[this.index];
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
