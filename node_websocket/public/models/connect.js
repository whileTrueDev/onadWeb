const mysql = require('mysql');
const config = require('./dbInfo');

module.exports = (function () {
  const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

  return {
    getConnection(callback) {
      pool.getConnection(callback);
    },
    end(callback) {
      pool.end(callback);
    }
  };
}());
