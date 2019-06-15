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

router.get('/banner',function(req, res, next) {
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

// bannner manage page banner list 가져오기 위한 query
router.get('/banner/all',(req, res, next)=>{
  const marketerId = req._passport.session.user.userid;
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      res.send([null, err]);
    } else {
      const queryState = `
      SELECT bannerId, bannerSrc, bannerCategory, date, confirmState, bannerDenialReason
      FROM bannerRegistered
      WHERE marketerId = ?
      ORDER BY date DESC`;
      conn.query(queryState, [marketerId], function(err, result, fields){
        if(err){
          conn.release();
          res.send([null, err]);
        }
        else{
          conn.release();
          res.send([true, result]);
        }
      })
    }
  })
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

router.post('/banner/delete', (req, res, next)=>{
  const {bannerId} = req.body;
  console.log(bannerId);
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send([null, err]);
    }
    conn.query(`DELETE FROM bannerRegistered WHERE bannerId = ? `, [bannerId], (err, result)=>{
      conn.release();
      res.send([true, '배너가 성공적으로 삭제되었습니다.']);
    })
  })
})


router.post('/banner/push', (req, res, next)=>{
  const marketerId = req._passport.session.user.userid;
  //console.log(req.body);
  const bannerSrc = req.body.url;
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send([null, err]);
    }
    conn.query(`SELECT 
    bannerId 
    FROM bannerRegistered 
    WHERE marketerId = ?  
    ORDER BY date DESC
    LIMIT 1`, [marketerId], (err, result)=>{
      if(err){
        console.log(err);
        conn.release();
        res.send([null, err]);
      }
      //등록된 배너가 존재할 경우
      if(result){
        var count =  parseInt(result[0].bannerId.split('_')[1]) + 1;
        if (count < 10){
          count = '0'+`${count}`;
        }
      }else{
        const count = '01';
      }
      const bannerId = `${marketerId}_${count}`
      conn.query(`INSERT 
      INTO bannerRegistered 
      (bannerId, marketerId, bannerSrc) 
      VALUES (?, ?, ?)
      `, [bannerId, marketerId, bannerSrc], (err, result)=>{
        if(err){
          console.log(err);
          conn.release();
          res.send([null, err]);
        }else{
          conn.release();
          res.send([true, '배너가 등록되었습니다.']);
        }
      })
    })
  })
})


module.exports = router;