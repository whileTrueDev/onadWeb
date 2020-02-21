// DB 커넥션 쿼리 함수
import doQuery from '../../model/doQuery';
// 암호화 체크 객체 생성
import encrpyto from '../encryption';

/* 2019-07-03 박찬우

1. session에 저장할 값 (변경되지 않는 영속적인 값)
    - useType
    - userId
    - marketerUserType

2. context에 저장할 값 (User의 기본적인 정보.)
    - userid : userid,
    - userType: 'marketer',
    - marketerName
    - marketerEmail
    - marketerContraction
    - marketerPhoneNum
    - marketerUserType
    - marketerAccountNumber

3. 구동방식
추후에 비밀번호 및 ID에 대한 오류 수정.
*/
const marketerLocal = (
  userid: string, passwd: string,
  done: (error: any, user?: any, options?: any) => void
): void => {
  console.log(`${userid} 로그인 수행`);
  const checkQuery = `
      SELECT marketerPasswd, marketerSalt,
      marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
      marketerUserType, marketerAccountNumber, marketerEmailAuth
      FROM marketerInfo
      WHERE marketerId = ? `;

  doQuery(checkQuery, [userid])
    .then((row) => {
      if (row.result[0]) {
        const marketerData = row.result[0];
        if (encrpyto.check(passwd, marketerData.marketerPasswd, marketerData.marketerSalt)) {
          const user = {
            userid,
            userType: 'marketer',
            marketerUserType: marketerData.marketerUserType,
            marketerMail: marketerData.marketerMail,
            marketerAccountNumber: marketerData.marketerAccountNumber,
            marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
            marketerName: marketerData.marketerName,
            marketerPhoneNum: marketerData.marketerPhoneNum,
          };
          const stampQuery = `
            INSERT INTO loginStamp(userId, userIp, userType) Values(?,?,?)`;
          doQuery(stampQuery, [user.userid, '', '1']);
          console.log(`${marketerData.marketerName} 로그인 하였습니다.`);

          return done(null, user);
        }

        console.log(`${marketerData.marketerName} 비밀번호가 일치하지 않습니다.`);
        return done(null, { message: '비밀번호가 일치하지 않습니다.' });
      }

      console.log('회원이 아닙니다.');
      return done('회원이 아닙니다.');
    })
    .catch((errorData) => done(errorData));
};

export default {
  marketerLocal
};
