const express = require('express');
const encrypto = require('../encryption');
const pool = require('../model/connectionPool');

var router = express.Router();

/* POST register page */
router.route('/')
.get(function(req, res, next){
  res.render('regist');
})
.post(function(req, res, next){
  //DB연결후 query문을 통한 데이터 삽입 
  pool.getConnection(function(err, conn){
    if(err){ 
      // header 정의
      // response 전달
    }
    var key, salt;
    [key, salt] = encrypto.make(req.body.passwd);
  
    conn.query(`INSERT INTO node_example (userid, passwd, salt) VALUES (?, ?, ?) `, [req.body.userid, key, salt], function(err, result, fields){
        if(err){
            console.log(err);
        }
        conn.release();
    });
  });
  res.redirect('/');
});

module.exports = router;