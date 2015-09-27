/*

Exports unused_variables


float a;
float b = 1.;
float c, d;
float e = 2., f = 3.;

void test(float g, float h) {
  float i;
}
*/

function unused_variables(ast, reporter, global_declared) {
	// exception - varying depends on in vs / fs.
	var declared_list = {};
	var warnings = [];

	function checkNode(node) {

	}

	simple_walker(ast, function(node) {
		if (node.type === 'decllist') {
			walk_into(node, 'ident', function(node) {
				declared_list[node.data] = {
					name: node.data,
					token: node.token,
					calls: 0
				};
				// console.log('ident!', node.data);
			});

			return;
		}

		if (node.type === 'expr') {
			walk_into(node, 'ident', function(node) {
				if (node.data in declared_list) {
					declared_list[node.data].calls++;
				}
				else if (global_declared && node.data in global_declared) {
					global_declared[node.data].calls++;
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

			unused_variables(node, reporter, declared_list);

			return true; // break walker
		}
	});

	console.log('declared variables', declared_list, Object.keys(declared_list));

	for (var variable in declared_list) {
		var symbol = declared_list[variable];
		if (!symbol.calls) {
			var msg = 'variable [' + symbol.name + '] is not used';
			reporter.report(msg, symbol);
		}
	}

	return;
	// decl < decllist
	// stmt / func / functionargs
}