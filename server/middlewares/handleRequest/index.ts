import express from 'express';
import createError from 'http-errors';

// Http Error codes
const ERROR_301 = 'Moved Permanently';
const ERROR_400 = 'Bad Request';
const ERROR_401 = 'Unauthorized';
const ERROR_403 = 'Forbidden';
const ERROR_405 = 'Method Not Allowed';
const ERROR_429 = 'Too Many Requests';
const ERROR_500 = 'Internal Server Error';

/**
   * Request handle Middlewares
   */

// // ( 1. 요청을 받는다. req 필요시 요청으로부터 온 데이터를 변수로 설정한다)
// checkAuth() {
//   // session 체크 및 api_key 체크
// }

// getParams(targetParams: string[]): void {
//   // targetParams에 해당하는 파라미터 가져오기.
//   console.log(targetParams);
//   console.log(this.req);
// }

// // ( 2. 쿼리와 쿼리에 들어가는 변수를 선언한다 )
// getQuery() {}

// // ( 3. doQuery 또는 doTransacQuery를 통해 DB 작업을 실행한다.)
// doQuery() {

// }

// // ( 4. DB작업 이후 DB로부터의 응답에 따라 성공/실패 분기하여 요청자에게 응답한다.)
// sendResponse() {

// }
interface RequestHandler {
  (req: express.Request, res: express.Response, next: express.NextFunction): void;
}
interface RequestPromiseHandler {
  (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}
// ( 1. 요청을 받는다. req 필요시 요청으로부터 온 데이터를 변수로 설정한다)
const checkSession: RequestHandler = (req, res, next) => {
  if (req && req.session && req.session.user) {
    next();
  } else {
    next(new createError[401](ERROR_401));
  }
};

const checkAuth: RequestHandler = (req, res, next) => {
  /** ******************
   * Authorization tasks
   ****************** */
  if (req && req.session && req.session.user) {
    next();
  } else {
    // res.send('session not exists');
    next(new createError[401](ERROR_401));
  }
};

/**
 * @author hwasurr
 * @param fn 미들웨어 함수
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
 */
const withErrorCatch = (
  fn: RequestPromiseHandler
): RequestHandler => (
  req, res, next
): void => {
  fn(req, res, next).catch(next);
};

export default {
  checkSession,
  checkAuth
};
