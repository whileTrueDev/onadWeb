import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import encrypto from '../../../middlewares/encryption';
import setTemporaryPassword from '../../../middlewares/auth/setTemporyPassword';
import profileImageRouter from './profileImage';

const router = express.Router();
router.use('/profile-image', profileImageRouter);

/**
 * @swagger
 * paths:
 *  /:
 *     post:
 *     summary: 마케터를 등록한다.
 *     responses:
 *       201:
 *         description: 성공적으로 등록되었다. 
 *         schema:
 *           type: object
 *           properties:
 *             todos:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Todo'
 */
router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT 
            marketerId, marketerName, marketerMail, 
            marketerPhoneNum, marketerBusinessRegNum,
            marketerContraction, platformType, profileImage
            FROM marketerInfo
            WHERE marketerId = ? `;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send(row.result[0], 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [
        marketerId, marketerName,
        marketerMail, marketerPhoneNum, marketerRawPasswd
      ] = responseHelper.getParam([
        'marketerId', 'marketerName',
        'marketerMail', 'marketerPhoneNum',
        'marketerRawPasswd'
      ], 'POST', req);
      const [key, salt] = encrypto.make(marketerRawPasswd);

      const infoQuery = `
              INSERT INTO marketerInfo 
              (marketerId, marketerPasswd, marketerSalt, marketerName, marketerMail, 
              marketerPhoneNum) 
              VALUES (?, ?, ?, ?, ?, ?)`;
      const infoQueryArray = [marketerId, key, salt, marketerName, marketerMail,
        marketerPhoneNum];

      const cashQuery = `
              INSERT INTO marketerDebit
              (marketerId, cashAmount)
              VALUES (?, ?)`;

      Promise.all([
        doQuery(infoQuery, infoQueryArray),
        doQuery(cashQuery, [marketerId, 0]),
      ])
        .then(() => {
          responseHelper.send({
            error: null,
            result: 'Email skip!'
          }, 'POST', res);
          // next();
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
    // sendEmailAuth
  )
  .patch(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const [type, value] = responseHelper.getParam(['type', 'value'], 'PATCH', req);
      const getQuery = (intype: string): [string, any[]] => {
        switch (intype) {
          case 'password': {
            const [key, salt] = encrypto.make(value);
            return [`
                        UPDATE marketerInfo 
                        SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 0
                        WHERE marketerId = ? 
                        `, [salt, key, marketerId]];
          }
          case 'name': {
            return [`
                        UPDATE marketerInfo 
                        SET marketerName = ?
                        WHERE marketerId = ? 
                        `, [value, marketerId]];
          }
          case 'phone': {
            return [`
                        UPDATE marketerInfo 
                        SET marketerPhoneNum = ?
                        WHERE marketerId = ? 
                        `, [value, marketerId]];
          }
          case 'mail': {
            return [`
                        UPDATE marketerInfo 
                        SET marketerMail = ?
                        WHERE marketerId = ? 
                        `, [value, marketerId]];
          }
          case 'profileImage': {
            return ['UPDATE marketerInfo SET profileImage = ? WHERE marketerId = ?', [value, marketerId]];
          }
          default:
            return ['', []];
        }
      };
      const [updateQuery, params] = getQuery(type);
      doQuery(updateQuery, params)
        .then(() => {
          responseHelper.send([true], 'PATCH', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .delete(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = ` UPDATE marketerInfo SET
                                    marketerPasswd = null,
                                    marketerSalt= null,
                                    marketerName= null,
                                    marketerMail= null,
                                    marketerPhoneNum= null,
                                    marketerBusinessRegNum= null,
                                    marketerBusinessRegSrc= null,
                                    marketerContraction= null,
                                    marketerAlarmAgreement= null,
                                    marketerEmailAuth= null,
                                    date= null,
                                    temporaryLogin= null,
                                    marketerAccountNumber= null,
                                    accountHolder= null,
                                    profileImage = null,
                                    signOutState =2,
                                    signOutDate = NOW()
                                    WHERE marketerId = ?`;
      doQuery(query, [marketerId])
        .then(() => {
          req.logout();
          // session이 존재하지 않을 수 있다.
          if (req.session) {
            req.session.destroy(() => {
              console.log(`${marketerId}님 회원탈퇴`);
            });
          }
          responseHelper.send([true], 'DELETE', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/platform')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [
        marketerId, marketerName,
        marketerMail, marketerPhoneNum,
        platformType
      ] = responseHelper.getParam([
        'marketerId', 'marketerName',
        'marketerMail', 'marketerPhoneNum',
        'platformType'
      ], 'POST', req);

      const infoQuery = `
            INSERT INTO marketerInfo 
            (marketerId, marketerName, marketerMail, 
            marketerPhoneNum, platformType, marketerEmailAuth) 
            VALUES (?, ?, ?, ?, ?, ?) `;

      const infoQueryArray = [marketerId, marketerName, marketerMail,
        marketerPhoneNum, platformType, 1];

      const cashQuery = `
            INSERT INTO marketerDebit
            (marketerId, cashAmount)
            VALUES (?, ?)`;

      Promise.all([
        doQuery(infoQuery, infoQueryArray),
        doQuery(cashQuery, [marketerId, 0])
      ])
        .then(() => {
          responseHelper.send({ error: false }, 'POST', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/history')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT *
            FROM marketerActionLog
            WHERE marketerId = ?
            ORDER BY date DESC
            LIMIT 100
            `;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// marketer/sub/profile =>/accountNumber 가져옴.
// regist =>/accountNum 가져옴.  테스트 필요
router.route('/account')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT marketerAccountNumber, accountHolder
            FROM marketerInfo
            WHERE marketerId = ?`;
      doQuery(query, [marketerId])
        .then((row) => {
          const { marketerAccountNumber, accountHolder } = row.result[0];
          let accountNumber;
          if (marketerAccountNumber) {
            accountNumber = encrypto.decipher(marketerAccountNumber);
          } else {
            accountNumber = '';
          }

          responseHelper.send({
            marketerAccountNumber: accountNumber, accountHolder
          }, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .put(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const [bankName, bankRealName, bankAccount] = responseHelper.getParam(['bankName', 'bankRealName', 'bankAccount'], 'PUT', req);
      const accountNumber = `${bankName}_${bankAccount}`;
      const enciphedAccountNum = encrypto.encipher(accountNumber);
      const query = 'UPDATE marketerInfo SET marketerAccountNumber = ?, accountHolder = ? WHERE marketerId = ?';
      doQuery(query, [enciphedAccountNum, bankRealName, marketerId])
        .then(() => {
          responseHelper.send([true], 'PUT', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// marketer/sub/profile => /business, /business/upload 가져옴.
router.route('/business')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT marketerBusinessRegNum, marketerBusinessRegSrc
            FROM marketerInfo
            WHERE marketerId = ?`;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send(row.result[0], 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .put(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const taxBillData = responseHelper.getParam('value', 'PUT', req);
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            UPDATE marketerInfo
            SET marketerBusinessRegSrc = ?
            WHERE marketerId = ?`;
      // S3에 저장
      // S3.uploadImage(`business-regi/${marketerId}`, businessImageSrc);
      doQuery(query, [taxBillData, marketerId])
        .then(() => {
          responseHelper.send([true], 'PUT', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


interface Taxbill {
  state: string | number;
  cashAmount: string;
}

// marketer/sub/profile =>taxbill
router.route('/tax-bills')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT date, cashAmount, state FROM marketerTaxBill
            WHERE marketerId = ?
            ORDER BY date DESC`;
      doQuery(query, [marketerId])
        .then((row) => {
          const sendArray: any[] = [];
          row.result.forEach((obj: Taxbill) => {
            const object = obj;
            let taxBillState = '';
            switch (object.state) {
              case 0: taxBillState = '발행대기'; break;
              case 1: taxBillState = '발행완료'; break;
              case 2: taxBillState = '미발행'; break;
              default: throw Error('tax bill state');
            }
            object.state = taxBillState;
            object.cashAmount = object.cashAmount ? object.cashAmount.toString() : '0';
            sendArray.push(Object.values(object));
          });
          responseHelper.send(sendArray, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// marketer/sub/notification =>/
// marketer/sub/notification =>/update/read
router.route('/notification')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const callQuery = `
            SELECT 
            mn.index, title, content,
            date_format(date,'%y년 %m월 %d일') AS dateform,
            readState
            FROM marketerNotification AS mn
            WHERE marketerId = ?
            ORDER BY date DESC, readState ASC`;

      const countQuery = `
            SELECT count(*) as count
            FROM marketerNotification
            WHERE marketerId = ? AND readState = 0`;
      const result = { notifications: [{}], unReadCount: 0 };

      doQuery(callQuery, [marketerId])
        .then((data) => {
          result.notifications = data.result;
          doQuery(countQuery, [marketerId])
            .then((row) => {
              if (row.result) {
                const { count } = row.result[0];
                result.unReadCount = count;
              }
              responseHelper.send(result, 'get', res);
            });
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .patch(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const index = responseHelper.getParam('index', 'PATCH', req);
      const query = `
                UPDATE marketerNotification
                SET readState = 1
                WHERE marketerNotification.index = ? AND marketerId = ?`;

      doQuery(query, [index, marketerId])
        .then(() => {
          responseHelper.send([true], 'PATCH', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

interface Notification {
  title: string;
  content: string;
  data: string;
  readState: number | string;
}

// marketer/sub/notification => /list
router.route('/notification/list')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT title, content, date_format(date,'%y. %m. %d') as date, readState
            FROM marketerNotification AS mn
            WHERE marketerId = ?
            ORDER BY readState`;

      doQuery(query, [marketerId])
        .then((data) => {
          const dataArray = data.result.map((value: Notification) => {
            const returnValue: Notification = { ...value };
            returnValue.readState = returnValue.readState ? '읽음' : '안읽음';
            return Object.values(returnValue);
          });
          console.log(dataArray);
          responseHelper.send(dataArray, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/checkId')
  // 회원 가입시 아이디 중복 체크
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const idValue: string = responseHelper.getParam('idValue', 'post', req);
      console.log('checkId로 중복확인 합니다.');
      doQuery('SELECT marketerId FROM marketerInfo WHERE marketerId = ? ', [idValue])
        .then((row) => {
          const { result } = row;
          if (result[0]) {
            // ID가 존재한다.
            responseHelper.send(true, 'post', res);
          } else {
            responseHelper.send(false, 'post', res);
          }
        })
        .catch(() => {
          responseHelper.send(false, 'post', res);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/social')
  // 세션 데이터 전송
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerPlatformData, marketerMail } = responseHelper.getSessionData(req);
      responseHelper.send({ marketerPlatformData, marketerMail }, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/tmp-password')
  .patch(
    // 아이디, 이메일로 체크 후 비밀번호 변경
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const json = {
        error: true,
        message: ''
      };
      const [marketerId, marketerMail] = responseHelper.getParam(['marketerId', 'marketerMail'], 'patch', req);

      doQuery('SELECT marketerMail, marketerId FROM marketerInfo WHERE marketerId = ? ', [marketerId])
        .then((data) => {
          const { result } = data;
          if (result[0]) {
            if (result[0].marketerMail === marketerMail && result[0].marketerId === marketerId) {
              next();
            } else {
              json.message = 'EMAIL이 일치하지 않습니다.';
              responseHelper.send(JSON.stringify(json), 'patch', res);
            }
          } else {
            json.message = '해당 ID의 회원이 존재하지 않습니다.';
            responseHelper.send(JSON.stringify(json), 'patch', res);
          }
        })
        .catch(() => {
          json.message = 'DB 관련 오류입니다. 잠시 후 다시 시도해주세요..';
          responseHelper.send(JSON.stringify(json), 'patch', res);
        });
    }), setTemporaryPassword
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/id')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      let json = {
        error: true,
        message: ''
      };
      const [marketerName, marketerMail] = responseHelper.getParam(['marketerName', 'marketerMail'], 'get', req);

      doQuery('SELECT marketerId, marketerName FROM marketerInfo WHERE marketerMail = ? ', [marketerMail])
        .then((data) => {
          const { result } = data;
          if (result[0]) {
            if (result[0].marketerName === marketerName) {
              json = {
                error: false,
                message: result[0].marketerId
              };
            } else {
              json.message = 'NAME이 일치하지 않습니다.';
            }
          } else {
            json.message = '입력하신 EMAIL의 회원이 존재하지 않습니다.';
          }
          responseHelper.send(JSON.stringify(json), 'get', res);
        })
        .catch(() => {
          json.message = 'DB 관련 오류입니다. 잠시 후 다시 시도해주세요..';
          responseHelper.send(JSON.stringify(json), 'get', res);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
