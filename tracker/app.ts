/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import tracking from './lib/tracking';
import parseUserAgent from './lib/parseUserAgent';
import googleAnalytics from './lib/GoogleAnalytics';

const app = express();
const httpServer = http.createServer(app);

const PORT = 3030;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';

app.set('views', `${__dirname}/views`); // view engine
app.set('view engine', 'ejs');

// GoogleAnalytics
app.use(googleAnalytics);

app.use(helmet());
// ***********************
// cache 무시
app.use(express.static(path.join(__dirname, 'public'), { etag: false })); // 정적리소스 처리
app.set('etag', false);
app.use(nocache());
// ***********************
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'));
app.engine('html', require('ejs').renderFile);

// For AWS Health Checks
app.get('/', (req, res, next) => {
  res.sendStatus(200);
});
app.get('/:creatorTwitchId', async (req, res, next) => {
  const costType = 'adpanel';
  // Get semantic parameters
  const creatorTwitchId = req.params.creatorTwitchId as string;
  // Get UserAgent and IP
  const nowIp: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const uastring = req.headers['user-agent'];
  const userAgent = parseUserAgent(uastring);

  const result = await tracking(nowIp, userAgent, creatorTwitchId, costType);
  if (result.href) {
    res.redirect(302, result.href);
  } else {
    let message = '광고주 페이지로 이동중입니다...';
    if (result.message === 'Invalid ip'
      || result.message === 'DB Error'
      || result.message === 'invalid link') {
      message = '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (result.message === 'No campaign') {
      message = `${result.name || creatorTwitchId} 님은 현재 광고중이지 않습니다.`;
    }
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Clear-Site-Data', '*');
    res.render('server', { message, twitchlink: `https://twitch.tv/${creatorTwitchId}` });
  }
});

// 아프리카 광고 클릭 라우터 (아프리카는 챗봇광고가 없으므로 클릭광고만.)
app.get('/afreeca/:afreecaId', async (req, res, next) => {
  const costType = 'adpanel';
  // Get semantic parameters
  const afreecaId = req.params.afreecaId as string;
  // Get UserAgent and IP
  const nowIp: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const uastring = req.headers['user-agent'];
  const userAgent = parseUserAgent(uastring);

  const result = await tracking(nowIp, userAgent, afreecaId, costType, 'afreeca');
  if (result.href) {
    res.redirect(302, result.href);
  } else {
    let message = '광고주 페이지로 이동중입니다...';
    if (result.message === 'Invalid ip'
      || result.message === 'DB Error'
      || result.message === 'invalid link') {
      message = '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (result.message === 'No campaign') {
      message = `${result.name || afreecaId} 님은 현재 광고중이지 않습니다.`;
    }
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Clear-Site-Data', '*');

    // 버튼 클릭 시 현재 방송으로 리다이렉트 => `http://play.afreecatv.com/${afreecaId}`
    // [현재 설정] 버튼 클릭 시 방송국으로 리다이렉트
    res.render('server', { message, twitchlink: `http://bj.afreecatv.com/${afreecaId}` });
  }
});

app.get('/adchat/:creatorTwitchId', async (req, res, next) => {
  const costType = 'adchat';
  // Get semantic parameters
  const creatorTwitchId = req.params.creatorTwitchId as string;
  // Get UserAgent and IP
  const nowIp: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const uastring = req.headers['user-agent'];
  const userAgent = parseUserAgent(uastring);

  const result = await tracking(nowIp, userAgent, creatorTwitchId, costType);
  if (result.href) {
    res.redirect(302, result.href);
  } else {
    let message = '광고주 페이지로 이동중입니다...';
    if (result.message === 'Invalid ip'
      || result.message === 'DB Error'
      || result.message === 'invalid link') {
      message = '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (result.message === 'No campaign') {
      message = `${result.name || creatorTwitchId} 님은 현재 광고중이지 않습니다.`;
    }
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Clear-Site-Data', '*');
    res.render('server', { message, twitchlink: `https://twitch.tv/${creatorTwitchId}` });
  }
});

httpServer.listen(PORT, () => {
  console.log(`tracking server on ${process.env.NODE_ENV} mode`);
});
