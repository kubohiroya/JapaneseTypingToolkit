'use strict';
require("style/keyboard.css");
var keyboard = require('./keyboard')
var TextSourceFactory = require('./textsource').TextSourceFactory;
//var kana = require('./kana.js');

var debug = false;

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

function keyCode(e) {
    if (document.all) {
        return e.keyCode;
    } else if (document.getElementById) {
        return (e.keyCode) ? e.keyCode : e.charCode;
    } else if (document.layers){
        return e.which;
    }
}

function setupTypingPracticeElement(document, src){

    var mainPanel = new MainPanel(document, document.getElementById("main"));

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

        var code = keyCode(e);
        if(debug){
            console.log(code);
        }

        if(code == 9){//tab
            return;
        }

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
            //mainPanel.setKeyFocused(code, (e.key.length == 1)?Colors.focusedKey:Colors.focusedSpecialKey);
            inputField.appendChar(cursor, e.key);
            cursor += 1;
            //console.log('keydown '+code+" ->"+e.key);
        }else{

    }
        inputField.setCursor(cursor);
    }, false);

    document.addEventListener("keyup", function (e) {
        if(! mainPanel.isEnabled()){
            return;
        }
        var code = e.keyCode ? e.keyCode : e.which;
        //mainPanel.setKeyFocused(code, 'none');
        //console.log('keyup '+code+" ->"+e.key);
    }, false);
}

keyboard.initialize("en", document, "#keyboard");
setupTypingPracticeElement(document, new TextSourceFactory.newInstance());

//keyboard.initialize("jp", document, "#keyboard");
module.exports = {
    setupTypingPracticeElement:setupTypingPracticeElement
};
