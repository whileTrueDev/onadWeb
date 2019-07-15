const express = require('express');
const passport = require('passport');
const checkEmailAuth = require('../middlewares/checkEmailAuth');
const pool = require('../model/connectionPool');
const doQuery = require('../model/doQuery');
const encrypto = require('../encryption');
var router = express.Router();

router.post( '/', passport.authenticate('local'),
  checkEmailAuth
);

router.get( '/check', function(req, res) {
  if(req.session.passport && req.session.passport.user.userType === 'marketer'){
    const checkQuery = `
    SELECT temporaryLogin
    FROM marketerInfo
    WHERE marketerId = ?`
    console.log(req.session)
    doQuery(checkQuery, [req.session.passport.user.userid])
    .then((row)=>{
      const { temporaryLogin } = row.result[0];
      if(temporaryLogin === 1){
        res.send({
          error : false,
          state : 1
        })
      }else{
        res.send({
          error : false,
          state : 0
        })
      }
    })
    .catch(()=>{
      res.send({
        error : true,
      })
    })
  }
  else if(req.session.passport && req.session.passport.user.userType === 'creator'){
    res.send({
      //creator 일 경우
      error : false,
      state : 0,
    })
  }
  else {
    res.send({
      //creator 일 경우
      error : true,
    })
  }
});

router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(()=>{
    console.log('로그아웃 되었습니다.');
  })
  res.end();
});


router.post('/changePw', (req, res, next) =>{
  let password = req.body.password;
  let marketerId = req.session.passport.user.userid;
  let key, salt;
  [key, salt] = encrypto.make(password);
  const changeQuery = `
  UPDATE marketerInfo 
  SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 0 
  WHERE marketerId = ? `
  doQuery(changeQuery, [salt, key, marketerId])
  .then(()=>{
    console.log('비밀번호 변경 성공');
    res.send(true);
  })
  .catch(()=>{
    res.send(false);
  })
})

router.get("/twitch", passport.authenticate("twitch"));

router.get("/twitch/callback", passport.authenticate("twitch"),
  function(req, res, next){
    console.log('success in server');
    res.redirect("http://localhost:3001/dashboard/creator/door");
    //res.send({userType: userType});
  }
);

module.exports = router;