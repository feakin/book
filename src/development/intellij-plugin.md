# Intellij Plugins

Main Resources:

- [Custom Language](https://plugins.jetbrains.com/docs/intellij/custom-language-support-tutorial.html) (basic concepts of custom language support)
- [Intellij Rust GitHub](https://github.com/intellij-rust/intellij-rust) (A good example of a custom language plugin)
- [Intellij Plugin Development](https://www.jetbrains.org/intellij/sdk/docs/welcome.html)

## Syntax BNF

Grammar Kit: [https://github.com/JetBrains/Grammar-Kit](https://github.com/JetBrains/Grammar-Kit)


## Indexes with Stub

sample:

```bnf
contextMapDeclaration ::= CONTEXT_MAP_KEYWORD IDENTIFIER contextMapBody
{
  implements = [
    "com.feakin.intellij.psi.FkNamedElement"
    "com.feakin.intellij.psi.FkNameIdentifierOwner"
  ]
  mixin = "com.feakin.intellij.stubs.ext.FkContextMapImplMixin"
  stubClass = "com.feakin.intellij.stubs.FkContextMapDeclStub"
  elementTypeFactory = "com.feakin.intellij.stubs.StubImplementationsKt.factory"
}
```

## Reference

添加 Ctrl/Command + B，需要配置双向 Reference。如：

- FkContextNameReferenceImpl 用于寻找对应的 FkContextDeclaration
- FkContextDeclReferenceImpl 用于寻找对应的 FkContextName

配置缓存支持两种方式

- 通过 `stubIndex` 与 BNF 中的 `stubClass` 配置 Stub。
- 通过 `CachedValuesManager.getCachedValue` 配置。

## LSP (todo)

