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
  }});

module.exports = router;
