const express = require('express');
const pool = require('../model/connectionPool');
const preprocessing = require('../middlewares/preprocessingData/');
const router = express.Router();

/**
 * **********************************
 *  Marketer Routes
 * **********************************
 */

router.route('/cash').get(function(req, res, next) {
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
      SELECT marketerDebit, date
      FROM marketerCost
      WHERE marketerId = ?
      ORDER BY date DESC
      LIMIT 1`;

      const queryArray = [
        marketerId
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 광고캐시 조회 오류', err);
          }
          if (result.length > 0) {
            console.log(result[0]);
            conn.release();
            res.send(result[0]);
          }
          //conn.release();
      });
  }})
})

router.post('/info', (req, res, next)=> {
  const marketerId = req._passport.session.user.userid;
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send(err);
    }
    conn.query(`SELECT marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum, marketerUserType FROM marketerInfo WHERE marketerId = ? `, [marketerId], (err, result)=>{
      conn.release();
      res.send(result[0]);
    })
  })
})

router.post('/info/change', (req, res, next)=> {
  const marketerId = req._passport.session.user.userid;
  const {marketerName, marketerMail, marketerPhoneNum} = req.body;
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send(err);
    }
    conn.query(`UPDATE marketerInfo SET marketerName = ? , marketerMail = ? , marketerPhoneNum = ? WHERE marketerId = ? `, [marketerName, marketerMail, marketerPhoneNum, marketerId], (err, result)=>{
      conn.release();
      res.send(false);
    })
  })
})

module.exports = router;