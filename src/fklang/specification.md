# Fklang Specification

> Fklang provide a two-way binding between design-implementation for architecture.

Basic Works:

- DDD syntax. DDD strategy and tactic description.
- DomainEvent Implementation. for generate implementation of DomainEvent.

In dev:

- Binding. mapping DSL to SourceCode
- SourceSet Plugin. third-part integration, like PlantUml, Swagger.

TBD:

- Layered syntax. layered structured syntax.
- Description syntax. description design in fake code.
- Typedef (TBD). for DDD syntax type bootstrapping.
- Style (TBD). for design visualization UI.

## DDD

DDD Syntax:

| decl               |        | usage                                                                        |
|--------------------|--------|------------------------------------------------------------------------------|
| context_map_decl   | :      | [ 'ContextMap' ] [ ID ] '{' (context_node_decl &#124; context_node_rel ) '}' |
|                    | &#124; | att_list                                                                     |
| context_node_decl  | :      | ['context'] [ID]                                                             |
| context_node_rel   | :      | [ ID ] rel_symbol [ ID ]                                                     |
| rel_symbol         | :      | ('->' &#124; '<-' &#124; '<->')                                              |                     
| context_decl       | :      | [ 'Context' ] [ ID ] '{' aggregate_list? '}'                                 |
|                    | &#124; | att_list                                                                     |
| att_list           | :      | attr_item+                                                                   |
| attr_item          | :      | ([ ID ] '=' [ value ] ','?)* ';'?                                            |
|                    | &#124; | ([ ID ] ':' [ value ] ','?)* ';'?                                            |
|                    | &#124; | [ ID ] ([ value, ',' ])*     ';'?                                            |
| aggregate_decl     | :      | [ 'Aggregate' ]  [ ID ] '{' entity_list '}'                                  |
|                    | &#124; | att_list                                                                     |
| entity_decl        | :      | [ 'Entity' ] [ ID ] '{' value_object_list '}'                                |
|                    | &#124; | att_list                                                                     |
| value_object__decl | :      | [ 'ValueObject' ] [ ID ] '{' value_list '}'                                  |
|                    | &#124; | att_list                                                                     |

### Sample

```kotlin
ContextMap Ticket {}

Context ShoppingCarContext {}

// render wtih UML styled?
Aggregate Cart {
  """ inline doc sample
  just-demo for test
  """
  display = "Cart";
  DomainEvent CartCreated, CartItemAdded, CartItemRemoved, CartItemQuantityChanged, CartCheckedOut;
  DomainEvent CartItemQuantityChanged;
  
  // Concept or UML like ?
  // can be inside or outside of the Aggregate
  Entity Cart {
    // it's to many, can change in different way.
    ValueObject CartId
    ValueObject CartStatus
    ValueObject CartItem
    ValueObject CartItemQuantity
    ValueObject CartItemPrice
    ValueObject CartItemTotal
    ValueObject CartTotal
  }
}

// global detail for Cart.
Entity Cart {}

DomainLanguage(sourceSet = TicketLang)
```

## DomainEvent Implementation

Subscribe / Publish / Event / Flow

### API

- input -> request
  - pre-validate
- output -> response
  - post-validate
- process -> flow
  - tasking

compare to `given-when-then`.

```kotlin
impl CinemaCreated {
  endpoint {
    POST "${uri}/post";
    authorization: Basic {{username}} {{password}};
    request {
      "id": {{$uuid}},
      "price": {{$randomInt}},
      "ts": {{$timestamp}},
      "value": "content"
    }
  }
  
  // created in ApplicationService
  flow {
    via UserRepository::getUserById receive user: User
    // send "book.created" to Kafka
    via UserRepository::save with parameter() ??
    // or
    via UserRepository::save(user: User) receive user: User;
    // message queue
    via MessageQueue send CinemaCreated to "CinemaCreated"
    // http request
    via HTTP::post (with parameter())? to "${uri}/post"
    // grpc Greeter
    via GRPC::Greeter send CinemaCreated to "CinemaCreated"
    // map filter
    choose(isUserValid) {
      is true => {
        // do something
      }
      is false => {
        // do something
      }
    } 
  }
}
```

expect generate code will be:

```java
// get_user_by_user_id from JPA
public User getUserByUserId(String userId) {
  return userRepository.findByUserId(userId);
}

// get_user_by_user_id from MyBatis
public User getUserByUserId(String userId) {
  return userMapper.getUserByUserId(userId);
}
```

with API testing

```kotlin
impl CinemaCreated {
  qualified: "${moduleName}:com.example.book", 
  
  endpoint {
    GET "/book/{id}";
    authorization: Basic admin admin;
    response: Cinema;
    request: CreateBookRequest;

    // testForLocal
    env "Local" {
       host: ""
       token: ""

       expect {
        "status": 200
        "data": {
          "id": {{$uuid}},
          "price": {{$randomInt}},
          "ts": {{$timestamp}},
          "value": "content"
        }
    }
  }

  // full processing (TBD)
  request CreateBookRequest {
    struct {
      "title" : "string",
      "author" : "string",
      "price" : "number"
    }
    example {
      "title" : "The Lord of the Rings",
      "author" : "J.R.R. Tolkien",
      "price" : 29.99
    }
    validate {
      // title.length > 10 ? 
      title  {
        required { min: 3, max: 10 }
        pattern { regex: "^[a-zA-Z0-9]+$" }
        range { min: 1, max: 100 }
      }
    } 
  } 
  
  middle {
    via User get/update/delete/post userId 
    via Kafka send "book.created"
  }

  response CreateBookResponse {
     struct {
        "id" : "number"
     }
     validate  { }
  } 
  
  // with source side (TBD)
  output CreateBookResponse(xpath="");
  input CreateBookResponse(sourceSet="PetSwagger" location="");
}
```


### Default impl config (TBD)

```kotlin
config impl {
  techstack {
    language = "Kotlin"
    framework = "Spring"
    message = "Kafka" 
    dao = "JPA"
    cache = "Redis"
    search = "ElasticSearch"
  }
}
```

## Binding

> Binding provide a way to binding source code to Context

```
Aggregate Ticket {
 
  binding {
     ....
  }
}

binding Ticket {
  event: TicketCreated, TicketUpdated, TicketDeleted; 
  language: "Kotlin";
  qualified: "subdirectory?/${moduleName}:com.phodal.coco";
}
```

## SourceSet (TBD)

> SourceSet is design for support 3rd-party dsl, like PlantUML, Swagger.yaml

| decl                   |        | usage                                   |
|------------------------|--------|-----------------------------------------|
| source_set_decl        | :      | simple_source_set_decl                  |
|                        | &#124; | space_source_set_decl                   |
| space_source_set_decl  | :      | [ 'SourceSet' ] [ ID ] '{' att_list '}' |
| simple_source_set_decl | :      | [ 'SourceSet' ] [ ID ] '(' att_list ')' |
| implementation_decl    | :      | [ 'impl' ] [ID] '{' (inline_doc) '}'    |

### PlantUML for Structure

file_type: uml, puml

```
Struct(sourceSet=DddUml, location="")

SourceSet DddUml {
  type: "puml",
  file: PlantUml
}

// or
SourceSet(type="puml", file="ddd.puml")
```

### Swagger API (TBD)

file_type: Yaml, JSON

with: XPath

refs:

- xpath
  syntax: [https://github.com/antlr/grammars-v4/blob/master/xpath/xpath31/XPath31.g4](https://github.com/antlr/grammars-v4/blob/master/xpath/xpath31/XPath31.g4)

```
SourceSet PetSwagger {
  file: "openapi.yaml",
  type: OpenApi,
  prefix: "Pet"  // add prefix to items
}
```

### UniqueLanguage model ? (TBD)

file_type: CSV, JSON, Markdown ?

```
SourceSet TicketLang {
  file: "ticket.csv",
  type: UniqueLanguage, // or also for UL
  prefix: "Ticket"
}
```

## Layered (TBD)

> Layered is design for decl

| decl             |        | usage                                                       |
|------------------|--------|-------------------------------------------------------------|
| layered_decl     | :      | 'layered' ([ ID ] &#124; 'default' )  '{' layered_body? '}' |
| layered_body     | :      | layer_dependency                                            |
|                  | &#124; | layer_item_decl                                             |
| layer_item_decl  | :      | 'layer' [ ID ] '{' layer_item_entry* '}'                    |
| layer_item_entry | :      | package_decl                                                |
| package_decl     | :      | 'package' ':' [ string ]                                    | 

can be guarding for model

```kotlin
layered DDD {
  dependency {
    "interface" -> "application"
    "interface" -> "domain"
    "domain" -> "application"
    "application" -> "infrastructure"
    "interface" -> "infrastructure"
  }
  layer interface {
     package: "com.example.book"
  }
  layer domain {
     package: "com.example.domain"
  }
  layer application {
    package: "com.example.application"
  }
  layer infrastructure {
     package: "com.example.infrastructure"
  }
}
```

## Description (TBD)

> Description can provide design in fake code way.

Description Syntax:

| decl             |        | usage                                                                   |
|------------------|--------|-------------------------------------------------------------------------|
| description_decl | :      | [ ID ] '{' expr* '}'                                                    |
| expr             | :      | if_expr                                                                 |
|                  | &#124; | choose_expr                                                             | 
|                  | &#124; | behavior_expr                                                           | 
| if_expr          | :      | [ 'if' ] '(' [ expression ]  ')'                                        |
| choose_expr      | :      | [ 'choose' ] '(' [ expression ]  ')'                                    |
| behavior_expr    | :      | ['via'] [ ID ] action [ID]                                              |
| action           | :      | [ 'get' &#124; 'update' &#124; 'delete' &#124; 'create' &#124;  'send'] |

```kotlin
description FakeCode {
  if (and ?) then {} else {}
  choose() {
    condition:
    condition:
  }

  done
  operator: <, >, >=, <=, ==, +, -, *, %, /, ?
  // call
  via Entity send/ receive Event;
}
```

## Typedef (TBD)

> Typedef provide custom syntax like container or others, can support for bootstrapping DDD syntax.

### BuildIn Types

| Name        | Description                     |
|-------------|---------------------------------|
| identifier  | unique identifier               |
| binary      | Any binary data                 |
| bits        | A set of bits or flags          |
| boolean     | "true" or "false"               |
| enumeration | Enumerated strings              |
| string      | string                          |
| number      | Any number, can be float or int |
| optional ?  | Optional type ?                 |

### Container

```groovy
typedef(container) ContextMap {
 
}
```

| decl         |     | usage                                                 |
|--------------|-----|-------------------------------------------------------|
| typedef_decl | :   | [ 'typedef'] '(' metaType ')' ID '{' (decl_list) '}'; |
| decl_list    | :   | decl_item*                                            |
| decl_item    | :   | [ID] ':' decl_name                                    |

## Style Decl (TBD)

```kotlin
styles {

    // node
    element "Software System" {
        background #1168bd
        color #ffffff
    }
    element "Person" {
        shape person
        background #08427b
        color #ffffff
    }
    
    // edge
    relationship <tag> {
        thickness <integer>
        color #777777
        colour #777777
        dashed <true|false>
        style <solid|dashed|dotted>
        routing <Direct|Orthogonal|Curved>
        fontSize <integer>
        width <integer>
        position <integer: 0-100>
        opacity <integer: 0-100>
    }

}
```
