/**
 * graph.js
 * Microsoft Graph SDK
 */

// 引入库
const { ConfidentialClientApplication } = require('@azure/msal-node');
const graph = require('@microsoft/microsoft-graph-client');
const clog = require('yooofur-clog');
require('isomorphic-fetch');

// 引入 MSAL 实例
const msalClient = require('./msal');

// 引入配置文件
const config = require('./config.json');

// 引入数据模型
const Account = require('./mongo/schemas/Account');

// 初始化参数
const
    { scopes, root } = config.azureApp,
    redirct_uri = config.express.url + root + '/callback';


// 导出模块
module.exports = {

    // 获取用户详情
    getUserDetails: async () => {
        const client = await getAuthenticatedClient();
        const user = await client
            .api('/me')
            .select('displayName')
            .get();
        return user;
    },

    // 获取用户驱动器
    getDrives: async () => {
        const client = await getAuthenticatedClient();
        const drives = await client
            .api('/me/drives')
            .get();
        return drives;
    },

    // 获取驱动器根目录
    getDriveChildren: async (driveId) => {
        const client = await getAuthenticatedClient();
        const children = await client
            .api(`/drives/${driveId}/root/children`)
            .get();
        return children;
    },

    // 获取目录
    getDirChildren: async (itemId) => {
        const client = await getAuthenticatedClient();
        const children = await client
            .api(`/me/drive/items/${itemId}/children`)
            .get();
        return children;
    },

    // 获取驱动器中项目详情
    getItemDetail: async (itemId) => {
        const client = await getAuthenticatedClient();
        const item = await client
            .api(`/me/drive/items/${itemId}`)
            .get();
        return item;
    },

};

/**
 * 获取已验证的客户端
 * @param {ConfidentialClientApplication} msalClient msal客户端
 * @param {String} userId 回调后的 userId
 * @returns {graph.Client.init} 已验证的 Graph Client
 */
async function getAuthenticatedClient() {

    // 通过数据库读取 userId
    result = await Account.findOne({ bot: config.bot.account.qq });
    if (!result) {
        throw new Error(`未登录`);
    }
    const {userId} = result;

    // 初始化 Graph 客户端
    const client = graph.Client.init({
        // 通过应用的 MSAL实例 实现一个获取令牌的身份验证提供程序
        authProvider: async (done) => {
            try {
                // 获取用户账户
                const account = await msalClient
                    .getTokenCache()
                    .getAccountByHomeId(userId);

                if (account) {
                    // 尝试静默获取 token
                    // 该方法使用令牌缓存并根据需要刷新过期令牌
                    const response = await msalClient.acquireTokenSilent({
                        scopes, redirct_uri, account
                    });
                    // 回调第一个参数为 err
                    done(null, response.accessToken);
                }
            } catch (err) {
                clog.error(JSON.stringify(Object.getOwnPropertyNames(err)));
                done(err, null);
            }
        }
    });

    return new Promise ((resolve, reject) => {
        resolve(client);
        return;
    })
}
