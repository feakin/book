# Intellij Plugins

Main Resources:

- [Custom Language](https://plugins.jetbrains.com/docs/intellij/custom-language-support-tutorial.html) (basic concepts of custom language support)
- [Intellij Rust GitHub](https://github.com/intellij-rust/intellij-rust) (A good example of a custom language plugin)
- [Intellij Plugin Development](https://www.jetbrains.org/intellij/sdk/docs/welcome.html)

## Syntax BNF

Grammar Kit: [https://github.com/JetBrains/Grammar-Kit](https://github.com/JetBrains/Grammar-Kit)

## Define by `plugin.xml`

```xml
<extensions defaultExtensionNs="com.intellij">
    <!-- File-type Factory -->
    <fileType name="Feakin File"
              language="Feakin"
              implementationClass="com.feakin.intellij.FkFileType"
              fieldName="INSTANCE"
              extensions="fkl"/>
    <internalFileTemplate name="Feakin File"/>

    <!-- Parser -->
    <lang.parserDefinition language="Feakin"
                           implementationClass="com.feakin.intellij.parser.FkParserDefinition"/>

    <lang.syntaxHighlighter language="Feakin"
                            implementationClass="com.feakin.intellij.highlight.FkSyntaxHighlighter"/>

    <lang.psiStructureViewFactory language="Feakin"
                                  implementationClass="com.feakin.intellij.structure.FkStructureViewFactory"/>

    <!-- Editor -->
    <extendWordSelectionHandler implementation="com.feakin.intellij.ide.editor.FkBlockSelectionHandler"/>
    <lang.foldingBuilder language="Feakin"
                         implementationClass="com.feakin.intellij.edit.FkFoldingBuilder"/>

    <lang.commenter language="Feakin" implementationClass="com.feakin.intellij.completion.FkCommenter"/>
    <lang.braceMatcher language="Feakin" implementationClass="com.feakin.intellij.ide.FkBraceMatcher"/>


    <!-- Navigate between useDomainObject and DomainObjectDecl -->
    <indexedRootsProvider implementation="com.feakin.intellij.indexing.FkIndexableSetContributor"/>

    <stubElementTypeHolder class="com.feakin.intellij.lexer.FkElementTypes"/>

    <stubIndex implementation="com.feakin.intellij.resolve.indexes.FkNamedElementIndex"/>
    <stubIndex implementation="com.feakin.intellij.resolve.indexes.FkGotoClassIndex"/>

    <gotoSymbolContributor implementation="com.feakin.intellij.ide.navigate.FkGotoSymbolContributor"/>

    <!-- Completion -->
    <completion.contributor language="Feakin"
                            implementationClass="com.feakin.intellij.completion.FkKeywordCompletionContributor"
                            id="FkKeywordCompletionContributor"
                            order="first"/>


    <!-- Line Marker Providers -->
    <codeInsight.lineMarkerProvider language="Feakin"
                                    implementationClass="com.feakin.intellij.linemarkers.FkImplMessageProvider"/>
    <codeInsight.lineMarkerProvider language="Feakin"
                                    implementationClass="com.feakin.intellij.linemarkers.FkImplMethodProvider"/>

    <runLineMarkerContributor language="Feakin"
                              implementationClass="com.feakin.intellij.linemarkers.FkImplLineMarkerContributor"/>

    <!-- Run Configurations -->
    <configurationType implementation="com.feakin.intellij.runconfig.FkCommandConfigurationType"/>

    <programRunner implementation="com.feakin.intellij.runconfig.FkCommandRunner"/>

    <runConfigurationProducer
            implementation="com.feakin.intellij.runconfig.command.FkRunConfigurationProducer"/>

    <!-- Formatter -->
    <lang.formatter language="Feakin" implementationClass="com.feakin.intellij.formatter.FkFormattingModelBuilder"/>

    <!-- Usages Provider -->
    <lang.findUsagesProvider language="Feakin" implementationClass="com.feakin.intellij.ide.search.FkFindUsagesProvider"/>
    <findUsagesHandlerFactory implementation="com.feakin.intellij.ide.search.FkFindUsagesHandlerFactory"/>
    <usageTypeProvider implementation="com.feakin.intellij.ide.search.FkUsageTypeProvider"/>
</extensions>
```

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

## Custom LineMarker

```xml
<!-- line marker -->
<runLineMarkerContributor language="Feakin" implementationClass="com.feakin.intellij.linemarkers.FkEndpointRequestLineMarkerContributor"/>

<!--  producer -->
<runConfigurationProducer implementation="com.feakin.intellij.runconfig.command.FkEndpointConfigurationProducer"/>
```

## FkCommandLine

与 `fkl_cli/src/main.rs` 中的 `Cli::Commands` 保持一致：

```kotlin
class FkCommandLine(
    var path: String,
    var impl: String,
    private val subcommand: String,
    private val funcName: String = "",
)
```

## LSP (todo)

