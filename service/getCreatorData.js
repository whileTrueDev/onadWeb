// 크리에이터 상세정보 변수 정의 및 변수별 함수 정의
require('dotenv').config();

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

const axios = require('axios');
const doQuery = require('./model/doQuery');
const pool = require('./model/connectionPool');

const baseSelectQuery = `
  select B.streamerName, B.streamerId, viewer, gameId, time
  from (select *
  FROM twitchStreamDetail
  where MONTH(time) = 11
  and YEAR(time) = 2019) AS A
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId
  where B.streamerId = ? 
  `;


const doConnectionQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.query(queryState, params, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});


const doTransacQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.beginTransaction((err) => {
    if (err) {
      console.log('doTransacQuery err');
      console.log(err);
      reject(err);
    }
    connection.query(queryState, params, (err1, result) => {
      if (err1) {
        console.log('doTransacQuery err1');
        console.log(err1);
        connection.rollback(() => {
          reject(err1);
        });
      } else {
        connection.commit((err2) => {
          if (err2) {
            console.log('doTransacQuery err2');
            console.log(err2);
            connection.rollback(() => {
              reject(err2);
            });
          } else {
            resolve();
          }
        });
      }
    });
  });
});

// 0. 구독자 수를 갱신하는 함수.
// creatorId에 대해 API요청으로 data를 가져온다.
const UpdateFollower = creatorId => new Promise((resolve, reject) => {
  const clientID = '7197nobf8rsf7aqqk4nf7a22dtyu93';
  // connection을 받아서 update query를 수행하는 함수 정의
  const config = {
    headers: {
      'Client-ID': clientID
    }
  };

  const url = `https://api.twitch.tv/helix/users/follows?to_id=${creatorId}`;
  axios.get(url, config)
    .then((res) => {
      resolve(res.data.total);
    })
    .catch((error) => {
      console.log('twitch API를 통한 구독자수 요청 실패');
      reject(error);
    });
});

// 2. stream별 이상치제거를 수행하는 함수.
// streamId로 구별되는 평균시청자수, 평균 방송시간의 분포에서 이상치를 구별하여 제거한다.
// 이상치의 정의는, 평균방송시간의 평균과 편차를 구하여
const removeOutliner = ({ streamData }) => {
  const viewerList = [];
  const airtimeList = [];
  const average = data => data.reduce((sum, value) => sum + value) / data.length;
  const stddev = values => Math.sqrt(average(values.map(value => (value - average(values)) ** 2)));


  streamData.forEach(({ viewer, airtime }) => {
    airtimeList.push(airtime);
  });
  console.log(average(airtimeList));
  console.log(stddev(airtimeList));
};
// 1. 평균 시청자수를 계산하여 반환하는 함수
// 이전달의 데이터를 기준으로 일간 평균시청자수, 방송날짜, 방송시간(from-to)를 list형태로 반환한다.
const getViewer = ({
  connection, creatorId
}) => new Promise((resolve, reject) => {
  const selectQuery = `
  SELECT B.streamId, AVG(viewer) AS viewer, COUNT(*) AS airtime
  FROM twitchStreamDetail AS A
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId
  WHERE B.streamerId = ?
  GROUP BY B.streamId
  `;
  doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId] })
    .then((row) => {
      if (row.length > 0) {
        removeOutliner({ streamData: row });
        resolve(row);
      } else {
        reject();
      }
    })
    .catch((err) => {
      console.log('viewer를 가져오는 과정');
      reject(err);
    });
});


pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    getViewer({
      connection, creatorId: '147356756'
    })
      .then((data) => {

      });
  }
});


// UpdateFollower('145219668');
