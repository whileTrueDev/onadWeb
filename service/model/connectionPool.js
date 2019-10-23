const mysql = require('mysql');
const config = require('../config.json');

const pool = mysql.createPool({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.password,
  database: config.DB.database,
  port: config.DB.port,
  charset: config.DB.charset
  /**
     * The maximum number of connection requests the pool will queue
     * before returning an error from getConnection.
     * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
     */
  // connectionLimit : 1000,
  // connectTimeout  : 60 * 60 * 1000,
  // acquireTimeout  : 60 * 60 * 1000,
  // timeout         : 60 * 60 * 1000,
});

console.log('create pool!');

module.exports = pool;
