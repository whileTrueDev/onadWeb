const express = require('express');
const doQuery = require('../../../../model/doQuery');
const encrypto = require('../../../../encryption');

const router = express.Router();

// 마케터 정보 조회
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

// 마케터 정보 변경
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

// 마케터 회원탈퇴
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
      req.logout();
      req.session.destroy(() => {
        console.log(`${marketerId}님 회원탈퇴`);
      });
      res.send(true);
    })
    .catch((err) => { console.log(` 회원탈퇴 에러 : ${err}`); });
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
      const result = row.result[0];
      let accountNumber;
      if (result.marketerAccountNumber) {
        accountNumber = encrypto.decipher(result.marketerAccountNumber);
      } else {
        accountNumber = '';
      }
      result.marketerAccountNumber = accountNumber;
      const { accountHolder } = result;
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

// 마케터 세금계산 정보 조회
router.get('/taxbill', (req, res) => {
  const marketerId = req._passport.session.user.userid;

  const query = `
  SELECT date, cashAmount, state FROM marketerTaxBill
  WHERE marketerId = ?`;

  const queryArray = [marketerId];

  doQuery(query, queryArray).then((row) => {
    const sendArray = [];
    if (!row.error && row.result) {
      row.result.forEach((obj) => {
        const object = obj;

        let taxBillState = '';
        switch (object.state) {
          case 0: taxBillState = '발행대기'; break;
          case 1: taxBillState = '발행완료'; break;
          case 2: taxBillState = '미발행'; break;
          default: throw Error('tax bill state');
        }

        object.state = taxBillState;
        object.cashAmount = object.cashAmount.toString();
        sendArray.push(Object.values(object));
      });
      res.send(sendArray);
    }
  });
});

router.get('/google', (req, res) => {
  const { user } = req._passport.session;
  res.send(user);
});


module.exports = router;
