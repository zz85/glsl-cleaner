GLSL Cleaner

is a GLSL Code Tree Shaker / Cleaner / Pruner / Dead code eliminator. It parses GLSL code into AST and prune dead code and paths through static analysis.

# Work In Progress!

Part I. View + Visualize Tokens that gets emitted by [GLSL-Tokenizer](https://github.com/stackgl/glsl-tokenizer/). This somewhat performs as GLSL Syntax highlighter.

Part II. Visualize AST after passing tokens through [GLSL-Parser]()

Part III. Analyse AST and scope. (Pontential to build a GLSL-linter here!)

Part IV. Clean passes: remove unrequired AST nodes.

Part V. Generate clean GLSL code!

Updates
21 Sep 2015 - Proof of concept quickly done for Part I
22 Sep 2014 - Simple AST / Parse Tree viewer
