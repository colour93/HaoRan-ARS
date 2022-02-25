/**
 * mirai/controllers/game.js
 * 获取游戏的主控制器
 */

// 引入库
const clog = require('yooofur-clog');

// 引入控制器
const $ = require('./base');
const fileInfo = require('../../controllers/fileInfo');

// 引入数据模型
const Resource = require('../../mongo/schemas/Resource');

// 引入配置文件
const {contact} = require('../../config.json').bot.manage;

/**
 * 搜索资源
 * @param {import('node-mirai-sdk').message} message node-mirai-sdk 中的 message对象
 * @param {Array} msgAry msg 解析数组
 */
async function searchGame (message, msgAry) {

    if (!msgAry[1]) return;

    result = await Resource.find({name: {$regex: msgAry[1]}});

    clog.log(`${message.sender.nickname} (${message.sender.id}) 查询了: ${msgAry[1]}`);

    // 如果没搜到
    if (!result.length) {
        message.reply(`抱歉\n没有搜索到相关已收录游戏资源\n联系${contact.name}提交收录👉${contact.qq}`);
        return;
    }

    let replyMsg = "为您搜索到以下结果：";

    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        replyMsg += `\nID: ${item.id}\t${item.name}`;
    }

    message.reply(replyMsg);
    return;
}

/**
 * 下载资源
 * @param {import('node-mirai-sdk').message} message node-mirai-sdk 中的 message对象
 * @param {Array} msgAry msg 解析数组
 */
async function downloadGame (message, msgAry) {

    let inputId = parseInt(msgAry[1]);
    if (isNaN(inputId)) {
        message.reply("请输入正确的ID");
        return;
    }

    result = await Resource.findOne({id: inputId});

    // 如果没搜到
    if (!result) {
        message.reply("抱歉\n没有搜索到您输入的ID相关资源");
        return;
    }

    const ts = (new Date()).getTime();

    const {name, id, size, fileName, itemId} = result;
    let {downloadUrl} = result;

    clog.log(`${message.sender.nickname} (${message.sender.id}) 访问了: ${name}`);

    if (!downloadUrl || (ts > downloadUrl.expire)) {
        downloadUrl = await fileInfo.updateFileUrl(itemId);
    };

    if (!downloadUrl) {
        message.reply(`您输入的ID对应资源无法找到\n请联系管理员👉${contact.name} ${contact.qq}`);
        return;
    };

    // 统计访问量
    await Resource.updateOne({itemId}, {$inc: {views: 1}});
    
    let replyMsg = "";

    replyMsg += name + "\n";
    replyMsg += `ID：${id}\n`;
    replyMsg += `文件名：${fileName}\n`;
    if (size) {
        replyMsg += `文件大小：${size.str}\n`;
    }
    replyMsg += `下载链接：${downloadUrl.url}\n`;

    message.reply(replyMsg);
    return;
}

/**
 * 命令路由
 * @param {import('node-mirai-sdk').message} message node-mirai-sdk 中的 message对象
 */
function route (message) {

    const {msg, msgAry} = $.compareKeyword(".", message);
    if (!msg) return;

    switch (msgAry[0]) {

        // 搜索资源
        case '.game':
            searchGame(message, msgAry)
            break;

        // 获取下载链接
        case '.down':
            downloadGame(message, msgAry)
            break;
    
        default:
            return;
    }

}

module.exports = route;