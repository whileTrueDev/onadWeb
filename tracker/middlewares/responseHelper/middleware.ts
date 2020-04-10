import express from 'express';
import createError from 'http-errors';
import responseMessages from '../../lib/responseMessages';

export interface RequestHandler {
  /** handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): void;
}
export interface RequestPromiseHandler {
  /** promise handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}

/**
 * `req` 로부터 세션의 여부를 체크하여 세션이 없는 경우 401에러(Unauthorized) 를 전파하는 미들웨어  
 * 요청에 세션 체크가 필요한 경우 해당 라우터핸들러의 첫 미들웨어로 이 함수를 넣어야 한다.
 * 요청에 세션 체크가 필요하지 않은 경우 사용하지 않으면 된다.
 * @param req `express.Request`
 * @param res `express.Response`
 * @param next `express.NextFunction`
 * @author hwasurr
 */
const checkSessionExists: RequestHandler = (req, res, next) => {
  /** ******************
   * Session Check
   ****************** */
  if ((req && req.session && req.session.passport && req.session.passport.user)
    || (req && req.user)) {
    next();
  } else {
    next(new createError[401](responseMessages.ERROR_401));
  }
};

/**
 * `req` 로부터 `api_key` 값을 체크하여 세션이 없는 경우 401에러(Unauthorized) 를 전파하는 미들웨어  
 * 요청에 `api_key` 체크가 필요한 경우 해당 라우터핸들러의 첫 미들웨어로 이 함수를 넣어야 한다.
 * 요청에 `api_key` 체크가 필요하지 않은 경우 사용하지 않으면 된다.
 * @param req `express.Request`
 * @param res `express.Response`
 * @param next `express.NextFunction`
 * @author hwasurr
 */
const checkAuth: RequestHandler = (req, res, next) => {
  /** ******************
   * Authorization tasks ( API_KEY check )
   ****************** */
  if (req && req.session && req.session.passport && req.session.passport.user) {
    next();
  } else {
    // res.send('session not exists');
    next(new createError[401](responseMessages.ERROR_401));
  }
};

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
const withErrorCatch = (
  fn: RequestPromiseHandler
): RequestHandler => (
  req, res, next
): void => {
    fn(req, res, next).catch(next);
  };

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
const unusedMethod: RequestHandler = (req, res, next) => {
  next(new createError[405](responseMessages.ERROR_405));
};

export default {
  unusedMethod, checkAuth, checkSessionExists, withErrorCatch
};
