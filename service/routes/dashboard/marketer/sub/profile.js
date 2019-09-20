const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// 유저정보 조회
// marketerInfo
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const infoQuery = `
  SELECT 
  marketerId, marketerName, marketerMail, 
  marketerPhoneNum, marketerBusinessRegNum,
  marketerUserType, marketerContraction
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

// 유저 정보 변경
// marketerInfo
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
// marketerInfo
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

// 등록된 사업자 등록증 스캔본 조회
// marketerInfo
router.get('/business', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const businessRegiQuery = `
  SELECT marketerBusinessRegNum, marketerBusinessRegSrc
  FROM marketerInfo
  WHERE marketerId = ?`;
  doQuery(businessRegiQuery, [marketerId])
    .then((row) => {
      if (!row.error && row.result.length > 0) {
        res.send(row.result[0]);
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({});
    });
});


// 사업자 등록증 스캔본 업로드
// marketerInfo
router.post('/business/upload', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const businessRegistrationImageSrc = req.body.imageUrl;

  const businessRegiQuery = `
  UPDATE marketerInfo
  SET marketerBusinessRegSrc = ?
  WHERE marketerId = ?`;
  const businessRegiArray = [businessRegistrationImageSrc, marketerId];

  doQuery(businessRegiQuery, businessRegiArray)
    .then((row) => {
      if (!row.error) {
        res.send([true, '등록되었습니다.']);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

//
// 세금계산서 데이터 등록
router.post('/taxbill', (req, res) => {
  // 회사명, (회사주소, 업태, 업종, 사업자등록번호, 이메일 주소(세금계산서를 모으는 메일이 따로있을 수 있으므로 메일주소를 입력받아야 함)
  const marketerId = req._passport.session.user.userid;
  const { email } = req.body;
  console.log(req.body);

  const query = `
  INSERT INTO marketerTaxBill
  (marketerId, state, receivingMail)
  VALUES( ?, ?, ? )
  `;
  const array = [marketerId, 0, email];
  doQuery(query, array)
    .then((row) => {
      if (!row.error && row.result) {
        res.send([true, '등록되었습니다.']);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

module.exports = router;
