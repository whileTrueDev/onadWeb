import express from 'express';
import createHttpError from 'http-errors';
import axios from 'axios';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';
import encrypto from '../../middlewares/encryption';
import slack from '../../lib/slack/messageWithJson';
// routers
import incomeRouter from './income';
import bannerRouter from './banner';
import notificationRouter from './notification';
import clicksRouter from './clicks';
import cpaRouter from './cpa';
import makeAdvertiseUrl from '../../lib/makeAdvertiseUrl';
import makeRemoteControllerUrl from '../../lib/makeRemoteControllerUrl';

const router = express.Router();
router.use('/income', incomeRouter);
router.use('/banner', bannerRouter);
router.use('/notification', notificationRouter);
router.use('/clicks', clicksRouter);
router.use('/cpa', cpaRouter);

// 통합 회원가입 - 아이디 중복 체크
router.route('/check-id')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const userid = responseHelper.getParam('userid', 'get', req);
      const duplicateCheckQuery = 'SELECT creatorId, loginId FROM creatorInfo WHERE loginId = ?';
      const queryArray = [userid];
      const { result } = await doQuery(duplicateCheckQuery, queryArray);
      if (result.length > 0) { // 중복아이디가 있는 경우
        responseHelper.send('duplicate', 'get', res);
      } else { // 중복 아이디가 없는 경우
        responseHelper.send('allow', 'get', res);
      }
    })
  );

router.route('/')
  // 크리에이터 유저정보(계좌암호화 해제하여 전송) 조회
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId, userType } = responseHelper.getSessionData(req);

      if (userType === 'marketer') {
        throw new createHttpError[403]('you are not a creator!');
      }
      const NowIp: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const query = `
      SELECT *
      FROM creatorInfo
      WHERE creatorId = ?`;
      doQuery(query, [creatorId])
        .then((row) => {
          const userData = row.result[0];
          const rawAccount: string = row.result[0].creatorAccountNumber || '';
          const deciphedAccountNum: string = encrypto.decipher(rawAccount);
          const deciphedIdentificationNum: string = encrypto.decipher(
            userData.identificationNumber
          );
          const deciphedphoneNum: string = encrypto.decipher(userData.phoneNumber);
          userData.identificationNumber = deciphedIdentificationNum;
          userData.phoneNumber = deciphedphoneNum;
          userData.creatorAccountNumber = deciphedAccountNum;
          const result = { ...userData, NowIp };
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .post(
    // 크리에이터 회원 가입
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const creatorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const [userid, passwd] = responseHelper.getParam(['userid', 'passwd'], 'POST', req);
      const [encryptedPassword, salt] = encrypto.make(passwd);
      // 고유 아이디
      const creatorId = `V2_${userid}_${new Date().getTime()}`;
      const createCreatorQuery = `
      INSERT INTO creatorInfo 
        (creatorId, loginId, password, passwordSalt, creatorIp) 
        VALUES (?, ?, ?, ?, ?)`;
      const queryArray = [creatorId, userid, encryptedPassword, salt, creatorIp];
      const row = await doQuery(createCreatorQuery, queryArray);
      if (row.result) {
        responseHelper.send(userid, 'post', res);
      } else next();

      // 각 테이블 기본 행 추가 (수익금, 수익률, 레벨)
      const incomeQuery = `
        INSERT INTO creatorIncome 
        (creatorId, creatorTotalIncome, creatorReceivable) 
        VALUES (?, 0, 0)`;

      const priceQuery = `
        INSERT INTO creatorPrice
        (creatorId, grade, viewerAverageCount, unitPrice)
        VALUES (?, ?, ?, ?)`;

      const royaltyQuery = `
        INSERT INTO creatorRoyaltyLevel
        (creatorId, level, exp, visitCount)
        VALUES (?, 1, 0, 0)`;

      Promise.all([
        doQuery(incomeQuery, [creatorId]),
        doQuery(priceQuery, [creatorId, 1, 0, 2]),
        doQuery(royaltyQuery, [creatorId])
      ]).then(() => responseHelper.send(userid, 'post', res))
        .catch(() => next());
    })
  )
  .patch(
    // 크리에이터 계약 OR IP 업데이트 OR CPA 계약 동의
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId, creatorName } = responseHelper.getSessionData(req);
      const [newIp, type] = responseHelper.getOptionalParam(['newIp', 'type'], 'patch', req);

      if (typeof newIp === 'string') {
        // IP update
        const ipQuery = 'UPDATE creatorInfo SET creatorIp = ? WHERE creatorId = ?';
        doQuery(ipQuery, [newIp, creatorId])
          .then(() => {
            responseHelper.send(`${creatorId}님 IP변경완료`, 'PATCH', res);
          }).catch((error) => {
            responseHelper.promiseError(error, next);
          });
      } else if (type === 'contraction') {
        // ***************************************************************************
        // 201207 - advertiseURL 생성 기능 여기서 추가필요. ( 회원가입시 -> 이용계약시 수정 )

        // 크리에이터 계약
        const creatorBannerUrl = makeAdvertiseUrl();
        const remoteControllerUrl = makeRemoteControllerUrl(creatorId);
        const contractionUpdateQuery = `
          UPDATE creatorInfo
          SET creatorContractionAgreement = ?, advertiseUrl = ?, remoteControllerUrl = ?
          WHERE creatorInfo.creatorId = ?`;
        // 계약시 생성되는 creatorCampaign 기본값
        const campaignList = JSON.stringify({ campaignList: [] });
        const campaignQuery = `
          INSERT INTO creatorCampaign
          (creatorId, campaignList, banList, pausedList)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE creatorId = creatorId
        `;
        // 계약시 생성되는 creatorLanding 기본값
        const landingQuery = `
          INSERT INTO creatorLanding
          (creatorId, creatorTwitchId)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE creatorId = creatorId`;
        Promise.all([
          doQuery(contractionUpdateQuery, [1, creatorBannerUrl, remoteControllerUrl, creatorId]),
          doQuery(campaignQuery, [creatorId, campaignList, campaignList, campaignList]),
          doQuery(landingQuery, [creatorId, creatorName])
        ])
          .then(() => {
            responseHelper.send([true], 'PATCH', res);
          })
          .catch((error) => {
            responseHelper.promiseError(error, next);
          });
      } else if (type === 'CPAAgreement') {
        const CPAAgreementUpdateQuery = `
          UPDATE creatorInfo
          SET CPAAgreement = ?
          WHERE creatorInfo.creatorId = ?`;

        doQuery(CPAAgreementUpdateQuery, [1, creatorId])
          .then(() => {
            responseHelper.send([true], 'PATCH', res);
          })
          .catch((error) => {
            responseHelper.promiseError(error, next);
          });
      } else { // newIP, type 모두 없는 경우 = 400 BadRequest
        throw new createHttpError[400]();
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 기존 트위치 로그인 -> 새로운 로그인 방식으로 변환하는 작업
// @2020 12 13 hwasurr
router.route('/pre-user')
  .post(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const [creatorId, userid, passwd, accessToken] = responseHelper.getParam([
      'creatorId', 'userid', 'passwd', 'accessToken'
    ], 'POST', req);

    // 백에서는 받은 액세스토큰으로 twitch users 요청을 진행,
    axios.get('https://api.twitch.tv/helix/users', {
      params: { id: creatorId },
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((userInfoRes) => {
        if (userInfoRes.data.data.length > 0) {
        // 올바른 정보가 오면 아디/비번을 설정
          const [encrypted, salt] = encrypto.make(passwd);
          const query = `
          UPDATE creatorInfo
          SET loginId = ?, password = ?, passwordSalt = ?, creatorTwitchOriginalId = ?
          WHERE creatorId = ?`;
          const queryArray = [userid, encrypted, salt, creatorId, creatorId];
          doQuery(query, queryArray)
            .then((row) => {
              responseHelper.send(row.result.affectedRows, 'POST', res);
            })
            .catch((err) => {
              console.error('Query Error occurred in - /pre-user');
              throw err;
            });
        }
      })
      // 액세스토큰이 없거나, 올바르지 못한 액세스토큰인 경우, 에러처리.
      .catch((err) => {
        if (err.response.status === 401) {
          throw new createHttpError[401](err.response.data);
        }
        throw err;
      });
  }));

router.route('/settlement')
  .patch( // 크리에이터 정산에 필요한 계좌 등록 / 변경
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const [bankName, bankRealName, bankAccount, CreatorName, CreatorType,
        CreatorIdentity, CreatorPhone, CreatorIDImg, CreatorAccountImg, CreatorBussinessImg]: string[] = responseHelper.getParam([
          'bankName', 'bankRealName', 'bankAccount', 'CreatorName', 'CreatorType',
          'CreatorIdentity', 'CreatorPhone', 'CreatorIDImg', 'CreatorAccountImg', 'CreatorBussinessImg'], 'patch', req);

      const AccountNumber = `${bankName}_${bankAccount}`;
      const enciphedAccountNum: string = encrypto.encipher(AccountNumber);
      const enciphedPhoneNum: string = encrypto.encipher(CreatorPhone);
      const enciphedIdentityNum: string = encrypto.encipher(CreatorIdentity);

      const settlementQuery = `
      UPDATE creatorInfo
      SET name = ?, settlementState = ?, identificationNumber = ?, phoneNumber = ?, creatorType = ?,
      identificationImg = ?, AccountImg = ?, BussinessRegiImg = ?, creatorAccountNumber = ?, realName = ?
      WHERE creatorId = ?
      `;

      doQuery(settlementQuery, [CreatorName, 1, enciphedIdentityNum, enciphedPhoneNum, CreatorType,
        CreatorIDImg, CreatorAccountImg, CreatorBussinessImg, enciphedAccountNum, bankRealName, creatorId])
        .then((row) => {
          if (row.result && row.result.affectedRows > 0) {
            responseHelper.send([true], 'patch', res);
            // 정산 등록 슬랙 알림
            slack({
              summary: '방송인 정산 등록 알림',
              text: '방송인아 정산을 등록했습니다. 확인해주세요.',
              fields: [
                { title: '방송인 아이디', value: creatorId!, short: true },
                { title: '은행', value: bankName!, short: true },
              ]
            });
          } else {
            responseHelper.promiseError(Error('정산 등록 신청 실패'), next);
          }
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  );

/**
 * Deprecated
 * # 2020. 04. 21 - 광고페이지 삭제
 */
router.route('/ad-page')
  .get(
    // 크리에이터 광고 페이지 정보
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT
        CL.creatorTwitchId, CL.creatorDesc,
        CL.creatorBackgroundImage, CL.creatorTheme, CR.visitCount, CR.level, CR.exp
      FROM creatorLanding as CL
      JOIN creatorRoyaltyLevel as CR
        ON CL.creatorId = CR.creatorId
      WHERE CL.creatorId = ?
      LIMIT 1`;
      interface CreatorAdPageResult {
        creatorTwitchId: string;
        creatorDesc: string;
        creatorBackgroundImage: string;
        creatorTheme: 'dark' | 'light';
        exp: number;
        level: number;
        visitCount: number;
      }

      const clickAndTransferQuery = `         
      SELECT 
        SUM(clickCount) as clickCount, SUM(transferCount) as transferCount
      FROM landingClick  WHERE creatorId = ?`;
      interface ClickAndTransferResult {
        clickCount: number;
        transferCount: number;
        date: string;
      }

      Promise.all([
        doQuery<CreatorAdPageResult[]>(query, [creatorId]),
        doQuery<ClickAndTransferResult[]>(clickAndTransferQuery, [creatorId])
      ])
        .then((row) => {
          const [creatorAdPageResult, clickAndTransferResult] = row;
          if (creatorAdPageResult.result && clickAndTransferResult.result) {
            const result = Object.assign(
              creatorAdPageResult.result[0], clickAndTransferResult.result[0]
            );
            responseHelper.send(result, 'get', res);
          }
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const imageUrlKey = 'creatorBackgroundImage';
      const descriptionKey = 'creatorDesc';
      const creatorThemeKey = 'creatorTheme';
      const [creatorBackgroundImage, creatorDesc, creatorTheme] = responseHelper.getOptionalParam(
        [imageUrlKey, descriptionKey, creatorThemeKey], 'patch', req
      );

      const updateFields: { key: string; value: string }[] = [];
      if (creatorBackgroundImage) {
        updateFields.push({ key: imageUrlKey, value: creatorBackgroundImage });
      }
      if (creatorDesc) { updateFields.push({ key: descriptionKey, value: creatorDesc }); }
      if (creatorTheme) { updateFields.push({ key: creatorThemeKey, value: creatorTheme }); }

      const updateArray = updateFields.map((field) => field.value).concat(creatorId as string);
      const updateStrings = updateFields.map((field, index) => {
        const comma = ',';
        const r = `${field.key} = ?`;
        if (updateFields.length - 1 === index) { return r; }
        return r + comma;
      }).join('\n ');
      const updateQuery = `
      UPDATE creatorLanding SET ${updateStrings} WHERE creatorId = ?
      `;

      doQuery(updateQuery, updateArray).then((row) => {
        if (!row.error) {
          responseHelper.send([true, '변경되었습니다.'], 'PATCH', res);
        }
      }).catch((err) => {
        responseHelper.promiseError(err, next);
      });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/landing-url')
  // 크리에이터 광고 페이지 URL
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const type = responseHelper.getParam('type', 'get', req);

      switch (type) {
        case 'twitch':
          doQuery(
            'SELECT creatorTwitchId AS targetId FROM creatorInfo WHERE creatorId = ? AND creatorTwitchId IS NOT NULL',
            [creatorId]
          )
            .then((row) => {
              if (row.result.length > 0) {
                const { targetId } = row.result[0];
                const result = `https://t.onad.io/${targetId}`;
                responseHelper.send({ url: result }, 'get', res);
              } else {
                // 오류를 반환 처리
                responseHelper.send(null, 'get', res);
              }
            }).catch((error) => {
              responseHelper.promiseError(error, next);
            });
          break;
        case 'afreeca':
          doQuery(
            'SELECT afreecaId AS targetId FROM creatorInfo WHERE creatorId = ? AND afreecaId IS NOT NULL',
            [creatorId]
          )
            .then((row) => {
              if (row.result.length > 0) {
                const { targetId } = row.result[0];
                const result = `https://t.onad.io/afreeca/${targetId}`;
                responseHelper.send({ url: result }, 'get', res);
              } else {
                // 오류를 반환 처리
                responseHelper.send(null, 'get', res);
              }
            }).catch((error) => {
              responseHelper.promiseError(error, next);
            });
          break;
        default:
          next(new createHttpError[401]('type parameter is required. type must be afreeca or twitch'));
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/adchat/agreement')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const query = 'SELECT adChatAgreement FROM creatorInfo WHERE creatorId = ?';
      const queryArray = [creatorId];

      const row = await doQuery(query, queryArray);
      if (row.result.length > 0) {
        responseHelper.send(row.result[0], 'get', res);
      }
    }),
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const targetOnOffState = responseHelper.getParam('targetOnOffState', 'patch', req);
      const query = 'UPDATE creatorInfo SET adChatAgreement = ? WHERE creatorId = ?';
      const queryArray = [targetOnOffState, creatorId];
      const row = await doQuery(query, queryArray);
      if (row.result.affectedRows > 0) {
        responseHelper.send(row.result.affectedRows, 'patch', res);
      } else {
        responseHelper.promiseError(new Error(`failed - creatorId ${creatorId} is not exists`), next);
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/level')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT
        creatorId, level, exp
      FROM creatorRoyaltyLevel
      WHERE creatorId = ?`;
      interface CreatorAdPageResult {
        creatorId: string; exp: number; level: number;
      }
      const row = await doQuery(query, [creatorId]);
      if (row.result) {
        responseHelper.send(row.result[0], 'get', res);
      }
    })
  );

router.route('/follower')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const getAccessToken = (): Promise<string> => new Promise((resolve, reject) => {
        const clientID = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        const authorizationUrl = 'https://id.twitch.tv/oauth2/token';

        axios.post(authorizationUrl, null, {
          params: {
            client_id: clientID, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'user:read:email'
          }
        })
          .then((response) => {
            const accesstoken = response.data.access_token || '';
            resolve(accesstoken);
          })
          .catch((error) => {
            console.log(error);
            console.log('twitch API를 통한 token 가져오기 실패');
            resolve('');
          });
      });

      const UpdateFollower = (accessToken: string): Promise<void> => new Promise((resolve, reject) => {
        const clientID = process.env.TWITCH_CLIENT_ID;

        const config = {
          headers: {
            'Client-ID': `${clientID}`,
            Authorization: `Bearer ${accessToken}`
          }
        };
        const url = `https://api.twitch.tv/helix/users/follows?to_id=${creatorId}`;
        axios.get(url, config)
          .then((response) => {
            const followers = response.data.total;
            responseHelper.send(followers, 'get', res);
          })
          .catch((error) => {
            console.log('twitch API를 통한 구독자수 요청 실패');
            resolve();
          });
      });
      getAccessToken().then(async (result) => {
        UpdateFollower(result);
      });
    })

  );

// 2020.12.14 hwasurr - 새로운 로그인 방식에 따른 password 변경 라우터 생성
router.route('/password')
  .patch( // 비밀번호 변경
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const sess = responseHelper.getSessionData(req);
      const newPassword = responseHelper.getParam('password', 'PATCH', req);

      const [encrypted, salt] = encrypto.make(newPassword);
      const query = 'UPDATE creatorInfo SET password = ?, passwordSalt = ? WHERE creatorId = ?';
      const queryArray = [encrypted, salt, sess.creatorId];

      doQuery(query, queryArray)
        .then((row) => {
          responseHelper.send(row.result.changedRows, 'PATCH', res);
        })
        .catch((err) => responseHelper.promiseError(err, next));
    })
  )
  .post( // 비밀번호 확인
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const sess = responseHelper.getSessionData(req);
      const password = responseHelper.getParam('password', 'post', req);

      const findQuery = `
      SELECT password, passwordSalt FROM creatorInfo WHERE creatorId = ?`;
      const queryArray = [sess.creatorId];

      doQuery(findQuery, queryArray)
        .then((row) => {
          const user = row.result[0];
          if (encrypto.check(password, user.password, user.passwordSalt)) {
            responseHelper.send(true, 'get', res);
          } else {
            responseHelper.send(false, 'get', res);
          }
        })
        .catch((err) => responseHelper.promiseError(err, next));
    })
  );

export default router;
