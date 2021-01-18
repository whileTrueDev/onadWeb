import Axios from 'axios';
import express from 'express';
import responseHelper from '../../middlewares/responseHelper';

const router = express.Router();

router.route('/')
  // 본인인증 처리
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const imp_uid: string = responseHelper.getParam('imp_uid', 'post', req);
      console.log('[본인인증요청] imp_uid: ', imp_uid);
      try {
        // 인증 토큰 발급 받기
        const getToken = await Axios({
          url: 'https://api.iamport.kr/users/getToken',
          method: 'post', // POST method
          headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
          data: {
            imp_key: process.env.IMP_KEY, // REST API키
            imp_secret: process.env.IMP_SECRET // REST API Secret
          }
        });

        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 인증 정보 조회
        const getCertifications = await Axios({
          url: `https://api.iamport.kr/certifications/${imp_uid}`, // imp_uid 전달
          method: 'get', // GET method
          headers: { Authorization: access_token } // 인증 토큰 Authorization header에 추가
        });
        const certificationsInfo = getCertifications.data.response; // 조회한 인증 정보
        // 인증정보에 대한 데이터를 저장하거나 사용한다.

        const {
          birth
        } = certificationsInfo;

        const date = new Date(birth);
        const now = new Date();
        now.setFullYear(now.getFullYear() - 19);

        const minor = now < date;
        responseHelper.send({ error: false, data: { minor } }, 'post', res);
      } catch (e) {
        console.error(e);
        responseHelper.send({ error: true, data: { msg: '서버오류입니다. 잠시후 다시 진행해주세요.' } }, 'post', res);
        // responseHelper.promiseError(error, next);
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
