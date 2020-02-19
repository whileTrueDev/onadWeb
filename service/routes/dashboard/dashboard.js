// import
const express = require('express');
const doQuery = require('../../model/doQuery');
const creatorRouter = require('./creator/creator');
const marketerRouter = require('./marketer/marketer');

const router = express.Router();
router.use((req, res, next) => {
  if (req && req._passport && req._passport.session
    && req._passport.session.user) {
    next();
  } else {
    res.send('session not exists');
  }
});

router.use('/creator', creatorRouter);
router.use('/marketer', marketerRouter);

router.get('/checkUserType', (req, res) => {
  if (req && req._passport && req._passport.session
    && req._passport.session.user) {
    res.send({ userType: req._passport.session.user.userType });
  }
});

router.get('/notice', (req, res) => {
  const query = `
  SELECT code, topic, title, contents, regiDate
  FROM publicNotice
  ORDER BY code DESC
  `;

  doQuery(query)
    .then((rows) => {
      if (!rows.error) {
        res.send(rows.result);
      }
    })
    .catch((err) => {
      console.log('/notice ERROR - ', err);
      res.end();
    });
});

function getQuery(userType) {
  switch (userType) {
    case 'marketerSelect': {
      return (`SELECT noticeReadState 
                FROM marketerInfo 
                WHERE marketerId = ?`); }
    case 'creatorSelect': {
      return (`SELECT noticeReadState 
                FROM creatorInfo 
                WHERE creatorId = ?`); }
    case 'marketerUpdate': {
      return (`UPDATE marketerInfo
                SET noticeReadState = 1
                WHERE marketerId = ?`); }
    case 'creatorUpdate': {
      return (`UPDATE creatorInfo
                SET noticeReadState = 1
                WHERE creatorId = ?`); }
    default: { return ''; }
  }
}

router.get('/noticereadstate', (req, res) => {
  const userType = req.query.type;
  let userId;

  if (userType === 'marketer') {
    userId = req._passport.session.user.userid;
  } else { userId = req._passport.session.user.creatorId; }

  const query = getQuery(`${userType}Select`);
  doQuery(query, userId)
    .then((row) => {
      if (!row.error) {
        res.send(row.result[0]);
      }
    })
    .catch((err) => {
      console.log('/noticereadstate ERROR - ', err);
      res.end();
    });
});

router.post('/noticereadstateupdate', (req, res) => {
  const { userType } = req.body;
  let userId;
  console.log({ userType });
  if (userType === 'marketer') {
    userId = req._passport.session.user.userid;
  } else { userId = req._passport.session.user.creatorId; }

  const query = getQuery(`${userType}Update`);
  doQuery(query, userId)
    .then((row) => {
      if (!row.error) {
        res.send([true, '공지사항 확인 완료']);
      }
    })
    .catch((err) => {
      console.log('/noticereadcheck ERROR - ', err);
      res.end();
    });
});

module.exports = router;
