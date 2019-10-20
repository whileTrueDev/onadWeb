// import
const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();


router.get('/', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const callQuery = `
  SELECT 
    mn.index, title, content,
    date_format(date,'%y년 %m월 %d일') AS dateform,
    readState
  FROM creatorNotification AS mn
  WHERE creatorId = ?
  ORDER BY date DESC, readState ASC`;

  const countQuery = `
    SELECT count(*) as count
    FROM creatorNotification
    WHERE creatorId = ? AND readState = 0`;
  const variableArray = [creatorId];

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
  const { index } = req.body;
  const callQuery = `UPDATE creatorNotification AS cn 
    SET readState = 1
    WHERE cn.index = ${index}`;
  doQuery(callQuery, [index])
    .then(() => {
      res.send(true);
    }).catch((err) => {
      console.log('readState 에러발생');
      console.log(err);
      res.end();
    });
});

router.get('/list', (req, res) => {
  const { creatorId } = req._passport.session.user;
  let dataArray;
  let tmpDataArray;
  const callQuery = `
  SELECT title, content, date_format(date,'%y. %m. %d'), readState
  FROM creatorNotification AS cn
  WHERE creatorId = ?
  ORDER BY readState;
  `;
  doQuery(callQuery, [creatorId])
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
