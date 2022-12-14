# Architecture Guarding

## 分层架构守护

```feakin
layered DDD {
    dependency {
        "interface" -> "application"
        "interface" -> "domain"
        "domain" -> "application"
        "application" -> "infrastructure"
        "interface" -> "infrastructure"
    }
    layer interface {
        package: "com.feakin.demo.rest";
    }
    layer domain {
        package: "com.feakin.demo.domain";
    }
    layer application {
        package: "com.feakin.demo.application";
    }
    layer infrastructure {
        package: "com.feakin.demo.infrastructure";
    }
}
```

Run by IDE:

![Guarding](../images/idea/guard-sample.png)

点击 `Guard` 按钮，会自动检查依赖是否符合预期。

Run by CLI:

```bash
$ fkl run --main ./test_data/cli/impl.fkl --func guarding
```


## 更多守护规则（TBD）

refs: [Guarding](https://github.com/modernizing/guarding)

```guarding
class(implementation "BaseParser")::name should endsWith "Parser";

class("java.util.Map") only accessed(["com.phodal.pepper.refactor.staticclass"]);
class(implementation "BaseParser")::name should not contains "Lexer";
```
