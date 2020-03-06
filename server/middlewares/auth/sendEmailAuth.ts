import express from 'express';
import axios from 'axios';
import responseHelper from '../../middlewares/responseHelper';

const HOST = process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_API_HOSTNAME
    : process.env.DEV_API_HOSTNAME;

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

