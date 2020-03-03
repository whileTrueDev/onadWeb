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
  // 크리에이터 유저정보(암호화 해제하여 전송) 조회
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
        .then((row) => {
          responseHelper.send(row, 'POST', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .patch(

  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/ad-page')
  // 크리에이터 광고 페이지 정보
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      // const session = responseHelper.getSessionData(req);
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT  CL.creatorTwitchId, CL.creatorDesc, CL.creatorBackgroundImage, CL.creatorTheme, CR.visitCount
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
  .all(responseHelper.middleware.unusedMethod);

export default router;
