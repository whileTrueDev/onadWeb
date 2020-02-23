import express from 'express';
import createError from 'http-errors';
import responseMessages from '../../lib/responseMessages';

export interface GetParam {
  (
    paramField: string | string[],
    req: express.Request,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  ): any | any[];
}

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

export default { getParam };
