# Code Generator

> code generator for fklang

Download from: [https://github.com/feakin/fklang/releases](https://github.com/feakin/fklang/releases)

```bash
fkl gen --help

Generate code from a fkl file, current support Java

Usage: fkl gen [OPTIONS]

Options:
      --path <PATH>
      --impl <String>
  -h, --help           Print help information
  -V, --version        Print version information
```

## Basic: generate method

sample code:

```feakin
impl HelloGot {
    endpoint {
        GET "/hello";
        response: String;
    }
}
```

output:

```java
@GetMapping("/hello")
public String gotHello() {

}
```

## Auto insert: Aggregate and Layered

declaration with aggregate and layered:

```feakin
impl HelloGot {
    aggregate: Hello; // here
    endpoint {
        GET "/hello";
        response: String;
    }
}

layered DDD {
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

with insert code to: `src/main/java/com/feakin/demo/rest/Controller.java`

```java
@GetMapping("/hello")
public String gotHello() {

}
```

