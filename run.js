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

ajax('vs.glsl', function(r) {
	// console.log('got', r);
	source.value = r;
	startParsing(r)
});

var glsl_container;
var token_to_dom = [];

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

	tree.innerHTML = '';
	walker(ast);

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
		debug.innerHTML = JSON.stringify(token);
	}

	token_to_dom.push(span);
}

var level = 0;
function walker(ast) {
	level++;
	tree.appendChild(document.createTextNode(new Array(level).join('|') + '- '));

	var a = document.createElement('a');
	a.innerHTML = ast.type + '\n';
	a.href = '#';
	a.onclick = function() {
		console.log('hi', ast, ast.token, tokens.indexOf(ast.token));


		return false;
	}

	tree.appendChild(a);

	ast.children.forEach(walker);
	level--;
	// stmtlist - has multiple statements/ preprocessor
	// stmt
	// struct
	// function
	// functionargs
	// decl
	// decllist
	// forloop
	// whileloop
	// if
	// expr
	// precision
	// comment
	// preprocessor
	// keyword
	// ident
	// return
	// continue
	// break
	// discard
	// do-while
	// binary
	// ternary
	// unary
}