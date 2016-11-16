var assert = require('power-assert');
var kana = require('../kana');

describe('romanizeOf', function() {
    it('「つ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanizeOf('つ');
        var b = ['tu', 'tsu'];
        assert.deepEqual(a, b);
    });
    it('「づ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanizeOf('づ');
        var b = ['du','dzu'];
        assert.deepEqual(a, b);
    });
    it('「ち」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanizeOf('ち');
        var b = ['ti','chi'];
        assert.deepEqual(a, b);
    });
    it('「あ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = 'a';
        var b = kana.romanizeOf('あ');
        assert.deepEqual(a, b);
    });
    it('「い」をローマ字で入力する際の候補を配列として返す', function() {
        var a = 'i';
        var b = kana.romanizeOf('い');
        assert.deepEqual(a, b);
    });
});

describe('hiraganizeOf', function() {
    it('「tu」をローマ字で入力した結果のひらがな表現「つ」を返す', function() {
        var a = kana.hiraganizeOf('tu');
        var b = 'つ';
        assert.deepEqual(a, b);
    });
    it('「tsu」をローマ字で入力した結果のひらがな表現「つ」を返す', function() {
        var a = kana.hiraganizeOf('tsu');
        var b = 'つ';
        assert.deepEqual(a, b);
    });
    it('「ti」をローマ字で入力した結果のひらがな表現「ち」を返す', function() {
        var a = kana.hiraganizeOf('ti');
        var b = 'ち';
        assert.deepEqual(a, b);
    });
    it('「chi」をローマ字で入力した結果のひらがな表現「ち」を返す', function() {
        var a = kana.hiraganizeOf('chi');
        var b = 'ち';
        assert.deepEqual(a, b);
    });
});

describe('romanize', function() {
    it('「しょ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = ['syo', 'sho', {seq:[['si', 'shi'], ['xyo', 'lyo']]}];
        var b = kana.romanize('しょ');
        assert.deepEqual(a, b);
    });
    it('「った」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('った');
        var b = ['tta', {seq:[['xtu','ltu','xtsu','ltsu'], 'ta']}];
        assert.deepEqual(a, b);
    });
    it('「っち」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('っち');
        var b = ['tti','cchi', {seq:[['xtu','ltu','xtsu','ltsu'], ['ti','chi']]}];
        assert.deepEqual(a, b);
    });
    it('「っつ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('っつ');
        var b = ['ttu','ttsu', {seq:[['xtu','ltu','xtsu','ltsu'], ['tu','tsu']]}];
        assert.deepEqual(a, b);
    });
    it('「っきゃ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('っきゃ');
        var b = ['kkya',
            {seq:[['xtu','ltu','xtsu','ltsu'],['kya',{seq:['ki',['xya','lya']]}]]},
            {seq:[['xtu','ltu','xtsu','ltsu'],'ki',['xya','lya']]},
            {seq:[['kki',{seq:[['xtu','ltu','xtsu','ltsu'],'ki']}],['xya','lya']]}
        ];
        assert.deepEqual(a, b);
    });
    it('「っちゃ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('っちゃ');
        var b = ['ttya',
            'ccha',
            {'seq':[['xtu','ltu','xtsu','ltsu'],['tya','cha',{'seq':[['ti','chi'],['xya','lya']]}]]},
            {'seq':[['xtu','ltu','xtsu','ltsu'],['ti','chi'],['xya','lya']]},
            {'seq':[['tti','cchi',{'seq':[['xtu','ltu','xtsu','ltsu'],['ti','chi']]}],['xya','lya']]}
        ];
        assert.deepEqual(a, b);
    });

    it('「あんな」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('あんな');
        var b = {'seq':['a',['n', 'nn'], 'na']};
        assert.deepEqual(a, b);
    });

    it('「きゃきゅきょ」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('きゃきゅきょ');
        var b = {'seq':[['kya',{'seq':['ki',['xya','lya']]}],
            ['kyu',{'seq':['ki',['xyu','lyu']]}],
            ['kyo',{'seq':['ki',['xyo','lyo']]}]]};
        assert.deepEqual(a, b);
    });
    it('「やっぱりさっかーをしたかった」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('やっぱりさっかーをしたかった');
        var b = {'seq':['ya',
            ['ppa',{'seq':[['xtu','ltu','xtsu','ltsu'],'pa']}],
            'ri',
            'sa',
            ['kka',{'seq':[['xtu','ltu','xtsu','ltsu'],'ka']}],
            '-',
            'wo',
            ['si','shi'],
            'ta',
            'ka',
            ['tta',{'seq':[['xtu','ltu','xtsu','ltsu'],'ta']}]]};
        assert.deepEqual(a, b);
    });
    it('「ちばしょうかだいがく」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('ちばしょうかだいがく');
        var b = {'seq':[['ti','chi'],
            'ba',
            ['syo','sho',{'seq':[['si','shi'],['xyo','lyo']]}],
            'u',
            'ka',
            'da',
            'i',
            'ga',
            'ku']};
        assert.deepEqual(a, b);
    });
    it('「しゅっちょう」をローマ字で入力する際の候補を配列として返す', function() {
        var a = kana.romanize('しゅっちょう');
        var b = {'seq':[['syu','shu',{'seq':[['si','shi'],['xyu','lyu']]}],//しゅ
            ['ttyo','ccho',//っちょ
                {'seq':[['xtu','ltu','xtsu','ltsu'],['tyo','cho',{'seq':[['ti','chi'],['xyo','lyo']]}]]},
                {'seq':[['xtu','ltu','xtsu','ltsu'],['ti','chi'],['xyo','lyo']]},
                {'seq':[[ 'tti',
                    'cchi',
                    {'seq':[['xtu','ltu','xtsu','ltsu'],['ti','chi']]}
                ],
                    ['xyo','lyo']]}],
            'u']};
        assert.deepEqual(a, b);
    });
    it('「ぷれぜん」をローマ字で入力する際の候補を配列として返す', function() {
        var a = {seq:['pu','re','ze',['n','nn']]};
        var b = kana.romanize('ぷれぜん');
        assert.deepEqual(a, b);
    });
});

describe('hiraganize', function() {
    it('「purezen」をローマ字で入力する際の変換後のひらがなを配列として返す', function() {
        var a = {seq:['ぷ','れ','ぜ','ん']};
        var b = kana.hiraganize('purezen');
        assert.deepEqual(a, b);
    });
    it('「purezenn」をローマ字で入力する際の変換後のひらがなを配列として返す', function() {
        var a = {seq:['ぷ','れ','ぜ','ん']};
        var b = kana.hiraganize('purezenn');
        assert.deepEqual(a, b);
    });
    it('「syuttyou」をローマ字で入力する際の変換後のひらがなを配列として返す', function() {
        var a = {seq:['しゅ','っちょ','う']};
        var b = kana.hiraganize('syuttyou');
        assert.deepEqual(a, b);
    });
    it('「shuttyou」をローマ字で入力する際の変換後のひらがなを配列として返す', function() {
        var a = {seq:['しゅ','っちょ','う']};
        var b = kana.hiraganize('shuttyou');
        assert.deepEqual(a, b);
    });
    it('「shuxtsuchou」をローマ字で入力する際の変換後のひらがなを配列として返す', function() {
        var a = {seq:['しゅ','っ', 'ちょ', 'う']};
        var b = kana.hiraganize('shuxtsuchou');
        assert.deepEqual(a, b);
    });
    it('「shixyuxtsuchou」をローマ字で入力する際の変換後のひらがなを配列として返す', function() {
        var a = {seq:['し','ゅ','っ', 'ちょ', 'う']};
        var b = kana.hiraganize('shixyuxtsuchou');
        assert.deepEqual(a, b);
    });
});


describe('getChildPointer', function() {
	it('次の一段深い入力位置を示す', function() {
		assert.deepEqual(kana.getChildPointer([]), [0]);
		assert.deepEqual(kana.getChildPointer([0]), [0,0]);
		assert.deepEqual(kana.getChildPointer([1]), [1,0]);
		assert.deepEqual(kana.getChildPointer([1,2]), [1,2,0]);
		assert.deepEqual(kana.getChildPointer([1,2,3]), [1,2,3,0]);
		assert.deepEqual(kana.getChildPointer([2]), [2,0]);
	});
});

describe('select', function(){
    var romanCode = {seq:[['ti', 'chi'], 'ba']};
    it('「ちば」をローマ字で入力する際の候補', function() {
	assert.deepEqual(kana.select(romanCode, []), {seq:[['ti', 'chi'], 'ba']});
	assert.deepEqual(kana.select(romanCode, [0]), ['ti','chi']);
	assert.deepEqual(kana.select(romanCode, [0, 0]), 'ti');
	assert.deepEqual(kana.select(romanCode, [0, 1]), 'chi');
	assert.deepEqual(kana.select(romanCode, [1]), 'ba');
    });

    it('「ちばしょうかだいがく」をローマ字で入力する際の候補', function() {
		var romanCode = {'seq':[['ti','chi'],
					'ba',
					['syo','sho',{'seq':[['si','shi'],['xyo','lyo']]}],
					'u',
					'ka',
					'da',
					'i',
					'ga',
					'ku']};
		assert.deepEqual( kana.select(romanCode, []), romanCode);
		assert.deepEqual( kana.select(romanCode, [0]), ['ti', 'chi']);
		assert.deepEqual( kana.select(romanCode, [1]), 'ba');
		assert.deepEqual( kana.select(romanCode, [2]), ['syo','sho',{'seq':[['si','shi'],['xyo','lyo']]}]);
		assert.deepEqual( kana.select(romanCode, [2, 0]), 'syo');
		assert.deepEqual( kana.select(romanCode, [2, 1]), 'sho');
		assert.deepEqual( kana.select(romanCode, [2, 2]), {'seq':[['si','shi'],['xyo','lyo']]});
		assert.deepEqual( kana.select(romanCode, [2, 2, 0]), ['si','shi']);
		assert.deepEqual( kana.select(romanCode, [2, 2, 1]), ['xyo','lyo']);
		assert.deepEqual( kana.select(romanCode, [3]), 'u');
		assert.deepEqual( kana.select(romanCode, [4]), 'ka');
		assert.deepEqual( kana.select(romanCode, [5]), 'da');
		assert.deepEqual( kana.select(romanCode, [6]), 'i');
		assert.deepEqual( kana.select(romanCode, [7]), 'ga');
		assert.deepEqual( kana.select(romanCode, [8]), 'ku');
    });
});

describe('selectCandidatePointers', function() {
    it('現在のポインタから遷移し得るポインタを全て返す', function() {
        var romanCode = {'seq':[
            ['ti','chi'],
            'ba',
            ['syo','sho',{'seq':[['si','shi'],['xyo','lyo']]}],
            'u',
            'ka',
            'da',
            'i',
            'ga',
            'ku'
        ]
        };
        assert.deepEqual(kana.selectCandidatePointers(romanCode, []),[[0,0],[0,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [0]),[[0,0],[0,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [0,0]),[[0,0]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [0,1]),[[0,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [1]),[[1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2]),[[2,0],[2,1],[2,2,0,0],[2,2,0,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2,0]),[[2,0]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2,1]),[[2,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2,2,0,0]),[[2,2,0,0]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2,2,0,1]),[[2,2,0,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2,2,1,0]),[[2,2,1,0]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [2,2,1,1]),[[2,2,1,1]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [3]),[[3]]);
		assert.deepEqual(kana.selectCandidatePointers(romanCode, [4]),[[4]]);
	});
});

describe('getNextPointer', function() {
	it('「ちばしょうかだいがく」を例に、現在のポインタが完了したら遷移するポインタを返す', function() {
		var romanCode = {'seq':[
			['ti','chi'],
			'ba',
			['syo','sho',{'seq':[['si','shi'],['xyo','lyo']]}],
			'u',
			'ka',
			'da',
			'i',
			'ga',
			'ku'
		]
		};
		assert.deepEqual(kana.getNextPointer(romanCode, [0, 0]), [1]);
		assert.deepEqual(kana.getNextPointer(romanCode, [0, 1]), [1]);
		assert.deepEqual(kana.getNextPointer(romanCode, [1]), [2]);
		assert.deepEqual(kana.getNextPointer(romanCode, [2, 0]), [3]);
		assert.deepEqual(kana.getNextPointer(romanCode, [2, 1]), [3]);
		assert.deepEqual(kana.getNextPointer(romanCode, [2, 2, 0, 0]), [2, 2, 1]);
		assert.deepEqual(kana.getNextPointer(romanCode, [2, 2, 0, 1]), [2, 2, 1]);
		assert.deepEqual(kana.getNextPointer(romanCode, [2, 2, 1, 0]), [3]);
		assert.deepEqual(kana.getNextPointer(romanCode, [2, 2, 1, 1]), [3]);
		assert.deepEqual(kana.getNextPointer(romanCode, [3]), [4]);
		assert.deepEqual(kana.getNextPointer(romanCode, [7]), [8]);
		assert.deepEqual(kana.getNextPointer(romanCode, [8]), null);
    });
    it('「しょ」を例に、現在のポインタが完了したら遷移するポインタを返す', function() {
        var romanCode = ['syo', 'sho', {seq:[['si', 'shi'], ['xyo', 'lyo']]}];
        assert.deepEqual(kana.getNextPointer(romanCode, [0]), null);
    });
});

describe('getText', function() {
    it('指定のポインタ以降のテキストを返す', function () {
        var code = {
            'seq': [
                ['ti', 'chi'],
                'ba',
                ['syo', 'sho', {'seq': [['si', 'shi'], ['xyo', 'lyo']]}],
                'u',
                'ka',
                'da',
                'i',
                'ga',
                'ku'
            ]
        };
        assert.equal(kana.getText(code, [0]), 'tibasyoukadaigaku');
        assert.equal(kana.getText(code, [0,0]), 'tibasyoukadaigaku');
        assert.equal(kana.getText(code, [0,1]), 'chibasyoukadaigaku');
        assert.equal(kana.getText(code, [1]), 'basyoukadaigaku');
        assert.equal(kana.getText(code, [2]), 'syoukadaigaku');
        assert.equal(kana.getText(code, [2,1]), 'shoukadaigaku');
        assert.equal(kana.getText(code, [2,2,1]), 'xyoukadaigaku');
        assert.equal(kana.getText(code, [2,2,1,0]), 'xyoukadaigaku');
        assert.equal(kana.getText(code, [2,2,1,1]), 'lyoukadaigaku');
        assert.equal(kana.getText(code, [3]), 'ukadaigaku');
        assert.equal(kana.getText(code, [4]), 'kadaigaku');
    });
});

describe('type', function() {

	it('「しょ」をローマ字で入力する(1)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];

        assert.deepEqual(kana.type(code, {pointer: [], line: '', segment: '', added: ''}),
            {status: 'initialized', pointer: [], line: '', segment: '', next: [[0], [1], [2, 0, 0], [2, 0, 1]]});

		assert.deepEqual(kana.type(code, {pointer: [], line: '', segment: '', added: 's'}),
            {status: 'ok', pointer: [], line: 's', segment: 's', next: [[0], [1], [2, 0, 0], [2, 0, 1]]});

        assert.deepEqual(kana.type(code, {pointer: [], line: 's', segment: 's', added: 'y'}),
            {status: 'ok', pointer: [0], line: 'sy', segment: 'sy', next: [[0]]});

        assert.deepEqual(kana.type(code, {pointer: [0], line: 'sy', segment: 'sy', added: 'o'}),
            {status: 'finished', pointer:undefined, line: 'syo', segment:''});
	});

	it('「しょ」をローマ字で入力する(2)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];
        assert.deepEqual(kana.type( code, {pointer: [0], line: 's', segment: 's', added: 'h'}),
            {status: 'ok', pointer: [1], line: 'sh', segment: 'sh', next: [[1]]}); // 候補が'syo'から'sho'に変更される
        assert.deepEqual(kana.type( code, {pointer: [1], line: 'sh', segment: 'sh', added: 'o'}),
            {status: 'finished', pointer:undefined, line: 'sho', segment:''}); // 完了
	});

	it('「しょ」をローマ字で入力する(3)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];
		 
			assert.deepEqual(kana.type( code, {pointer: [0], line: 's', segment: 's', added: 'i'}),
				{status: 'ok', pointer: [2, 1], line: 'si', segment: '', next: [[2, 1, 0], [2, 1, 1]]}); // 候補が['xyo','lyo']に変更される
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1], line: 'si', segment: '', added: 'x'}),
				{status: 'ok', pointer: [2, 1, 0], line: 'six', segment: 'x', next: [[2, 1, 0]]}); // 候補が'xyo'に変更(限定)される
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 0], line: 'six', segment: 'x', added: 'y'}),
				{status: 'forwarded', pointer: [2, 1, 0], line: 'sixy', segment: 'xy', next: [[2, 1, 0]]}); // 候補が'xyo'に変更(限定)される
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 0], line: 'sixy', segment: 'xy', added: 'o'}),
				{status: 'finished', pointer:undefined, line: 'sixyo', segment:''}); // 候補が'xyo'に変更(限定)される
	});

	it('「しょ」をローマ字で入力する(4)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];
		 
			assert.deepEqual(kana.type( code, {pointer: [1], line: 'sh', segment: 'sh', added: 'i'}),
				{status: 'ok', pointer: [2, 1], line: 'shi', segment: '', next: [[2, 1, 0], [2, 1, 1]]}); // 候補が['xyo','lyo']に変更(限定)される
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1], line: 'shi', segment: '', added: 'x'}),
				{status: 'ok', pointer: [2, 1, 0], line: 'shix', segment: 'x', next: [[2, 1, 0]]}); // 候補が['xyo','lyo']に変更(限定)される
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 0], line: 'shix', segment: 'x', added: 'y'}),
				{status: 'forwarded', pointer: [2, 1, 0], line: 'shixy', segment: 'xy', next: [[2, 1, 0]]}); // 候補が['xyo','lyo']に変更(限定)される
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 0], line: 'shixy', segment: 'xy', added: 'o'}),
				{status: 'finished', pointer:undefined, line: 'shixyo', segment:''}); // 候補が['xyo','lyo']に変更(限定)される
	});

	it('「しょ」をローマ字で入力する(5)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 0], line: 'si', segment: '', added: 'l'}),
				{status: 'ok', pointer: [2, 1, 1], line: 'sil', segment: 'l', next: [[2, 1, 1]]});
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 1], line: 'sil', segment: 'l', added: 'y'}),
				{status: 'forwarded', pointer: [2, 1, 1], line: 'sily', segment: 'ly', next: [[2, 1, 1]]});
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 1], line: 'sily', segment: 'ly', added: 'o'}),
				{status: 'finished', pointer:undefined, line: 'silyo', segment:''});
	});

	it('「しょ」をローマ字で入力する(6)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];

		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1], line: 'shi', segment: '', added: 'l'}),
				{status: 'ok', pointer: [2, 1, 1], line: 'shil', segment: 'l', next: [[2, 1, 1]]});
		 
			assert.deepEqual(kana.type( code, {pointer: [2, 1, 1], line: 'shil', segment: 'l', added: 'y'}),
				{status: 'forwarded', pointer: [2, 1, 1], line: 'shily', segment: 'ly', next: [[2, 1, 1]]});

			assert.deepEqual(kana.type( code, {pointer: [2, 1, 1], line: 'shily', segment: 'ly', added: 'o'}),
				{status: 'finished', pointer:undefined, line: 'shilyo', segment:''});
	});

    it('「しょ」をローマ字で入力する(7)', function () {
		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];
			assert.deepEqual(kana.type( code, {pointer: [], line: '', segment: '', added: 'a'}),
				{status: 'ng', pointer:[], line:'', segment:''});// 不正な入力内容
	});

	it('「しょ」をローマ字で入力する*まとめ*', function () {

		var code = ['syo', 'sho', {seq: [['si', 'shi'], ['xyo', 'lyo']]}];

		var src = [
			[
				{added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
				{added: 's', result: {status: 'ok', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
				{added: 'y', result: {status: 'ok', next: [[0]]}},
				{added: 'o', result: {status: 'finished'}}
			],
			[
				{added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
				{added: 's', result: {status: 'ok', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
				{added: 'h', result: {status: 'ok', next: [[1],[2,0,1]]}},
				{added: 'o', result: {status: 'finished'}}
			],
			[
				{added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
				{added: 's', result: {status: 'ok', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
				{added: 'i', result: {status: 'ok', next: [[2,1,0],[2,1,1]]}},
				{added: 'x', result: {status: 'ok', next: [[2,1,0]]}},
				{added: 'y', result: {status: 'forwarded', next: [[2,1,0]]}},
				{added: 'o', result: {status: 'finished'}}
			],
            [
                {added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 's', result: {status: 'ok', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 'i', result: {status: 'ok', next: [[2,1,0],[2,1,1]]}},
                {added: 'l', result: {status: 'ok', next: [[2,1,1]]}},
                {added: 'y', result: {status: 'forwarded', next: [[2,1,1]]}},
                {added: 'o', result: {status: 'finished'}}
            ],
            [
                {added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 's', result: {status: 'ok', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 'h', result: {status: 'ok', next: [[1],[2,0,1]]}},
                {added: 'i', result: {status: 'ok', next: [[2,1,0],[2,1,1]]}},
                {added: 'x', result: {status: 'ok', next: [[2,1,0]]}},
                {added: 'y', result: {status: 'forwarded', next: [[2,1,0]]}},
                {added: 'o', result: {status: 'finished'}}
            ],
            [
                {added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 's', result: {status: 'ok', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 'h', result: {status: 'ok', next: [[1],[2,0,1]]}},
                {added: 'i', result: {status: 'ok', next: [[2,1,0],[2,1,1]]}},
                {added: 'l', result: {status: 'ok', next: [[2,1,1]]}},
                {added: 'y', result: {status: 'forwarded', next: [[2,1,1]]}},
                {added: 'o', result: {status: 'finished'}}
            ],
            [
                {added: '', result: {status: 'initialized', next: [[0], [1], [2, 0, 0], [2, 0, 1]]}},
                {added: 'a', result: {status: 'ng'}}
            ]
        ];

		src.forEach(function(set) {
			var state = {pointer: [], line: '', segment: '', added: ''};
			set.forEach(function (item) {
				state.added = item.added;
				var result = kana.type( code, state);
				assert.equal(result.status, item.result.status);
				if (item.result.next) {
					assert.deepEqual(result.next, item.result.next);
				}
				state.pointer = result.pointer;
				state.line = result.line;
				state.segment = result.segment;
			});
		});
	});
});
