# Intellij Plugins

Main Resources:

- [Custom Language](https://plugins.jetbrains.com/docs/intellij/custom-language-support-tutorial.html) (basic concepts of custom language support)
- [Intellij Rust GitHub](https://github.com/intellij-rust/intellij-rust) (A good example of a custom language plugin)
- [Intellij Plugin Development](https://www.jetbrains.org/intellij/sdk/docs/welcome.html)

## Define by `plugin.xml`

IDEA 

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

配置缓存支持两种方式:

- 通过 `stubIndex` 与 BNF 中的 `stubClass` 配置 Stub。
- 通过 `CachedValuesManager.getCachedValue` 配置。


### 配置 `stubIndex` 与 BNF 中的 `stubClass` 配置 Stub

1. 在 `plugin.xml` 中配置 `stubIndex` 配置缓存元素：

```java
<stubIndex implementation="com.feakin.intellij.resolve.indexes.FkNamedElementIndex"/>
```

2. 从 BNF 中配置 `stubClass`：

```bnf
contextDeclaration ::= CONTEXT_KEYWORD IDENTIFIER contextBody
{
  implements = [
    "com.feakin.intellij.psi.FkNamedElement"
    "com.feakin.intellij.psi.FkNameIdentifierOwner"
    "com.feakin.intellij.psi.ext.FkMandatoryReferenceElement"
  ]
  mixin = "com.feakin.intellij.stubs.ext.FkContextDeclarationImplMixin"
  stubClass = "com.feakin.intellij.stubs.FkContextDeclarationStub"
  elementTypeFactory = "com.feakin.intellij.stubs.StubImplementationsKt.factory"
}
```

3. 实现对应的配置

## Custom LineMarker

自定义 LineMarker 的方式有两种：

- 通过 `LineMarkerProvider` 实现
- 通过 `RunLineMarkerContributor` 实现

```xml
<!-- line marker -->
<codeInsight.lineMarkerProvider language="Feakin"
                                implementationClass="com.feakin.intellij.linemarkers.FkImplMessageProvider"/>

<!--  producer -->
<runConfigurationProducer implementation="com.feakin.intellij.runconfig.command.FkEndpointConfigurationProducer"/>
```

在 Intellij Feakin 中，先创建 `RunLineMarkerContributor` 后，再创建 `RunConfigurationProducer`，如 `GencodeImplConfigurationProducer`。

```kotlin
class FkCodegenImplLineMarkerContributor : RunLineMarkerContributor() {
    override fun getInfo(element: PsiElement): Info? {
        if (element !is FkImplDeclaration) return null
        val state = GencodeImplConfigurationProducer().findConfig(listOf(element)) ?: return null

        val actions = ExecutorAction.getActions(0)
        return Info(
            AllIcons.RunConfigurations.TestState.Run,
            { state.configurationName },
            *actions
        )
    }
}
```

示例：

```kotlin
class GencodeImplConfigurationProducer : BaseLazyRunConfigurationProducer<GencodeConfig, FkImplDeclaration>() {
    override val commandName: String = "gen"

    init {
        registerConfigProvider { elements -> createConfigFor<FkImplDeclaration>(elements) }
    }

    private inline fun <reified T : FkImplDeclaration> createConfigFor(
        elements: List<PsiElement>
    ): GencodeConfig? {
        val path = elements.firstOrNull()?.containingFile?.virtualFile?.path ?: return null
        val sourceElement = elements.firstOrNull { it is T } ?: return null
        return GencodeConfig(commandName, path, sourceElement as FkImplDeclaration)
    }

    private fun registerConfigProvider(provider: (List<PsiElement>) -> GencodeConfig?) {
        runConfigProviders.add(provider)
    }
}
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

## Syntax BNF

语法解析，基于 Grammar Kit 来进行解析： [https://github.com/JetBrains/Grammar-Kit](https://github.com/JetBrains/Grammar-Kit)

官方示例如下：

```bnf
root_rule ::= rule_A rule_B rule_C rule_D                // sequence expression
rule_A ::= token | 'or_text' | "another_one"             // choice expression
rule_B ::= [ optional_token ] and_another_one?           // optional expression
rule_C ::= &required !forbidden                          // predicate expression
rule_D ::= { can_use_braces + (and_parens) * }           // grouping and repetition

// Grammar-Kit BNF syntax

{ generate=[psi="no"] }                                  // top-level global attributes
private left rule_with_modifier ::= '+'                  // rule modifiers
left rule_with_attributes ::= '?' {elementType=rule_D}   // rule attributes

private meta list ::= <<p>> (',' <<p>>) *                // meta rule with parameters
private list_usage ::= <<list rule_D>>                   // meta rule application
```

## LSP (todo)


