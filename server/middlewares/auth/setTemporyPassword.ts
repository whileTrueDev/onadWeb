import { Request, Response } from 'express';
import axios from 'axios';
import encrypto from '../encryption';
import doQuery from '../../model/doQuery';
import responseHelper from '../responseHelper';

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_API_HOSTNAME
  : process.env.DEV_API_HOSTNAME;

function setTemporaryPassword(req: Request, res: Response): void {
  // 임시비밀번호 생성.
  let password = '';

  for (let i = 0; i < 8; i += 1) {
    const lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    if (i % 2 === 0) {
      password += String(Math.floor(Math.random() * 10));
    } else {
      password += lowerStr;
    }
  }

  const [key, salt] = encrypto.make(password);

  doQuery('UPDATE marketerInfo SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 1 WHERE marketerId = ? ',
    [salt, key, req.body.marketerId])
    .then(() => {
      const user = {
        marketerId: req.body.marketerId,
        marketerMail: req.body.marketerMail,
        password,
        baseUrl: req.baseUrl
      };
      console.log(req.body);
      axios.post(`${HOST}/mail/tmp-auth`, user)
        .then((response) => {
          // 메일 전송 오류 및 성공.
          responseHelper.send(response.data, 'POST', res);
        });
    })
    .catch((data) => {
      // 쿼리문이나 커넥션에 대한 에러
      res.send(data);
    });
}

export default setTemporaryPassword;
