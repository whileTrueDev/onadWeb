import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';
import encrypto from '../../middlewares/encryption';
import incomeRouter from './income';
import bannerRouter from './banner';
import notificationRouter from './notification';
import clicksRouter from './clicks';
import slack from '../../lib/slack/messageWithJson';

const router = express.Router();
router.use('/income', incomeRouter);
router.use('/banner', bannerRouter);
router.use('/notification', notificationRouter);
router.use('/clicks', clicksRouter);


router.route('/')
  // 크리에이터 유저정보(계좌암호화 해제하여 전송) 조회
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId, creatorLogo } = responseHelper.getSessionData(req);
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
          const deciphedIdentificationNum: string = encrypto.decipher(userData.identificationNumber);
          const deciphedphoneNum: string = encrypto.decipher(userData.phoneNumber);
          userData.creatorLogo = creatorLogo;
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
  .patch(
    // 크리에이터 계약 OR IP 업데이트
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
        // 크리에이터 계약
        const contractionUpdateQuery = `
          UPDATE creatorInfo
          SET creatorContractionAgreement = ?
          WHERE creatorInfo.creatorId = ?`;
        // 계약시 생성되는 creatorCampaign 기본값
        const campaignList = JSON.stringify({ campaignList: [] });
        const campaignQuery = `
          INSERT INTO creatorCampaign
          (creatorId, campaignList, banList)
          VALUES (?, ?, ?)
        `;
        // 계약시 생성되는 creatorLanding 기본값
        const landingQuery = `
          INSERT INTO creatorLanding
          (creatorId, creatorTwitchId)
          VALUES (?, ?)`;

        Promise.all([
          doQuery(contractionUpdateQuery, [1, creatorId]),
          doQuery(campaignQuery, [creatorId, campaignList, campaignList]),
          doQuery(landingQuery, [creatorId, creatorName])
        ])
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
              summary: '크리에이터 정산 등록 알림',
              text: '크리에이터가 정산을 등록했습니다. 확인해주세요.',
              fields: [
                { title: '크리에이터 아이디', value: creatorId!, short: true },
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

      const query = `
      SELECT 
      creatorTwitchId 
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then((row) => {
          const { creatorTwitchId } = row.result[0];
          const result = `https://l.onad.io/${creatorTwitchId}`;
          responseHelper.send({ url: result }, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
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
      responseHelper.send(row.result, 'patch', res);
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
export default router;
