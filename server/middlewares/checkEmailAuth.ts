/*
DB에 접근하여 context에 저장할 session값을 불러오는 작업을 진행.
*/
import doQuery from '../model/doQuery';

const checkEmailAuth = (req: any, res: any): void => {
  const { message } = req.session.passport.user;
  if (req.session.passport.user.message) {
    res.send([true, message]);
  } else if (req.session.passport.user.userType === 'marketer') {
    const { marketerId } = req.session.passport.user;
    const checkQuery = `
      SELECT marketerEmailAuth, temporaryLogin
      FROM marketerInfo
      WHERE marketerId = ? `;
    doQuery(checkQuery, [marketerId])
      .then((row) => {
        const { marketerEmailAuth } = row.result[0];
        if (!marketerEmailAuth) {
          console.log('인증되지 않았습니다.');
          res.send([true, '이메일 본인인증을 해야합니다.']);
        } else {
          console.log('인증되었습니다.');
          res.send([false, row.result[0]]);
        }
      })
      .catch(() => {
        res.send([true, '일시적인 DB오류입니다. 로그인이 불가하오니 잠시 후 다시 시도해주세요..']);
      });
  } else if (req.session.passport.user.userType === 'creator') {
    res.send('success');
  }
};

export default checkEmailAuth;
