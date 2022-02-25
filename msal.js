/**
 * msal.js
 * MSAL 实例初始化文件
 */

// 引用库
const msal = require('@azure/msal-node');
const clog = require('yooofur-clog');

// 引用配置文件
const config = require('./config.json');

clog.info("初始化 MSAL 实例");

// 初始化参数
const
    { scopes, clientId, clientSecret, authority, root } = config.azureApp,
    { port, url } = config.express,
    redirectUri = config.express.url + root + "/callback",
    msalConfig = { auth: { clientId, authority, clientSecret } };

    
// 初始化MSAL身份验证对象
module.exports = new msal.ConfidentialClientApplication(msalConfig);