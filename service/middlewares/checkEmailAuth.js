checkEmailAuth = (req, res, next) =>{
  if(req.session.passport.user.marketerEmailAuth === 0){
    // Email 인증이 되지 않았으므로
    console.log('인증되지 않았습니다.');
    res.send(false);
  }else{
    console.log('인증되었습니다.');
    res.send(req.session.passport.user);
  }
}

module.exports = checkEmailAuth;
