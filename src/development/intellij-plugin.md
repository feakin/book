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

?????? Ctrl/Command + B????????????????????? Reference?????????

- FkContextNameReferenceImpl ????????????????????? FkContextDeclaration
- FkContextDeclReferenceImpl ????????????????????? FkContextName

??????????????????????????????:

- ?????? `stubIndex` ??? BNF ?????? `stubClass` ?????? Stub???
- ?????? `CachedValuesManager.getCachedValue` ?????????


### ?????? `stubIndex` ??? BNF ?????? `stubClass` ?????? Stub

1. ??? `plugin.xml` ????????? `stubIndex` ?????????????????????

```java
<stubIndex implementation="com.feakin.intellij.resolve.indexes.FkNamedElementIndex"/>
```

2. ??? BNF ????????? `stubClass`???

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

3. ?????????????????????

## Custom LineMarker

????????? LineMarker ?????????????????????

- ?????? `LineMarkerProvider` ??????
- ?????? `RunLineMarkerContributor` ??????

```xml
<!-- line marker -->
<codeInsight.lineMarkerProvider language="Feakin"
                                implementationClass="com.feakin.intellij.linemarkers.FkImplMessageProvider"/>

<!--  producer -->
<runConfigurationProducer implementation="com.feakin.intellij.runconfig.command.FkEndpointConfigurationProducer"/>
```

??? Intellij Feakin ??????????????? `RunLineMarkerContributor` ??????????????? `RunConfigurationProducer`?????? `GencodeImplConfigurationProducer`???

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

?????????

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

??? `fkl_cli/src/main.rs` ?????? `Cli::Commands` ???????????????

```kotlin
class FkCommandLine(
    var path: String,
    var impl: String,
    private val subcommand: String,
    private val funcName: String = "",
)
```

## Syntax BNF

????????????????????? Grammar Kit ?????????????????? [https://github.com/JetBrains/Grammar-Kit](https://github.com/JetBrains/Grammar-Kit)

?????????????????????

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


