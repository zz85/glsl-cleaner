GLSL Cleaner

is a GLSL Code Tree Shaker / Cleaner / Pruner / Dead code eliminator. It parses GLSL code into AST and prune dead code and paths through static analysis.

# Work In Progress!

Part I. View + Visualize Tokens that gets emitted by [GLSL-Tokenizer](https://github.com/stackgl/glsl-tokenizer/). This somewhat performs as GLSL Syntax highlighter.

Part II. Visualize AST after passing tokens through [GLSL-Parser](https://github.com/stackgl/glsl-parser)

Part III. Analyse AST and scope. (Pontential to build a GLSL-linter here!)

Part IV. Clean passes: remove unrequired AST nodes.

Part V. Generate clean GLSL code!

## Updates

27 Sep 2015 - Simple Linter for unused variables + functions
22 Sep 2015 - Simple AST / Parse Tree viewer (Part II)
21 Sep 2015 - Proof of concept quickly done (Part I)

## Comments?
Add a github issue/PR, or find me on [twitter](https://twitter.com/blurspline)

## TODO
- handle macro/preprocessors/defines
  - inline macros in parsetree or token stream?
- refactor to node modules?
- more lint passes
  - check type safety
  - check declared variables get assigned
