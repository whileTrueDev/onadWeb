const axios = require('axios');
const pool = require('../model/connectionPool');
const encrypto = require('../encryption');


const setTemporaryPassword = (req, res, next) => {
  // 임시비밀번호 생성.
  let password = "";
  let key, salt;

  for(let i = 0; i < 8; i++){
    let lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    if(i % 2 == 0){
    password += String(Math.floor(Math.random() * 10));
    }else{
    password += lowerStr;
    }
  }

  [key, salt] = encrypto.make(password);
  
  //DB로 비밀번호 변경 및 임시 비밀번호임을 체크
  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    conn.query(`UPDATE marketerInfo SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 1 WHERE marketerId = ? `, [salt, key, req.body.marketerId], function(err, result, fields){
      console.log('비밀번호 변경 성공');
    });
    conn.release();
  });

  let user = {
    marketerId : req.body.marketerId,
    marketerMail : req.body.marketerMail,
    password : password,
    baseUrl : req.baseUrl
  }
  sendMail( user );
}

const sendMail = ( user ) =>{
  axios.post('http://localhost:3001/mailer/auth', user)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err)=>{
    console.log(err);
  })
}


module.exports = setTemporaryPassword;