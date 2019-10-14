// import
const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();


router.get('/', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const callQuery = `
  SELECT cn.index, title, content, date_format(date,'%y-%m-%d %H:%i') AS dateform
  FROM creatorNotification AS cn
  WHERE creatorId = ?
  AND readState = 0`;
  doQuery(callQuery, [creatorId])
    .then((data) => {
      res.send(data.result);
    })
    .catch((err) => {
      console.log('notification error - ', err);
      res.end();
    });
});

router.get('/count', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const callQuery = `SELECT count(*) as count
  FROM creatorNotification 
  WHERE creatorId = ? AND readState = 0`;
  doQuery(callQuery, creatorId)
    .then((data) => {
      if (!data.error && data.result.length > 0) {
        res.send(data.result[0]);
      }
    })
    .catch(() => {
      res.send(false);
    });
});

router.post('/readState', (req, res) => {
  const { creatorId } = req._passport.session.user;
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
  SELECT title, content, date_format(date,'%y-%m-%d %H:%i'), readState
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
