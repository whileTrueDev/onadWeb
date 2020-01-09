const express = require('express');
const axios = require('axios');
const doQuery = require('../../../../model/doQuery');
const marketerActionLogging = require('../../../../middlewares/marketerActionLog');
const Notification = require('../../../../middlewares/notification');

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

router.get('/defaultCash', (req, res) => {
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
        console.log(row.result[0].cashAmount)
        res.send(row.result[0].cashAmount.replace(",",""));
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
          switch(object.temporaryState) {
            case 1 :
              object.temporaryState = '완료됨'
              break;
            case 2 :
              object.temporaryState = '취소됨'
              break;
            default :
              object.temporaryState = '진행중'
              break;
          }
          
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

    
    // 우리 DB에서 결제되어야 하는 금액과 실제로 사용자가 입금한 금액 대조하기
    if (parseInt(chargeCash * 1.1) === parseInt(amount)) {

      switch(status) {
        case 'ready' :
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

                      // 가상계좌에 대한 알림 발송
                      Promise.all[Notification(
                        {
                          userType: 'marketer',
                          type: 'vbankChargeReady',
                          targetId: marketerId,
                          params: {
                            cashAmount: amount,
                            vbankName: vbank_name,
                            vbankNum: vbank_num,
                          },
                          vbankDate: vbank_date
                        }
                      )]
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.end();
                  });
              } 
            });
          break;

        case 'paid' :
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
                  console.log(row.result[0].cashAmount)
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
          break;

        default: break;
      }
    } else {
      throw {status: "forgery", message: "위조된 결제시도!!!"}
    }    
  } catch (e) {
    res.status(400).send(e);
  }
});


// "/iamportWebhook"에 대한 웹훅 POST 요청을 처리
router.post('/iamportWebhook', async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body;
    console.log(`/marketer/iamportWebhook - imp_uid: ${imp_uid} | merchant_uid: ${merchant_uid}`);

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

    const marketerDBdata = `
    SELECT marketerId, cash
    FROM marketerCharge
    WHERE imp_uid = ?
    `

    const marketerDBdataArray = [imp_uid]

    doQuery(marketerDBdata, marketerDBdataArray)
    .then((row) => {
      if (!row.error) {
        if (parseInt(Number(row.result[0].cash)*1.1) === parseInt(amount)) {
          const { marketerId, cash } = row.result[0]

          switch(status) {
            case 'paid' : 

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

            // 가상계좌 입금시 기존의 캐시량 + 캐시충전량으로 update
            const vbankDebitUpdateQuery = `
            UPDATE marketerDebit
            SET cashAmount = ? 
            WHERE marketerId = ?`;

            // 가상계좌 입금시 marketerCharge 테이블 temporaryState값 1로 바꾸기 및 date 업뎃
            const vbankChargeUpdateQuery = `
            UPDATE marketerCharge
            SET temporaryState = 1, date = NOW()
            WHERE imp_uid = ?
            `;
            const vbankChargeUpdateArray = [imp_uid]

            doQuery(vbankCurrentDebitQuery, vbankCurrentDebitArray)
            .then((row) => {
              if (!row.error) {
                
                const currentCashAmount = Number(row.result[0].cashAmount);
                
                Promise.all([
                  doQuery(vbankChargeUpdateQuery, vbankChargeUpdateArray),
                  doQuery(vbankDebitUpdateQuery, [currentCashAmount + cash, marketerId]),
                  Notification(
                    {
                      userType: 'marketer',
                      type: 'vbankChargeComplete',
                      targetId: marketerId,
                      params: {
                        cashAmount: amount
                      }
                    }
                  )
                ])
                  .then((secondrow) => {
                    console.log(secondrow)
                    // 마케터 캐시 충전 쿼리 완료
                    if (!secondrow.error) {
                        res.send({ status: 'success', message: '가상계좌 결제 성공!'
                    })
                    .catch((err) => {
                      console.log(err);
                      res.end();
                    });
                  }
                });
              }})

                break;

            case 'cancelled' :
              // 추후 업뎃 예정
              // 금액 다시 떨어뜨리고, temporaryState 2(취소)로 바꾸고, 결제일 Date 바꾸면 됨
              break;
            default: break; 
          }
        } else {
          throw {status: "forgery", message: "위조된 결제시도!!!"}
        }
      }
    }).catch((err) => {
      console.log(err);
      res.end();
    })  
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/vbankCancle', (req, res) => {
  const marketerId = req._passport.session.user.userid;

  const vbankCancleQuery = `
  UPDATE marketerCharge
  SET temporaryState = 2
  WHERE marketerId = ? AND type = ? AND (NOW() > vbankDueDate) AND temporaryState = 0
  `;

  const vbankCancleArray = [marketerId, "vbank"]

  doQuery(vbankCancleQuery, vbankCancleArray)
  .then(() => {
    res.send(true);
  })
});

module.exports = router;
