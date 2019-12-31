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

router.post('/signout', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const deleteQuery = ` UPDATE marketerInfo SET
                        marketerPasswd = null,
                        marketerSalt= null,
                        marketerName= null,
                        marketerMail= null,
                        marketerPhoneNum= null,
                        marketerBusinessRegNum= null,
                        marketerBusinessRegSrc= null,
                        marketerUserType= null,
                        marketerContraction= null,
                        marketerAlarmAgreement= null,
                        marketerEmailAuth= null,
                        date= null,
                        temporaryLogin= null,
                        marketerAccountNumber= null,
                        accountHolder= null,
                        signOutState =2,
                        signOutDate = NOW()
                        WHERE marketerId = ?`;
  doQuery(deleteQuery, marketerId)
    .then(() => {
      console.log(`${marketerId}님 회원탈퇴`);
      res.send(true);
    })
    .catch((err) => { console.log(` 회원탈퇴 에러 : ${err}`); });
  // const moveQuery = `
  // INSERT INTO signOutId SELECT marketerId FROM marketerInfo WHERE marketerId = ?
  // `;
  // const deleteQuery = `SELECT * FROM marketerInfo AS mi
  //                       LEFT JOIN bannerRegistered AS br ON mi.marketerId = br.marketerId
  //                       LEFT JOIN campaign AS cp ON mi.marketerId = cp.marketerId
  //                       WHERE mi.marketerId = ?`;
  // Promise.all(
  //   [doQuery(moveQuery, [marketerId])],
  //   doQuery(deleteQuery, [marketerId])
  // )
  //   .then(() => {
  //     res.send(true);
  //   })
  //   .catch((errorData) => {
  //     console.log(errorData);
  //     res.end();
  //   });
});

// 마케터 계좌정보 조회
// marketerInfo
router.get('/accountNumber', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const accountQuery = `
  SELECT marketerAccountNumber, accountHolder
  FROM marketerInfo
  WHERE marketerId = ?`;
  doQuery(accountQuery, [marketerId])
    .then((row) => {
      const accountNumber = row.result[0].marketerAccountNumber;
      const { accountHolder } = row.result[0];
      res.send({
        accountNumber, accountHolder
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

module.exports = router;
