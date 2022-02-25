/**
 * express/routers/root.js
 * “根” 路由
 */

// 引入库
const express = require('express');
const graph = require('../../graph');
const $ = require('../../controllers/base');

// 引入 MSAL 实例
const msalClient = require('../../msal');

// 引入配置文件
const config = require('../../config.json');

// 引用数据模型
const
    Account = require('../../mongo/schemas/Account'),
    Resource = require('../../mongo/schemas/Resource');

// 初始化路由
let router = express.Router();

// 初始化参数
const
    { scopes, root } = config.azureApp,
    redirectUri = config.express.url + root + "/callback"

// 根
router.get('/', async (req, res) => {

    clog.log("发起根请求");

    let data, driveList, resources, dirList = [], dirsList;

    try {
        data = await Account.findOne({ bot: config.bot.account.qq });
        resources = await Resource.find();
    } catch (error) {
        clog.error(error);
        res.send({
            code: -2,
            error
        })
        return;
    }
    

    // 如果有登录态且未绑定目录
    if (data.data && !data.bindPathId) {
        try {
            driveList = await graph.getDriveChildren(data.data.drives.value[0].id).then(a => a.value);
        } catch (error) {
            clog.error(error);
            res.send({
                code: -2,
                error
            })
            return;
        }
    }

    // 获取绑定目录内容
    if (data.data && data.bindPathId) {
        try {
            dirsList = await graph.getDirChildren(data.bindPathId).then(a => a.value);
            // 算是去重
            for (let i = 0; i < dirsList.length; i++) {
                let item = dirsList[i];
                for (let j = 0; j < resources.length; j++) {
                    const resource = resources[j];
                    if (item.id != resource.itemId) {
                        item.sizeStr = $.sizeCalc(item.size);
                        dirList.push(item);
                    };
                }
            };
        } catch (error) {
            clog.error(error);
            res.send({
                code: -3,
                error
            })
            return;
        }
    }

    res.render('index', {
        title: "主页",
        data,
        root,
        driveList,
        resources,
        dirsList,
        dirList
    });

})

// 前往登录
router.get('/auth', async (req, res) => {

    clog.log("发起登录请求");

    const urlParameters = {
        scopes,
        redirectUri
    };

    try {
        const authUrl = await msalClient.getAuthCodeUrl(urlParameters);
        res.redirect(authUrl);
    }
    catch (error) {
        clog.error(error);
        res.send({
            code: -1,
            error
        });
    }

})

// 回调
router.get('/callback', async (req, res) => {

    const tokenRequest = {
        code: req.query.code,
        scopes,
        redirectUri
    };

    try {
        const response = await msalClient.acquireTokenByCode(tokenRequest);

        const userId = response.account.homeAccountId;

        // 保存 userId
        result = await Account.updateOne({
            bot: config.bot.account.qq
        }, {
            bot: config.bot.account.qq,
            userId
        }, {
            upsert: true
        });

        const user = await graph.getUserDetails();

        const drives = await graph.getDrives();

        // 添加 user 到存储区
        result = await Account.updateOne({
            bot: config.bot.account.qq
        }, {
            $set: {
                data: {
                    user,
                    drives
                }
            }
        });

        clog.log(`登陆成功! ${user.displayName} (${user.userPrincipalName})`)

        res.redirect(root);
    } catch (error) {

        clog.log(`登陆失败!`)

        clog.error(error)

        res.send({
            code: -1,
            error
        });
    }


})

// 登出
router.get('/signout', async (req, res) => {

    clog.log("发起登出请求");

    // 先判断是否存在
    result = await Account.findOne({ bot: config.bot.account.qq });
    if (result.userId) {

        // 获取 token 缓存
        const accounts = await msalClient
            .getTokenCache()
            .getAllAccounts();

        const userAccount = accounts.find(a => a.homeAccountId === result.userId);

        // 移除账户
        if (userAccount) {
            msalClient
                .getTokenCache()
                .removeAccount(userAccount);
            result = await Account.updateOne({ userId: result.userId }, {
                $set: {
                    data: null
                }
            });
        }

        clog.log(`${userAccount.name} (${userAccount.username}) 已登出`);
    }

    res.redirect(root);
})

// 导出路由
module.exports = router;