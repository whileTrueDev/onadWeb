import express from 'express';
import axios from 'axios';
import responseHelper from '../responseHelper';

const HOST = process.env.API_HOSTNAME;

function sendEmailAuth(
  req: express.Request, res: express.Response
): void {
  const user = {
    marketerId: req.body.marketerId,
    marketerMail: req.body.marketerMail
  };
  axios.post(`${HOST}/mail/auth`, user)
    .then((row) => {
      responseHelper.send(row.data, 'POST', res);
    });
}

export default sendEmailAuth;
