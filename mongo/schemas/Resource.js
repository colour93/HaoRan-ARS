/**
 * Resource 集合
 * @description 用于存储资源信息
 */

const Schema = require('mongoose').Schema;
const model = require('mongoose').model;

const ResourceSchema = new Schema ({

    // 名字
    name: String,

    // 文件名
    fileName: String,

    // 查询用id
    id: Number,

    // OD 上的 itemId
    itemId: String,

    // 文件大小
    size: {
        num: Number,
        str: String
    },

    // OD 下载直链
    downloadUrl: {

        // URL
        url: String,

        // 过期时间
        expire: Number

    },

    // 访问量
    views: Number
})
const Resource = model('Resource', ResourceSchema);

module.exports = Resource;