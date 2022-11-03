# Chapter 7 - Environment

## Env

测试数据库连接

```bash
$ fkl run --main docs/samples/impl.fkl  --func test-connection --env Local
```

```feakin
env Local {
    datasource {
        driver: postgresql
        host: "localhost"
        port: 5432
        database: "test"
    }
    server {
        port: 9090;
    }
}

env Staging {
    // URL 模式
    datasource {
        url: "mysql://localhost:3306/test"
    }
}
```

## 自定义环境变量

```feakin

env Local {
    kafka {
        host: "localhost"
        port: 9092
    }
}
```