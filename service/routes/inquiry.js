var express = require('express');
var pool = require('../model/connectionPool');
var router = express.Router();

router.post('/', function(req, res, next) {
  
  const email = req.body.data.email;
  const inquiryText = req.body.data.inquiryText;

  if (email === '' || inquiryText === '') {
    res.json({
      err: 'err! no value on submit data'
    });
  } else {
    // 문의 데이터를 쌓는 로직 추가  
    // pool.getConnection((err, connection) => {
    //   if(!err) {
    //     // not error! connected logics
    //     connection.query(
    //       `insert into inquiry values("${email}", "${inquiryText}")`, (err, rows) => {
    //       res.json(rows);
    //     })
    //   }
      
    })
  };
  })

module.exports = router;
