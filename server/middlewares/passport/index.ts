/*
1. passport-local을 통해 직접 passport를 통한 로그인을 구현한다.
2. passport를 사용하기 위해서 LocalStrategy를 custom으로 정의해야한다. (option, verify callback function)으로 구성
3. app.js에서 해당 LocalStrategy를 사용하여 passport를 정의하고 app.use로 추가한다.
4. app.use(passport.initialize()); 추가
5. app.use(passport.session()); 추가
6. passport.serializeUser() 를 오버라이딩하여 session에 저장할 데이터를 지정.
7. passport.unserializeUser()를 오버라이딩하여 session의 값을 이용하여 매 req에 저장할 데이터를 지정.
8. /login 에 post Method 정의할 때, connection middleware로 callback
   함수전에 passport.authenticate('local')을 사용하여 session 변경
9. user-defined function인 승인된 session인지 체크하는 ensureAuthenticated() 미들웨어 정의
10. routing 마다 callback 함수 전에 체크 후 진행하도록 한다.
*/
import express from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import Local from 'passport-local';
import Google from 'passport-google-oauth20';
import Naver from 'passport-naver';
import Kakao from 'passport-kakao';

import Twitch from './TwitchPassport';
import verification from './verification';
import doQuery from '../../model/doQuery';

const LocalStrategy = Local.Strategy;
const TwitchStrategy = Twitch.Strategy;
const GoogleStrategy = Google.Strategy;
const NaverStrategy = Naver.Strategy;
const KakaoStrategy = Kakao.Strategy;

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_API_HOSTNAME
  : process.env.DEV_API_HOSTNAME;
// serializeUser를 정의한다. session에 저장해둘 data를 구현하는 것.
passport.serializeUser((user, done) => {
  console.log('serialize');
  done(null, user);
});

// 로그인이 되었을 때 매 요청시마다 자동으로 수행되는 session에서 인증된 req.user의 영역으로 저장하기.
passport.deserializeUser((user, done) => {
  // db에서 추가로 데이터를 req.user에 저장.
  done(null, user);
});


passport.use(new LocalStrategy(
  {
    usernameField: 'userid',
    passwordField: 'passwd',
    passReqToCallback: false,
  }, verification.marketerLocal
));

/* 2019-07-02 박찬우

1. twitch를 통해 받는 데이터
    - creator ID => creatorId
    - creator DisplayName => creatorName
    - creator Name
    - creator Mail
    - creator Logo

2. 구동방식
    1) twitch를 통해 전달받은 데이터들은 session으로 전달된다.
    2) 매 로그인 시, Data가 존재하는지 확인한다.

    * 최초 로그인이 아닐 때
    3-1) Data가 존재하므로 creatorName, creatorMail을 가져온다.
    3-2) 현재 DB에서 가져온 값과 session으로 획득한 값을 비교하여 DB 수정.
    3-3) 나머지 data는 session에 띄워놓고 필요할 때 바로 사용할 수 있도록
        session을 context화 하여 필요한 Component에서 접근이 가능하게 구현한다.

    * 최초 로그인시
    3-1) creator Logo를 제외한 모든 값을 creatorInfo table에 저장한다.

    - DB에 저장될 데이터 (col명 : twitchdata 명)
        - creatorId : _id
        - creatorName : display_name
        - creatorMail : email
        - advertiseUrl : 난수를 생성하여 추가.
        - creatorIp : 현재 Ip를 추가.
        - creatorAccountNumber : Null
        - creatorAlarmAgreement : 0
        - creatorContractionAgreement : 0

3. clientID, clientSecret은 초기화 및 파일화하여 배포.
*/

const makeUrl = () => {
  let password = '';

  for (let i = 0; i < 8; i += 1) {
    const lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    if (i % 2 === 0) {
      password += String(Math.floor(Math.random() * 10));
    } else {
      password += lowerStr;
    }
  }
  return password;
};

const clientID = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_CLIENT_ID
  : process.env.DEV_CLIENT_ID;
const clientSecret = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_CLIENT_SECRET
  : process.env.DEV_CLIENT_SECRET;

interface CreatorSession {
  creatorId: string;
  creatorDisplayName: string;
  creatorName: string;
  creatorMail: string;
  creatorLogo: string;
  userType: 'creator';
  creatorIp?: string | string[];
}

passport.use(new TwitchStrategy({
  clientID: clientID || '',
  clientSecret: clientSecret || '',
  callbackURL: `${HOST}/login/twitch/callback`,
  scope: 'user:read:email', // user:read:email
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  passReqToCallback: true,
},
// login성공시 수행되는 함수.
((req: express.Request, accessToken: string,
  refreshToken: string, profile: any,
  done: OAuth2Strategy.VerifyCallback) => {
  console.log(req);
  const user: CreatorSession = {
    creatorId: profile.id,
    creatorDisplayName: profile.display_name,
    creatorName: profile.login,
    creatorMail: profile.email,
    creatorLogo: profile.profile_image_url,
    userType: 'creator'
  };
  const selectQuery = `
    SELECT
      creatorIp, creatorId, creatorName,
      creatorMail, creatorTwitchId, creatorLogo
    FROM creatorInfo
    WHERE creatorId = ?`;
  doQuery(selectQuery, [user.creatorId])
    .then((row): void => {
      const creatorData = row.result[0];
      if (creatorData) {
        console.log('creatorData', creatorData);
        console.log(`[${new Date().toLocaleString()}] [로그인] ${user.creatorDisplayName}`);
        user.creatorIp = creatorData.creatorIp;

        // Data 변경시에 변경된 값을 반영하는 영역.
        if (!(creatorData.creatorName === user.creatorDisplayName
          && creatorData.creatorMail === user.creatorMail)) {
          // 크리에이터의 name 또는 email 이 바뀐 경우 재설정
          const UpdateQuery = `
                    UPDATE creatorInfo
                    SET  creatorName = ?, creatorMail = ?, creatorTwitchId = ?, creatorLogo = ?
                    WHERE creatorId = ?
                    `;
            // 랜딩페이지 명 변경
          const landingUpdateQuery = `
          UPDATE creatorLanding
          SET creatorTwitchId = ?
          WHERE creatorId = ?`;
          Promise.all([
            doQuery(UpdateQuery, [
              user.creatorDisplayName, user.creatorMail,
              user.creatorName, user.creatorLogo, user.creatorId
            ]),
            doQuery(landingUpdateQuery, [user.creatorName, user.creatorId])
          ])
            .then(() => done(null, user))
            .catch((errorData) => {
              console.log(errorData);
              done(errorData);
            });
        } else if (!(creatorData.creatorLogo === user.creatorLogo)) {
          // 크리에이터의 로고가 바뀐 경우 재설정
          const updateQuery = `
                    UPDATE creatorInfo
                    SET creatorLogo = ?
                    WHERE creatorId = ?
                    `;

          doQuery(updateQuery, [user.creatorLogo, user.creatorId])
            .then(() => done(null, user))
            .catch((errorData) => {
              console.log(errorData);
              done(errorData);
            });
        } else if (!(creatorData.creatorTwitchId === user.creatorName)) {
          // 크리에이터의 twitch id가 바뀐 경우 재 설정
          const updateQuery = `
                    UPDATE creatorInfo
                    SET creatorTwitchId = ?
                    WHERE creatorId = ?
                    `;
          const landingClickUpdateQuery = `
          UPDATE creatorLanding SET creatorTwitchId = ? WHERE creatorId = ?
          `;

          Promise.all([
            doQuery(updateQuery, [user.creatorName, user.creatorId])
              .then(() => done(null, user))
              .catch((errorData) => {
                console.log(errorData);
                done(errorData);
              }),
            doQuery(landingClickUpdateQuery, [user.creatorName, user.creatorId])
              .then(() => done(null, user))
              .catch((errorData) => {
                console.log(errorData);
                done(errorData);
              })
          ]);
        } else {
          return done(null, user);
        }
      } else {
        console.log(`${user.creatorDisplayName} 님이 최초 로그인 하셨습니다.`);
        const creatorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const campaignList = JSON.stringify({ campaignList: [] });
        const creatorBannerUrl = makeUrl();
        user.creatorIp = creatorIp;

        const infoQuery = `
                INSERT INTO creatorInfo
                (creatorId, creatorName, creatorMail, creatorIp, advertiseUrl, creatorTwitchId, creatorLogo)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const incomeQuery = `
                INSERT INTO creatorIncome 
                (creatorId, creatorTotalIncome, creatorReceivable) 
                VALUES (?, ?, ?)`;

        const priceQuery = `
                INSERT INTO creatorPrice
                (creatorId, grade, viewerAverageCount, unitPrice)
                VALUES (?, ?, ?, ?)
                `;

        const royaltyQuery = `
                INSERT INTO creatorRoyaltyLevel
                (creatorId, level, exp, visitCount)
                VALUES (?, 1, 0, 0)
                `;


        Promise.all([
          doQuery(infoQuery, [user.creatorId, user.creatorDisplayName,
            user.creatorMail, creatorIp, `/${creatorBannerUrl}`,
            user.creatorName, user.creatorLogo]),
          doQuery(royaltyQuery, [user.creatorId]),
          doQuery(incomeQuery, [user.creatorId, 0, 0]),
          doQuery(priceQuery, [user.creatorId, 1, 0, 2]),
        ])
          .then(() => done(null, user))
          .catch((errorData) => {
            console.log(errorData);
            done(errorData);
          });
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      done(errorData);
    });
})));


// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: `${HOST}/api/login/google/callback`
// },
// ((accessToken, refreshToken, profile, done) => {
//   // 최초 로그인시를 정의한다. 존재할 때는 sub를 통해서 DB에서 값을 조회한다.
//   const jsonData = profile._json;
//   const {
//     sub, given_name, family_name, email
//   } = jsonData;

//   const checkQuery = `
//   SELECT marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
//   marketerUserType, marketerAccountNumber
//   FROM marketerInfo
//   WHERE marketerId = ?
//   AND platformType = 1 `;

//   doQuery(checkQuery, [sub])
//     .then((row) => {
//       if (row.result[0]) {
//       // ID가 존재할 경우.
//         const marketerData = row.result[0];
//         const user = {
//           userid: marketerData.marketerId,
//           userType: 'marketer',
//           marketerUserType: marketerData.marketerUserType,
//           marketerMail: marketerData.marketerMail,
//           marketerAccountNumber: marketerData.marketerAccountNumber,
//           marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
//           marketerName: marketerData.marketerName,
//           marketerPhoneNum: marketerData.marketerPhoneNum,
//           registered: true
//         };
//         const stampQuery = `
//         INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
//         doQuery(stampQuery, [user.userid, '', '1']);
//         console.log('로그인이 완료되었습니다, ', marketerData.marketerName);

//         return done(null, user);
//       }

//       const user = {
//         userType: 'marketer',
//         marketerMail: email,
//         marketerName: family_name + given_name,
//         marketerPlatformData: sub,
//         registered: false
//       };
//       return done(null, user);
//     })
//     .catch((errorData) => done(errorData));
// })));


// passport.use(new NaverStrategy({
//   clientID: process.env.NAVER_CLIENT_ID,
//   clientSecret: process.env.NAVER_CLIENT_SECRET,
//   callbackURL: `${HOST}/api/login/naver/callback`
// },
// ((accessToken, refreshToken, profile, done) => {
//   const jsonData = profile._json;

//   const {
//     email, id
//   } = jsonData;


//   const checkQuery = `
//   SELECT marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
//   marketerUserType, marketerAccountNumber
//   FROM marketerInfo
//   WHERE marketerId = ?
//   AND platformType = 2 `;

//   doQuery(checkQuery, [id])
//     .then((row) => {
//       if (row.result[0]) {
//       // ID가 존재할 경우.
//         const marketerData = row.result[0];
//         const user = {
//           userid: marketerData.marketerId,
//           userType: 'marketer',
//           marketerUserType: marketerData.marketerUserType,
//           marketerMail: marketerData.marketerMail,
//           marketerAccountNumber: marketerData.marketerAccountNumber,
//           marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
//           marketerName: marketerData.marketerName,
//           marketerPhoneNum: marketerData.marketerPhoneNum,
//           registered: true
//         };
//         const stampQuery = `
//         INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
//         doQuery(stampQuery, [user.userid, '', '1']);
//         console.log('로그인이 완료되었습니다, ', marketerData.marketerName);

//         return done(null, user);
//       }

//       const user = {
//         userType: 'marketer',
//         marketerPlatformData: id,
//         registered: false,
//         marketerMail: email
//       };
//       return done(null, user);
//     })
//     .catch((errorData) => done(errorData));
// })));


// passport.use(new KakaoStrategy({
//   clientID: process.env.KAKAO_CLIENT_ID,
//   callbackURL: `${HOST}/api/login/kakao/callback`
// },
// ((accessToken, refreshToken, profile, done) => {
//   const jsonData = profile._json;

//   const {
//     id, kakao_account
//   } = jsonData;


//   const checkQuery = `
//   SELECT marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
//   marketerUserType, marketerAccountNumber
//   FROM marketerInfo
//   WHERE marketerId = ?
//   AND platformType = 3 `;

//   doQuery(checkQuery, [id])
//     .then((row) => {
//       if (row.result[0]) {
//       // ID가 존재할 경우.
//         const marketerData = row.result[0];
//         const user = {
//           userid: marketerData.marketerId,
//           userType: 'marketer',
//           marketerUserType: marketerData.marketerUserType,
//           marketerMail: marketerData.marketerMail,
//           marketerAccountNumber: marketerData.marketerAccountNumber,
//           marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
//           marketerName: marketerData.marketerName,
//           marketerPhoneNum: marketerData.marketerPhoneNum,
//           registered: true
//         };
//         const stampQuery = `
//         INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
//         doQuery(stampQuery, [user.userid, '', '1']);
//         console.log('로그인이 완료되었습니다, ', marketerData.marketerName);

//         return done(null, user);
//       }

//       const user = {
//         userType: 'marketer',
//         marketerPlatformData: id,
//         registered: false
//       };

//       if (kakao_account.has_email) {
//         user.marketerMail = kakao_account.email;
//       }

//       return done(null, user);
//     })
//     .catch((errorData) => done(errorData));
// })));

export default passport;