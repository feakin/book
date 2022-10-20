# Chapter 2 - Binding Implementation

## Implementation DomainEvent

创建 API 时，需要绑定领域事件到实现。

```feakin
impl TicketReservated {
  endpoint {
    POST "/ticket/reservate";
    request: TicketReservatedRequest;
    response: TicketReservatedResponse;
  }
}
```

## Layered Implementation

分层依赖关系：

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