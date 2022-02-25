/**
 * mirai/index.js
 * Bot 入口文件
 */

// 引入库
const Mirai = require('node-mirai-sdk');
const clog = require('yooofur-clog');

// 引入配置文件
const {account, manage} = require('../config.json').bot;

// 引入控制器
const
    $ = require('./controllers/base')
    gameCtrl = require('./controllers/game');

clog.info("初始化 Bot");

// 创建 Bot 实例
const bot = new Mirai(account);

// auth 认证
bot.onSignal('authed', () => {
    clog.info(`Bot 已登录，sessionKey: ${bot.sessionKey}`);
    bot.verify();
})

// session 校验回调
bot.onSignal('verified', async () => {
    clog.info(`Bot 已校验，sessionKey: ${bot.sessionKey}`);

    const friendList = await bot.getFriendList();
    const groupList = await bot.getGroupList();
    clog.info(`Bot 好友数量: ${friendList.length}`);
    clog.info(`Bot 群聊数量: ${groupList.length}`);
})

bot.onMessage(async message => {

    gameCtrl(message);

})

// 监听类型
bot.listen(manage.listen);

// 导出模块
module.exports = bot;