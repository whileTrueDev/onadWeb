import express from 'express';
import createError from 'http-errors';
import responseMessages from '../lib/responseMessages';

export interface RequestHandler {
  /** handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): void;
}
export interface RequestPromiseHandler {
  /** promise handler function (Middleware) */
  (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}

export default class Controller {
  router = express.Router();

  protected checkSessionExists: RequestHandler = (req, res, next) => {
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

  protected checkAuth: RequestHandler = (req, res, next) => {
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

  protected withErrorCatch = (fn: RequestPromiseHandler): RequestHandler => (
    req, res, next
  ): void => {
    fn(req, res, next).catch(next);
  };

  protected unusedMethod: RequestHandler = (req, res, next) => {
    next(new createError[405](responseMessages.ERROR_405));
  };
}
