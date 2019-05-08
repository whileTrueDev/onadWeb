const pool = require('./connect');

module.exports = function () {
  return {
    select: function(callback){
      pool.getConnection(function(err, conn){
        if(err) return callback(err);
        var sql = "INSERT INTO `test`.`broadcastingcheck` (`bannerName`) VALUES ('tmp');"
        conn.query(sql, function (err, result, fields) {
          conn.release();
          if (err) return callback(err);
          callback(null, result);
        });
      });
    },
    pool: pool
  }
};

