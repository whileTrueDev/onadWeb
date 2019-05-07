const express = require('express');
const passport = require('passport');
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
  function(req, res, next){
    console.log('success in server');
    res.send('good');
  }
);


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


module.exports = router;