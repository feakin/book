# Chapter 5 - HTTP API verify (TBD)

## 契约驱动的 HTTP API （TBD)

- HTTP API 测试集成
- 先验条件
- 后验条件

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

```
$ fkl run --main ./test_data/cli/impl.fkl --impl GitHubOpened --func http-request
```

## 校验机制



