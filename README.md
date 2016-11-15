JapaneseTypingToolkit
====

日本語ローマ字かなタイピングソフトを作成する際のツールキットです。

## Description

キーボードを打つと、画面上にSVGで描かれたキーボード上の対応するキーの絵が強調表示されるとともに、
画面上の文字入力欄のカーソル位置に入力した文字が表示され、矢印キーやBackspaceによる文字編集ができるようにしました。
また、Enterキーを押すと、用意された入力候補の文字列の配列から順番に次の入力候補を表示するようにしました。

一連のJavaScriptファイルはwebpackを用いてまとめる形としました。

ライブラリには、JsDoc形式でAPIドキュメントを書きました。

特徴となるのは、入力候補の表示方法です。
世間のタイピングソフトでは、最初、候補の文字列の中の「し」が「si」として表示されていたのが、ユーザが「shi」と打つと、それ以降の「し」は「shi」に表示が変わる、というようなものがあります。
本システムでゃ、例えば「ちばしょうかだいがく」という入力候補は、内部的には、


     {
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
     }


のような構造を持っています。この構造を視覚化してユーザに提示する点を重視しています。


## Install

    npm i

## Usage

    npm run

## Contribution

## Licence

[MIT License]

## Author

[kubohiroya](https://github.com/kubohiroya)

