# 浩然 - 自动资源分享 Bot

HaoRan - ARS

## 0. 简介

浩然 - 自动资源分享 Bot 是一个基于 node-mirai 的 mirai 框架下 QQ Bot。他通过云盘存储资源，通过mirai使用QQ进行资源查询提取。

目前支持的存储方式有 OneDrive，计划支持 本地、阿里云OSS、腾讯云COS。

## 1. 快速上手

1. 将本仓库拉至本地，并确保已配置 Node.js 运行环境（使用 v14.17.4 开发）

    ```bash
    git clone git@github.com:colour93/HaoRan-ARS.git

    cd HaoRan-ARS

    npm install
    ```

2. 根据配置模板文件 ```config.template.json``` 进行配置，配置后修改文件名为 ```config.json```

    ```json
    {
        "bot": {
            "account": {
                "host": "http://test.com:233",  // mirai-api-http 地址
                "authKey": "authKey",           // mirai-api-http authKey
                "qq": 123456789,                // mirai-api-http 绑定QQ
                "enableWebsocket": true         // mirai-api-http 是否开启WS
            },
            "manage": {
                "listen": "friend",             // 监听消息，可选 friend | group | all
                "contact": {                    // 建议选 friend
                    "qq": 987654321,            // 这里是你的联系方式
                    "name": "玖叁"              // 用于错误反馈消息
                }
            }
        },
        "azureApp": {
            "clientId": "xxx",                  // Azure 申请的 APP 的 ClientID
            "clientSecret": "secret",           // Azure 申请的 APP 的 ClientSecret
            "authority": "https://login.microsoftonline.com/common/", // 固定为此即可
            "scopes": [
                "User.Read",                    // Azure 申请的 APP 的 权限，固定为此即可
                "Files.ReadWrite.All"
            ],
            "root": "/listenPath"               // 响应 Azure 相关请求的根路径
        },
        "express": {
            "secret": "sss",                    // Express Session 加密密钥
            "url": "http://test.com:20461",     // 外部可访问到站点的 URL (一定要带端口，用于计算 redirectURI
            "port": 20461                       // Express 监听端口
        },
        "mongo": {
            "host": "test.com",                 // MongoDB 地址
            "user": "user",                     // MongoDB 账户
            "pwd": "pwd",                       // MongoDB 密码
            "db": "db"                          // MongoDB 数据库
        }
    }
    ```

3. 然后运行

    ```bash
    npm run start
    ```

4. 运行后会向您展示 Azure APP 的回调链接

    ```bash
    ...
    [信息] ==========================
    [信息] 
    [信息] 请在 Azure 对应应用程序中设置以下回调URI
    [信息] http://localhost:20461/ms/callback
    [信息] 
    [信息] ==========================
    ...
    ```

    请将其设置在 Azure APP 的 身份验证 - 平台配置 - Web平台 - 重定向URI 中

    ![AzureAPP_RedirectURI](/docs/imgs/QuickStart_redirectURI.png)

    同时，请确保您的 API权限 应当包含 Files.ReadWrite.All 和 User.Read

    ![AzureAPP_APIScopes](/docs/imgs/QuickStart_APIScopes.png)
