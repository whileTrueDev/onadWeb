const crypto = require('crypto');

const makeEncryption = function(passwd){
  var salt = crypto.randomBytes(64).toString('base64');
  var key = crypto.pbkdf2Sync(passwd, salt, 100202, 64, 'sha512').toString('base64');
  return [key, salt];
}

// 입력된 passwd를 salt로 돌려서
// 생성되는 key와 db의 key값과 비교
const checkEncryption = function(passwd, key, salt){
  var newkey = crypto.pbkdf2Sync(passwd, salt, 100202, 64, 'sha512').toString('base64');
  if(key === newkey){
    return true;
  }
  return false;
};

const encrypto = {
  make : makeEncryption,
  check : checkEncryption
}

module.exports = encrypto;

