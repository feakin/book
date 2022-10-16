# FKL Parser

解析器生成器：[https://pest.rs/](https://pest.rs/)

Pest 在线编辑器：[https://pest.rs/#editor](https://pest.rs/#editor)

## 语法

```pest
declarations = _{ SOI ~ declaration* ~ EOI }

declaration = {
  include_decl
  | context_map_decl
  | context_decl
  | ext_module_decl
  | aggregate_decl
  | entity_decl
  | value_object_decl
  | struct_decl
  // ddd
  | component_decl
  | implementation_decl
  | layered_decl
  // extension
  | source_sets_decl
}
```

