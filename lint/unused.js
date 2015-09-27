/*

Exports: unused_variables


float a;
float b = 1.;
float c, d;
float e = 2., f = 3.;

void test(float g, float h) {
  float i;
}
*/

var exceptions = ['main'];

function unused_variables(ast, reporter, global_declared) {
	// exception - varying depends on in vs / fs.
	var declared_list = {}; // symbol table
	var warnings = [];

	simple_walker(ast, function(node) {
		if (node.type === 'decllist') {
			walk_into(node, 'ident', function(node) {
				declared_list[node.data] = {
					type: 'variable',
					name: node.data,
					token: node.token,
					calls: 0
				};
			});

			return;
		}

		if (node.type === 'function') {
			var functionNode = node.children[0];

			declared_list[functionNode.data] = {
				type: 'function', // technically a function variable
				name: functionNode.data,
				token: functionNode.token,
				calls: 0
			};

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
					// TODO: add exceptions?

					// warn that variable has not been declared!
					if (exceptions.indexOf(node.data) === -1)
						console.warn('Variable not found!', node.data);


				}
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
		if (!symbol.calls && exceptions.indexOf(variable) === -1) {
			var msg = symbol.type + ' [' + symbol.name + '] is not used';
			reporter.report(msg, symbol);
		}
	}

	return;
	// decl < decllist
	// stmt / func / functionargs
}