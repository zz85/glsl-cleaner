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

ajax('vs.glsl', function(r) {
	// console.log('got', r);
	source.textContent = r;
	tokens = tokenize(r);
	console.log(tokens);

	var glsl_container = document.createElement('pre');
	glsl_container.id = 'glsl_container';
	document.body.appendChild(glsl_container);

	tokenHighlighter(tokens);
});

function tokenHighlighter(tokens) {
	tokens.forEach(eatToken)
}
function eatToken(token) {
	console.log(token);
	span = document.createElement('span');
	span.className = 'token';
	span.textContent = token.data;
	glsl_container.appendChild(span);

	if (token.data.match(/\n+/g)) {
		span.innerHTML = token.data.replace(/\n/g, '↵\n');
	}
}