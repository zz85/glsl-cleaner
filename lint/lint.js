function lint(ast, passes) {
	var reporter = new Reporter();
	passes.forEach(function(pass) {
		pass(ast, reporter);
	});
	return reporter.reports;
}

function lint_all(ast) {
	return lint(ast, [unused_variables]);
}

function Reporter() {
	this.reports = [];
}

Reporter.prototype.report = function(message, details) {
	console.log('Warning on ' + details.token.line + ':' + details.token.column, '-', message);
	this.reports.push(message);
};