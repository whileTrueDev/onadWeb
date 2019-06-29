const express = require('express');
const pool = require('../model/connectionPool');

var router = express.Router();

/* POST register page */
router.route('/')
.get(function(req, res, next){
//DB연결후 query문을 통한 데이터 삽입 
  pool.getConnection(function(err, conn){
    if(err){ 
        console.log(err)
    }
    conn.query(`SELECT * 
                FROM creatorWithdrawal 
                  WHERE creatorWithdrawal.withdrawalState = 0`, function(err, result, fields){
        if(err){
            console.log(err);
        }
        else{
          console.log('fin')
          result = result.map(
            (value) => {
              value = Object.values(value);
              return value
            }
          )
        }
        console.log(result)
        conn.release();
        res.send(result);
      });
    });
  });

router.route('/pay')
.post(function(req, res, next){
  //DB연결후 query문을 통한 데이터 삽입 
    pool.getConnection(function(err, conn){
      if(err){ 
          console.log(err)
      }
      conn.query(`UPDATE creatorWithdrawal SET withdrawalState = 1 WHERE creatorWithdrawal.index = ${req.body.index};`, function(err, result, fields){
          if(err){
              console.log(err);
          } 
          conn.release();
        });
      });
    });
    
router.route('/confirm')
.get(function(req, res, next){
  //DB연결후 query문을 통한 데이터 삽입 
    pool.getConnection(function(err, conn){
      if(err){ 
          console.log(err)
      }
      conn.query(`SELECT bannerSrc, bannerId, marketerId, bannerCategory, confirmState FROM bannerRegistered WHERE confirmState = 0;`, function(err, result, fields){
        if(err){
          console.log(err);
        }
      else{
        console.log('fin')
        result = result.map(
          (value) => {
            value = Object.values(value);
            return value
          }
        )
      }
        conn.release();
        res.send(result);
        
        });
      });
    });

router.route('/confirmState')
.post(function(req, res, next){
  //DB연결후 query문을 통한 데이터 삽입 
    pool.getConnection(function(err, conn){
      if(err){ 
        console.log(err)
      }
      conn.query(`UPDATE bannerRegistered SET confirmState = 1 WHERE bannerRegistered.bannerId = "${req.body.bannerId}";`,function(err, result, fields){
        if(err){
              console.log(err);
          } 
          conn.release();
        });
      });
    });

router.route('/rejectBanner')
.post(function(req, res, next){
  //DB연결후 query문을 통한 데이터 삽입 
    pool.getConnection(function(err, conn){
      if(err){ 
          console.log(err)
      }
      conn.query(`UPDATE bannerRegistered 
                  SET confirmState = 2, bannerDenialReason = "${req.body.denialReason}" 
                  WHERE bannerRegistered.bannerId = "${req.body.bannerId}";`, function(err, result, fields){
          if(err){
              console.log(err);
          } 
          conn.release();
        });
      });
    });
module.exports = router;