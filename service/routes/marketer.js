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
            res.send(result[0])
          }
          conn.release();
      });
  }})
})

module.exports = router;