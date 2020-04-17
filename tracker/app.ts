/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import http from 'http';

import adChat from './public/tracker/adchat';

const app = express();
const httpServer = http.createServer(app);

const PORT = 3030;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';
let TRACKER_HOST = process.env.DEV_TRACKER_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  TRACKER_HOST = process.env.PRODUCTION_TRACKER_HOSTNAME;
}

app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
// view engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/:costType/:id', async (req, res, next) => {
  const { id } = req.params;
  const { costType } = req.params;
  const userData = req.query;
  const redirection = await adChat(req, res, userData, [id, costType]);
  // if (redirection) {
  //   res.redirect(200, 'https://onad.io');
  //   console.log(redirection);
  //   return;
  // } // 구조적으로 문제 있음
  res.render('index.ejs');
});

httpServer.listen(PORT, () => {
  console.log(`tracking server on ${process.env.NODE_ENV} mode`);
});
