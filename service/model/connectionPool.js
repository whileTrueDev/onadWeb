const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: process.env.DB_CHARSET,
  // connectTimeout: 10000
  /**
     * The maximum number of connection requests the pool will queue
     * before returning an error from getConnection.
     * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
     */
  // connectTimeout  : 60 * 60 * 1000,
  // acquireTimeout  : 60 * 60 * 1000,
  // timeout         : 60 * 60 * 1000,
});

console.log('create pool!');

module.exports = pool;
