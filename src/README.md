# Feakin - 软件开发工业化方法

![](images/logo.svg)

Feakin 是一个软件开发工业化（软件架构设计与开发标准化）方法，基于 DDD （领域驱动设计）与 [TypeFlow](https://zhuanlan.zhihu.com/p/341089716) 编程思想。

![Design Principles](../images/design-principles.svg)

核心设计理念：

1. 架构孪生：双态绑定。提供架构设计态与实现态的双向绑定，保证架构设计与实现的一致性。 
2. 显性化设计意图。将软件设计的意图化，借助于 DSL 语言的特性，将意图转换化代码。
3. 类型与事件驱动。通过事件驱动的方式，将数据类型与领域事件进行绑定。

详细见：《[Design Principles](/design-principles.html) 一节》

Feakin 主要组成部分：

- Fklang 是一个基于软件开发工业化思想，设计的架构设计 DSL。以确保软件系统描述与实现的一致性。通过显式化的软件架构设计，用于支持 AI 代码生成系统的嵌入。
- Intellij Plugin 是 Feakin 的一个 IntelliJ 插件，用于将 Feakin/Fklang 集成到项目中。
- （Todo） Vscode Plugin 是 Feakin 的一个 Vscode 插件，用于将 Feakin/Fklang 集成到项目中。
- Feakin Web 提供了一个架构设计与可视化协作工具，让架构师能够更加高效地进行架构设计与可视化协作。

## Feakin IntelliJ Plugin

安装：[![Version](https://img.shields.io/jetbrains/plugin/v/20026-feakin.svg)](https://plugins.jetbrains.com/plugin/20026-feakin)

![Feakin Impl Sample](../images/feakin-intellij-plugin.png)

Fklang 示例：

```feakin
// DDD 上下文映射图
ContextMap TicketBooking {
    Reservation -> Cinema;
    Reservation -> Movie;
    Reservation -> User;
}

Context Reservation {
  Aggregate Reservation;
}

Context Cinema {
  Aggregate Cinema;
}

Aggregate Cinema {
  Entity Cinema, ScreeningRoom, Seat;
}

// DDD 领域事件
impl CinemaCreated {
    endpoint {
        // API 声明与验证
        GET "/book/{id}";
        authorization: Basic admin admin;
        response: Cinema;
    }
}
```

## Feakin Web

在线地址：[https://online.feakin.com/](https://online.feakin.com/)

点击 `TEAMPLATES` -> `Feakin Sample` 查看示例

![Feakin Web](images/feakin-web.png)

## Fklang

下载地址：[https://github.com/feakin/fklang/releases](https://github.com/feakin/fklang/releases)

```bash
Usage: fkl <COMMAND>

Commands:
  gen    Generate code from a fkl file, current support Java
  dot    Generate dot file from a fkl file
  parse  Parse a fkl file and print the AST
  help   Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help information
```

CLI 示例：

```bash
fkl gen --main /Users/phodal/IdeaProjects/untitled/simple.fkl --impl CinemaCreated
```

```java
@GetMapping("/book/{id}")
public Cinema creatCinema() { }
```
