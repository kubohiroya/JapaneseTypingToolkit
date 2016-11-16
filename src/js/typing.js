'use strict';
require("style/keyboard.css");
//var kana = require('./kana.js');

var debug = true;
var Colors = {
    enabled: '#fff',
    disabled: '#bbb',
    focusedKey: '#f88',
    focusedSpecialKey:'#aaa'
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

function TextSource(){
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

function MainPanel(document, element, callback){
    this.document = document;
    this.element = element;
    this._isEnabled = false;

    this.setEnabled = function(isEnabled){
        if(isEnabled){
            this.element.setAttribute('style', 'background-color: '+Colors.enabled);
        }else{
            this.element.setAttribute('style', 'background-color: '+Colors.disabled);
        }
        this._isEnabled = isEnabled;
    };

    this.isEnabled = function(){
        return this._isEnabled;
    };

    this.setSVGDocument = function(svgDocument){
        this.svgDocument = svgDocument;
    };

    this.setKeyFocused = function(code, fillColor){
        if(this.svgDocument){
            setAttribute(this.svgDocument.getElementById("code-"+code), 'path', 'fill', fillColor);
        }
    };

    this.initialize = function(callback){
        this.setEnabled(false);
        this.objectElement = this.document.createElement('object');
        this.objectElement.setAttribute('tabindex','0');
        this.objectElement.setAttribute('type','image/svg+xml');
        this.objectElement.setAttribute('width','1190');
        this.objectElement.setAttribute('height','348');
        this.objectElement.setAttribute('data', 'img/keyboard_ja.svg');

        this.document.getElementById('keyboard').appendChild(this.objectElement);

        var _this = this;
        this.objectElement.addEventListener("load", function(){
            _this.setSVGDocument(_this.objectElement.getSVGDocument());
            callback();
        });
    };

    this.initialize(callback);
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

function InputField(document, element){
    this.element = element;

    this.clearCursor = function(){
        for(var i = 0; i < this.element.childElementCount; i++){
            var item = this.element.childNodes.item(i);
            if(item.hasAttribute('class')){
                item.removeAttribute('class');
            }
        }
    };

    this.setCursor = function(cursor) {
        if(cursor < this.element.childNodes.length){
            this.element.childNodes.item(cursor).setAttribute('class', 'cursor');
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

    this.clearText = function(){
        while(1 < this.element.childElementCount){
            this.element.removeChild(this.element.firstElementChild);
        }
    };

    this.removeTextAfter = function(cursor){
        var count = this.element.childElementCount - 1;
        for(var i = cursor ; i < count; i++){
            this.element.removeChild(this.element.childNodes.item(cursor));
        }
    };

    this.removeCharAt = function(cursor){
        var target = this.element.childNodes.item(cursor);
        this.element.removeChild(target);
    };

    this.length = function(){
        return this.element.childElementCount - 1;
    };

    this.appendChar = function(cursor, ch){
        var span1 = document.createElement('span');
        var span2 = document.createElement('span');
        span1.appendChild(span2);
        span2.appendChild(document.createTextNode(ch));
        var target = this.element.childNodes.item(cursor);
        this.element.insertBefore(span1, target);
    };

    this.setEnabled = function(isEnabled){
        setAttribute(this.element, 'span', 'style', 'border-left-color:'+(isEnabled?Colors.enabled:Colors.disabled));
    };

    this.setEnabled(false);
    this.setCursorBlink(false);

}

function setupTypingPracticeElement(document, src){

    var mainPanel = new MainPanel(document, document.getElementById("main"), function(){
        var promptField = new PromptField(document, document.getElementById('prompt'));
        var inputField = new InputField(document, document.getElementById('typed'));
        promptField.setText(src.getNextText());

        var cursor = 0;
        mainPanel.setEnabled(false);
        promptField.setEnabled(false);
        inputField.setEnabled(false);
        inputField.setCursorBlink(false);

        document.addEventListener("mousedown", function (){
            mainPanel.setEnabled(true);
            promptField.setEnabled(true);
            inputField.setEnabled(true);
            inputField.setCursorBlink(true);
        }, false);

        document.addEventListener("mouseleave", function (){
            mainPanel.setEnabled(false);
            promptField.setEnabled(false);
            inputField.setEnabled(false);
            inputField.setCursorBlink(false);
        }, false);

        document.addEventListener("keydown", function (e) {
            if(! mainPanel.isEnabled()){
                return;
            }

            var code = e.keyCode ? e.keyCode : e.which;
            if(debug){
                console.log(code);
            }

            if(code == 9){//tab
                return;
            }

            mainPanel.setKeyFocused(code, (e.key.length == 1)?Colors.focusedKey:Colors.focusedSpecialKey);

            inputField.clearCursor();

            if(code == 13){//Enter
                inputField.clearText();
                promptField.clearText();
                promptField.setText(src.getNextText());
                cursor = 0;
            } if(code == 75/*'k'*/ && e.ctrlKey){
                inputField.removeTextAfter(cursor);
            }else if(code == 8 || (code == 72/*'h'*/ && e.ctrlKey)){ // backspace
                if(0 < cursor){
                    cursor -= 1;
                    inputField.removeCharAt(cursor);
                }
            }else if(code == 37 || (code == 66 /*'b'*/ && e.ctrlKey)){ // backward
                if(0 < cursor){
                    cursor -= 1;
                }
            }else if(code == 39 || (code == 70 /*'f'*/ && e.ctrlKey)){ // forward
                if(cursor < inputField.length()) {
                    cursor += 1;
                }
            }else if(code == 65 /*'a'*/ && e.ctrlKey){ // ahead
                cursor = 0;
            }else if(code == 69 /*'e'*/ && e.ctrlKey){ // end
                cursor = inputField.length();
            }else if(e.key.length == 1){
                inputField.appendChar(cursor, e.key);
                cursor += 1;
            }
            inputField.setCursor(cursor);
        }, false);

        document.addEventListener("keyup", function (e) {
            if(! mainPanel.isEnabled()){
                return;
            }
            var code = e.keyCode ? e.keyCode : e.which;
            mainPanel.setKeyFocused(code, 'none');
        }, false);

    });

}

setupTypingPracticeElement(document, new TextSource());

module.exports = {
    setupTypingPracticeElement:setupTypingPracticeElement
};
