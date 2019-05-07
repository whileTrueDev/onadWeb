const express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // user에 저장된다.
  console.log(req.user);
  res.send('respond with a resource');
});

module.exports = router;
