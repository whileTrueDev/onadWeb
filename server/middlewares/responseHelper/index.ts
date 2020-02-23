import express from 'express';
import createError from 'http-errors';
import responseMessages from '../../lib/responseMessages';

interface RequestHandler {
  /** handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): void;
}
interface RequestPromiseHandler {
  /** promise handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}

interface GetParam {
  (
    paramField: string | string[],
    req: express.Request,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  ): any | any[];
}

// *******************************************************************
// *************************    미들웨어     *************************
// *******************************************************************

/**
 * `req` 로부터 세션의 여부를 체크하여 세션이 없는 경우 401에러(Unauthorized) 를 전파하는 미들웨어  
 * 요청에 세션 체크가 필요한 경우 해당 라우터핸들러의 첫 미들웨어로 이 함수를 넣어야 한다.
 * 요청에 세션 체크가 필요하지 않은 경우 사용하지 않으면 된다.
 * @param req `express.Request`
 * @param res `express.Response`
 * @param next `express.NextFunction`
 * @author hwasurr
 */
const checkSession: RequestHandler = (req, res, next) => {
  /** ******************
   * Session Check
   ****************** */
  if (req && req.session && req.session.passport && req.session.passport.user) {
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

// *******************************************************************
//                             Helper 함수
// *******************************************************************

/**
 * 제공된 필드명의 파라미터를 반환하는 함수.  
 * 필드명의 파라미터가 요청객체에 없는 경우 400 에러를 발생시킨다.
 * @param paramField 필드명 또는 필드명을 요소로 하는 배열
 * @param req `express.Request`
 * @param method HTTP Method get | post | put | patch | delete 를 값으로 갖는다.
 * @author hwasurr
 */
const getParam: GetParam = (paramField, req, method) => {
  // 파라미터 field가 하나의 문자열인 경우
  if (typeof paramField === 'string') {
    switch (method.toLowerCase()) {
      case 'get':
        if (!(req.query[paramField])) {
          throw new createError[400](responseMessages.ERROR_400);
        }
        return req.query[paramField];
      case 'post':
      case 'put':
      case 'patch':
      case 'delete':
        if (!(req.query[paramField])) {
          throw new createError[400](responseMessages.ERROR_400);
        }
        return req.query[paramField];
      default:
        throw new Error('getParam에 올바른 Method 명을 입력하지 않았습니다.');
    }
  }
  // 파라미터 field가 배열인 경우
  switch (method.toLowerCase()) {
    case 'get':
      return paramField.map((param) => {
        if (!(req.query[param])) {
          throw new createError[400](responseMessages.ERROR_400);
        }
        return req.query[param];
      });
    case 'post':
    case 'put':
    case 'patch':
    case 'delete':
      return paramField.map((param) => {
        if (!(req.body[param])) {
          throw new createError[400](responseMessages.ERROR_400);
        }
        return req.body[param];
      });
    default:
      throw new Error('getParam에 올바른 Method 명을 입력하지 않았습니다.');
  }
};

export default {
  middleware: {
    checkSession,
    checkAuth,
    withErrorCatch,
    unusedMethod,
  },
  getParam
};
