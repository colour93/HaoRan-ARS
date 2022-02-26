/**
 * express/middle.js
 * 中间件
 */

// 引入配置文件
const config = require('../config.json');

// 引入 MSAL 实例
const msalClient = require('../msal');

// 引用数据模型
const Account = require('../mongo/schemas/Account');


// 初始化参数
const {root} = config.azureApp;

// 初始化中间件

/**
 * 校验 token缓存 是否存在
 * 校验 session 是否存在
 */
async function verifyAccess (req, res, next) {

    const {userId} = req.session;
    if (!userId) {
        res.send({
            code: 401,
            msg: "未登录"
        });
        return;
    }
    
    const accounts = await msalClient
        .getTokenCache()
        .getAllAccounts();
    const userAccount = accounts.find(a => a.homeAccountId === userId);
    if (!userAccount) {
        res.send({
            code: 401,
            msg: "未能找到登录信息"
        })
        return;
    }

    next();
}

module.exports = {
    verifyAccess
}