const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// doQuery 수정
router.post('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const infoQuery = `
  SELECT 
  marketerId, marketerName, marketerMail, 
  marketerPhoneNum, marketerBusinessRegNum, marketerUserType, marketerContraction 
  FROM marketerInfo 
  WHERE marketerId = ? `;

  doQuery(infoQuery, [marketerId])
    .then((row) => {
      res.send(row.result[0]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// doQuery 수정
router.post('/change', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { marketerName, marketerMail, marketerPhoneNum } = req.body;
  const updateQuery = `
  UPDATE marketerInfo 
  SET marketerName = ? , marketerMail = ? , marketerPhoneNum = ? 
  WHERE marketerId = ? `;

  doQuery(updateQuery, [marketerName, marketerMail, marketerPhoneNum, marketerId])
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 마케터 계좌정보 조회
router.get('/accountNumber', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const accountQuery = `
  SELECT marketerAccountNumber
  FROM marketerInfo
  WHERE marketerId = ?`;
  doQuery(accountQuery, [marketerId])
    .then((row) => {
      const accountNumber = row.result[0].marketerAccountNumber;
      res.send({
        accountNumber
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({});
    });
});


module.exports = router;
