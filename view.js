var TokenString = require('./glsl-tokenizer/string')
var ParseTokens = require('./glsl-parser/direct')

window.process = process;
window.tokenize = TokenString;
window.parse = ParseTokens;

function process(code) {
	tokens = TokenString(code)
	ast = ParseTokens(tokens)
	console.log(JSON.stringify(tokens))
}