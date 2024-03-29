import Crypto from 'crypto-js';

// MUST BE JS

function makeSignature(method = 'GET',
  url = '/photos/puppy.jpg?query1=&query2',
  nowtime = new Date().getTime().toString()) {
  const space = ' '; // one space
  const newLine = '\n'; // new line
  const timestamp = nowtime; // current timestamp (epoch)

  const accessKey = process.env.NAVER_CLOUD_ACCESS_KEY; // access key id
  const secretKey = process.env.NAVER_CLOUD_SECRET_KEY; // secret key

  if (!(accessKey && secretKey)) {
    throw Error('accesskey and secretkey is needed');
  }

  const hmac = Crypto.algo.HMAC.create(Crypto.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();

  return hash.toString(Crypto.enc.Base64);
}

export default makeSignature;
