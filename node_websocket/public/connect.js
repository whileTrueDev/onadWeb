
module.exports = function () {
  var mysql = require('mysql');
  var config = require('./dbInfo');
  var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

  return {
    getConnection: function (callback) {
      pool.getConnection(callback);
    },
    end: function(callback){
      pool.end(callback);
    }
  }
}();
