const express = require('express');
const pool = require('../model/connectionPool');

var router = express.Router();

/* POST register page */
router.route('/').get(function(req, res, next){
//DB연결후 query문을 통한 데이터 삽입 
  pool.getConnection(function(err, conn){
    if(err){ 
        console.log(err)
    }
    conn.query(`
      SELECT * 
      FROM creatorWithdrawal 
      WHERE creatorWithdrawal.creatorId = "${req.query.creatorId}"`, function(err, result, fields){
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
        res.send(result);
        conn.release();
      });
    });
  });

module.exports = router;