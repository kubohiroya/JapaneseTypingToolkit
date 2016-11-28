/**
 * Created by hiroya on 16/11/20.
 */

'use strict';

var d3 = require('d3');

function appendRomanCodeInputPrompt(element, code, d){
    if(d == undefined){
        d = [];
    }
    if(typeof(element)=='string'){
        element = d3.select(element);
    }
    if(code instanceof Array){
        var candidates = element.append('div');
        candidates.attr('class','candidates');
        candidates.attr("id","p_" + d.join('_'));
        code.forEach(function(item, j){
            appendRomanCodeInputPrompt(candidates, item, d.concat(j));
        });
    }else if(code instanceof Object && code.seq){
        var sequence = element.append('div');
        sequence.attr('class','sequence');
        sequence.attr("id","p_" + d.join('_'));
        code.seq.forEach(function(item, j){
            appendRomanCodeInputPrompt(sequence, item, d.concat(j));
        });
    }else if(typeof(code) == 'string'){
        var div = element.append('div').attr("id","p_" + d.join('_')).text(code);
        div.data(d);
    }
}

module.exports = {
    appendRomanCodeInputPrompt:appendRomanCodeInputPrompt
};