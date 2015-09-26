// walker which executes a callback on every node.

function simple_walker(ast, onNode) {
	if (onNode(ast)) return;

	ast.children.forEach(function(child) {
		simple_walker(child, onNode);
	});
}

function walk_into(ast, type, onNode) {
	simple_walker(ast, function(node) {
		if (node.type === type) { // stmtlist
			onNode(node);
		}
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
	return lint(ast, [unused_variables]);
}

/*


float a;
float b = 1.;
float c, d;
float e = 2., f = 3.;

void test(float g, float h) {
  float i;
}
*/

function unused_variables(ast, global_declared) {
	var declared_list = {};

	function checkNode(node) {
		if (node.type === 'decllist') { // stmtlist
			walk_into(node, 'ident', function(node) {
				declared_list[node.data] = 0;
				console.log('ident!', node.data);
			});
		}
	}

	simple_walker(ast, function(node) {
		checkNode(node);

		if (node.type === 'function' && !global_declared) {
			console.log('function!');

			unused_variables(node, declared_list);

			return true; // break walker
		}
	});

	console.log('declared variables', Object.keys(declared_list));
	// decl < decllist
	// stmt / func / functionargs
}