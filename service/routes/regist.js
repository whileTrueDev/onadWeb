const express = require('express');
const encrypto = require('../encryption');
const pool = require('../model/connectionPool');

var router = express.Router();

/* POST marketer register page */
router.route('/marketer')
.post(function(req, res, next){
  //DB연결후 query문을 통한 데이터 삽입 
  pool.getConnection(function(err, conn){
    if(err){ 
      // header 정의
      // response 전달
      console.log('DB연결 관련 오류' + err);
    }
    let key, salt;
    [key, salt] = encrypto.make(req.body.marketerRawPasswd);
    let queryState = `INSERT INTO marketerInfo (marketerId, marketerPasswd, marketerSalt, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum, marketerUserType) VALUES (?, ?, ?, ?, ?, ?, ?, ?) `
    let queryArray = [req.body.marketerId, key, salt, req.body.marketerName, req.body.marketerMail, req.body.marketerPhoneNum, req.body.marketerBusinessRegNum, req.body.marketerUserType]
    conn.query(queryState, queryArray, function(err, result, fields){
        if(err){
            console.log(err);
        }
        conn.release();
    });
  });
  // 이메일 발송
  res.send('작성하신 이메일으로 본인인증 메일을 발송하였습니다. 해당 경로로 로그인 해주세요.');
});

module.exports = router;