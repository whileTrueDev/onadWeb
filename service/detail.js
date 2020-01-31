require('dotenv').config();

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

const doQuery = require('./model/doQuery');
const pool = require('./model/connectionPool');


const doConnectionQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.query(queryState, params, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

// 현재시간은 5분, crawler가 활동하는 시기는 0분 타이밍이므로 10분을 깎아서
const getcreatorList = ({ date }) => {
  const streamerListQuery = `
  SELECT B.streamerId
  FROM (SELECT * FROM twitchStreamDetail WHERE time > ?) AS A
  LEFT JOIN twitchStream AS B
  ON A.streamId = B.streamId `;

  const bannerListQuery = `
  SELECT creatorId, campaignId
  FROM campaignTimestamp
  WHERE date > ?`;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('getcreatorList 의 오류: 현재 방송 중이며, 배너를 게시하고 있는 creator 구하는 과정');
        reject(err);
      } else {
        Promise.all([
          doConnectionQuery({ connection, queryState: bannerListQuery, params: [date] }),
          doConnectionQuery({ connection, queryState: streamerListQuery, params: [date] }),
        ])
          .then(([bannerListData, streamerListData]) => {
            // 실제 현재 방송 중인 크리에이터이다.
            const streamers = streamerListData.map(streamerData => streamerData.streamerId);
            const uniqueStreamers = Array.from(new Set(streamers));
            // streamers의 중복을 제거하기 위해서 Array.from(new Set([1,2,4,6]))을 사용한다.
            const creators = bannerListData.reduce((result, bannerData) => {
              if (uniqueStreamers.includes(bannerData.creatorId)) {
                result.push(bannerData);
              }
              return result;
            }, []);
            connection.release();
            console.log(creators);
            resolve(creators);
          })
          .catch((errorData) => {
            errorData.point = 'getCreatorList()';
            errorData.description = '현재 방송 중이며, 배너를 게시하고 있는 creator 구하는 과정';
            connection.release();
            reject(errorData);
          });
      }
    });
  });
};

const date = new Date();
date.setMinutes(date.getMinutes() - 10);

getcreatorList({ date });
