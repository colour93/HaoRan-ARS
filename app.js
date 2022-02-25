/**
 * 浩然 - 资源自动共享 Bot
 * HaoRan Automatic-Resources-Sharing
 * 
 * app.js
 * 入口文件
 */


// 使用库
const clog = require('yooofur-clog');

console.log(`
=======================================
    __  __            ____            
   / / / /___ _____  / __ \\____ _____ 
  / /_/ / __ \`/ __ \\/ /_/ / __ \`/ __ \\
 / __  / /_/ / /_/ / _, _/ /_/ / / / /
/_/ /_/\\__,_/\\____/_/ |_|\\__,_/_/ /_/ 
                                   
=======================================

浩然 - 资源自动共享 Bot
HaoRan Automatic-Resources-Sharing
https://github.com/colour93/HaoRan-ARS

v0.0.1
`);

clog.info("初始化");

// 初始化 mongo
const mongo = require('./mongo');

// 初始化 express
const express = require('./express');

// 初始化 bot
const bot = require('./mirai');





// 退出前发送释放指令
process.on('SIGINT', async () => {
    clog.info("正在释放 Bot");
    await bot.release();
    clog.info("正在断开 MongoDB 连接");
    await mongo.disconnect();
    process.exit();
});