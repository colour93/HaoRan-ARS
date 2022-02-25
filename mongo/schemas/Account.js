/**
 * Account 集合
 * @description 用于存储 Bot 对应的登录凭据
 */

const Schema = require('mongoose').Schema;
const model = require('mongoose').model;

const AccountSchema = new Schema({

   // Bot QQ
   bot: Number,

   // Microsoft 账户对应授权的 userId
   userId: String,

   // 绑定路径
   bindPathId: String,

   //  账户的信息
   data: Object

})
const Account = model('Account', AccountSchema);

module.exports = Account;