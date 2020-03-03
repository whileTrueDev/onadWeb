import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import dataProcessing from '../../lib/dataProcessing';
import doQuery from '../../model/doQuery';
import encrypto from '../../middlewares/encryption';
import incomeRouter from './income';
import bannerRouter from './banner';
import notificationRouter from './notification';

const router = express.Router();
router.use('/income', incomeRouter);
router.use('/banner', bannerRouter);
router.use('/notification', notificationRouter);


router.route('/')
  .all(responseHelper.middleware.checkSessionExists)
  // 크리에이터 유저정보(계좌암호화 해제하여 전송) 조회
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const session = responseHelper.getSessionData(req);
      const { creatorId } = responseHelper.getSessionData(req);
      const NowIp: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const query = `
      SELECT creatorId, creatorName, creatorIp, creatorMail, 
      creatorAccountNumber, creatorContractionAgreement, creatorTwitchId, realName
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then(row => {
          const userData = row.result[0];
          const rawAccount: string = row.result[0].creatorAccountNumber || '';
          const deciphedAccountNum: string = encrypto.decipher(rawAccount);
          userData.creatorLogo = session.creatorLogo;
          userData.creatorAccountNumber = deciphedAccountNum;
          const result: object = {
            ...userData,
            NowIp
          }
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  // 크리에이터 정산에 필요한 계좌 등록 / 변경
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {

      const { creatorId } = responseHelper.getSessionData(req);
      const [bankName, bankRealName, bankAccount]: string[] = responseHelper.getParam(['bankName', 'bankRealName', 'bankAccount'], 'post', req);
      const AccountNumber: string = `${bankName}_${bankAccount}`;
      const enciphedAccountNum: string = encrypto.encipher(AccountNumber);
      const query = `
      UPDATE creatorInfo 
      SET creatorAccountNumber = ?, realName = ?  WHERE creatorId = ?
      `;

      doQuery(query, [enciphedAccountNum, bankRealName, creatorId])
        .then(row => {
          responseHelper.send(row, 'POST', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .patch(
    // 크리에이터 계약 및 IP 업데이트
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {

      const { creatorId, creatorName } = responseHelper.getSessionData(req);
      const newIp: string | undefined = responseHelper.getParam('newIp', 'PATCH', req);

      if (typeof newIp === 'string') {
        //IP update
        const ipQuery = 'UPDATE creatorInfo SET creatorIp = ? WHERE creatorId = ?';
        doQuery(ipQuery, [newIp, creatorId])
          .then(() => {
            responseHelper.send(`${creatorId}님 IP변경완료`, 'PATCH', res);
          }).catch((error) => {
            responseHelper.promiseError(error, next)
          }
          )
      } else {
        //contraction update
        const campaignList = JSON.stringify({ campaignList: [] });

        const campaignQuery = `
        INSERT INTO creatorCampaign
        (creatorId, campaignList, banList)
        VALUES (?, ?, ?)
        `;

        const landingQuery = `
        INSERT INTO creatorLanding
        (creatorId, creatorTwitchId)
        VALUES (?, ?)`;

        const updateQuery = `
        UPDATE creatorInfo
        SET creatorContractionAgreement = ?
        WHERE creatorInfo.creatorId = ?`;

        Promise.all([
          doQuery(campaignQuery, [creatorId, campaignList, campaignList]),
          doQuery(landingQuery, [creatorId, creatorName]),
          doQuery(updateQuery, [1, creatorId])
        ])
          .then(() => {
            responseHelper.send([true], 'PATCH', res);
          })
          .catch((error) => {
            responseHelper.promiseError(error, next)
          });
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/ad-page')
  .all(responseHelper.middleware.checkSessionExists)
  .get(
    // 크리에이터 광고 페이지 정보
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT CL.creatorTwitchId, CL.creatorDesc, CL.creatorBackgroundImage, CL.creatorTheme, CR.visitCount
      FROM creatorLanding as CL
      JOIN creatorRoyaltyLevel as CR
      ON CL.creatorId = CR.creatorId 
      WHERE CL.creatorId = ?
      LIMIT 1`;

      doQuery(query, [creatorId])
        .then(row => {
          if (!row.error && row.result) {
            responseHelper.send(row.result[0], 'get', res);
          } else {
            res.end()
          }

        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .patch(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const [description, creatorTheme]: [string | undefined, string | undefined] = responseHelper.getParam(['description', 'creatorTheme'], 'PATCH', req);
      const imageUrl: string | undefined = responseHelper.getParam('imageUrl', 'PATCH', req);

      if (typeof description === 'string' || typeof creatorTheme === 'string') {
        // 소개글 관리 변경
        const query = `
          UPDATE creatorLanding
          SET creatorDesc = ?, creatorTheme = ?
          WHERE creatorId = ?
          `;
        const queryArray = [description, creatorTheme, creatorId];
        doQuery(query, queryArray)
          .then((row) => {
            if (!row.error && row.result) {
              responseHelper.send([true], 'PATCH', res);
            }
          })
          .catch((err) => {
            responseHelper.promiseError(err, next)
          });
      } else {
        // 이미지 변경
        const businessRegiQuery = `
          UPDATE creatorLanding
          SET creatorBackgroundImage = ?
          WHERE creatorId = ?`;
        const businessRegiArray = [imageUrl, creatorId];
        doQuery(businessRegiQuery, businessRegiArray)
          .then((row) => {
            if (!row.error) {
              responseHelper.send([true, '등록되었습니다.'], 'PATCH', res);
            }
          })
          .catch((err) => {
            responseHelper.promiseError(err, next)
          });
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/landing-url')
  // 크리에이터 광고 페이지 정보
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      // const session = responseHelper.getSessionData(req);
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT 
      creatorTwitchId 
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then(row => {
          const { creatorTwitchId } = row.result[0];
          const result = `http://l.onad.io/${creatorTwitchId}`
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
