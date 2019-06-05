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
            conn.release();
            res.send(result);
          } else {
            conn.release();
            res.end();
          }
      });
  }})
})

router.route('/banner').get(function(req, res, next) {
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
      SELECT bannerId, bannerSrc, bannerCategory, date
      FROM bannerRegistered
      WHERE marketerId = ? AND confirmState = ?
      ORDER BY date DESC
      LIMIT 10`;

      const queryArray = [
        marketerId, 1 // 1 is the confirmState of valid banner
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 배너데이터 조회 오류', err);
          } else {
            if (result.length > 0) {
              conn.release();
              res.send(result);
            } else{
              conn.release();
              res.end();
            }
          }
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