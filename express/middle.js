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
    
    const accounts = await msalClient
        .getTokenCache()
        .getAllAccounts();
    if (!accounts.length) {
        await Account.deleteOne({ bot: config.bot.account.qq });
        res.redirect(root);
        return;
    }

    next();
}

/**
 * 校验 token缓存 是否存在
 */
async function rootVerify (req, res, next) {
    
    const accounts = await msalClient
        .getTokenCache()
        .getAllAccounts();
    if (!accounts.length) {
        await Account.deleteOne({ bot: config.bot.account.qq });
    }

    next();
}


module.exports = {
    verifyAccess,
    rootVerify
}