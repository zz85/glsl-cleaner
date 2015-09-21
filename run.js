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

	ast = tokenize(r);
	console.log(ast);
});
