
// 미들웨어
import middleware from './middleware';

// Helper함수
import helper from './helper';

export default {
  getParam: helper.getParam,
  getOptionalParam: helper.getOptionalParam,
  getSessionData: helper.getSessionData,
  paramValidationCheck: helper.paramValidationCheck,
  send: helper.send,
  promiseError: helper.promiseError,
  /**
   * 에러처리 및 요청처리를 돕는 미들웨어들을 프로퍼티로 갖는 객체
   */
  middleware: {
    /**
   * `req` 로부터 세션의 여부를 체크하여 세션이 없는 경우 401에러(Unauthorized) 를 전파하는 미들웨어  
   * 요청에 세션 체크가 필요한 경우 해당 라우터핸들러의 첫 미들웨어로 이 함수를 넣어야 한다.
   * 요청에 세션 체크가 필요하지 않은 경우 사용하지 않으면 된다.
   * @param req `express.Request`
   * @param res `express.Response`
   * @param next `express.NextFunction`
   * @author hwasurr
   */
    checkSessionExists: middleware.checkSessionExists,
    /**
   * `req` 로부터 `api_key` 값을 체크하여 세션이 없는 경우 401에러(Unauthorized) 를 전파하는 미들웨어  
   * 요청에 `api_key` 체크가 필요한 경우 해당 라우터핸들러의 첫 미들웨어로 이 함수를 넣어야 한다.
   * 요청에 `api_key` 체크가 필요하지 않은 경우 사용하지 않으면 된다.
   * @param req `express.Request`
   * @param res `express.Response`
   * @param next `express.NextFunction`
   * @author hwasurr
   */
    checkAuth: middleware.checkAuth,
    /**
   * @param fn 미들웨어 함수 (리퀘스트 핸들러)
   * @description `async/await` 함수 또는 `Promise`를 반환하는 미들웨어 함수의 에러 캐치를 도와주는 함수.
   *
   * `async`함수 또는 `Promise`를 반환하는 함수일때에만 사용한다.  
   * `.catch()` 구문을 작성할 필요 없이, 에러를 `throw` 하기만 하면 해당 에러가 에러핸들링 미들웨어로 전파된다.  
   * 
   * @example
   * withErrorCatch(async (req, res, next) => {
   *   await new Promise(resolve => setTimeout(() => resolve()), 50);
   *   throw new createError[ERROR_CODE](ERROR_MESSAGE);
   * })
   * @author hwasurr
   */
    withErrorCatch: middleware.withErrorCatch,
    /**
   * 라우터의 사용하지 않는 메소드 핸들러의 경우 해당 함수를 미들웨어로 두어
   * 405에러 (Method Not Allowed) 를 발생시키도록 하는 미들웨어.
   * @param req `express.Request`
   * @param res `express.Response`
   * @param next `express.NextFunction`
   * @example
   * // get과 patch 메소드만을 사용하는 엔드포인트의 경우
   * router.route('/some-end-point')
   *   .get((req, res, next) => {
   *     // some middleware
   *   })
   *   .post(unusedMethod)
   *   .put(unusedMethod)
   *   .patch(someMiddleware)
   *   .delete(unusedMethod)
   * @author hwasurr
   */
    unusedMethod: middleware.unusedMethod,
  }
};
