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
		warnings = warnings.concat(warnings);
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
	// exception - varying depends on in vs / fs.
	var declared_list = {};
	var warnings = [];

	function checkNode(node) {

	}

	simple_walker(ast, function(node) {
		if (node.type === 'decllist') {
			walk_into(node, 'ident', function(node) {
				declared_list[node.data] = 0;
				// console.log('ident!', node.data);
			});

			return;
		}

		if (node.type === 'expr') {
			walk_into(node, 'ident', function(node) {
				if (node.data in declared_list) {
					declared_list[node.data]++;
				}
				else if (global_declared && node.data in global_declared) {
					global_declared[node.data]++;
				}
				else {
					// warn that variable has not been declared!
					// console.log('Not found!!', node.data);
				}
				// console.log('expr ident!', node.data);
			});

			return;
		}

		if (node.type === 'function' && !global_declared) {
			console.log('function!');

			warnings = warnings.concat(
				unused_variables(node, declared_list)
			);


			return true; // break walker
		}
	});

	console.log('declared variables', declared_list, Object.keys(declared_list));

	for (var variable in declared_list) {
		if (!declared_list[variable]) {
			var msg = '[' + variable + '] is not used';
			console.log(msg);
			warnings.push(msg)
		}
	}

	return warnings;
	// decl < decllist
	// stmt / func / functionargs
}