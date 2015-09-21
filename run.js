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

ajax('vs.glsl', function(r) {
	// console.log('got', r);
	source.textContent = r;
	tokens = tokenize(r);
	console.log(tokens);

	var glsl_container = document.createElement('pre');
	glsl_container.id = 'glsl_container';
	document.body.appendChild(glsl_container);

	tokenHighlighter(tokens);

	console.log(Object.keys(types));
});

function tokenHighlighter(tokens) {
	tokens.forEach(eatToken)
}

var types = {

};

function eatToken(token) {
	console.log(token);
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
	}
}