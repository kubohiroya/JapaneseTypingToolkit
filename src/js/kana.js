'use strict';

var patterns = function(){
	var pattern = {
		'基本50音':function(){
			var src =
				'ぁあぃいぅうぇえぉお'+
				'かがきぎくぐけげこご'+
				'さざしじすずせぜそぞ'+
				'ただちぢっつづてでとど'+
				'なにぬねの'+
				'はばぱひびぴふぶぷへべぺほぼぽ'+
				'まみむめも'+
				'ゃやゅゆょよ'+
				'らりるれろ'+
				'ゎわゐゑをん';

			var code = [
				['xa','la'],'a', ['xi','li'],'i', ['xu','lu'], 'u', ['le','xe'],'e', ['xo','lo'],'o',
				'ka','ga','ki','gi','ku','gu','ke','ge','ko','go',
				'sa','za',['si','shi'],['zi','ji'],'su',['zu','dzu'],'se','ze','so','zo',
				'ta','da',['ti','chi'],'di',['xtu','ltu','xtsu','ltsu'],['tu','tsu'],['du','dzu'],'te','de','to','do',
				'na','ni','nu','ne','no',
				'ha','ba','pa','hi','bi','pi','hu','bu','pu','he','be','pe','ho','bo','po',
				'ma','mi','mu','me','mo',
				['xya','lya'],'ya',['xyu','lyu'],'yu',['xyo','lyo'],'yo',
				'ra','ri','ru','re','ro',
				['xwa','lwa'],'wa','wi','we','wo', ['n','nn']
			];
			var data = {};
			src.split('').forEach(function(c, i){
				data[c] = code[i];
			});
			return data;
		}(),
		'XゃXゅXょ': function(){
			var data = {};
			[['き','k'],['に', 'n'], ['ひ', 'h'], ['み', 'm'], ['り','r'],
				['ぎ','g'], ['じ','z'], ['ぢ', 'd'], ['び', 'b'],
				['ぴ','p']].forEach(function(key){
				data[key[0]+'ゃ'] = key[1]+'ya';
				data[key[0]+'ゅ'] = key[1]+'yu';
				data[key[0]+'ょ'] = key[1]+'yo';
			});
			return data;
		}(),
		'ふぁふぃ・ふぇふぉ': {'ふぁ':'fa', 'ふぃ':'fi', 'ふぇ':'fe', 'ふぉ':'fo'},
		'ゔぁゔぃ・ゔぇゔぉ': {'ゔぁ':'va', 'ゔぃ':'vi', 'ゔぇ':'ve', 'ゔぉ':'vo'},
		'くゎぐゎ':{'くゎ':'kwa', 'ぐゎ':'gwa'},
		'ちゃちゅちょ':{'ちゃ':['tya','cha'], 'ちゅ':['tyu','chu'], 'ちょ':['tyo','cho']},
		'しゃしゅしょ':{'しゃ':['sya','sha'], 'しゅ':['syu','shu'], 'しょ':['syo','sho']},
		'じゃじゅじょ':{'じゃ':['zya','ja'], 'じゅ':['zyu','ju'], 'じょ':['zyo','jo']},
		'記号':{
			'ー':'-',
			'。':'.',
			'．':'.',
			'、':',',
			'，':',',
			'？':'?'
		}
	};

	var romanizer = {};
	Object.keys(pattern).forEach(function(key){
		romanizer = Object.assign(romanizer, pattern[key]);
	});
	mixInSokuonPatterns(romanizer);
	mixInLowerCasePatterns(romanizer);

	var hiraganizer = {};
	var addHiraganaItem = function(key, value){
		if(value instanceof Array){
			value.forEach(function(v){
				addHiraganaItem(key, v);
			});
		}else if(value instanceof Object) {
			//ignore
		}else if(typeof(value) == 'string'){
			if(value in hiraganizer) {
				if(typeof(hiraganizer[value]) == 'string'){
					hiraganizer[value] = [ hiraganizer[value], key ];
				}else if(hiraganizer[value] instanceof Array) {
					hiraganizer[value].push(key);
				}
			}else{
				hiraganizer[value] = key;
			}
		}
	};

	Object.keys(romanizer).forEach(function(key){
		var value = romanizer[key];
		addHiraganaItem(key, value);
	});
	//mixInHiraganizedPrefixPatterns(hiraganizer);
	return {romanizer:romanizer, hiraganizer:hiraganizer};
}();

function createSokuonPatterns(romanizer){
	var consonants = 'かがきぎくぐけげこご'+
		'さざしじすずせぜそぞ'+
		'ただちぢつづてでとど'+
		'なにぬねの'+
		'はばぱひびぴふぶぷへべぺほぼぽ'+
		'まみむめも'+
		'やゆよ'+
		'らりるれろ';
	var sokuonCodes = {};

	Object.keys(romanizer).forEach(function(kanaKey){
		if(0 <= consonants.indexOf(kanaKey.charAt(0))){
			var romanCodes = romanizer[kanaKey];
			if(typeof(romanCodes) == 'string'){
				sokuonCodes['っ'+kanaKey] = romanCodes.charAt(0)+romanCodes;
			}else if(romanCodes instanceof Array){
				sokuonCodes['っ'+kanaKey] = [];
				romanCodes.forEach(function(romanCode){
					var sokuonCode = romanCode.charAt(0)+romanCode;
					sokuonCodes['っ'+kanaKey].push(sokuonCode);
				});
			}
		}
	});
	return sokuonCodes;
}

function mixInSokuonPatterns(ret){
	return Object.assign(ret, createSokuonPatterns(ret));
}

function mixInLowerCasePatterns(romanizer){

	var createLowerCaseTests = function(kanaKey){
		return kanaKey.split('').map(function(c){
			return 0 <= 'ぁぃぅぇぉっゃゅょゎ'.indexOf(c);
		});
	};

	[function(kanaKey){
		if(kanaKey.length == 2){
			var lowerCaseTests = createLowerCaseTests(kanaKey);
			if((lowerCaseTests[0] === true && lowerCaseTests[1] === false) || (lowerCaseTests[0] === false && lowerCaseTests[1] === true)){//ex.「っち」「ちゃ」
				var kanaKeyToRomanCode = romanizer[kanaKey];
				if(typeof(kanaKeyToRomanCode) == 'string'){
					romanizer[kanaKey] = [
						kanaKeyToRomanCode,
						{seq:[romanizer[kanaKey.charAt(0)],
							romanizer[kanaKey.charAt(1)]]
						}
					];
				}else if(kanaKeyToRomanCode instanceof Object){
					kanaKeyToRomanCode.push({seq:[romanizer[kanaKey.charAt(0)],
						romanizer[kanaKey.charAt(1)]]});
				}
			}
		}
	},
		function(kanaKey){
			if(kanaKey.length == 3){
				var lowerCaseTests = createLowerCaseTests(kanaKey);
				if(lowerCaseTests[0] === true && lowerCaseTests[1] === false && lowerCaseTests[0] === true){//ex.「っちゃ」
					var kanaKeyToRomanCode = romanizer[kanaKey];
					if(typeof(kanaKeyToRomanCode) == 'string'){
						var wrappedkanaKeyToRomanCode = [kanaKeyToRomanCode];
						kanaKeyToRomanCode = wrappedkanaKeyToRomanCode;
						romanizer[kanaKey] = wrappedkanaKeyToRomanCode;

					}
					if(kanaKeyToRomanCode instanceof Object){
						kanaKeyToRomanCode.push({seq:[romanizer[kanaKey.charAt(0)],
							romanizer[kanaKey.substr(1,2)]]});
						kanaKeyToRomanCode.push({seq:[romanizer[kanaKey.charAt(0)],
							romanizer[kanaKey.charAt(1)] ,
							romanizer[kanaKey.charAt(2)]]});
						kanaKeyToRomanCode.push({seq:[romanizer[kanaKey.substr(0,2)],
							romanizer[kanaKey.charAt(2)]]});
					}
				}
			}
		}].forEach(function(f){
		Object.keys(romanizer).forEach(function(kanaKey){
			f(kanaKey);
		});
	});
}

function mixInHiraganizedPrefixPatterns(hiraganizer){
	var hiraganizedPrefixPatterns = {};
	Object.keys(hiraganizer).forEach(function(key){
		var value = hiraganizer[key];
		if(key.charAt(0) == 'n'){
			hiraganizedPrefixPatterns['ん'+key.substring(1)] = value;
		}
	});

	return Object.assign(hiraganizer, hiraganizedPrefixPatterns);
}

/**
 * ひらがなによる部分文字列に対応するローマ字文字列パターン構造を返す。通常は、この関数ではなく、romanizeを用いる。
 * @param {string} ch ひらがなによる部分文字列
 * @returns {*} ローマ字文字列のパターン構造
 */
function romanizeOf(ch){
	return patterns.romanizer[ch];
}

/**
 * ローマ字による部分文字列に対応するひらがな文字列パターン構造を返す。通常は、この関数ではなく、hiraganizeを用いる。
 * @param {string} str ローマ字による部分文字列
 * @returns {*} ひらがな文字列のパターン構造
 */
function hiraganizeOf(str){
	return patterns.hiraganizer[str];
}

/**
 * ひらがな文字列に対応するローマ字文字列パターン構造を返す。
 * @param {string} src ひらがなによる文字列
 * @returns {*} ローマ字による文字列パターン構造
 */
function romanize(src){
	var target = [];
	var s = src.split('');
	for(var i = 0; i < s.length ; i++){
		(function(){
			for(var j = 3; 0 < j; j--){
				if(i <= s.length - j){
					var pattern = src.substr(i, j);
					var code = romanizeOf(pattern);
					if(code){
						target.push(code);
						i += (j - 1);
						return;
					}
				}
			}
			target.push(romanizeOf(s[i]));
		})();
	}
	if(target.length == 1 && target instanceof Array ){
		return target[0];
	}
	return {seq:target};
}


/**
 * ローマ字による文字列に対応するひらがな文字列パターン構造を返す。
 * @param {string} src ローマ字による文字列
 * @returns {*} ひらがなによる文字列パターン構造
 */
function hiraganize(src){
	var target = [];
	var s = src.split('');
	for(var i = 0; i < s.length ; i++){
		(function() {
			for (var j = 4; 0 < j; j--) {
				var pattern = src.substr(i, j);
				var code = hiraganizeOf(pattern);
				if (code) {
					target.push(code);
					i += (j - 1);
					return;
				}else if(j == 1){
					target.push(pattern);
					return;
				}
			}
			target.push(hiraganizeOf(s[i]));
		})();
	}
	if(target.length == 1 && target instanceof Array ){
		return target[0];
	}
	return {seq:target};
}

/**
 * 文字列パターン構造へのポインタを与えると、そのポインタの子ポインタ（指定されたポインタの階層よりも１段深い階層の0番目のポインタ）を返す。
 * @param {Array.<Number>} pointer 文字列パターンへのポインタ
 * @returns {Array.<Number>} 入力された文字列パターンへのポインタの子ポインタ
 */
function getChildPointer(pointer){
	var ret = [].concat(pointer);
	ret.push(0);
	return ret;
}

/**
 * 文字列パターン構造に対してポインタを与えると、そのポインタの差し示す文字列パターン構造を返す。
 * @param {*} code 文字列パターン構造
 * @param {Array.<Number>} pointer 文字列パターン構造へのポインタ
 * @returns {*} 文字列パターン構造
 * @throws {string} ポインタが不正な場合にエラーメッセージを投げる
 */
function select(code, pointer){
	if(!(pointer instanceof Array)) {
		throw 'InvalidPointer:'+JSON.stringify(pointer, null, ' ');
	}
	if(pointer.length == 0){
		return code;
	}
	var index = pointer[0];
	var next = pointer.slice(1);

	if(code instanceof String){
		return code;
	}else if(code instanceof Array && index < code.length){
		return select(code[index], next);
	}else if(code && code.seq && code.seq instanceof Array && index < code.seq.length){
		return select(code.seq[index], next);
	}else{
		return [];
	}
}

/**
 * 文字列パターン構造に対してポインタを与えると、そのポインタの親についてのコンテキスト情報を返す。
 * @param {*} code 文字列パターン構造
 * @param {Array.<Number>} pointer 文字列パターン構造へのポインタ
 * @returns {Object} context コンテキスト情報
 * @returns {string} context.type コンテキスト名、'sequence','candidates'のいずれかの文字列値を取る。
 * @returns {Array.<Array.<Number>>} context.sequence このコンテキストにおける入力順での直列的なポインタの配列。コンテキスト名がsequenceの場合に必須。
 * @returns {Array.<Array.<Number>>} context.candidates このコンテキストにおける入力候補での並列的なポインタの配列。コンテキスト名がcandidatesの場合に必須。
 * @returns {Number} context.index このコンテキストにおけるポインタ配列の中での現在のポインタのインデクス。
 * @returns {Number} context.length このコンテキストにおけるポインタ配列の長さ。
 * @returns {boolean} context.isLastElement このコンテキストにおけるポインタ配列内で、現在のポインタが配列末尾の要素であるか否かを返す。
 * @returns {*|null|undefined} context.nextPointer このコンテキストにおけるポインタ配列内で、現在のポインタの次の要素を返す。現在のポインタが配列末尾の要素である場合はnullを、さらにポインタが文字列パターン構造の終端である場合にはundefinedを返す。
 * @throws {string} ポインタが不正な場合にエラーメッセージを投げる
 */
function getContext(code, pointer){
	if(!(pointer instanceof Array)) {
		throw 'pointer must be an array';
	}
	var candidates;
	if(0 < pointer.length) {
		candidates = select(code, pointer.slice(0, pointer.length - 1));
	}else{
		candidates = code;
	}

	var index = pointer[pointer.length - 1];

	function getNextElementPointer(){
		return pointer.slice(0, pointer.length - 2).concat(pointer[pointer.length-1]+1);
	}

	if(candidates instanceof Object && candidates.seq){
		var isLastSeqItem = pointer[pointer.length - 1] == candidates.seq.length - 1;
		var nextSequencePointer = (isLastSeqItem)? null: getNextElementPointer();
		return {
			'type':'sequence',
			'sequence':candidates.seq,
			'index':index,
			'length':candidates.seq.length,
			'isLastElement': isLastSeqItem,
			'nextPointer': nextSequencePointer
		};
	}else if(candidates instanceof Array){
		var isLastCandidateItem = (0 < pointer.length) && (pointer[pointer.length - 1] == candidates.length - 1);
		var siblingCandidatePointer = (isLastCandidateItem)? null: ((0 < pointer.length)? getNextElementPointer():undefined);
		return {
			'type':'candidates',
			'candidates':candidates,
			'index':index,
			'length':candidates.length,
			'isLastElement': isLastCandidateItem,
			'nextPointer': siblingCandidatePointer
		};
	}else{
		throw 'invalid context';
	}
}

/**
 * 文字列パターン構造に対してポインタを与えると、そのポインタから選択可能な文字列パターン構造へのポインタの配列を返す。
 * @param {*} code 文字列パターン構造
 * @param {Array.<Number>} pointer 文字列パターン構造へのポインタ
 * @returns {Array.<Array.<Number>>} そのポインタから選択可能な文字列パターン構造へのポインタの配列
 * @throws {string} ポインタが不正な場合にエラーメッセージを投げる
 */
function selectCandidatePointers(code, pointer) {
	if (!(pointer instanceof Array)) {
		throw 'Pointer must be an array';
	}
	var current = select(code, pointer);
	if (typeof(current) == 'string') {
		return [pointer];
	} else if (current instanceof Array) {
		var ret = [];
		current.forEach(function (a, i) {
			var targetPointer = pointer.concat(i);
			if (typeof(a) == 'string') {
				ret.push(targetPointer);
			} else if (a instanceof Array) {
				ret = ret.concat(selectCandidatePointers(code, targetPointer));
			} else if (a instanceof Object) {
				ret = ret.concat(selectCandidatePointers(code, targetPointer.concat(0)));
			} else {
				throw 'invalid pointer';
			}
		});
		return ret;
	} else if (current instanceof Object) {
		return selectCandidatePointers(code, pointer.concat(0));
	} else {
		throw 'Invalid pointer';
	}
}


/**
 * 文字列パターン構造に対してポインタを与えると、そのポインタでの処理集合後に選択可能な文字列パターン構造へのポインタを返す。
 * @param {*} code 文字列パターン構造
 * @param {Array.<Number>} pointer 文字列パターン構造へのポインタ
 * @returns {Array.<Array.<Number>>} そのポインタから選択可能な文字列パターン構造へのポインタの配列
 * @throws {string} ポインタが不正な場合にエラーメッセージを投げる
 */
function getNextPointer(code, pointer){
	if(!(pointer instanceof Array)) {
		throw 'pointer must be an array';
	}
	if(pointer.length == 0) {
		return selectCandidatePointers(code, [0]);
	}
	var context = getContext(code, pointer);
	var p = pointer.slice(0, pointer.length - 1);
	if(context.type == 'sequence'){
		if(! context.isLastElement) {
			p.push(pointer[pointer.length - 1] + 1);
			return p;
		}else if(1 < pointer.length){
			return getNextPointer(code, p);
		}else{
			return null;
		}
	}else if(context.type == 'candidates'){
		if(p.length == 0) {
			return null;
		}else {
			return getNextPointer(code, p);
		}
	}else{
		throw 'invalid context';
	}
}


/**
 * 文字列パターン構造に対してポインタを与えると、そのポインタ以降のテキストを返す
 * @param {*} code 文字列パターン構造
 * @param {Array.<Number>} pointer 文字列パターン構造へのポインタ
 * @param {function} [selectorFunction] 文字列パターンの配列のうち、どれを利用するかを選択する関数
 * @returns {String} そのポインタ以降のテキスト
 * @throws {string} ポインタが不正な場合にエラーメッセージを投げる
 */
function getText(code, pointer, selectorFunction){
	var currentText = select(code, pointer);
	if(currentText instanceof Array && 0 < currentText.length){
		if(selectorFunction && selectorFunction instanceof Function){
			currentText = selectorFunction(currentText);
		}else{
			currentText = currentText[0];
		}
	}
	var nextPointer = getNextPointer(code, pointer);
	if(nextPointer != null){
		return [currentText].concat(getText(code, nextPointer)).join('');
	}else{
		return currentText;
	}
}

/**
 * 追加的な文字をタイピングをした結果を返す。
 * @param code かな文字列をromanize関数により文字列パターン構造化したもの。
 * @param {Object} params 処理対象となる状態を表すオブジェクト。pointer, line, segment, addedの4つのプロパティを持つ必要がある。
 * @param {Array.<Number>} params.pointer 文字列パターン構造に対する現在のポインタ。
 * @param {String} params.line 現在の一連の入力結果の文字列。
 * @param {String} params.segment 現在のポインタが差す文字列パターン構造部分についての入力結果の文字列。
 * @param {String} params.added 追加的な文字列
 * @param {String} [params.status] 現在のステータス。指定はオプション。
 * @returns {String} result.status 処理後のステータス、'initialized', 'ok', 'forwarded', 'finished', 'ng'の文字列値を取り得る。
 * @returns {String} result.line 処理後の一連の入力結果の文字列。
 * @returns {Array.<Number>} [result.pointer] 処理後の文字列パターン構造に対するポインタ。statusが'finished'の値を取る際には省略される。
 * @returns {String} result.segment 処理後のポインタが差す文字列パターン構造部分についての入力結果の文字列。
 * @returns {Array.<Array.<Number>>} [result.next] 処理後に、文字列パターン構造に対する現在のポインタから遷移し得る、次のポインタの配列。statusが'finished'の値を取る際には省略される。
 * @returns {Object} result 追加的な文字をタイピングをした結果
 * @throws {string} ポインタが不正な場合にエラーメッセージを投げる
 */
function type(code, params){
	var status = params.status || 'forwarded';
	var pointer = params.pointer;
	var line = params.line;
	var segment = params.segment;
	var added = params.added;
	var candidatePointers = selectCandidatePointers(code, pointer);
	var test = segment + added;
	if(pointer.length == 0 && line == '' && added == ''){
		return {status:'initialized', pointer:[], line:'', segment:'', next: candidatePointers};
	}

	var selectedPointers = candidatePointers.filter(function(candidatePointer){
		var candidate = select(code, candidatePointer);
		return (typeof(candidate) == 'string' && candidate.indexOf(test) == 0);
	});

	var context = getContext(code, pointer);

	if(selectedPointers.length == 0){
		if(context.candidates && context.nextPointer){
			return type(code, {status:'ok', pointer:context.nextPointer, line:line, segment:segment, added:added});
		}else {
			return {status: 'ng', pointer:pointer, line:line, segment:segment};
		}
	}else if(selectedPointers.length == 1) {
		var target = select(code, selectedPointers[0]);
		if(pointer != selectedPointers[0]) {
			status = 'ok';
		}
		pointer = selectedPointers[0];

		if(target == test) {
			var nextPointer = getNextPointer(code, selectedPointers[0]);
			if(nextPointer) {
				return type(code, {status:'ok', pointer:nextPointer, line:line+added, segment:'', added:''});
			}else{
				return {status: 'finished', pointer:undefined, line: line + added, segment:''};
			}
		}
	}else if(1 < selectedPointers.length) {
		status = 'ok';
	}

	return {
		status: status,
		pointer: pointer,
		line: line + added,
		segment: segment + added,
		next: selectedPointers
	};
}

module.exports = {
	romanizeOf: romanizeOf,
	hiraganizeOf: hiraganizeOf,
	romanize: romanize,
	hiraganize: hiraganize,
	getChildPointer:getChildPointer,
	select: select,
	getText: getText,
	getNextPointer:getNextPointer,
	selectCandidatePointers:selectCandidatePointers,
	type:type
};
