var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  
  const email = req.body.data.email;
  const inquiryText = req.body.data.inquiryText;

  
  res.send('sucessed');

  // 문의 데이터를 쌓는 로직 추가
  
});

module.exports = router;
