/**
 * express/index.js
 * HTTP 服务入口
 */

// 引入库
const express = require('express');
const http = require('http');
const logger = require('morgan');
const clog = require('yooofur-clog');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

clog.info("初始化 Express");

// 引用配置文件
const config = require('../config.json');

// 引入中间件
const middle = require('./middle');

// 引入路由
const
    rootRouter = require('./routers/root'),
    apiRouter = require('./routers/api');

// 初始化 Express 实例
const app = express();

// 初始化 body 处理中间件
app.use(bodyParser.json())

// 初始化参数
const
    { root } = config.azureApp,
    { port, url, secret } = config.express,
    redirectUri = config.express.url + root + "/callback";

app.locals.users = {};

// 初始化 session
app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
}));

// 初始化模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 初始化静态目录
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

clog.info(`==========================`);
clog.info(``);
clog.info(`请在 Azure 对应应用程序中设置以下回调URI`);
clog.info(redirectUri);
clog.info(``);
clog.info(`==========================`);

// 设置中间件
app.use('/api', middle.verifyAccess);

// 设置路由
app.use(root, rootRouter);
app.use('/api', apiRouter);

// 设置端口
clog.info(`Express 运行于: ${url}${root}`);
clog.info(`登录链接: ${url}${root}/auth`);
app.set('port', port);

app.use(logger('dev'));

// 创建 HTTP 服务实例
clog.info("初始化 HTTP 服务");
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// 错误处理
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            clog.error(bind + ' 需要提升权限');
            process.exit(1);
        case 'EADDRINUSE':
            clog.error(bind + ' 端口已在使用中');
            process.exit(1);
        default:
            throw error;
    }
}

// 监听处理
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    clog.info(`HTTP 服务监听本地 ${bind}`);
}