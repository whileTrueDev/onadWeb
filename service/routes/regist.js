const express = require('express');
const encrypto = require('../encryption');
const doQuery = require('../model/doQuery');
const pool = require('../model/connectionPool');
const setTemporaryPassword = require('../middlewares/setTemporyPassword');
const logger = require('../middlewares/logger');
const sendEmailAuth = require('../middlewares/sendEmailAuth');


const router = express.Router();

// 쿼리관련 에러 핸들링 완료.
router.post('/marketer', (req, res, next)=>{
  let key, salt;
  [key, salt] = encrypto.make(req.body.marketerRawPasswd);
  let query = `INSERT INTO marketerInfo (marketerId, marketerPasswd, marketerSalt, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum, marketerUserType) VALUES (?, ?, ?, ?, ?, ?, ?, ?) `
  let queryArray = [req.body.marketerId, key, salt, req.body.marketerName, req.body.marketerMail, req.body.marketerPhoneNum, req.body.marketerBusinessRegNum, req.body.marketerUserType]
  doQuery(query, queryArray)
  .then(()=>{
    next();
  })
  .catch((data)=>{
    res.send(data); 
  })
}, sendEmailAuth);

// 쿼리관련 에러 핸들링 완료.
router.post('/checkId', (req, res)=>{
  console.log('checkId로 중복확인 합니다.');
  doQuery(`SELECT marketerId FROM marketerInfo WHERE marketerId = ? `, [req.body.id])
  .then((row)=>{
    const {result} = row;
    if(result[0]){
      //ID가 존재한다.
      res.send(true);
    }
    else{
      res.send(false);
    }
  })
  .catch(()=>{
    res.send(false);
  })
})

// 쿼리관련 에러 핸들링 완료.
router.post('/findId', (req, res)=>{
  let json = {
    error : true,
    message : ''
  };
  doQuery(`SELECT marketerId, marketerName FROM marketerInfo WHERE marketerMail = ? `, [req.body.marketerMail])
  .then((data)=>{
    const { result } = data;
    if(result[0]){
      if(result[0].marketerName === req.body.marketerName){
        json = {
          error : false,
          message : result[0].marketerId
        }
      }else{
        json['message'] = "NAME과 EMAIL이 일치하지 않습니다."
      }
    }else{
      json['message'] =  "입력하신 EMAIL의 회원이 존재하지 않습니다."
    }
    res.send(JSON.stringify(json));
  })
  .catch(()=>{
    json['message'] = 'DB 관련 오류입니다. 본사에 문의하세요.'
    res.send(JSON.stringify(json));
  })
})

// 쿼리관련 에러 핸들링 완료.
router.post('/findPw', (req, res, next)=>{
  let json = {
    error : true,
    message : ''
  };
  doQuery(`SELECT marketerMail FROM marketerInfo WHERE marketerId = ? `, [req.body.marketerId])
  .then((data)=>{
    const { result } = data;
    if(result[0]){  
      if(result[0].marketerMail === req.body.marketerMail){
        next(); 
      }else{
        json['message'] = "ID와 EMAIL이 일치하지 않습니다."
        res.send(JSON.stringify(json));
      }
    }
    else{
      json['message'] = "해당 ID의 회원이 존재하지 않습니다."
      res.send(JSON.stringify(json));
    }
  })
  .catch(()=>{
    json['message'] = 'DB 관련 오류입니다. 본사에 문의하세요.'
    res.send(JSON.stringify(json));
  })
}, setTemporaryPassword)

// 쿼리관련 에러 핸들링 완료.
router.get('/auth/:id', (req, res) => {
  console.log('본인인증에 대한 접근입니다.');
  doQuery(`
  UPDATE marketerInfo
  SET marketerEmailAuth = 1
  WHERE marketerId = ?`, [req.params.id])
  .then(()=>{
    res.redirect('http://localhost:3001');
  })
  .catch(()=>{
    res.redirect('http://localhost:3001');
  })
})

// 크리에이터 마케터 계좌 정보 입력
router.post('/accountNum', (req, res, next)=>{
  const { userType } = req.session.passport.user;
  let userId, query;
  if ( userType === 'creator' ) {
    userId = req.session.passport.user.creatorId;
    query = `UPDATE creatorInfo SET creatorAccountNumber = ? WHERE creatorId = ?`;
  } else {
    userId = req.session.passport.user.userid;
    query = `UPDATE marketerInfo SET marketerAccountNumber = ? WHERE marketerId = ?`;
  }
    
  const { bankName, bankAccount } = req.body;
  const AccountNumber = `${bankName}_${bankAccount}`
  doQuery(query, [AccountNumber, userId])
  .then((data)=>{
    res.send(data);
  })
  .catch((data)=>{
    res.send(data);
  })
})




module.exports = router;