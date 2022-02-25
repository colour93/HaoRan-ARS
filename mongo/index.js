/**
 * mongo/index.js
 * 数据库入口文件
 */

// 引用库
const mongoose = require('mongoose');
const clog = require('yooofur-clog');

// 引入数据模型
const Account = require('./schemas/Account');

// 引用配置文件
const {host, user, pwd, db} = require('../config.json').mongo;

clog.info("初始化 MongoDB 连接");

mongoose.connect(`mongodb://${user}:${pwd}@${host}/${db}`, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})

mongoose.connection.once('open',async (err)=>{ 
    if(!err){
        clog.info('MongoDB 连接成功');
        await Account.updateMany({}, {$set: {data: null}});
        clog.info('无效 data 已清除');
    }else{
        clog.error('MongoDB 连接失败');
        clog.error(err);
    }
})

module.exports = mongoose;