# References

- https://www.khronos.org/files/opengles_shading_language.pdf
- https://github.com/stackgl/glsl-tokenizer
- https://github.com/stackgl/glsl-parser
- https://github.com/burg/glsl-simulator/blob/master/lib/compiler/ast.js

## Tokens

- keyword
- identifier
- integer-constant
- floating-constant
- operator


## Comments
/* and */, or by // and a new-lin


## Preprocessor

## Variables and Types
	all variable functions -> must declare type
	type-safe, no implict conversion
	structs allowed

	basic_types = [
		void
		bool
		int
		float
		vec2
		vec3
		vec4
		bvec2
		bvec3
		bvec4
		ivec2
		ivec3
		ivec4
		mat2
		mat3
		mat4
		sampler2D
		samplerCube
	]


## GLSL parser types

stmtlist - has multiple statements/ preprocessor  ["preprocessor", "stmt"]
stmt - Statement. Has precision, ["decl", "return", "if", "expr", "forloop"]
struct -
function - has (ident, functionargs, stmtlist, )
functionargs - ["decl"]
decl - declaration has ["keyword", "decllist", "function", "placeholder"]
decllist - declaration list. ["ident", "expr"]
forloop ["decl", "expr", "stmt"]
whileloop
if ["expr", "stmtlist", "stmt"]
expr - ["literal", "call", "binary", "group", "ident", "assign", "unary", "operator"]
precision - has Keywords
comment
preprocessor - DEFINE, conditional MACROS (Leaf)
keyword. Keyword. (Leaf Node)
ident - Identifier. (Leaf Node)
return - Return (expr)
continue
break
discard
do-while
binary (binary, call, indent)
ternary -
unary - (call, ident, literal)
call - (keyword, call, literal, unary, builtin, ident, binary, operator)
assign - ["ident", "operator", "binary", "call", "unary", "literal"]
placeholder - does nothing.

## GLSL tokenizer types

block-comment: /* ... */
line-comment: // ... \n
preprocessor: # ... \n
operator: Any operator. If it looks like punctuation, it's an operator.
float: Optionally suffixed with f
ident: User defined identifier.
builtin: Builtin function.
eof: Emitted on end; data will === '(eof)'.
integer
whitespace
keyword