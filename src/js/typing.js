'use strict';
require("style/keyboard.css");
var keyboard = require('./keyboard');
var TextSourceFactory = require('./textsource').TextSourceFactory;
var kana = require('./kana');
var prompt = require('./prompt');
var debug = false;

var Colors = {
    enabled: '#fff',
    disabled: '#bbb'
};

function setAttribute(parentElement, name, key, value){
    if(! parentElement) {
        return;
    }
    var elements = parentElement.getElementsByTagName(name);
    if(elements){
        for(var i=0; i<elements.length;i++){elements[i].setAttribute(key, value);}
    }else{
        parentElement.setAttribute(key, value);
    }
}

function removeAllChildNodes(element){
    while(element.hasChildNodes()){
        element.removeChild(element.lastChild);
    }
}


function keyCode(e) {
    if (document.all) {
        return e.keyCode;
    } else if (document.getElementById) {
        return (e.keyCode) ? e.keyCode : e.charCode;
    } else if (document.layers){
        return e.which;
    }
}

function MainPanel(document, element, callback){
    this.document = document;
    this.element = element;
    this._isEnabled = false;
    this.setEnabled = function(isEnabled){
        if(isEnabled){
            this.element.setAttribute('style', 'opacity: 1.0');
        }else{
            this.element.setAttribute('style', 'opacity: 0.2');
        }
        this._isEnabled = isEnabled;
    };

    this.isEnabled = function(){
        return this._isEnabled;
    };

    this.setEnabled(false);
}

function PromptField(document, element){
    this.element = element;
    this._isEnabled = false;

    this.clearText = function(){
        removeAllChildNodes(this.element);
    };

    this.setText = function(text){
        this.clearText();
        text.split('').forEach(function(c){
            var span1 = document.createElement('span');
            var span2 = document.createElement('span');
            span1.appendChild(span2);
            span2.appendChild(document.createTextNode(c));
            element.appendChild(span1);
        });
    };

    this.setEnabled = function(isEnabled){
        this._isEnabled = isEnabled;
        setAttribute(this.element, 'span', 'style', 'border-left-color:'+(isEnabled?Colors.enabled:Colors.disabled));
    };

    this.isEnabled = function(){
        return this._isEnabled;
    };

    this.setEnabled(false);
}

function RomanCodePromptField(document, id){
    this.element = document.getElementById(id);
    this._isEnabled = false;

    this.setEnabled = function(isEnabled){
        this._isEnabled = isEnabled;
    };

    this.isEnabled = function(){
        return this._isEnabled;
    };

    this.setRomanCode = function(code){
        removeAllChildNodes(this.element);
        prompt.appendRomanCodeInputPrompt('#roman', code);
    };

    this.setEnabled(false);
}

function InputField(document, element){
    this.element = element;
    this.cursor = 0;

    this.setEnabled = function(isEnabled){
        setAttribute(this.element, 'span', 'style', 'border-left-color:'+(isEnabled?Colors.enabled:Colors.disabled));
    };

    this.getCursor = function(){
        return this.cursor;
    };

    this.setCursor = function(cursor){
        this.cursor = cursor;
    };

    this.backCursor = function(len){
        if(typeof(len) === 'number'){
            this.cursor = this.cursor - len;
        }else{
            this.cursor = this.cursor - 1;
        }
    };

    this.forwardCursor = function(len){
        if(typeof(len) === 'number'){
            this.cursor = this.cursor + len;
        }else{
            this.cursor = this.cursor + 1;
        }
    };

    this.hideCursor = function(){
        for(var i = 0; i < this.element.childElementCount; i++){
            var item = this.element.childNodes.item(i);
            if(item.hasAttribute('class')){
                item.removeAttribute('class');
            }
        }
    };

    this.showCursor = function() {
        if(this.cursor < this.element.childNodes.length){
            this.element.childNodes.item(this.cursor).setAttribute('class', 'cursor');
        }
    };

    this.setCursorBlink = function(cursorBlink){
        for(var i = 0; i < this.element.childElementCount; i++){
            var item = this.element.childNodes.item(i);
            var clazz = item.getAttribute('class');
            if(clazz){
                if(cursorBlink){
                    item.setAttribute('class', 'cursor');
                }else{
                    item.setAttribute('class', '_cursor');
                }
            }
        }
    };

    this.length = function(){
        return this.element.childElementCount - 1;
    };

    this.clearText = function(){
        while(1 < this.element.childElementCount){
            this.element.removeChild(this.element.firstElementChild);
        }
        this.cursor = 0;
    };

    this.getChar = function(cursor){
        return this.element.childNodes.item(typeof(cursor)=='number'?cursor:this.cursor).firstChild.textContent;
    };

    this.getText = function(cursor){
        cursor = (typeof(cursor) == 'number')?cursor:0;
        var ret = '';
        var count = this.element.childElementCount - 1;
        for(var i = cursor ; i < count; i++){
            ret += this.element.childNodes.item(i).firstChild.textContent;
        }
        return ret;
    };

    this.removeTextAfter = function(cursor){
        var count = this.element.childElementCount - 1;
        for(var i = cursor ; i < count; i++){
            this.element.removeChild(this.element.childNodes.item(cursor));
        }
        if(this.length() < this.cursor){
            this.cursor = this.length();
        }
    };

    this.removeCharAt = function(cursor){
        var target = this.element.childNodes.item(cursor);
        this.element.removeChild(target);
    };

    this.appendChar = function(cursor, ch){
        var span1 = document.createElement('span');
        var span2 = document.createElement('span');
        span1.appendChild(span2);
        span2.appendChild(document.createTextNode(ch));
        var target = this.element.childNodes.item(cursor);
        this.element.insertBefore(span1, target);
    };

    this.getRomanTextBefore = function(cursor){
        var chars = [];
        var text = this.getText(0).substring(0, cursor);
        for(var i = cursor - 1; 0 <= i; i--){
            var c = text.charAt(i);
            if('a' <= c && c <= 'z' || 'A' <= c && c <= 'Z'){
                chars.push(c);
            }else{
                break;
            }
        }
        return chars.reverse().join('');
    };

    this.replaceText = function(start, end, str){
        //var end = (end < this.element.childElementCount - 1)? end : this.element.childElementCount - 1;
        for(var i = start ; i <= end; i++){
            //console.log('remove', start, end, i, this.element.childNodes.item(start));
            this.element.removeChild(this.element.childNodes.item(start));
        }

        for(var i = 0; i < str.length; i++){
            //console.log('append', str.charAt(i));
            this.appendChar(start+i, str.charAt(i));
        }
    };

    this.appendRomanChar = function(cursor, ch){
        var prev = (0 < this.cursor)?this.getChar(cursor - 1):undefined;

        if(ch == 'n') {
            if(prev == 'n'){
                //nnを「ん」に変換表示
                this.replaceText(cursor - 1, cursor - 1, 'ん');
                return;
            }else{
                //単なるn入力は、前の文字に続けて「あn」「かn」として表示
                this.appendChar(cursor, ch);
                this.forwardCursor();
                return;
            }
        }

        var r = this.getRomanTextBefore(cursor);

        if(r.charAt(0) == 'n'){
            if(ch == 'y') {
                //nにつづけてのyの入力は、前の文字に続けて「ny」として表示
                this.appendChar(cursor, ch);
                this.forwardCursor();
                return;
            }if(0 < 'kstnhfmrwxlgdzjbvp'.indexOf(ch)) {
                this.replaceText(cursor - r.length, cursor - r.length, 'ん');
                r = r.substring(1);
            }
        }

        var hiraganized = kana.hiraganizeOf(r + ch);

        if(hiraganized){
            if(typeof(hiraganized) == 'string') {
                console.log(cursor, ch, ':', r, hiraganized, ':', cursor - r.length, hiraganized.length - r.length);
                this.replaceText(cursor - r.length, cursor - 1, hiraganized);
                this.forwardCursor(hiraganized.length - r.length);
            }
        }else{
            this.appendChar(cursor, ch);
            this.forwardCursor();
        }
    };

    this.setEnabled(false);
    this.setCursorBlink(false);

}

function setupTypingPracticeElement(document, src){

    var mainPanel = new MainPanel(document, document.getElementById("main"));
    var kanjiPromptField = new PromptField(document, document.getElementById('kanji'));
    var kanaPromptField = new PromptField(document, document.getElementById('kana'));
    var romanPromptField = new RomanCodePromptField(document, 'roman');
    var inputField = new InputField(document, document.getElementById('typed'));

    src.next();
    kanjiPromptField.setText(src.getCurrentKanjiText());
    kanaPromptField.setText(src.getCurrentKanaText());
    romanPromptField.setRomanCode(src.getCurrentRomanCode());

    document.addEventListener("keydown", function (e) {
        if(! mainPanel.isEnabled()){
            return;
        }

        var code = keyCode(e);
        if(debug){
            console.log(code);
        }

        if(code == 9){//tab
            return;
        }

        inputField.hideCursor();

        if(code == 13){//Enter
            inputField.clearText();
            kanaPromptField.clearText();
            kanjiPromptField.clearText();
            //romanPromptField.clearText();
            src.next();
            kanjiPromptField.setText(src.getCurrentKanjiText());
            kanaPromptField.setText(src.getCurrentKanaText());
            romanPromptField.setRomanCode(src.getCurrentRomanCode());

            inputField.setCursor(0);

        } if(code == 75/*'k'*/ && e.ctrlKey){
            inputField.removeTextAfter(inputField.getCursor());
        }else if(code == 8 || (code == 72/*'h'*/ && e.ctrlKey)){ // backspace
            if(0 < inputField.getCursor()){
                inputField.backCursor();
                inputField.removeCharAt(inputField.getCursor());
            }
        }else if(code == 46 || (code == 68/*'d'*/ && e.ctrlKey)){ // delete
            if(inputField.getCursor() < inputField.length()){
                inputField.removeCharAt(inputField.getCursor());
            }
        }else if(code == 37 || (code == 66 /*'b'*/ && e.ctrlKey)){ // backward
            if(0 < inputField.getCursor()){
                inputField.backCursor();
            }
        }else if(code == 39 || (code == 70 /*'f'*/ && e.ctrlKey)){ // forward
            if(inputField.getCursor() < inputField.length()) {
                inputField.forwardCursor();
            }
        }else if(code == 65 /*'a'*/ && e.ctrlKey){ // ahead
            inputField.setCursor(0);
        }else if(code == 69 /*'e'*/ && e.ctrlKey){ // end
            inputField.setCursor(inputField.length());
        }else if(e.key.length == 1){
            inputField.appendRomanChar(inputField.getCursor(), e.key);
            //inputField.appendChar(inputField.getCursor(), e.key);
            //inputField.forwardCursor();
        }else{

        }

        inputField.showCursor();
        //console.log('cursor=',inputField.getCursor());

    }, false);

    document.addEventListener("keyup", function (e) {
        if(! mainPanel.isEnabled()){
            return;
        }
        var code = e.keyCode ? e.keyCode : e.which;
    }, false);


    //var cursor = 0;
    mainPanel.setEnabled(false);
    kanjiPromptField.setEnabled(false);
    kanaPromptField.setEnabled(false);
    romanPromptField.setEnabled(false);
    inputField.setEnabled(false);
    inputField.setCursorBlink(false);

    document.addEventListener("mousedown", function (){
        mainPanel.setEnabled(true);
        kanjiPromptField.setEnabled(true);
        kanaPromptField.setEnabled(true);
        romanPromptField.setEnabled(false);
        inputField.setEnabled(true);
        inputField.setCursorBlink(true);
    }, false);


    document.addEventListener("mouseleave", function (){
        mainPanel.setEnabled(false);
        kanjiPromptField.setEnabled(false);
        kanaPromptField.setEnabled(false);
        romanPromptField.setEnabled(false);
        inputField.setEnabled(false);
        inputField.setCursorBlink(false);
    }, false);
}

keyboard.initialize("en", document, "#keyboard");
setupTypingPracticeElement(document, new TextSourceFactory.newInstance());

//keyboard.initialize("jp", document, "#keyboard");
module.exports = {
    setupTypingPracticeElement:setupTypingPracticeElement
};
