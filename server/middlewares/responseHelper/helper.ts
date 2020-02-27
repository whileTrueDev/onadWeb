import express from 'express';
import createError from 'http-errors';
import responseMessages from '../../lib/responseMessages';
import { Session } from '../../@types/session';

/**
 * 제공된 필드명의 파라미터를 반환하는 함수.  
 * 필드명의 파라미터가 요청객체에 없는 경우 400 에러를 발생시킨다.
 * @param paramField 필드명 또는 필드명을 요소로 하는 배열
 * @param method 현재 HTTP 메소드  get | post | put | patch | delete
 * @param req `express.Request`
 * @example
 * 
 * const marketerId = getParam('marketerId', 'get', req);
 * const [marketerId, marketerName] = getParam(['marketerId', 'marketerName'], 'get', req);
 * 
 * @author hwasurr
 */
const getParam = (paramField: string | string[],
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  req: express.Request): any | any[] => {
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
        if (!(req.body[paramField])) {
          throw new createError[400](responseMessages.ERROR_400);
        }
        return req.body[paramField];
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

/**
 * 세션데이터를 반환하는 함수.  
 * 세션이 없는 경우 401에러(Unauthorized) 를 발생시킨다.
 * @param req `express.Request`
 * @example
 * 
 * router.route('/some-end-point')
 *   .get((req, res, next) => {
 *     const session = getSessionData(req);
 *     const { marketerId } = getSessionData(req);
 *     const { creatorId } = getSessionData(req);
 *   })
 * 
 * @author hwasurr
 */
const getSessionData = (req: express.Request): Session => {
  if (req && req.session && req.session.passport && req.session.passport.user) {
    return req.session.passport.user;
  }
  throw new createError[401](responseMessages.ERROR_401);
};

/**
 * 세션 데이터와 파라미터 데이터를 체크하여  
 * 타인의 정보를 요청한 경우 403에러(Forbidden)를 발생시킨다,
 * @param param 유효성 체크할 파라미터 데이터
 * @param field 유효성 체크할 파라미터의 필드명 (세션의 key값)
 * @param req `express.Request`
 * @return `true` | `createError[405]('Forbidden')`
 * @author hwasurr
 */
const paramValidationCheck = (param: string | number | undefined,
  field: keyof Session,
  req: express.Request): true => {
  if (req.session && param === req.session.passport.user[field]) {
    return true;
  }
  throw new createError[403](responseMessages.ERROR_403);
};

/**
 * 데이터를 요청지로 전송하는 send함수.  
 * 올바른 HTTP status와 함께 전송하도록 도와준다.
 * @param resultData res.body에 실어 보낼 데이터
 * @param method 현재 메소드(HTTP Method) get | post | put | patch | delete
 * @param res `express.Response`
 */
const send = (
  resultData: any,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  res: express.Response
): void => {
  const OK = 200;
  const CREATED = 2001;
  switch (method.toLowerCase()) {
    case 'post':
      res.status(CREATED).json(resultData);
      break;
    case 'get':
    case 'put':
    case 'patch':
    case 'delete':
      res.status(OK).json(resultData);
      break;
    default:
      throw new Error('send함수에 올바른 Method 명을 입력하지 않았습니다.');
  }
};

export default {
  getParam, getSessionData, paramValidationCheck, send
};
