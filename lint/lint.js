'use strict';

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

function Report(message, details) {
	this.message = message;
	this.details = details;
}

function Reporter() {
	this.reports = [];
}

Reporter.prototype.report = function(message, details) {
	var msg = 'Warning on ' + details.token.line + ':' + details.token.column + ' - ' + message;
	console.log(msg);
	this.reports.push(new Report(message, details));
};