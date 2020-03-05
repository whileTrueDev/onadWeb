/*
1. passport-local을 통해 직접 passport를 통한 로그인을 구현한다.
2. passport를 사용하기 위해서 Local.Strategy를 custom으로 정의해야한다. (option, verify callback function)으로 구성
3. app.js에서 해당 Local.Strategy를 사용하여 passport를 정의하고 app.use로 추가한다.
4. app.use(passport.initialize()); 추가
5. app.use(passport.session()); 추가
6. passport.serializeUser() 를 오버라이딩하여 session에 저장할 데이터를 지정.
7. passport.unserializeUser()를 오버라이딩하여 session의 값을 이용하여 매 req에 저장할 데이터를 지정.
8. /login 에 post Method 정의할 때, connection middleware로 callback
   함수전에 passport.authenticate('local')을 사용하여 session 변경
9. user-defined function인 승인된 session인지 체크하는 ensureAuthenticated() 미들웨어 정의
10. routing 마다 callback 함수 전에 체크 후 진행하도록 한다.
*/
import passport from 'passport';
import Local from 'passport-local';
import Google from 'passport-google-oauth20';
import Naver from 'passport-naver';

import Twitch from './TwitchPassport';
import verification from './verification';
import { Session } from '../../@types/session';

const Kakao = require('passport-kakao'); // type정의 문제..

// 개발 환경에 따른 분기처리
const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_API_HOSTNAME
  : process.env.DEV_API_HOSTNAME;
const clientID = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_CLIENT_ID
  : process.env.DEV_CLIENT_ID;
const clientSecret = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_CLIENT_SECRET
  : process.env.DEV_CLIENT_SECRET;

// serializeUser를 정의한다. session에 저장해둘 data를 구현하는 것.
passport.serializeUser<Session, Session>((user, done) => {
  done(null, user);
});

// 로그인이 되었을 때 매 요청시마다 자동으로 수행되는 session에서 인증된 req.user의 영역으로 저장하기.
passport.deserializeUser<Session, Session>((user, done) => {
  // db에서 추가로 데이터를 req.user에 저장.
  done(null, user); // 여기의 user가 req.user가 됨
});

// 마케터 - Onad로 로그인
passport.use(new Local.Strategy(
  {
    usernameField: 'userid',
    passwordField: 'passwd',
    passReqToCallback: false,
  }, verification.marketerLocal
));

// 크리에이터 - twitch로 로그인
passport.use(new Twitch.Strategy(
  {
    clientID: clientID || '',
    clientSecret: clientSecret || '',
    callbackURL: `${HOST}/api/login/twitch/callback`,
    scope: 'user:read:email', // user:read:email
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    passReqToCallback: true,
  },
  // login성공시 수행되는 함수.
  verification.creatorTwitch
));

passport.use(new Google.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${HOST}/api/login/google/callback`,
}, verification.marketerGoogle));

passport.use(new Kakao.Strategy({
  clientID: process.env.KAKAO_CLIENT_ID || '',
  // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
  // from https://github.com/rotoshine/passport-kakao#readme
  clientSecret: '',
  callbackURL: `${HOST}/api/login/kakao/callback`
}, verification.marketerKakao));

passport.use(new Naver.Strategy({
  clientID: process.env.NAVER_CLIENT_ID || '',
  clientSecret: process.env.NAVER_CLIENT_SECRET || '',
  callbackURL: `${HOST}/api/login/naver/callback`
}, verification.marketerNaver));

export default passport;
