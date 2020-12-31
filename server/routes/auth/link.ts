
import Axios from 'axios';
import express from 'express';
import shortid from 'shortid';
import passport from 'passport';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const HOST = process.env.REACT_HOSTNAME;
const router = express.Router();

// ************************************************************
// 온애드 계정 연결 - 트위치
// middlewares/auth/passport/verification 의 creatorTwitchLink 함수를 확인.
router.get('/twitch', passport.authenticate('twitch-link'));
router.route('/twitch/callback')
  .get(
    passport.authenticate('twitch-link'),
    (req, res) => { res.redirect(`${HOST}/mypage/creator/user`); }
  )
  // exception filter 역할의 에러 처리 미들웨어
  .get((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.message) {
      res.redirect(`${HOST}/mypage/creator/user?${err.message}&platform=twitch`);
    } else res.redirect(`${HOST}/mypage/creator/user?error=error&platform=twitch`);
  });


// 트위치 연동을 해제 (쪽지인증정보를 제거하는것이 아닌 creatorInfo의 연동을 제거)
router.delete('/twitch',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const query = `UPDATE creatorInfo_v2
    SET
      creatorTwitchOriginalId = ?, creatorName = ?, creatorTwitchId = ?,
      creatorMail = ?, creatorLogo = ?, creatorTwitchRefreshToken = ?
    WHERE creatorId = ?`;
    const queryArray = [null, null, null, null, null, null, creatorId];
    const { result } = await doQuery(query, queryArray);
    if (result.affectedRows > 0) {
      responseHelper.send('success', 'delete', res);
    }
  }));

// ***********************************************************
// 온애드 계정 연결 - 아프리카

// 아프리카 쪽지 인증 기록 조회
router.get('/afreeca/cert',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const query = `SELECT * FROM afreecaLinkCertification
    WHERE creatorId = ? AND certState = 0`;
    const { result } = await doQuery(query, [creatorId]);
    if (result.length > 0) {
      responseHelper.send(result[0], 'get', res);
    }
  }));
// 아프리카 쪽지 인증을 이용한 채널 연동
router.post('/afreeca/cert',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const afreecaId = responseHelper.getParam('afreecaId', 'POST', req);

    // 요청받은 afreecaId가 이미 다른 onad유저에게 연동되어 있는 지 체크
    const checkQuery = `SELECT creatorId, loginId FROM creatorInfo_v2
    WHERE afreecaId = ?`;
    const checkQueryArray = [afreecaId];
    const alreadyLinked = await doQuery(checkQuery, checkQueryArray);

    // 이미 다른 유저에게 연동되어 있는 경우
    if (alreadyLinked.result.length > 0) {
      const alreadyLinkedUser = alreadyLinked.result[0];
      responseHelper.send({
        status: 'already-linked',
        user: { creatorId: alreadyLinkedUser.creatorId, loginId: alreadyLinkedUser.loginId }
      }, 'post', res);
      return;
    }

    // 동일한 온애드 유저로부터의 동일한 afreecaId로의 인증번호 발급이 이미 있는 경우
    const check2Query = `SELECT
    creatorId, afreecaId, tempCode, createdAt, certState
    FROM afreecaLinkCertification
    WHERE certState = 0 AND creatorId = ? AND afreecaId = ? LIMIT 1`;
    const check2QueryArray = [creatorId, afreecaId];
    const duplicateRequestCheck = await doQuery(check2Query, check2QueryArray);
    if (duplicateRequestCheck.result.length > 0) {
      responseHelper.send({
        status: 'duplicate-request',
        cert: duplicateRequestCheck.result[0]
      }, 'post', res);
      return;
    }

    // 위 두 경우가 아닌 경우
    // 인증번호 발급
    const certCode = `${new Date().getTime()}${shortid.generate()}`;

    // afreecaLinkCertification 테이블에 row 생성
    const query = `
    INSERT INTO afreecaLinkCertification
      (creatorId, tempCode, certState, afreecaId)
    VALUES (?, ?, ?, ?)`;
    // 상태 0 으로 생성
    const queryArray = [creatorId, certCode, 0, afreecaId];

    const { result } = await doQuery(query, queryArray);

    if (result.affectedRows > 0) {
      responseHelper.send({
        status: 'created',
        cert: {
          creatorId, tempCode: certCode, certState: 0, afreecaId
        }
      }, 'POST', res);
    } else {
      responseHelper.promiseError(
        Error('An error ocurred during insert afreecaLinkCertification'),
        next
      );
    }
  }));

// 아프리카 쪽지 인증 취소
router.delete('/afreeca/cert',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const query = `DELETE FROM afreecaLinkCertification
    WHERE creatorId = ? AND certState = 0`;
    const { result } = await doQuery(query, [creatorId]);
    if (result.affectedRows > 0) {
      responseHelper.send('success', 'get', res);
    }
  }));

// 아프리카 연동을 해제 (쪽지인증정보를 제거하는것이 아닌 creatorInfo의 연동을 제거)
router.delete('/afreeca',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const query = `UPDATE creatorInfo_v2
    SET afreecaId = ?, afreecaName = ?, afreecaLogo = ?, afreecaRefreshToken = ?
    WHERE creatorId = ?`;
    const queryArray = [null, null, null, null, creatorId];
    const { result } = await doQuery(query, queryArray);
    if (result.affectedRows > 0) {
      responseHelper.send('success', 'delete', res);
    }
  }));

// ***************************************************************
// 향후 아프리카 open api를 통한 로그인에서 사용됨. from 2020 12 25 hwasurr
// creator - afreeca oauth 로그인
router.get('/afreeca/nextversion', (req, res) => {
  Axios.get('https://openapi.afreecatv.com/auth/code',
    {
      params: { client_id: process.env.AFREECA_KEY },
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      }
    })
    .then((apiRes) => {
      res.redirect(apiRes.request.res.responseUrl);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.sendStatus(err.response.status);
    });
});

// 향후 아프리카 open api를 통한 로그인에서 사용됨. from 2020 12 25 hwasurr
router.get('/afreeca/nextversion/callback', (req, res) => {
  const afreecaCode = req.query.code;
  Axios.post('https://openapi.afreecatv.com/auth/token',
    {
      grant_type: 'authorization_code',
      client_id: process.env.AFREECA_KEY,
      client_secret: process.env.AFREECA_SECRET_KEY,
      code: afreecaCode,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      }
    })
    .then((tokenRes) => {
      console.log(tokenRes.data);
      res.redirect(`${HOST}/creator`);
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
    });
});

export default router;
