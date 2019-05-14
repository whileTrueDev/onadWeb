const express = require('express');
var router = express.Router();

/* GET home page. */
router.get( '/', function(req, res, next) {
});

router.get( '/check', function(req, res, next) {
  res.send(req.session.passport);
});

module.exports = router;