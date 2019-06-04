const express = require('express');
const encrypto = require('../encryption');
const pool = require('../model/connectionPool');
const setTemporaryPassword = require('../middlewares/setTemporyPassword');
const sendEmailAuth = require('../middlewares/sendEmailAuth');
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
  next();
}, sendEmailAuth);


router.route('/checkId')
.post((req, res, next)=>{
  console.log('checkId로 중복확인 합니다.');
  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    conn.query(`SELECT marketerId FROM marketerInfo WHERE marketerId = ? `, [req.body.id], function(err, result, fields){
      if(result[0]){
        res.send(true);
      }
      else{
        res.send(false);
      }
    });
    conn.release();
  });
})

router.route('/findId')
.post((req,res,next)=>{
  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    let errorJson = {};
    conn.query(`SELECT marketerId, marketerName FROM marketerInfo WHERE marketerMail = ? `, [req.body.marketerMail], function(err, result, fields){
      if(result[0]){  
        if(result[0].marketerName === req.body.marketerName){
          errorJson = {
            error : false,
            message : result[0].marketerId
          }
        }else{
          errorJson = {
            error : true,
            message : "NAME과 EMAIL이 일치하지 않습니다."
          }
        }
      }
      else{
        errorJson = {
          error : true,
          message : "입력하신 EMAIL의 회원이 존재하지 않습니다."
        }
      }
      res.send(JSON.stringify(errorJson));
    });
    conn.release();
  });
})

router.route('/findPw')
.post((req,res,next)=>{
  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    let errorJson = {};
    conn.query(`SELECT marketerMail FROM marketerInfo WHERE marketerId = ? `, [req.body.marketerId], function(err, result, fields){
      if(result[0]){  
        if(result[0].marketerMail === req.body.marketerMail){
          errorJson = {
            error : false,
            message : '귀하의 메일로 임시비밀번호가 발송되었습니다.'
          }
          next(); 
          //함수수행.
        }else{
          errorJson = {
            error : true,
            message : "ID와 EMAIL이 일치하지 않습니다."
          }
        }
      }
      else{
        errorJson = {
          error : true,
          message : "해당 ID의 회원이 존재하지 않습니다."
        }
      }
      res.send(JSON.stringify(errorJson));
    });
    //요청에 대한 응답을 전달한 후, 다음으로 넘어가서 실행하고자한다.
    conn.release();
  });
}, setTemporaryPassword)


router.route('/auth/:id')
.get((req, res, next) => {
  console.log('본인인증에 대한 접근입니다.');
  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    conn.query(`
    UPDATE marketerInfo
    SET marketerEmailAuth = 1
    WHERE marketerId = ?`, [req.params.id], function(err, result, fields){
      if(err){
        console.log(err);
      }else{
        console.log('본인인증이 완료되었습니다.');
      }
    });
    conn.release();
  });
  
  res.redirect('http://localhost:3001');
})

router.post('/accountNum', (req, res, next)=>{
  const { creatorId } = req.session.passport.user;
  const { bankName, bankAccount } = req.body;
  const creatorAccountNumber = `${bankName}_${bankAccount}`
  try{
    pool.getConnection(function(err, conn){
      if(err){ 
        conn.release();
        throw new Error(err);
      }
      conn.query(`UPDATE creatorInfo SET creatorAccountNumber = ? WHERE creatorId = ? `, [creatorAccountNumber, creatorId], function(err, result, fields){
        if(err){
          conn.release();
          throw new Error(err); 
        }else{
          console.log('계좌번호 입력이 완료되었습니다.');
          res.end();
          conn.release(); 
        }
      });
    });
  }
  catch (err) {
    console.log(err);
  }
})



module.exports = router;