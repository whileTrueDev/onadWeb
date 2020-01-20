const mysql = require('mysql');

module.exports = (function () {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
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
