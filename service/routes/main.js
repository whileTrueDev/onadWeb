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
    conn.query(`SELECT bannerId, marketerId FROM bannerMatched where contractionState = 1`, function(err, result, fields){
        if(err){
            console.log(err);
        }
        result = result.map(
          (value) => {
            value = Object.values(value);
            return value
          }
        )
        res.send(result);
        conn.release();
      });
    });
  });

module.exports = router;