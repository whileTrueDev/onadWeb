const express = require('express');
const doQuery = require('../model/doQuery');

const router = express.Router();

const loginRouter = require('./login/login');
const registRouter = require('./regist/regist');
const dashboardRouter = require('./dashboard/dashboard');
const payRouter = require('./payment/pay');

router.use('/login', loginRouter);
router.use('/regist', registRouter);
router.use('/dashboard', dashboardRouter);
router.use('/pay', payRouter);

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
    console.log(resultList);
    res.send(resultList);
  });
});



module.exports = router;
