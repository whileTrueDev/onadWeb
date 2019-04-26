const express = require('express');
var router = express.Router();

/* GET home page. */
router.get( '/', function(req, res, next) {
  if(typeof(req.session.count) === 'undefined'){
    req.session.count = 0;
  }else{
    req.session.count++;
  }
  res.render('home', { title: 'Express' , count : req.session.count});
});

module.exports = router;