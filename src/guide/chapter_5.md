# Chapter 5 - HTTP API verify（TBD)
 
## 契约驱动的 HTTP API （TBD)

- HTTP API 测试集成
- 先验条件
- 后验条件

TBD：需要优先支持 Swagger 之类的？

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
$ fkl run --config ./test_data/cli/impl.fkl --impl GitHubOpened --func request
```

## 校验机制



