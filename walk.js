// walker which executes a callback on every node.

function simple_walker(ast, onNode) {
	if (onNode(ast)) return;

	ast.children.forEach(function(child) {
		simple_walker(child, onNode);
	});
}

function lint(ast, passes) {
	var warnings = []; // or pass reporter
	passes.forEach(function(pass) {
		var warning = pass(ast);
		warnings.push(warnings);
	});
	return warnings;
}

function lint_all(ast) {
	return lint(ast, [check_unused]);
}

// lint(ast, [check_unused]);

/*


float a;
float b = 1.;
float c, d;
float e = 2., f = 3.;

void test(float g, float h) {
  float i;
}
*/

function check_unused(ast) {
	simple_walker(ast, function(node) {
		if (node.type === 'function') {
			console.log('function!');
		}

		if (node.type === 'decl') { // stmtlist
			console.log('decl!');
		}
	});
	// decl < decllist
	// stmt / func / functionargs
}