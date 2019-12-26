const crypto = require('crypto');
require('dotenv').config();

const makeEncryption = function (passwd) {
  const salt = crypto.randomBytes(64).toString('base64');
  const key = crypto.pbkdf2Sync(passwd, salt, 100202, 64, 'sha512').toString('base64');
  return [key, salt];
};

// 입력된 passwd를 salt로 돌려서
// 생성되는 key와 db의 key값과 비교
const checkEncryption = function (passwd, key, salt) {
  const newkey = crypto.pbkdf2Sync(passwd, salt, 100202, 64, 'sha512').toString('base64');
  if (key === newkey) {
    return true;
  }
  return false;
};

const makeDecipherText = (account) => {
  //  base64로 되어있는 string을 buffer화 한다.
  if (account === '') {
    return '';
  }

  const accountBuffer = Buffer.from(account, 'base64');
  const secret = process.env.CIPHER_KEY;
  const cryptkey = crypto.createHash('sha256').update(secret).digest();
  const iv = Buffer.alloc(16, process.env.CIPHER_IV, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv);
  const buffer = Buffer.concat([
    decipher.update(accountBuffer),
    decipher.final()
  ]);

  return buffer.toString('utf-8');
};


const makeCipherText = (account) => {
  if (account === '') {
    return '';
  }

  const secret = process.env.CIPHER_KEY;
  const iv = Buffer.alloc(16, process.env.CIPHER_IV, 'base64');
  const cryptkey = crypto.createHash('sha256').update(secret).digest();
  const encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv);
  const buffer = Buffer.concat([
    encipher.update(account),
    encipher.final()
  ]);

  return buffer.toString('base64');
};

const encrypto = {
  make: makeEncryption,
  check: checkEncryption,
  encipher: makeCipherText,
  decipher: makeDecipherText
};

module.exports = encrypto;
