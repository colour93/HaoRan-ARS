/**
 * express/routers/api.js
 * 根 -> API
 */

// 引入库
const express = require('express');
const graph = require('../../graph');

// 引入 MSAL 实例
const msalClient = require('../../msal');

// 引入配置文件
const config = require('../../config.json');
const clog = require('yooofur-clog');

// 引用数据模型
const Account = require('../../mongo/schemas/Account');

// 初始化路由
let router = express.Router();

// 初始化参数
const
    { scopes, root } = config.azureApp,
    redirectUri = config.express.url + root + "/callback"

/**
 * 绑定目录
 * POST /bindPath
 */
router.post('/bindPath', async (req, res) => {

    clog.log("发起绑定目录请求");

    const {userId, bindPathId} = req.body;

    result = await Account.updateOne({userId}, {
        $set: {bindPathId}
    });

    if (!result.matchedCount) {
        res.send({
            code: 404,
            msg: "没有找到对应账户"
        });
        return;
    };

    clog.log(`已绑定目录，userId：${userId}，bindPathId：${bindPathId}`);

    res.send({
        code: 0,
        msg: 'success'
    })
})

module.exports = router;