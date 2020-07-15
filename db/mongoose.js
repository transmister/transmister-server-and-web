/**
 * 连接 MongoDB
 * 参考 https://github.com/transmister/work-share/blob/master/transmister-server-and-web/mongodb.md
 */

const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/transmister';

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

const mongoClient = mongoose.createConnection(URI,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    poolSize: 5, 
    keepAlive: 120,
})

mongoClient.on('connected', function () {
    console.log('Mongoose 连接成功: ' + URI);
});

mongoClient.on('error', function (err) {
    console.log('Mongoose 连接失败: ' + err);
});

mongoClient.on('disconnected', function () {
    console.log('Mongoose 连接关闭');
});
