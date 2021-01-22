
import express from 'express';
import OAuth2Strategy from 'passport-oauth2';
import Google from 'passport-google-oauth20';
import Naver from 'passport-naver';
import Kakao from 'passport-kakao';
// DB 커넥션 쿼리 함수
import doQuery from '../../../model/doQuery';
// 암호화 체크 객체 생성
import encrpyto from '../../../middlewares/encryption';
// type
import { Session } from '../../../@types/session';
import makeAdvertiseUrl from '../../../lib/makeAdvertiseUrl';
import twitchUpdate from './funcs/twitchUpdate';
import afreecaUpdate from './funcs/afreecaUpdate';

/**
 * @author 박찬우
 * @date 2019-07-13
 * @maintainer hwasurr
 * @date 2020.12.
 * @description
 * 1. session에 저장할 값 (변경되지 않는 영속적인 값)
 *   - useType
 *   - marketerId
 * 2. context에 저장할 값 (User의 기본적인 정보.)
 *   - marketerId : userid,
 *   - userType: 'marketer',
 *   - marketerName
 *   - marketerEmail
 *   - marketerContraction
 *   - marketerPhoneNum
 *   - marketerAccountNumber
 * 3. 구동방식
 *   - 추후에 비밀번호 및 ID에 대한 오류 수정.
 */
const local = async (
  req: express.Request,
  userid: string, passwd: string,
  done: (error: any, user?: any, options?: any) => void
): Promise<void> => {
  const { type } = req.body;
  switch (type) {
    case 'creator': {
      console.log(`creator new 통합 Login request - ${userid}`);
      const query = `
      SELECT creatorId, loginId, password, passwordSalt, advertiseUrl, creatorContractionAgreement,
      arrested, noticeReadState, adChatAgreement, settlementState,
      creatorName, creatorMail, creatorTwitchId, creatorLogo,  creatorTwitchRefreshToken, creatorTwitchOriginalId,
      afreecaId, afreecaName, afreecaLogo
      FROM creatorInfo WHERE loginId = ?`;
      const queryArray = [userid];
      await doQuery(query, queryArray)
        .then(async (row) => {
          if (row.result.length > 0) {
            const creator = row.result[0];
            if (encrpyto.check(passwd, creator.password, creator.passwordSalt)) {
              const user: Session = {
                userType: 'creator',
                creatorId: creator.creatorId,
                creatorIp: creator.creatorIp,
              };

              // 트위치 연동한 상태라면, 트위치 연동 정보 최신화
              if (creator.creatorTwitchOriginalId) {
                await twitchUpdate(creator).then((result) => {
                  if (result === 'success') console.log(`트위치 연동 정보 최신화 성공 - ${userid}`);
                  if (result === 'fail') console.log(`트위치 연동 정보 최신화 실패 - ${userid}`);
                }).catch((err) => console.error(`트위치 연동 정보 최신화 실패 - ${err}`));
              }

              if (creator.afreecaId) {
                await afreecaUpdate(creator).then((result) => {
                  if (result === 'success') console.log(`아프리카 연동 정보 최신화 성공 - ${userid}`);
                  if (result === 'fail') console.log(`아프리카 연동 정보 최신화 실패 - ${userid}`);
                }).catch((err) => console.error(`아프리카 연동 정보 최신화 실패 - ${err}`));
              }

              return done(null, user);
            }
            console.log(`${creator.loginId} 비밀번호가 일치하지 않습니다.`);
            return done(null, { message: '비밀번호가 일치하지 않습니다.' });
          }
          console.log(`${userid} 회원이 아닙니다.`);
          return done(new Error('아이디를 확인해주세요. 등록된 아이디가 아닙니다.'));
        })
        .catch((err) => done(err));
      break;
    }
    case 'marketer':
    default: {
      const checkQuery = `
      SELECT
        marketerPasswd, marketerSalt,
        marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
        marketerAccountNumber, marketerEmailAuth
      FROM marketerInfo
      WHERE marketerId = ? `;

      doQuery(checkQuery, [userid])
        .then((row) => {
          if (row.result[0]) {
            const marketerData = row.result[0];
            if (encrpyto.check(passwd, marketerData.marketerPasswd, marketerData.marketerSalt)) {
              const user: Session = {
                marketerId: userid,
                userType: 'marketer',
                marketerMail: marketerData.marketerMail,
                marketerAccountNumber: marketerData.marketerAccountNumber,
                marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
                marketerName: marketerData.marketerName,
                marketerPhoneNum: marketerData.marketerPhoneNum,
              };
              const stampQuery = `
            INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
              doQuery(stampQuery, [user.marketerId, '', '1']);
              console.log(`${marketerData.marketerName} 로그인 하였습니다.`);

              return done(null, user);
            }

            console.log(`${marketerData.marketerName} 비밀번호가 일치하지 않습니다.`);
            return done(null, { message: '비밀번호가 일치하지 않습니다.' });
          }

          console.log('회원이 아닙니다.');
          return done('회원이 아닙니다.');
        })
        .catch((errorData) => done(errorData));
    }
  }
};

/**
 * @deprecated
 * @author 박찬우
 * @date 2019-07-02
 * @description
 * @params 의 콜백 함수
 * 1. twitch를 통해 받는 데이터
 *   - creator ID => creatorId
 *   - creator DisplayName => creatorName
 *   - creator Name
 *   - creator Mail
 *   - creator Logo
 *
 * 2. 구동방식
 *     1) twitch를 통해 전달받은 데이터들은 session으로 전달된다.
 *     2) 매 로그인 시, Data가 존재하는지 확인한다.
 *
 *     * 최초 로그인이 아닐 때
 *     3-1) Data가 존재하므로 creatorName, creatorMail을 가져온다.
 *     3-2) 현재 DB에서 가져온 값과 session으로 획득한 값을 비교하여 DB 수정.
 *     3-3) 나머지 data는 session에 띄워놓고 필요할 때 바로 사용할 수 있도록
 *         session을 context화 하여 필요한 Component에서 접근이 가능하게 구현한다.
 *
 *     * 최초 로그인시
 *     3-1) creator Logo를 제외한 모든 값을 creatorInfo table에 저장한다.
 *
 *     - DB에 저장될 데이터 (col명 : twitchdata 명)
 *      - creatorId : _id
 *      - creatorName : display_name
 *      - creatorMail : email
 *      - advertiseUrl : 난수를 생성하여 추가.
 *      - creatorIp : 현재 Ip를 추가.
 *      - creatorAccountNumber : Null
 *      - creatorAlarmAgreement : 0
 *      - creatorContractionAgreement : 0
 *
 * 3. clientID, clientSecret은 초기화 및 파일화하여 배포.
 */
const creatorTwitch = (
  req: express.Request, accessToken: string,
  refreshToken: string, profile: any,
  done: OAuth2Strategy.VerifyCallback
): void => {
  const selectQuery = `
    SELECT
      creatorIp, creatorId, creatorName,
      creatorMail, creatorTwitchId, creatorLogo
    FROM creatorInfo
    WHERE creatorId = ?`;

  const user: Session = {
    creatorId: profile.id,
    creatorDisplayName: profile.display_name,
    creatorName: profile.login,
    creatorMail: profile.email,
    creatorLogo: profile.profile_image_url,
    userType: 'creator'
  };

  doQuery(selectQuery, [user.creatorId])
    .then((row): void => {
      const creatorData = row.result[0];
      // 기존 유저 로그인 시
      if (creatorData) {
        console.log(`[${new Date().toLocaleString()}] [크리에이터트위치로그인] ${user.creatorDisplayName}`);
        user.creatorIp = creatorData.creatorIp;

        // 트위치 Data 변경시에 변경된 값을 반영하는 영역.
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
              return done(errorData);
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
              return done(errorData);
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
                return done(errorData);
              }),
            doQuery(landingClickUpdateQuery, [user.creatorName, user.creatorId])
              .then(() => done(null, user))
              .catch((errorData) => {
                console.log(errorData);
                return done(errorData);
              })
          ]);
        }
        return done(null, user);
      }
      // 최초 로그인 시
      console.log(`${user.creatorDisplayName} 님이 최초 로그인 하셨습니다.`);
      const creatorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const campaignList = JSON.stringify({ campaignList: [] });

      const creatorBannerUrl = makeAdvertiseUrl();
      user.creatorIp = creatorIp;

      const infoQuery = `
                INSERT INTO creatorInfo
                (creatorId, creatorName, creatorMail, creatorIp, advertiseUrl, creatorTwitchId, creatorLogo, remoteControllerUrl)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

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
          user.creatorMail, creatorIp, creatorBannerUrl,
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
      return done(null, user);
    })
    .catch((errorData) => {
      console.log(errorData);
      done(errorData);
    });
};

const marketerGoogle = (
  accessToken: string,
  refreshToken: string, profile: Google.Profile,
  done: Google.VerifyCallback
): void => {
  // 최초 로그인시를 정의한다. 존재할 때는 sub를 통해서 DB에서 값을 조회한다.
  const jsonData = profile._json;
  const {
    sub, given_name, family_name, email
  } = jsonData;

  const checkQuery = `
  SELECT
    marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
    marketerAccountNumber
  FROM marketerInfo
  WHERE marketerId = ?
  AND platformType = 1`;

  doQuery(checkQuery, [sub])
    .then((row) => {
      if (row.result[0]) {
        // ID가 존재할 경우.
        const marketerData = row.result[0];
        const user: Session = {
          marketerId: marketerData.marketerId,
          userType: 'marketer',
          marketerMail: marketerData.marketerMail,
          marketerAccountNumber: marketerData.marketerAccountNumber,
          marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
          marketerName: marketerData.marketerName,
          marketerPhoneNum: marketerData.marketerPhoneNum,
          registered: true
        };
        const stampQuery = `
        INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
        doQuery(stampQuery, [user.marketerId, '', '1']);
        console.log(`[${new Date().toLocaleString()}] [마케터구글로그인] ${user.marketerName}`);

        // passport-google-oauth20의 done function 타입
        // done(null, user) X done(undefined, user)
        return done(undefined, user);
      }

      const user = {
        userType: 'marketer',
        marketerMail: email,
        marketerName: family_name + given_name,
        marketerPlatformData: sub,
        registered: false
      };
      // passport-google-oauth20의 done function 타입
      // done(null, user) X done(undefined, user)
      return done(undefined, user);
    })
    .catch((errorData) => done(errorData));
};

const marketerNaver: Naver.VerifyFunction = (accessToken, refreshToken, profile, done) => {
  const jsonData = profile._json;

  const { email, id } = jsonData;

  const checkQuery = `
  SELECT
    marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
    marketerAccountNumber
  FROM marketerInfo
  WHERE marketerId = ?
  AND platformType = 2 `;

  doQuery(checkQuery, [id])
    .then((row) => {
      if (row.result[0]) {
        // ID가 존재할 경우.
        const marketerData = row.result[0];
        const user: Session = {
          marketerId: marketerData.marketerId,
          userType: 'marketer',
          marketerMail: marketerData.marketerMail,
          marketerAccountNumber: marketerData.marketerAccountNumber,
          marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
          marketerName: marketerData.marketerName,
          marketerPhoneNum: marketerData.marketerPhoneNum,
          registered: true
        };
        const stampQuery = `
        INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
        doQuery(stampQuery, [user.marketerId, '', '1']);
        console.log(`[${new Date().toLocaleString()}] [마케터네이버로그인] ${user.marketerName}`);

        return done(null, user);
      }

      const user = {
        userType: 'marketer',
        marketerPlatformData: id,
        registered: false,
        marketerMail: email
      };
      return done(null, user);
    })
    .catch((errorData) => done(errorData));
};

const marketerKakao: Kakao.VerifyFunction = (accessToken, refreshToken, profile, done) => {
  const jsonData = profile._json;

  const { id, kakao_account } = jsonData;

  const checkQuery = `
  SELECT marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
  marketerAccountNumber
  FROM marketerInfo
  WHERE marketerId = ?
  AND platformType = 3 `;

  doQuery(checkQuery, [id])
    .then((row) => {
      if (row.result[0]) { // ID가 존재할 경우.
        const marketerData = row.result[0];
        const user: Session = {
          marketerId: marketerData.marketerId,
          userType: 'marketer',
          marketerMail: marketerData.marketerMail,
          marketerAccountNumber: marketerData.marketerAccountNumber,
          marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
          marketerName: marketerData.marketerName,
          marketerPhoneNum: marketerData.marketerPhoneNum,
          registered: true
        };
        const stampQuery = `
        INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
        doQuery(stampQuery, [user.marketerId, '', '1']);
        console.log(`[${new Date().toLocaleString()}] [마케터카카오로그인] ${user.marketerName}`);

        return done(null, user);
      }

      const user: Session = {
        userType: 'marketer',
        marketerPlatformData: id,
        registered: false
      };

      if (kakao_account.has_email) {
        user.marketerMail = kakao_account.email;
      }

      return done(null, user);
    })
    .catch((errorData) => done(errorData));
};

// 기존 로그인 방식의 크리에이터의 새로운 회원가입을 위한 verification함수
const creatorTwitchPreCreator = (
  req: express.Request, accessToken: string,
  refreshToken: string, profile: any,
  done: OAuth2Strategy.VerifyCallback
): void => {
  // 이전에 트위치 로그인을 사용해 사용했던 크리에이터를 찾는다. V
  // 프론트로 보낸다. ( 크리에이터 아이디/이름과 엑세스 토큰을 ) V
  const searchQuery = `
  SELECT creatorId, creatorName FROM creatorInfo WHERE creatorId = ? LIMIT 1`;
  const searchArray = [profile.id];
  doQuery(searchQuery, searchArray).then((row) => {
    if (row.result.length > 0) {
      // 해당 크리에이터의 twitch api 리프레시 토큰 삽입
      const updateRefreshTokenQuery = `
      UPDATE creatorInfo SET creatorTwitchRefreshToken = ? WHERE creatorId = ?
      `;
      doQuery(updateRefreshTokenQuery, [refreshToken, profile.id]);

      done(null, {
        userType: 'creator',
        accessToken,
        creatorId: row.result[0].creatorId,
        creatorName: row.result[0].creatorName,
      });
    } else done(Error('error=no-pre-creator'));
  })
    .catch((err) => done(Error(`Internal Server Error\n${err}`)));
};

/**
 * Twitch 연동 패스포트 verification 미들웨어 - 트위치 로그인이 아닌 "연동" 미들웨어.
 * @param req 요청객체
 * @param accessToken twitch 액세스토큰
 * @param refreshToken twitch 리프레시 토큰
 * @param profile twitch 로그인 user 정보
 * @param done 세션 체크 완료 콜백함수
 */
const creatorTwitchLink = async (
  req: express.Request, accessToken: string,
  refreshToken: string, profile: any,
  done: OAuth2Strategy.VerifyCallback
): Promise<void> => {
  const { creatorId } = req.user as Session;
  const newCreatorTwitchOriginalId = profile.id; // 트위치 고유 아이디 (ex. 13009139)
  const newCreatorName = profile.display_name; // 트위치 닉네임 (ex. 화수르)
  const newCreatorTwitchId = profile.login; // 트위치 로그인 아이디 (ex. hwasurr)
  const newCreatorMail = profile.email; // 트위치 가입 이메일 주소
  const newCreatorLogo = profile.profile_image_url; // 트위치 로고 주소

  // ***************************************************
  // 기존 유저 체크
  // 이전 온애드 계정 사용으로, creatorId 가 twitchId인 경우 (본인일 수 있음)
  const preCreatorQuery = `
    SELECT creatorId, creatorName
    FROM creatorInfo
    WHERE creatorId = ? AND creatorTwitchId = ?
  `;
  const preCreatorRow = await doQuery(
    preCreatorQuery, [newCreatorTwitchOriginalId, newCreatorTwitchId]
  );
  if (preCreatorRow.result.length > 0) {
    const alreadyLinked = preCreatorRow.result[0];
    if (alreadyLinked.creatorId === newCreatorTwitchOriginalId) {
      done(Error('error=precreator'));
    }
  } else {
    // ***************************************************
    // 연결된 다른 유저가 있는지 조회
    const searchQuery = `SELECT creatorId, creatorName, loginId
    FROM creatorInfo WHERE creatorTwitchOriginalId = ?`;
    const { result } = await doQuery(searchQuery, [newCreatorTwitchOriginalId]);
    // 이미 해당 아이디에 연결된 유저가 있는 경우
    if (result.length > 0) {
      const alreadyLinked = result[0];
      // loginId가 있는 새로운 로그인 방식으로 가입한 다른 유저의 경우
      const user = `${alreadyLinked.loginId.slice(0, alreadyLinked.loginId.length - 2)}**`;
      done(Error(`error=alreadyLinked&user=${user}`));
    } else {
      // 이미 해당 twitch 아이디에 연결된 유저가 없는 경우.
      // 정상 연결 작업
      const linkQuery = `
      UPDATE creatorInfo
      SET
      creatorTwitchOriginalId = ?, creatorName = ?,
      creatorTwitchId = ?, creatorMail = ?, creatorLogo = ?,
      creatorTwitchRefreshToken = ?
      WHERE creatorId = ?`;
      const queryArray = [
        newCreatorTwitchOriginalId, newCreatorName,
        newCreatorTwitchId, newCreatorMail, newCreatorLogo,
        refreshToken, creatorId
      ];

      doQuery(linkQuery, queryArray)
        .then((row) => {
          if (row.result) {
            done(null, {
              userType: 'creator',
              creatorId,
              newCreatorTwitchOriginalId,
              newCreatorName,
              newCreatorMail,
              newCreatorLogo,
            });
          } else {
            done(Error('DB Update Error'));
          }
        })
        .catch((err) => done(err));
    }
  }
};

export default {
  local,
  creatorTwitch,
  creatorTwitchLink,
  creatorTwitchPreCreator,
  marketerGoogle,
  marketerNaver,
  marketerKakao,
};
