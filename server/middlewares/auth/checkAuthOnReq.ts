import express from 'express';

function checkAuthOnReq(
  req: express.Request, res: express.Response, next: express.NextFunction
): void {
  // request 객체가 passport를 가지고 있는지 체크한다.
  // this가 제대로 자신을 참조하고 있는지 확인해야한다.
  req.isAuthenticated = function isAuthenticated(): boolean {
    let property = 'user';
    if (this._passport && this._passport.instance._userProperty) {
      property = this._passport.instance._userProperty;
    }

    if (property === 'user') {
      return !!(this.user);
    }
    return !!(this[property]);
  };

  req.isUnauthenticated = function isUnauthenticated(): boolean {
    return !this.isAuthenticated();
  };

  next();
}

export default checkAuthOnReq;
