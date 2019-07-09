const mysql = require('mysql');
const config = require('../config.json');
const pool = mysql.createPool({
    host : config.DB.host,
    user : config.DB.user,
    password : config.DB.password,
    database : config.DB.database,
    port : config.DB.port
});

console.log('create pool!');

module.exports = pool;