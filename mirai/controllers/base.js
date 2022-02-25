/**
 * mirai/controllers/base.js
 * bot 基础控制器
 */


/**
 * 命令比对
 * @param {String} keyword 触发的关键词
 * @param {import('node-mirai-sdk').message} message node-mirai-sdk中的message对象
 * @param {Object} options 
 *        { 
 *          type: , //信息来源
 *          qq: , //QQ
 *          group: , //群号
 *          mode: , //substring或include
 *        }
 *        一些其他选项，比如限制群聊/单发，限制源群，限制发送人
 * @return {Boolean} 若命令匹配，返回object {msg, msgAry, quote(如有), at}，否则false
 */
function compareKeyword(keyword, message, options) {

    // 先进行额外options判断
    if (options) {

        // 判断消息模式
        switch (options.type) {

            // 群聊
            case 'group':
                if (message.type != 'GroupMessage') return false;
                break;

            // 私聊
            case 'friend':
                if (message.type != 'FriendMessage') return false;
                break;

            default:
                break;
        }

        // 判断是否限制QQ
        if (options.qq) {
            switch (typeof (options.qq)) {
                case 'object':
                    temp = 0;
                    options.qq.forEach((qq) => {
                        if (message.sender.id == qq) {
                            temp++;
                        };
                    });
                    if (temp == 0) {
                        return false
                    };
                    break;
                case 'number':
                    if (message.sender.id != options.qq) return false;
                    break;
            }
        };

        // 判断是否限制群聊
        if (options.group) {
            if (!message.sender.group) return false;
            switch (typeof (options.group)) {
                case 'object':
                    temp = 0;
                    options.group.forEach((group) => {
                        if (message.sender.group.id == group) {
                            temp++;
                        };
                    });
                    if (temp == 0) {
                        return false
                    };
                    break;
                case 'number':
                    if (message.sender.group.id != options.group) return false;
                    break;
            };
        };
    }

    // 大概只用得到这些
    const { type, sender, messageChain } = message;
    // 初始化一下msg文本变量
    let msg = '',
        quote,
        at;

    // 对链foreach
    messageChain.forEach(chain => {
        if (chain.type === 'Plain') {
            msg += chain.text;
        }
        if (chain.type === 'Quote') {
            quote = chain;
        }
        if (chain.type === 'At') {
            at = chain.target;
        }
    });

    let result = {
        msg,
        msgAry: msg.split(' '),
        quote,
        message,
        type: message.type,
        at
    };

    if (options) {

        switch (options.mode) {
            case 'include':
                if (msg.indexOf(keyword) != -1) {
                    return result;
                }
                break;

            case 'substring':
                if (msg.substring(0, keyword.length) == keyword) {
                    return result;
                }
                break;
        }

    }

    if (msg.substring(0, keyword.length) == keyword) {
        return result;
    }

    return false;
}

module.exports = {
    compareKeyword,
}