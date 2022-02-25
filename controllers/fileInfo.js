/**
 * controllers/fileInfo.js
 * OneDrive 文件操作相关控制器
 */

// 引入库
const graph = require('../graph');
const clog = require('yooofur-clog');

// 引入数据模型
const Resource = require('../mongo/schemas/Resource');
const Account = require('../mongo/schemas/Account');

// 引入控制器
const $ = require('./base');

/**
 * 更新文件下载链接
 */
async function updateFileUrl (itemId) {

    clog.log(`开始更新文件下载链接，itemId: ${itemId}`)

    // 获取文件详情
    detail = await graph.getItemDetail(itemId);

    const expire = (new Date()).getTime() + 1800000;

    const
        {name, size} = detail,
        url = detail['@microsoft.graph.downloadUrl'];

    clog.log(`${name} (itemId: ${itemId})下载链接已更新！`)

    const downloadUrl = {url, expire};

    // 更新文件详情
    result = await Resource.updateOne({itemId}, {
        $set: {
            fileName: name,
            size: {
                num: size,
                str: $.sizeCalc(size)
            },
            downloadUrl
        }
    })

    return new Promise ((resolve, reject) => {
        resolve(downloadUrl);
        return;
    })
}


module.exports = {
    updateFileUrl
}