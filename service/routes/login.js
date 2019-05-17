const express = require('express');
const passport = require('passport');
const checkEmailAuth = require('../middlewares/checkEmailAuth');
const pool = require('../model/connectionPool');
const encrypto = require('../encryption');
var router = express.Router();

/* GET home page. */
//미들웨어로써의 passport
// router.post( '/', 
//   //성공하였을때, serialize 함수 수행 후, callback
//   //실패하였을 때의 분기를 찾아야한다.
//   function(req, res, next){
//     // middleware 가 아닌 listener에서 수행.
//     passport.authenticate('local', function(err, user, info){
//       if(err){  return next(err);}
//       if(!user){  return res.json(null); }
//       else { 
//         console.log(user);
//         return res.json(user); }
//     })(req, res, next);
// },
// );

router.post( '/', passport.authenticate('local'),
  checkEmailAuth
);

router.get( '/check', function(req, res, next) {
  res.send(req.session.passport);
});

router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy((err)=>{
    console.log('로그아웃 되었습니다.');
  })
});

router.post( '/twitch', passport.authenticate('twitch'),
  function(req, res, next){
    console.log('success in server');
    res.send('good');
  }
);

router.get('/twitch/callback',passport.authenticate('twitch'),
function(req, res, next){
  console.log('success in server');
  res.send('good');
}
);

router.post('/changePw', (req, res, next) =>{
  let password = req.body.password;
  let marketerId = req.session.passport.user.userid;
  let key, salt;
  [key, salt] = encrypto.make(password);

  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    conn.query(`UPDATE marketerInfo SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 0 WHERE marketerId = ? `, [salt, key, marketerId], function(err, result, fields){
      console.log('비밀번호 변경 성공');
      res.end();
    });
    conn.release();
  });

})

module.exports = router;