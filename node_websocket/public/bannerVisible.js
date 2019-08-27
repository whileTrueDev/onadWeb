exports.modules = pool.getConnection(function(err, conn){
  if(err) return err;
  var sql = "INSERT INTO bannerVisible (contractionId, visibleState) VALUES (?, ?);"; 
  console.log('arrived')
  conn.query(sql, [bannerName, state], function (err, result, fields) { 
      conn.release();
      if (err) return err;   
    });
  }); 