# Quick Start

1. 安装 Feakin Intellij 插件: [![Version](https://img.shields.io/jetbrains/plugin/v/20026-feakin.svg)](https://plugins.jetbrains.com/plugin/20026-feakin)
2. 下载 FKL CLI（SDK）：[https://github.com/feakin/feakin/releases](https://github.com/feakin/feakin/releases)
    - 重命名为 fkl（Windows 下为 fkl.exe），并将其放置到 PATH 中
    - 添加可执行权限：`chmod +x fkl`
      - 遇到 "cannot be opened because the developer cannot be verified."，参考 [https://support.apple.com/zh-cn/HT202491](https://support.apple.com/zh-cn/HT202491)
    - 检查 CLI 是否安装成功：`fkl --help`
3. 创建一个 FKL 文件，比如：`cinema.fkl`，添加如下代码：
```feakin
impl CinemaCreated {
    endpoint {
        GET "/book/{id}";
        authorization: Basic admin admin;
        response: Cinema;
    }
}

impl CinemaUpdated {
   endpoint {
      POST "/book/{id}";
      request: CinemaUpdatedRequest;
      authorization: Basic admin admin;
      response: Cinema;
   }

   flow {
      via UserRepository::getUserById receive user: User
      via UserRepository::save(user: User) receive user: User;
      via MessageQueue send CinemaCreated to "CinemaCreated"
   }
}
```
4. 在 Intellij IDE 中打开 FKL 文件，点击左侧的 `Run` 按钮，查看是否有如下输出：

![Feakin Impl Sample](../images/feakin-intellij-plugin.png)
