const mysql = require('mysql');
const pool = mysql.createPool({
    host : 'onad.cbjjamtlar2t.ap-northeast-2.rds.amazonaws.com',
    user : 'onad',
    password : 'rkdghktn12',
    database : 'onadnode',
    port : 3306
});

console.log('create pool!');

module.exports = pool;