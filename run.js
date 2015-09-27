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
	attemptParse();
};

source.onkeyup = function() {
	attemptParse();
};

// shader_submerged.glsl vs.glsl
// ajax('shader_submerged.glsl', function(r) {
// 	// console.log('got', r);
// 	source.value = r;
// 	startParsing(r)
// });

setTimeout(attemptParse, 100);

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

		// glsl_container.contentEditable = true;

		// glsl_container.onkeyup = function() {

		// }

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


	/*
	// check children types
	var TYPE_CHILDREN = {};
	simple_walker(ast, function(node) {
		TYPE_CHILDREN[node.type] = TYPE_CHILDREN[node.type] || {};
		node.children.forEach(function(child) {
			TYPE_CHILDREN[node.type][child.type] = 1;
		})
	});
	for (k in TYPE_CHILDREN) console.log(k, Object.keys(TYPE_CHILDREN[k]))
	*/

	console.time('lint');
	var reports = lint_all(ast);

	reports.forEach(function(r) {
		var a = document.createElement('a');
		a.className = 'errorlink';
		a.onclick = function() {
			console.log(r.details.token);
			hightlightToken(r.details.token, true);
			return false;
		}
		a.innerHTML = 'Warning on ' + r.details.token.line + ':' + r.details.token.column + ' - ' + r.message + '\n';

		debug.appendChild(a);
	})
	console.timeEnd('lint');
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

function hightlightToken(token, hide) {
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

	if (!hide) debug.innerHTML = JSON.stringify(token);
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
}


var isParsing, lastParsed;

function attemptParse() {
	if (isParsing) {
		clearTimeout(isParsing);
	}
	isParsing = setTimeout(tryParse, 200);
}


function tryParse() {
	clearTimeout(isParsing);

	var contents = source.value;
	// var contents = glsl_container.textContent.split('↵').join('');
	// no thanks to no unicode reg expr
	if (contents == lastParsed) return;

	startParsing(contents);
	lastParsed = contents;
}
