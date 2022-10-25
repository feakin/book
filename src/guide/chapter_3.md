# Code Generator

> code generator for fklang

Download from: [https://github.com/feakin/fklang/releases](https://github.com/feakin/fklang/releases)

```bash
Feakin is a architecture design and visual collaboration tool. This is the parser for Feakin.

Usage: fkl <COMMAND>

Commands:
  dot   generate Graphviz/Dot from fkl file
  ast   generate ast from fkl file
  gen   generate code from fkl file
  run   run function from fkl file
  help  Print this message or the help of the given subcommand(s)

Options:
  -h, --help     Print help information
  -V, --version  Print version information
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

## Test with Http Request


```feakin
impl GitHubOpened {
    endpoint {
        GET "https://book.feakin.com/";
        response: String;
    }
}

impl FeakinJson {
    endpoint {
        GET "https://raw.githubusercontent.com/feakin/vscode-feakin/master/package.json";
        response: String;
    }
}
```

Run by Cli

```bash
$ fkl run --path ./test_data/cli/impl.fkl --impl GitHubOpened --func request
```
