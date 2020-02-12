const checkAuthOnReq = function (req, res, next) {
  // request 객체가 passport를 가지고 있는지 체크한다.
  // this가 제대로 자신을 참조하고 있는지 확인해야한다.
  req.isAuthenticated = function () {
    let property = 'user';
    if (this._passport && this._passport.instance._userProperty) {
      property = this._passport.instance._userProperty;
    }

    return !!(this[property]);
  };

  req.isUnauthenticated = function () {
    return !this.isAuthenticated();
  };

  next();
};

module.exports = checkAuthOnReq;
