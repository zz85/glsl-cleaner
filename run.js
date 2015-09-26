function ajax(url, callback) {
	var oReq = new XMLHttpRequest();
	oReq.open('GET', url, true);

	oReq.onload = function(oEvent) {
		console.log('ajax done for ', url);
		var response = oReq.response;
		callback(response);
	};

	oReq.send();
}

var SHOW_LINE_BREAKS = true;

source.onchange = function() {
	startParsing(source.value);
};

source.onkeyup = function() {
	startParsing(source.value);
};

// shader_submerged.glsl vs.glsl
ajax('shader_submerged.glsl', function(r) {
	// console.log('got', r);
	source.value = r;
	startParsing(r)
});

var glsl_container;
var token_to_dom = [];
var highlighted;

function startParsing(code) {
	try {
		tokens = tokenize(code);
		// console.log(code.length, tokens.length);

		if (glsl_container) glsl_container.parentNode.removeChild(glsl_container)
		glsl_container = document.createElement('pre');
		glsl_container.id = 'glsl_container';
		document.body.appendChild(glsl_container);

		tokenHighlighter(tokens);

		ast = parse(tokens);
	} catch (e) {
		debug.innerHTML = 'Error Parsing GLSL Code! ' + e;
		return e;
	}

	debug.innerHTML = '';

	tree.innerHTML = 'Ast:\n';
	walker(ast);

	simple_walker(ast, function(node) {
		TYPE_CHILDREN[node.type] = TYPE_CHILDREN[node.type] || {};
		node.children.forEach(function(child) {
			TYPE_CHILDREN[node.type][child.type] = 1;
		})
	});

}

function tokenHighlighter(tokens) {
	tokens.forEach(eatToken)
}

function eatToken(token) {
	span = document.createElement('span');
	span.className = 'token ' + token.type;
	span.textContent = token.data;
	glsl_container.appendChild(span);

	if (SHOW_LINE_BREAKS && token.data.match(/\n+/g)) {
		span.innerHTML = token.data.replace(/\n/g, '↵\n');
	}

	span.onclick = function() {
		console.log(token);
		hightlightToken(token);
	}

	token_to_dom.push(span);
}

var level = 0;

var TYPE_CHILDREN = {};

function simple_walker(ast, onNode) {
	onNode(ast);

	ast.children.forEach(function(child) {
		simple_walker(child, onNode);
	});
}


function hightlightToken(token) {
	var token_index = tokens.indexOf(token);
	if (token_index > -1) {
		if (highlighted) highlighted.classList.remove('highlight');
		highlighted = token_to_dom[token_index];
		highlighted.classList.add('highlight');

		highlighted.scrollIntoView();

		// highlighted.parentNode.scrollTop = (ast.token.line * 12) + 'px';
		// highlighted.scrollIntoView({behavior: "smooth"}); // block: "end",
	} else {
		console.log('token not found');
	}

	debug.innerHTML = JSON.stringify(token);
}


function walker(ast) {
	level++;

	if (ast.type !== 'placeholder') {
		tree.appendChild(document.createTextNode(new Array(level).join('|') + '- '));


		var a = document.createElement('a');
		a.innerHTML = ast.type;
		a.href = '#';
		a.onclick = function() {
			hightlightToken(ast.token);
			console.log('ast', ast);
			return false;
		}

		tree.appendChild(a);

		tree.appendChild(document.createTextNode(' ' + (ast.token ? ast.token.data : '') + '\n'));
	}

	ast.children.forEach(walker);
	level--;

	// mknode(mode/type, token, children, id)
	// for (k in TYPE_CHILDREN) console.log(k, Object.keys(TYPE_CHILDREN[k]))

	// stmtlist - has multiple statements/ preprocessor  ["preprocessor", "stmt"]
	// stmt - Statement. Has precision, ["decl", "return", "if", "expr", "forloop"]
	// struct -
	// function - has (ident, functionargs, stmtlist, )
	// functionargs - ["decl"]
	// decl - declaration has ["keyword", "decllist", "function", "placeholder"]
	// decllist - declaration list. ["ident", "expr"]
	// forloop ["decl", "expr", "stmt"]
	// whileloop
	// if ["expr", "stmtlist", "stmt"]
	// expr - ["literal", "call", "binary", "group", "ident", "assign", "unary", "operator"]
	// precision - has Keywords
	// comment
	// preprocessor - DEFINE, conditional MACROS (Leaf)
	// keyword. Keyword. (Leaf Node)
	// ident - Identifier. (Leaf Node)
	// return - Return (expr)
	// continue
	// break
	// discard
	// do-while
	// binary (binary, call, indent)
	// ternary -
	// unary - (call, ident, literal)
	// call - (keyword, call, literal, unary, builtin, ident, binary, operator)

	// assign - ["ident", "operator", "binary", "call", "unary", "literal"]
	// placeholder - does nothing.
}