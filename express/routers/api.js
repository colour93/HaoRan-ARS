/**
 * express/routers/api.js
 * 根 -> API
 */

// 引入库
const express = require('express');
const graph = require('../../graph');

// 引入控制器
const $ = require('../../controllers/base');
const fileInfo = require('../../controllers/fileInfo');

// 引入 MSAL 实例
const msalClient = require('../../msal');

// 引入配置文件
const config = require('../../config.json');
const clog = require('yooofur-clog');

// 引用数据模型
const Account = require('../../mongo/schemas/Account');
const Resource = require('../../mongo/schemas/Resource');

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

    const {bindPathId} = req.body;
    const {userId} = req.session;

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

/**
 * 注册新资源
 * POST /registerItem
 */
router.post('/registerItem', async (req, res) => {

    clog.log("发起注册资源请求");

    const {itemId, name} = req.body;

    // 直接写数据库
    id = (await Resource.findOne({}, null, {sort: {_id: -1}})).id + 1;
    result = await Resource.updateOne({itemId}, {
        name, id, itemId,
        views: 0
    }, {upsert: true})

    // 然后就是刷新文件相关信息
    result = await fileInfo.updateFileUrl(itemId);
    
    clog.log(`已注册新资源: ${name} (${itemId})`)

    res.send({
        code: 0,
        msg: 'success'
    });

})

module.exports = router;