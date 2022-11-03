# Chapter 7 - Environment

## Env

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