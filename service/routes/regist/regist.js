const express = require('express');
const axios = require('axios');
const encrypto = require('../../encryption');
const doQuery = require('../../model/doQuery');
const setTemporaryPassword = require('../../middlewares/setTemporyPassword');
const sendEmailAuth = require('../../middlewares/sendEmailAuth');
const config = require('../../config.json');

const HOST = process.env.NODE_ENV === 'production' ? config.production.reactHostName : config.dev.reactHostName;


const router = express.Router();

/* 2019-07-06 박찬우

- 회원가입시 초기화되어야하는 table
  1. marketerInfo
  2. marketerCash
  3. marketerCost

*/
router.post('/marketer', (req, res, next) => {
  const {
    marketerId, marketerName,
    marketerMail, marketerPhoneNum,
    marketerBusinessRegNum, marketerUserType,
    marketerRawPasswd
  } = req.body;
  const [key, salt] = encrypto.make(marketerRawPasswd);

  const infoQuery = `
  INSERT INTO marketerInfo 
  (marketerId, marketerPasswd, marketerSalt, marketerName, marketerMail, 
  marketerPhoneNum, marketerBusinessRegNum, marketerUserType) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;
  const infoQueryArray = [marketerId, key, salt, marketerName, marketerMail,
    marketerPhoneNum, marketerBusinessRegNum, marketerUserType];

  const cashQuery = `
  INSERT INTO marketerDebit
  (marketerId, cashAmount)
  VALUES (?, ?)`;

  Promise.all([
    doQuery(infoQuery, infoQueryArray),
    doQuery(cashQuery, [marketerId, 0]),
  ])
    .then(() => {
      next();
    })
    .catch((error) => {
      res.send([false, error]);
    });
}, sendEmailAuth);

// 쿼리관련 에러 핸들링 완료.
router.post('/checkId', (req, res) => {
  console.log('checkId로 중복확인 합니다.');
  doQuery('SELECT marketerId FROM marketerInfo WHERE marketerId = ? ', [req.body.id])
    .then((row) => {
      const { result } = row;
      if (result[0]) {
      // ID가 존재한다.
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch(() => {
      res.send(false);
    });
});

// 쿼리관련 에러 핸들링 완료.
router.post('/findId', (req, res) => {
  let json = {
    error: true,
    message: ''
  };
  doQuery('SELECT marketerId, marketerName FROM marketerInfo WHERE marketerMail = ? ', [req.body.marketerMail])
    .then((data) => {
      const { result } = data;
      if (result[0]) {
        if (result[0].marketerName === req.body.marketerName) {
          json = {
            error: false,
            message: result[0].marketerId
          };
        } else {
          json.message = 'NAME과 EMAIL이 일치하지 않습니다.';
        }
      } else {
        json.message = '입력하신 EMAIL의 회원이 존재하지 않습니다.';
      }
      res.send(JSON.stringify(json));
    })
    .catch(() => {
      json.message = 'DB 관련 오류입니다. 본사에 문의하세요.';
      res.send(JSON.stringify(json));
    });
});

// 쿼리관련 에러 핸들링 완료.
router.post('/findPw', (req, res, next) => {
  const json = {
    error: true,
    message: ''
  };
  doQuery('SELECT marketerMail FROM marketerInfo WHERE marketerId = ? ', [req.body.marketerId])
    .then((data) => {
      const { result } = data;
      if (result[0]) {
        if (result[0].marketerMail === req.body.marketerMail) {
          next();
        } else {
          json.message = 'ID와 EMAIL이 일치하지 않습니다.';
          res.send(JSON.stringify(json));
        }
      } else {
        json.message = '해당 ID의 회원이 존재하지 않습니다.';
        res.send(JSON.stringify(json));
      }
    })
    .catch(() => {
      json.message = 'DB 관련 오류입니다. 본사에 문의하세요.';
      res.send(JSON.stringify(json));
    });
}, setTemporaryPassword);

// 쿼리관련 에러 핸들링 완료.
router.get('/auth/:id', (req, res) => {
  console.log('본인인증에 대한 접근입니다.');
  doQuery(`
  UPDATE marketerInfo
  SET marketerEmailAuth = 1
  WHERE marketerId = ?`, [req.params.id])
    .then(() => {
      res.redirect(HOST);
    })
    .catch(() => {
      res.redirect(HOST);
    });
});

// 크리에이터 마케터 계좌 정보 입력
router.post('/accountNum', (req, res, next) => {
  const { userType } = req.session.passport.user;
  let userId; let
    query;
  if (userType === 'creator') {
    userId = req.session.passport.user.creatorId;
    query = 'UPDATE creatorInfo SET creatorAccountNumber = ? WHERE creatorId = ?';
  } else {
    userId = req.session.passport.user.userid;
    query = 'UPDATE marketerInfo SET marketerAccountNumber = ? WHERE marketerId = ?';
  }

  const { bankName, bankAccount } = req.body;
  const AccountNumber = `${bankName}_${bankAccount}`;
  doQuery(query, [AccountNumber, userId])
    .then((data) => {
      res.send(data);
    })
    .catch((data) => {
      res.send(data);
    });
});


router.get('/account', (req, res) => {
  axios.get('https://testapi.open-platform.or.kr/oauth/2.0/authorize',
    {
      params: {
        response_type: 'code',
        client_id: 'ONAD',
        redirect_uri: 'http://localhost:3000/api/regist/account/callback',
        scope: 'login transfer inquiry',
        client_info: 'OVGY8ObRgN6Glqqc9A0T1nAcQ4CXgBaEKKUCGx8c',
        auth_type: 0
      }
    })
    .then((row) => {
      console.log(row);
      console.log('요청완료');
    })
    .catch((errorData) => {
      console.log(errorData);
    });
});

router.get('/account/callback', (req, res) => {
  console.log('콜백');
  console.log(req.body);
  res.send('');
});

module.exports = router;
