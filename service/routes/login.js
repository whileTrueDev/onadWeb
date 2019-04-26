const express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.post( '/', passport.authenticate('local',
  {failureRedirect: '/'}), 
  function(req, res, next) {
    req.session.count++;   
    res.render('home');
});


module.exports = router;