const express = require('express');
const pool = require('../model/connectionPool');

var router = express.Router();

/* POST register page */
router.route('/').post(function(req, res, next){
  const creatorId = req._passport.session.user.creatorId;
  const bankId = req.body.user.bankSelector;
  const account = req.body.user.accountNumber;
  var result = bankId + '/' + account;
  console.log(req.body)
  console.log(result)
//DB연결후 query문을 통한 데이터 삽입 
  pool.getConnection(function(err, conn){
    if(err){ 
        console.log(err)
    }
    conn.query(`
      UPDATE creatorInfo
      SET creatorAccountNumber = "${result}"
      WHERE creatorId = "${creatorId}";`,
      function(err, result, fields){
        if(err){
            console.log(err);
        }
        conn.release();
      });
    });
  });

module.exports = router;