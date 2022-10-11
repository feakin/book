# Architecture Guarding

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