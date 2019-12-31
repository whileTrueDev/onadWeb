const express = require('express');
const axios = require('axios');
const doQuery = require('../../../../model/doQuery');
const marketerActionLogging = require('../../../../middlewares/marketerActionLog');

const router = express.Router();

// 특정 마케터의 광고캐시 조회
// marketerDebit
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const debitQuery = `
  SELECT FORMAT(cashAmount, 0) as cashAmount,
    DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date
  FROM marketerDebit
  WHERE marketerId = ?
  ORDER BY date DESC
  LIMIT 1`;

  doQuery(debitQuery, [marketerId])
    .then((row) => {
      if (!row.error) {
        res.send(row.result[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 마케터 캐시 충전
// marketerDebit, marketerCharge
router.post('/charge', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const chargeCash = Number(req.body.chargeCash);
  const { chargeType } = req.body;
  console.log(`/marketer/charge - id: ${marketerId} | amount: ${chargeCash}`);

  const currentDebitQuery = `
    SELECT cashAmount as cashAmount
    FROM marketerDebit
    WHERE marketerId = ?
    ORDER BY date DESC
    LIMIT 1
    `;
  const currentDebitArray = [marketerId];

  const cashChargeInsertQuery = `
  INSERT INTO marketerCharge
  (marketerId, cash, type)
  VALUES (?, ?, ?)
  `;
  const cashChargeArray = [marketerId, chargeCash, chargeType];

  // 충전시 기존의 캐시량 + 캐시충전량으로 update
  const debitUpdateQuery = `
  UPDATE marketerDebit
  SET cashAmount = ?
  WHERE marketerId = ?`;

  /** ********************
   * api call 및 캐시충전 처리 필요
   * ******************* */

  doQuery(currentDebitQuery, currentDebitArray)
    .then((row) => {
      if (!row.error) {
        let currentCashAmount = 0;
        if (row.result[0]) { // 기존에 marketerDebit에 데이터가 있는 경우
          currentCashAmount = Number(row.result[0].cashAmount);
        }

        // 마케터 활동내역 테이블 : 캐시 충전 상태값
        // const MARKETER_ACTION_LOG_TYPE = 1;
        Promise.all([
          doQuery(cashChargeInsertQuery, cashChargeArray),
          // doQuery(debitUpdateQuery, [currentCashAmount + chargedCash, marketerId])

          // 마케터 활동내역 테이블 : 마케터 캐시 충전 상태값
          // marketerActionLogging([marketerId, MARKETER_ACTION_LOG_TYPE,
          //   JSON.stringify({
          //     chargeCash
          //   })])
        ])
          .then((secondrow) => {
            // 마케터 캐시 충전 쿼리 완료
            if (!secondrow.error) {
              res.send([true, secondrow.result]);
            }
          })
          .catch((err) => {
            /** ****************
             * 쿼리 오류시 처리 필요
             * *************** */

            console.log(err);
            res.end();
          });
      }
    });
});

// 마케터 캐시 환불 신청.
// marketerRefund
router.post('/refund', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const refundCash = Number(req.body.withdrawCash);
  console.log(`/marketer/refund - id: ${marketerId} | amount: ${refundCash}`);

  let withFeeRefundCash;
  if (refundCash < 10000) {
    withFeeRefundCash = refundCash - 1000;
  } else {
    withFeeRefundCash = refundCash * 0.9;
  }

  // 현재 마케터의 캐시 보유량 조회
  const currentDebitQuery = `
  SELECT cashAmount as cashAmount
  FROM marketerDebit
  WHERE marketerId = ?
  ORDER BY date DESC
  LIMIT 1`;
  const currentDebitArray = [marketerId];

  // 마케터 캐시 보유량 수정 ( 환불진행한 만큼 차감 )
  const debitUpdateQuery = `
  UPDATE marketerDebit
  SET cashAmount = ?
  WHERE  marketerId = ?`;

  // 환불 내역에 데이터 적재
  const refundHistoryInsertQuery = `
  INSERT INTO marketerRefund
  (marketerId, cash, marketerRefund.check)
  VALUES (?, ?, ?)`;
  const refundHistoryInsertArray = [marketerId, Number(withFeeRefundCash), 0];

  const MARKETER_ACTION_LOG_TYPE = 9;

  doQuery(currentDebitQuery, currentDebitArray)
    .then((row) => {
      if (!row.error) {
        if (row.result[0]) {
          const currentCashAmount = Number(row.result[0].cashAmount);
          Promise.all([
            doQuery(refundHistoryInsertQuery, refundHistoryInsertArray),
            doQuery(debitUpdateQuery, [currentCashAmount - refundCash, marketerId]),
            // 마케터 활동내역 로깅 테이블 :환불 신청 적재
            marketerActionLogging([marketerId,
              MARKETER_ACTION_LOG_TYPE,
              JSON.stringify({ refundCash })])
          ])
            .then((secondrow) => {
            // 마케터 캐시 환불 쿼리 완료
              if (!secondrow.error) {
                res.send([true, secondrow.result]);
              }
            })
            .catch((err) => {
            /** ****************
             * 쿼리 오류시 처리 필요
             * *************** */

              console.log(err);
              res.end();
            });
        }
      }
    });
});

// 마케터 광고캐시 충전 내역 리스트
// { columns: ['날짜', '충전금액', '결제수단'], data: [ [ '19년 07월 06일', '10000', '계좌이체'], [] ] }
router.get('/charge/list', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const selectQuery = `
  SELECT 
    DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date,
    FORMAT(ROUND(cash), 0) as cash, type, temporaryState
  FROM marketerCharge
  WHERE marketerId = ? 
  ORDER BY date DESC`;
  const selectArray = [marketerId];

  doQuery(selectQuery, selectArray)
    .then((row) => {
      if (!row.error) {
        const sendArray = [];
        row.result.forEach((obj) => {
          const object = obj;
          object.cash = String(obj.cash);
          if (object.type === 'vbank') {
            object.type = '가상계좌'
          } else if (object.type === 'trans') {
            object.type = '계좌이체'
          } else if (object.type === 'card'){
            object.type = '신용카드'
          }
          object.temporaryState = object.temporaryState === 0 ? '진행중' : '완료됨';
          sendArray.push(Object.values(object));
        });
        const result = {
          data: sendArray
        };
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 마케터 광고캐시 환불 내역 리스트
// { columns: [ '날짜', '환불금액' '환불상태' ], data: [ [ '19년 07월 06일', '0', '0', '진행중' ], [] ] }
router.get('/refund/list', (req, res) => {
  // marketerID 가져오기
  const marketerId = req._passport.session.user.userid;
  const selectQuery = `
  SELECT 
    DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date,
    FORMAT(cash, 0) as cash, marketerRefund.check
  FROM marketerRefund
  WHERE marketerId = ?
  ORDER BY date DESC`;
  const selectArray = [marketerId];

  doQuery(selectQuery, selectArray)
    .then((row) => {
      if (!row.error) {
        const sendArray = [];
        row.result.forEach((obj) => {
          const object = obj;
          object.check = object.check === 0 ? '진행중' : '완료됨';
          sendArray.push(Object.values(object));
        });

        const result = {
          data: sendArray
        };

        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 마케터 광고 캐시 소진 내역
// { columns: ['날짜', '소진금액', '세금계산서 발행 여부'], data: [ [], [] ] }
router.get('/usage', (req, res) => {
  const marketerId = req._passport.session.user.userid;

  const selectQuery = `
  SELECT
    DATE_FORMAT(cl.date, "%y년 %m월") as date,
    FORMAT(sum(cashFromMarketer), 0) as cash,
    state
  FROM campaignLog AS cl
  JOIN marketerTaxBill AS mtb
  ON SUBSTRING_INDEX(cl.campaignId, '_', 1) = mtb.marketerId
  AND DATE_FORMAT(cl.date, "%y%m") = DATE_FORMAT(mtb.date, "%y%m") 
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
  GROUP BY month(cl.date)
  ORDER BY cl.date DESC
  `;
  const selectArray = [marketerId];

  doQuery(selectQuery, selectArray)
    .then((row) => {
      if (!row.error) {
        if (row.result) {
          const sendArray = [];
          row.result.forEach((obj) => {
            const object = obj;
            switch (object.state) {
              case 0: { object.state = '발행대기'; break; }
              case 1: { object.state = '발행완료'; break; }
              case 2: { object.state = '미발행'; break; }
              default: break;
            }
            sendArray.push(Object.values(obj));
          });

          res.send({
            data: sendArray
          });
        }
      }
    })
    .catch((err) => {
      console.log('/usage', err);
      res.end();
    });
});

// 마케터 광고 캐시 소진 내역 - 월별
router.get('/usage/month', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { month } = req.query; // ex) 19년 09월

  const selectQuery = `
  SELECT
    DATE_FORMAT(cl.date, "%y년 %m월 %d일") as date,
    FORMAT(sum(cashFromMarketer), 0) as cash, type
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
  AND DATE_FORMAT(cl.date, "%y년 %m월") = ?
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC

  `;
  const selectArray = [marketerId, month];

  const selectMetaQuery = `
  SELECT
    type, FORMAT(sum(cashFromMarketer), 0) as cash
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
  AND DATE_FORMAT(cl.date, "%y년 %m월") = ?
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월"), type
  ORDER BY type DESC
  `;
  const selectMetaArray = [marketerId, month];

  const sendArray = [];
  const sendMetaArray = [];
  Promise.all([
    doQuery(selectQuery, selectArray)
      .then((row) => {
        if (!row.error) {
          if (row.result) {
            row.result.forEach((obj) => {
              sendArray.push(Object.values(obj));
            });
          }
        }
      }),
    doQuery(selectMetaQuery, selectMetaArray)
      .then((row) => {
        if (!row.error) {
          if (row.result) {
            row.result.forEach((obj) => {
              sendMetaArray.push(Object.values(obj));
            });
          }
        }
      })
  ])
    .then(() => {
      res.send({ data: sendArray, metaData: sendMetaArray });
    })
    .catch((err) => {
      console.log('/usage', err);
      res.end();
    });
});

// 마케터 캐시 충전 전자결제
// marketerDebit, marketerCharge
router.post('/testcharge', async (req, res) => {
  try {
    const marketerId = req._passport.session.user.userid;
    const chargeCash = Number(req.body.chargeCash);
    const { chargeType, imp_uid, merchant_uid } = req.body;
    console.log(`/marketer/charge - id: ${marketerId} | amount: ${chargeCash} | chargeType: ${chargeType} | imp_uid: ${imp_uid} | merchant_uid: ${merchant_uid}`);

    // 결제시스템의 액세스 토큰(access token) 발급 받기 => 결제 위변조를 대조 용도도 포함
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: '2306149701563593', // REST API키 => import 관리자 페이지에 있음
        imp_secret: 'Oc6uNyT5UYJ1oGNoQn6aV3xZ5AdJeGJ2TPwGnqMipvkNc7c2uicqlKprlCbzjUBcK8T8yFqXbKLoSXqn' // REST API Secret => import 관리자 페이지에 있음
      }
    });

    const { access_token } = getToken.data.response; // 접속 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: 'get',
      headers: { Authorization: access_token } // 인증 토큰 Authorization header에 추가
    });

    const paymentData = getPaymentData.data.response; // 조회한 결제 정보를 들고 있는 변수

    const { amount, status } = paymentData; // 실제로 사용자가 전송한 금액과 그 상태
    console.log( status )
    console.log(paymentData)
    // 우리 DB에서 결제되어야 하는 금액과 실제로 사용자가 입금한 금액 대조하기
    if (parseInt(chargeCash * 1.1) === parseInt(amount)) {

      if (status === "ready") {
          // 가상계좌 발급 시 로직
          // DB에 가상계좌 발급 정보 저장
          const { vbank_num, vbank_date, vbank_name, vbank_holder } = paymentData;

          // 현재 마케터 보유 금액 조회
          const vbankCurrentDebitQuery = `
          SELECT cashAmount as cashAmount
          FROM marketerDebit
          WHERE marketerId = ?
          ORDER BY date DESC
          LIMIT 1
          `;
  
          // 현재 마케터 보유 금액 조회
          const vbankCurrentDebitArray = [marketerId];
  
          // 충전 금액 row 한 줄 추가
          const vbankCashChargeInsertQuery = `
          INSERT INTO marketerCharge
          (marketerId, cash, type, merchant_uid, imp_uid, temporaryState, vbanknum, vbankDueDate, vbankName)
          VALUES (?, ?, ?, ?, ?, 0, ?, (SELECT FROM_UNIXTIME(${vbank_date}, "%Y-%m-%d %h:%i:%s")), ? )
          `;
  
          // 충전 금액 row 한 줄 추가
          const vbankCashChargeArray = [marketerId, chargeCash, chargeType, merchant_uid, imp_uid, vbank_num, vbank_name ] ;
          
          doQuery(vbankCurrentDebitQuery, vbankCurrentDebitArray)
            .then((row) => {
              if (!row.error) {
                let currentCashAmount = 0;
                if (row.result[0]) { // 기존에 marketerDebit에 데이터가 있는 경우
                  currentCashAmount = Number(row.result[0].cashAmount);
                }
                  doQuery(vbankCashChargeInsertQuery, vbankCashChargeArray)
                  .then((secondrow) => {
                    // 마케터 캐시 충전 쿼리 완료
                    if (!secondrow.error) {
                      res.send({ status: 'vbankIssued',
                      vbank_num: `${vbank_num}`, vbank_date: `${vbank_date}`,
                      vbank_name: `${vbank_name}`, vbank_holder: `${vbank_holder}`,
                      });

                      // 알림 넣기 기능 쿼리 넣기
                      // 잊지말고 알림기능 넣어야 한다.
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.end();
                  });
              } 
            });
          } else {
          // 계좌이체 및 신용카드 결제 로직
          // 현재 마케터 보유 캐시량 조회
          const currentDebitQuery = `
          SELECT cashAmount as cashAmount
          FROM marketerDebit
          WHERE marketerId = ?
          ORDER BY date DESC
          LIMIT 1
          `;
          // 현재 마케터 보유 캐시량 조회
          const currentDebitArray = [marketerId];
  
          // 신용카드 및 계좌이체로 row 한줄 생성
          const cashChargeInsertQuery = `
          INSERT INTO marketerCharge
          (marketerId, cash, type, merchant_uid, imp_uid, temporaryState)
          VALUES (?, ?, ?, ?, ?, 1)
          `;

          // 신용카드 및 계좌이체로 row 한줄 생성
          const cashChargeArray = [marketerId, chargeCash, chargeType, merchant_uid, imp_uid];
  
          // 충전시 기존의 캐시량 + 캐시충전량으로 바로 update
          const debitUpdateQuery = `
          UPDATE marketerDebit
          SET cashAmount = ? 
          WHERE marketerId = ?`;
  
          doQuery(currentDebitQuery, currentDebitArray)
            .then((row) => {
              if (!row.error) {
                let currentCashAmount = 0;
                if (row.result[0]) { // 기존에 marketerDebit에 데이터가 있는 경우
                  currentCashAmount = Number(row.result[0].cashAmount);
                }
                Promise.all([
                  doQuery(cashChargeInsertQuery, cashChargeArray),
                  doQuery(debitUpdateQuery, [currentCashAmount + chargeCash, marketerId])
                ])
                  .then((secondrow) => {
                    console.log(secondrow)
                    // 마케터 캐시 충전 쿼리 완료
                    if (!secondrow.error) {
                      res.send({ status: 'success', message: '일반 결제 성공' });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.end();
                  });
              }
            });
          }
    } else {
      throw {status: "forgery", message: "위조된 결제시도!!!"}
    }    
  } catch (e) {
    res.status(400).send(e);
  }
});


// "/iamport-webhook"에 대한 POST 요청을 처리
router.post('/iamport-webhook', async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출

    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: '2306149701563593', // REST API키
        imp_secret: 'Oc6uNyT5UYJ1oGNoQn6aV3xZ5AdJeGJ2TPwGnqMipvkNc7c2uicqlKprlCbzjUBcK8T8yFqXbKLoSXqn' // REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: { Authorization: access_token } // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보

    // DB에서 결제되어야 하는 금액 조회
    const order = await Orders.findById(paymentData.merchant_uid);
    const amountToBePaid = order.amount; // 결제 되어야 하는 금액

    // 결제 검증하기
    const { amount, status } = paymentData;
    if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
      switch (status) {
        case 'ready': // 가상계좌 발급
          // DB에 가상계좌 발급 정보 저장
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          await Users.findByIdAndUpdate('/* 고객 id */', { $set: { vbank_num, vbank_date, vbank_name } });
          // 가상계좌 발급 안내 문자메시지 발송
          SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}` });
          res.send({ status: 'vbankIssued', message: '가상계좌 발급 성공' });
          break;
        case 'paid': // 결제 완료
          res.send({ status: 'success', message: '일반 결제 성공' });
          break;
      }
    } else { // 결제 금액 불일치. 위/변조 된 결제
      throw { status: 'forgery', message: '위조된 결제시도' };
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
