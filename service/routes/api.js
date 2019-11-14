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

module.exports = router;
