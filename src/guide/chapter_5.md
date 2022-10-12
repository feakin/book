# Chapter 5 - HTTP API verify（TBD)
 
## 契约驱动的 HTTP API （TBD)

- HTTP API 测试集成
- 先验条件
- 后验条件

TBD：需要优先支持 Swagger 之类的？


```feakin
impl CinemaCreated {
  endpoint {
    POST "${uri}/post";
    request: Request;
    authorization: Basic "{{username}}" "{{password}}";
  }
}
```