import express from 'express';
import createError from 'http-errors';
import responseMessages from '../lib/responseMessages';
import { Session } from '../@types/session';

export interface RequestHandler {
  /** handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): void;
}
export interface RequestPromiseHandler {
  /** promise handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}

export default class Controller {
  path = '';

  router = express.Router();

  // *********************************
  // ********** Middlewares **********
  // *********************************
  private checkSessionExists: RequestHandler = (req, res, next) => {
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

  private checkAuth: RequestHandler = (req, res, next) => {
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

  private withErrorCatch = (fn: RequestPromiseHandler): RequestHandler => (
    req, res, next
  ): void => {
    fn(req, res, next).catch(next);
  };

  private unusedMethod: RequestHandler = (req, res, next) => {
    next(new createError[405](responseMessages.ERROR_405));
  };

  protected middlewares = {
    checkSessionExists: this.checkSessionExists,
    checkAuth: this.checkAuth,
    withErrorCatch: this.withErrorCatch,
    unusedMethod: this.unusedMethod
  }

  // *********************************
  // ************ Helprs *************
  // *********************************
  protected getParam = (paramField: string | string[],
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    req: express.Request): any | any[] => {
    // 파라미터 field가 하나의 문자열인 경우
    if (typeof paramField === 'string') {
      switch (method.toLowerCase()) {
        case 'get':
          if (!(Object.keys(req.query).includes(paramField))) {
            throw new createError[400](responseMessages.ERROR_400);
          }
          return req.query[paramField];
        case 'post':
        case 'put':
        case 'patch':
        case 'delete':
          if (!Object.keys(req.body).includes(paramField)) {
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
          if (!(Object.keys(req.query).includes(param))) {
            throw new createError[400](responseMessages.ERROR_400);
          }
          return req.query[param];
        });
      case 'post':
      case 'put':
      case 'patch':
      case 'delete':
        return paramField.map((param) => {
          if (!Object.keys(req.body).includes(param)) {
            throw new createError[400](responseMessages.ERROR_400);
          }
          return req.body[param];
        });
      default:
        throw new Error('getParam에 올바른 Method 명을 입력하지 않았습니다.');
    }
  };

  protected getOptionalParam = (paramField: string | string[],
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    req: express.Request): any | any[] => {
    // 파라미터 field가 하나의 문자열인 경우
    if (typeof paramField === 'string') {
      switch (method.toLowerCase()) {
        case 'get':
          return req.query[paramField];
        case 'post':
        case 'put':
        case 'patch':
        case 'delete':
          return req.body[paramField];
        default:
          throw new Error('getOptionalParam에 올바른 Method 명을 입력하지 않았습니다.');
      }
    }
    // 파라미터 field가 배열인 경우
    switch (method.toLowerCase()) {
      case 'get':
        return paramField.map((param) => req.query[param]);
      case 'post':
      case 'put':
      case 'patch':
      case 'delete':
        return paramField.map((param) => req.body[param]);
      default:
        throw new Error('getOptionalParam에 올바른 Method 명을 입력하지 않았습니다.');
    }
  };

  protected getSessionData = (req: express.Request): Session => {
    if (req && req.session && req.session.passport && req.session.passport.user) {
      return req.session.passport.user;
    }
    throw new createError[401](responseMessages.ERROR_401);
  };

  protected send = (
    resultData: any,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    res: express.Response
  ): void => {
    const OK = 200;
    const CREATED = 201;
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

  protected promiseError = (error: Error, next: express.NextFunction): void => {
    next(new createError[500](error.message));
  };
}
