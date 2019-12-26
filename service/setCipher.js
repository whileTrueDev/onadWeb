require('dotenv').config(); //
const crypto = require('./encryption');
const doQuery = require('./model/doQuery');

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

const getCreatorList = () => {
  console.log('현재 방송 중인 모든 creator의 list 계산 시작');

  const listQuery = `
  SELECT creatorId, creatorAccountNumber 
  FROM creatorInfo
  WHERE creatorAccountNumber IS NOT NULL`;

  return new Promise((resolve, reject) => {
    doQuery(listQuery)
      .then((row) => {
        resolve(row.result);
      })
      .catch((errorData) => {
        errorData.point = 'getCreatorList()';
        errorData.description = '현재 방송 중인 creator 구하는 과정';
        reject(errorData);
      });
  });
};

const setCipher = async () => {
  const cipherQuery = `
  UPDATE creatorInfo 
  SET creatorAccountNumber = ?
  WHERE creatorId = ?
  `;

  const creatorList = await getCreatorList();
  Promise.all(
    creatorList.map(({ creatorId, creatorAccountNumber }) => new Promise((resolve, reject) => {
      const cipheredAccount = crypto.encipher(creatorAccountNumber);
      // console.log(cipheredAccount);
      doQuery(cipherQuery, [cipheredAccount, creatorId])
        .then(() => {
          console.log(`${creatorId} 의 계좌번호가 변경 되었습니다.`);
          resolve();
        })
        .catch((errorData) => {
          console.log(errorData);
          reject(errorData);
        });
    }))
  );
};


const setDecipher = async () => {
  const cipherQuery = `
  UPDATE creatorInfo 
  SET creatorAccountNumber = ?
  WHERE creatorId = ?
  `;

  const creatorList = await getCreatorList();
  Promise.all(
    creatorList.map(({ creatorId, creatorAccountNumber }) => new Promise((resolve, reject) => {
      const decipheredAccount = crypto.decipher(creatorAccountNumber);
      // console.log(cipheredAccount);
      doQuery(cipherQuery, [decipheredAccount, creatorId])
        .then(() => {
          console.log(`${creatorId} 의 계좌번호가 변경 되었습니다.`);
          resolve();
        })
        .catch((errorData) => {
          console.log(errorData);
          reject(errorData);
        });
    }))
  );
};

// setCipher();
setDecipher();

// // 커넥션을 전달 받아 쿼리문을 수행한다. 트랜잭션을 사용하기 때문에
// const doTransacQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
//   connection.beginTransaction((err) => {
//     if (err) {
//       console.log('doTransacQuery err');
//       console.log(err);
//       reject(err);
//     }
//     connection.query(queryState, params, (err1, result) => {
//       if (err1) {
//         console.log('doTransacQuery err1');
//         console.log(err1);
//         connection.rollback(() => {
//           reject(err1);
//         });
//       } else {
//         connection.commit((err2) => {
//           if (err2) {
//             console.log('doTransacQuery err2');
//             console.log(err2);
//             connection.rollback(() => {
//               reject(err2);
//             });
//           } else {
//             resolve();
//           }
//         });
//       }
//     });
//   });
// });
