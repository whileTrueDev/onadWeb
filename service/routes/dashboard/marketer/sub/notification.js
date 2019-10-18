// import
const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();


router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const callQuery = `
  SELECT 
    mn.index, title, content,
    date_format(date,'%y년 %m월 %d일') AS dateform,
    readState
  FROM marketerNotification AS mn
  WHERE marketerId = ?
  ORDER BY date DESC, readState ASC`;

  const countQuery = `
    SELECT count(*) as count
    FROM marketerNotification
    WHERE marketerId = ? AND readState = 0`;
  const variableArray = [marketerId];

  const result = { notifications: [{}], unReadCount: 0 };
  doQuery(callQuery, variableArray)
    .then((data) => {
      result.notifications = data.result;
      doQuery(countQuery, variableArray).then((row) => {
        if (row.result) {
          const { count } = row.result[0];
          result.unReadCount = count;
        }
        res.send(result);
      });
    })
    .catch((err) => {
      console.log('notification error - ', err);
      res.end();
    });
});

router.post('/update/read', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { index } = req.body;
  const callQuery = `
  UPDATE marketerNotification
  SET readState = 1
  WHERE marketerNotification.index = ? AND marketerId = ?`;
  doQuery(callQuery, [index, marketerId])
    .then(() => {
      res.send([true]);
    }).catch((err) => {
      console.log('readState 에러발생');
      console.log(err);
      res.end();
    });
});

router.get('/list', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  let dataArray;
  let tmpDataArray;
  const callQuery = `ㅔ
  SELECT title, content, date_format(date,'%y-%m-%d %H:%i'), readState
  FROM marketerNotification AS mn
  WHERE marketerId = ?
  ORDER BY readState;
  `;
  doQuery(callQuery, [marketerId])
    .then((data) => {
      dataArray = data.result.map(value => Object.values(value));
      tmpDataArray = dataArray;
      tmpDataArray.map((value, index) => {
        let tmpValue = value;
        if (value[3] === 0) {
          tmpValue = '안읽음';
        } else if (value[3] === 1) {
          tmpValue = '읽음';
        }
        dataArray[index][3] = tmpValue;
        return false;
      });
      res.send(dataArray);
    })
    .catch((err) => {
      console.log('notification list error - ', err);
      res.end();
    });
});

module.exports = router;
