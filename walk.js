'use strict';

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