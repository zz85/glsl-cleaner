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
	console.log('onchange')
	startParsing(source.value);
};

source.onkeyup = function() {
	console.log('onkeyup')
	startParsing(source.value);
};

ajax('vs.glsl', function(r) {
	// console.log('got', r);
	source.value = r;
	startParsing(r)
});


var glsl_container;

function startParsing(code) {
	tokens = tokenize(code);
	console.log(code.length, tokens.length);

	if (glsl_container) glsl_container.parentNode.removeChild(glsl_container)
	glsl_container = document.createElement('pre');
	glsl_container.id = 'glsl_container';
	document.body.appendChild(glsl_container);

	tokenHighlighter(tokens);

	// console.log(Object.keys(types));
}

function tokenHighlighter(tokens) {
	tokens.forEach(eatToken)
}

var types = {

};

function eatToken(token) {
	// console.log(token);
	span = document.createElement('span');
	span.className = 'token ' + token.type;
	types[token.type] = 1;
	span.textContent = token.data;
	glsl_container.appendChild(span);

	if (SHOW_LINE_BREAKS && token.data.match(/\n+/g)) {
		span.innerHTML = token.data.replace(/\n/g, '↵\n');
	}

	span.onclick = function() {
		console.log(token);
		debug.innerHTML = JSON.stringify(token);
	}
}