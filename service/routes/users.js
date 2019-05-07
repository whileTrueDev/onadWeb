var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {id: 1, user_name: 'somebody'},
    {id: 2, user_name: 'somebodyelse'},
    {id: 3, user_name: 'somebody!!'},
  ]);
});

module.exports = router;
