const express = require('express');
const doQuery = require('../model/doQuery');
const axios = require('axios');
const router = express.Router();
const Notification = require('../middlewares/notification');
const loginRouter = require('./login/login');
const registRouter = require('./regist/regist');
const dashboardRouter = require('./dashboard/dashboard');
const payRouter = require('./payment/pay');
const socketRouter = require('./socket/socket');

router.use('/login', loginRouter);
router.use('/regist', registRouter);
router.use('/dashboard', dashboardRouter);
router.use('/pay', payRouter);
router.use('/socket', socketRouter);

const getStreamerList = () => {
  const currentTimeQuery = `
  SELECT date 
  FROM campaignTimestamp 
  ORDER BY date DESC 
  LIMIT 1`;

  const streamerQuery = `
  SELECT campaignId, creatorId
  FROM campaignTimestamp
  WHERE date > ? `;

  return new Promise((resolve, reject) => {
    doQuery(currentTimeQuery)
      .then((row) => {
        const { date } = row.result[0];
        date.setMinutes(date.getMinutes() - 5);
        return date;
      })
      .then((time) => {
        doQuery(streamerQuery, [time])
          .then((inrow) => {
            if (!inrow.error) {
              resolve(inrow.result);
            } else {
              resolve([]);
            }
          })
          .catch((errorData) => {
            errorData.point = 'getStreamerList()';
            errorData.description = '최신 streamerId을 구하는 과정';
            reject(errorData);
          });
      })
      .catch((errorData) => {
        errorData.point = 'getStreamerList()';
        errorData.description = 'twitchStreamDetail의 최신 time을 구하는 과정';
        reject(errorData);
      });
  });
};

router.get('/creators', async (req, res) => {
  const creatorList = await getStreamerList();
  res.send(creatorList);
});

// 계약되어있는 크리에이터인지 확인된 리스트
router.route('/streams').get((req, res) => {
  const date = new Date();
  // date.setHours(date.getHours() + 9);
  date.setMinutes(date.getMinutes() - 10);
  // const selectQuery = `
  // SELECT creatorTwitchId
  // FROM creatorInfo as CI
  // JOIN
  // (SELECT streamerName
  //   FROM twitchStreamDetail
  //   WHERE time > ?) as A
  //   ON CI.creatorName = A.streamerName
  //   WHERE creatorContractionAgreement  = 1`;
  // 현재방송중이면서, 배너를 띄우고있는 스트리머 (시청자 많은 순)
  const selectQuery = `SELECT creatorTwitchId
  FROM creatorInfo as CI
  LEFT JOIN
  (SELECT streamerName, viewer
  FROM twitchStreamDetail
  WHERE time > ?
  GROUP BY streamerName) as A
  ON CI.creatorName = A.streamerName
  JOIN (
  SELECT creatorId FROM campaignTimestamp
  WHERE date > ?
  ) AS B ON CI.creatorId = B.creatorId
  WHERE creatorContractionAgreement  = 1
  ORDER BY viewer DESC`;
  doQuery(selectQuery, [date, date]).then((row) => {
    const retultList = row.result.map(creator => creator.creatorTwitchId);
    const resultList = retultList.slice(0, 10);
    res.send(resultList);
  });
});

// "/iamportWebhook"에 대한 웹훅 POST 요청을 처리(얘는 무조건 여기에 위치해야함 지우지 마셈!)
router.post('/iamportWebhook', async (req, res) => {
  try {
    const { imp_uid, merchant_uid} = req.body;
    const webhookStatus = req.body.status;
    console.log(`/api/iamportWebhook - imp_uid: ${imp_uid} | merchant_uid: ${merchant_uid} | status: ${webhookStatus}`);

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
        const cash = row.result[0].cash;
        if (parseInt(Number(cash)*1.1) === parseInt(Number(amount))) {
          const { marketerId } = row.result[0]

          switch(webhookStatus) {
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
            .then((secondrow) => {
              if (!secondrow.error) {
                const currentCashAmount = Number(secondrow.result[0].cashAmount);
                
                Promise.all([
                  doQuery(vbankChargeUpdateQuery, vbankChargeUpdateArray),
                  doQuery(vbankDebitUpdateQuery, [currentCashAmount + cash, marketerId]),
                  Notification(
                    {
                      userType: 'marketer',
                      type: 'vbankChargeComplete',
                      targetId: marketerId,
                      params: {
                        cashAmount: cash
                      }
                    }
                  )
                ]).then((thirdrow) => {
                  // 마케터 캐시 충전 쿼리 완료
                  if (!thirdrow.error) {
                    res.send({ status: 'success', message: '가상계좌 결제 성공!'});
                    console.log('가상계좌 입금 완료!')
                  }
                  }).catch((err) => {
                    console.log(err);
                    res.end();
                    });;
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
    console.log('가상계좌 결제 완료 실패')
  }
});


// socket과 통신할 router를 하나 만들자.

module.exports = router;
