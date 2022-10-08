# Fklang code binding

Whole process:

1. parse Fklang binding syntax, identify the binding target.
2. parse the target file, identify the binding target. (use Scanner)
3. generate the binding code, and insert it into the target file.
4. format the target file?

Source code scanner: TreeSitter

## TreeSitter

Online playground: [https://tree-sitter.github.io/tree-sitter/playground](https://tree-sitter.github.io/tree-sitter/playground)

TreeSitter is support [Pattern Matching with Queries](https://tree-sitter.github.io/tree-sitter/using-parsers#pattern-matching-with-queries) 
can use  [S-expression](https://en.wikipedia.org/wiki/S-expression) to query the AST.

### Examples

Java Code:

```java
class DateTimeImpl {
    public Date getDate() {
        return new Date();
    }
}
```

Query Language:

```haskell
(package_declaration
	(scoped_identifier) @package-name)

(import_declaration
	(scoped_identifier) @import-name)

(program
    (class_declaration
	    name: (identifier) @class-name
        interfaces: (super_interfaces (interface_type_list (type_identifier)  @impl-name))?
        body: (class_body (method_declaration
            (modifiers
                (annotation
                  name: (identifier) @annotation.name
                      arguments: (annotation_argument_list)? @annotation.key_values
                )
            )?
            type: (type_identifier) @return-type
            name: (identifier) @function-name
            parameters: (formal_parameters (formal_parameter
              type: (type_identifier) @param-type
                name: (identifier) @param-name
            ))?
          ))?
    )
)
```

Output:

```ini
program [0, 0] - [6, 0]
  class_declaration [0, 0] - [4, 1]
    name: identifier [0, 6] - [0, 18]
    body: class_body [0, 19] - [4, 1]
      method_declaration [1, 4] - [3, 5]
        modifiers [1, 4] - [1, 10]
        type: type_identifier [1, 11] - [1, 15]
        name: identifier [1, 16] - [1, 23]
        parameters: formal_parameters [1, 23] - [1, 25]
        body: block [1, 26] - [3, 5]
          return_statement [2, 8] - [2, 26]
            object_creation_expression [2, 15] - [2, 25]
              type: type_identifier [2, 19] - [2, 23]
              arguments: argument_list [2, 23] - [2, 25]
```