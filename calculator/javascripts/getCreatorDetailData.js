// 크리에이터 상세정보 변수 정의 및 변수별 함수 정의
const schedule = require('node-schedule');
const axios = require('axios');
const doQuery = require('../model/doQuery');
const pool = require('../model/connectionPool');

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

// 이번년도 
const yearStart = '2020-01-01 00:00:00';

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

const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item)), Promise.resolve());

const getMedian = ({ streamData }) => {
  streamData.sort((a, b) => a.airtime - b.airtime);
  const average = (data) => data.reduce((sum, value) => sum + value) / data.length;
  const len = streamData.length;
  let median = 0;
  if (len % 2 === 0) {
    // 짝수이므로, len과 len -1 번째 값의 평균을 중앙값으로 사용한다.
    // console.log(`기준은 ${len / 2}`);
    median = average([streamData[len / 2].airtime, streamData[len / 2 + 1].airtime]);
  } else {
    // console.log(`기준은 ${len / 2}`);
    median = streamData[Math.floor(len / 2)].airtime;
  }
  return median;
};

// 정렬된채로 전달받음.
const getIQ = ({ streamData }) => {
  const len = streamData.length;
  const median = getMedian({ streamData });
  let Q1;
  let Q3;
  if (len % 2 === 0) {
    // 짝수이므로, len과 len -1 번째 값의 평균을 중앙값으로 사용한다.

    Q1 = getMedian({ streamData: streamData.slice(0, len / 2) });
    Q3 = getMedian({ streamData: streamData.slice(len / 2 + 1) });
  } else {
    Q1 = getMedian({ streamData: streamData.slice(0, Math.floor(len / 2)) });
    Q3 = getMedian({ streamData: streamData.slice(Math.floor(len / 2) + 1) });
  }
  const IQR = Q3 - Q1;
  const outline = Q1 - 1.5 * (IQR);
  return {
    median,
    Q1,
    Q3,
    IQR,
    outline
  };
};

// 방송이 진행된 요일별 퍼센트를 구한다.
// const getDayofWeekPercent = () => {
//   const dayweekQuery = `
//   SELECT count(*), weekday(time)
//   FROM twitchStreamDetail AS A
//   LEFT JOIN twitchStream AS B
//   ON A.streamId = B.streamId
//   WHERE B.streamerId = '147356756'
//   group by weekday(time)`;
// };


// 1. 평균 시청자수를 계산하여 반환하는 함수
// 이전달의 데이터를 기준으로 일간 평균시청자수, 방송날짜, 방송시간(from-to)를 list형태로 반환한다.
// 사분위수를 구하여 X < Q1 - 1.5 * (Q3 -Q1) 인 값들을 제한다.
const getViewerAirtime = ({
  connection, creatorId
}) => {
  const selectQuery = `
  SELECT  B.streamId, AVG(viewer) AS viewer, COUNT(*) AS airtime, MAX(viewer) AS peakview
  FROM
  (SELECT streamId
  FROM twitchStream 
  WHERE streamerId = ? AND startedAt > ${yearStart}) AS B
  LEFT JOIN twitchStreamDetail AS A
  ON A.streamId = B.streamId
  GROUP BY streamId
  `;

  // 2. stream별 이상치제거를 수행하는 함수.
  // streamId로 구별되는 평균시청자수, 평균 방송시간의 분포에서 이상치를 구별하여 제거한다.
  // 이상치의 정의는, 평균방송시간의 평균과 편차를 구하여
  const removeOutliner = ({ streamData }) => {
    const cutStreamData = streamData.reduce((acc, element) => {
      // 한시간 이하의 방송은 이상치이므로 제거한다.
      if (element.airtime > 6) {
        acc.push(element);
      }
      return acc;
    }, []);

    // 위에서 airtime을 제거하니 남은 시간이 너무 적으므로 크리에이터라 판단하지 않는다.
    if (cutStreamData.length === 0) {
      return {};
    }
    const viewerList = [];
    const airtimeList = [];
    const peakList = [];
    const average = (data) => data.reduce((sum, value) => sum + value) / data.length;
    // const stddev = values => Math.sqrt(average(values.map(value => (value - average(values)) ** 2)));
    cutStreamData.forEach(({ viewer, airtime, peakview }) => {
      peakList.push(peakview);
      airtimeList.push(airtime);
      viewerList.push(viewer);
    });

    // 10분당 한개이므로 곱한다. => 올림후 시간.
    const airtime = (Math.round(average(airtimeList))) * 10;
    const viewer = (Math.round(average(viewerList)));
    const peakview = Math.max(...peakList);
    const impression = airtime * viewer;
    return {
      airtime, viewer, impression, peakview
    };
  };

  return new Promise((resolve, reject) => {
    doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId] })
      .then((row) => {
        if (row.length > 0) {
          const viewData = removeOutliner({ streamData: row });
          resolve(viewData);
        } else {
          resolve({});
        }
      })
      .catch((err) => {
        console.log(`${creatorId}의 시청자수, 방송시간을 구하는 과정`);
        resolve({});
      });
  });
};


// 방송하는 컨텐츠의 퍼센트를 구한다.
// 모든 gameId에 대응되는 총시간을 계산하여 각 비율을 return 한다.
// 비율을 기준으로  30퍼 이상의 gameData를 반환한다.
const getContentsPercent = ({
  connection, creatorId
}) => {
  const selectQuery = `
    SELECT  gameName, C.gameId, timecount
    FROM (SELECT gameId, count(*) as timecount
    FROM twitchStreamDetail AS A
    LEFT JOIN twitchStream AS B 
    ON A.streamId = B.streamId
    WHERE B.streamerId = ?
    GROUP BY gameId) AS C
    LEFT JOIN twitchGame
    ON C.gameId = twitchGame.gameId
    `;

  const preprocessing = (percentData) => {
    const outputData = percentData;
    const sum = percentData.reduce((a, b) => a + b.timecount, 0);

    percentData.forEach((element, index) => {
      const percent = Number((element.timecount / sum).toFixed(2));
      outputData[index].percent = percent;
    });

    outputData.sort((a, b) => b.timecount - a.timecount);

    // 돌면서 누적합이 90이상일 경우까지 값을 가져온다.
    let cumsum = 0;
    const returnData = outputData.reduce((result, element) => {
      if (cumsum <= 0.8) {
        cumsum += element.percent;
        result.push({
          gameName: element.gameName,
          percent: element.percent
        });
      }
      return result;
    }, []);

    returnData.push({
      gameName: 'Other games',
      percent: Number((1 - cumsum).toFixed(2))
    });

    return returnData;
  };

  return new Promise((resolve, reject) => {
    doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId] })
      .then((row) => {
        if (row.length > 0) {
          const contentsGraphData = preprocessing(row);
          const content = contentsGraphData[0].gameName;
          resolve({ content, contentsGraphData });
        } else {
          console.log(`${creatorId}의 방송시간대를 구하는 과정`);
          resolve({ content: '', contentsGraphData: {} });
        }
      })
      .catch((err) => {
        console.log(`${creatorId}의 방송시간대를 구하는 과정`);
        resolve({ content: '', contentsGraphData: {} });
      });
  });
};


// 방송이 진행된 시간대를 분할하여 가장 많은 시간을 진행한 시간대를 리턴한다.
// 현재는 새벽, 오전, 오후, 저녁으로 분할하여 가장 많은 시간을 입력한다.
// 그래프와 함께 활용하기 위한 데이터로 정규화(Normalization)을 진행한다.
const getOpenHourPercent = ({ connection, creatorId }) => {
  const getTimeName = (time) => {
    if (time >= 0 && time < 6) {
      return '새벽';
    }
    if (time >= 6 && time < 12) {
      return '오전';
    }
    if (time >= 12 && time < 18) {
      return '오후';
    }
    if (time >= 18 && time < 24) {
      return '저녁';
    }
  };

  const countTime = ({ timeData }) => {
    const timeDict = {
      새벽: 0,
      오전: 0,
      오후: 0,
      저녁: 0,
    };
    timeData.forEach((element) => {
      const timeName = getTimeName(element.hours);
      timeDict[timeName] += element.sumtime;
    });
    const timeList = Object.keys(timeDict).map((dateName) => {
      const count = timeDict[dateName];
      return {
        name: dateName,
        count
      };
    });
    timeList.sort((a, b) => b.count - a.count);
    return `${timeList[0].name}, ${timeList[1].name}`;
  };

  const normalization = ({ timeData }) => {
    // 존재하지 않는 시간에 대한 기본값 부여
    let outData = [];

    if (timeData.length !== 24) {
      outData = [...Array(24).keys()].map((i) => ({
        hours: i,
        sumtime: 0
      }));
      timeData.forEach((element) => {
        const hour = element.hours;
        outData[hour].sumtime = element.sumtime;
      });
    } else {
      outData = timeData;
    }


    // 일단 크기순으로 sorting (24개의 원소이므로 굉장히 작은 연산이다.)
    outData.sort((a, b) => a.sumtime - b.sumtime);

    // 최소값, 최대값을 indexing을 통해 찾는다.
    const min = outData[0].sumtime;
    const max = outData[23].sumtime;
    outData = outData.map((element) => {
      const sumtime = Number(((element.sumtime - min) / (max - min)).toFixed(2));
      return {
        ...element,
        sumtime
      };
    });

    outData.sort((a, b) => a.hours - b.hours);
    const returArray = outData.concat(outData.splice(0, 6));

    return returArray;
  };

  const timeQuery = `
  SELECT count(*) as sumtime, hour(time) as hours
  FROM twitchStreamDetail AS A
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId
  WHERE B.streamerId = ?
  group by hour(time)`;

  return new Promise((resolve, reject) => {
    doConnectionQuery({ connection, queryState: timeQuery, params: [creatorId] })
      .then((row) => {
        if (row.length > 0) {
          const openHour = countTime({ timeData: row });
          const timeGraphData = normalization({ timeData: row });
          resolve({ openHour, timeGraphData });
        } else {
          console.log(`${creatorId}의 방송시간대를 구하는 과정`);
          resolve({ openHour: '', timeGraphData: {} });
        }
      })
      .catch((err) => {
        console.log(`${creatorId}의 방송시간대를 구하는 과정`);
        resolve({ openHour: '', timeGraphData: {} });
      });
  });
};

// 해당 크리에이터의 일간 평균 클릭수
const getClickPercent = ({ connection, creatorId }) => {
  const clickQuery = `
  select ROUND(avg(counts), 2) as counts
  from (select count(*) as counts, date(date)
  from landingClickIp
  where creatorId = ?
  and landingClickIp.type = 2
  group by date(date)) as C
  `;

  return new Promise((resolve, reject) => {
    doConnectionQuery({ connection, queryState: clickQuery, params: [creatorId] })
      .then((row) => {
        if (row.length > 0) {
          const clickCount = row[0].counts;
          resolve({ clickCount });
        } else {
          console.log(`${creatorId}의 클릭률을 구하는 과정`);
          resolve({ clickCount: 0 });
        }
      })
      .catch((err) => {
        console.log(`${creatorId}의 클릭률을 구하는 과정`);
        resolve({ clickCount: 0 });
      });
  });
};


const getRegDate = ({ connection, creatorId }) => new Promise((resolve, reject) => {
  const selectQuery = `
  select date
  from creatorInfo
  where creatorId = ?
  `;
  doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId] })
    .then((row) => {
      const { date } = row[0];
      resolve(date);
    })
    .catch((err) => {
      console.log(`${creatorId}의 가입날짜를 구하는 과정`);
      console.log(err);
      resolve([]);
    });
});
// 2. API로 수집된 실제 방송 시간
const getAirtime = ({ connection, creatorId, date }) => new Promise((resolve, reject) => {
  const selectQuery = `
  SELECT  COUNT(*) AS airtime
  FROM twitchStreamDetail AS A
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId
  WHERE B.streamerId = ?
  AND time > ${yearStart}
  `;

  doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId, date] })
    .then((row) => {
      const { airtime } = row[0];
      resolve(airtime);
    })
    .catch((err) => {
      console.log(`${creatorId}의 실제 방송 시간을 구하는 과정`);
      console.log(err);
      resolve(0);
    });
});
// 3. timestamp에 찍힌 실제 배너 게시 시간.
const getImpressiontime = ({ connection, creatorId }) => new Promise((resolve, reject) => {
  const selectQuery = `
  SELECT  COUNT(*) AS impressiontime
  FROM campaignTimestamp
  WHERE creatorId = ?
  AND date > ${yearStart}
  `;

  doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId] })
    .then((row) => {
      const { impressiontime } = row[0];
      resolve(impressiontime);
    })
    .catch((err) => {
      console.log(`${creatorId}의 노출시간을 구하는 과정`);
      console.log(err);
      resolve(0);
    });
});

const getTimeData = ({ connection, creatorId }) => new Promise((resolve, reject) => {
  getRegDate({ connection, creatorId })
    .then((date) => {
      Promise.all([
        getAirtime({ connection, creatorId, date }),
        getImpressiontime({ connection, creatorId })
      ])
        .then(([airtime, impressiontime]) => {
          let RIP = 0;
          if (impressiontime !== 0) {
            RIP = Number((airtime / impressiontime).toFixed(2));
            if (RIP >= 1) {
              RIP = 1;
            }
          } else {
            RIP = 0;
          }
          resolve(RIP);
        })
        .catch((error) => {
          console.log('streamDetail에서 데이터를 가져오는 과정');
          console.log(error);
          resolve(0);
        });
    })
    .catch((error) => {
      console.log('streamDetail에서 데이터를 가져오는 과정');
      console.log(error);
      resolve(0);
    });
});

const getCheckDetail = ({ connection, creatorId }) => new Promise((resolve, reject) => {
  const selectQuery = `
  select *
  from creatorDetail
  where creatorId = ?
  `;

  doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId] })
    .then((row) => {
      if (row.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(() => {
      resolve(true);
    });
});


// creatorId를 조회하여 값이 존재하지 않을 경우 INSERT
// 존재할 경우 UPDATE
const getCreatorDetail = ({ connection, creatorId }) => new Promise((resolve, reject) => {
  getViewerAirtime({ connection, creatorId })
    .then((viewData) => {
      if (Object.entries(viewData).length === 0 && viewData.constructor === Object) {
        resolve();
        return;
      }
      const {
        airtime, viewer, impression, peakview
      } = viewData;
      Promise.all([
        getClickPercent({ connection, creatorId }),
        getOpenHourPercent({ connection, creatorId }),
        getContentsPercent({ connection, creatorId }),
        getTimeData({ connection, creatorId }),
      ])
        .then(([{ clickCount }, { openHour, timeGraphData }, { content, contentsGraphData }, rip]) => {
          if (impression === 0) {
            return [];
          }
          const followers = 0;
          const ctr = Number((clickCount / impression * 100).toFixed(3));
          const cost = viewer * 60 * 2; // 배너의 갯수에 따라 달라질 수 있기 떄문에 상의가 더필요하다.
          const timeJsonData = JSON.stringify({ data: timeGraphData });
          const contentsJsonData = JSON.stringify({ data: contentsGraphData });
          return [
            followers,
            ctr,
            airtime,
            viewer,
            impression,
            cost,
            content,
            openHour,
            timeJsonData,
            contentsJsonData,
            peakview,
            rip,
            creatorId
          ];
        })
        .then((params) => {
          if (params.length === 0) {
            resolve();
            return;
          }
          getCheckDetail({ connection, creatorId })
            .then((check) => {
              const insertQuery = `
              INSERT INTO creatorDetail
              (followers, ctr, airtime, viewer, impression, cost, content, openHour, timeGraphData, contentsGraphData, peakview, rip, creatorId)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;
              const updateQuery = `
              UPDATE creatorDetail
              SET 
              followers = ?, 
              ctr = ?, 
              airtime = ?, 
              viewer = ?, 
              impression = ?,
              cost = ?,
              content = ?, 
              openHour = ?,
              timeGraphData = ?,
              contentsGraphData = ?, 
              peakview = ?, 
              rip = ?
              WHERE creatorId = ?
              `;
              const queryState = check ? updateQuery : insertQuery;
              doTransacQuery({ connection, queryState, params })
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  console.log(`${creatorId}의 데이터를 저장하는 과정`);
                  console.log(error);
                  resolve();
                });
            });
        });
    })
    .catch((error) => {
      console.log(error);
      resolve();
    });
});

const getDoQueryCreatorList = () => new Promise((resolve, reject) => {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  const selectQuery = `
  select creatorId
  from creatorInfo
  where date < ?
  and creatorContractionAgreement = 1
  `;
  doQuery(selectQuery, [date])
    .then((row) => {
      const creatorList = row.result.map((element) => element.creatorId);
      resolve(creatorList);
    })
    .catch((err) => {
      console.log('creator list를 가져오는 과정');
      console.log(err);
      resolve([]);
    });
});

const preprocessingHeatmapData = (row) => {
  // 사전에 날짜별로 시간별로 정렬된 상태이므로
  const uniqueDateList = row.reduce((result, item) => {
    if (!result.includes(item.date)) {
      // 데이터가 존재하지 않으면 집어넣는다.
      result.push(item.date);
    }
    return result;
  }, []);

  // 날짜를 7개만 사용하도록 한다.
  if (uniqueDateList.length > 7) {
    uniqueDateList.splice(7);
  }

  // 날짜가 나왔으므로 날짜 / 시간별로 template 생성.
  const outData = [];
  uniqueDateList.forEach((date) => {
    [...Array(24).keys()].forEach((i) => {
      // date와 time이 일치하는 값을 가져온다.
      const matchIndex = row.findIndex((x) => x.date === date && x.time === i);
      let data = {
        date,
        time: i,
        viewer: 0
      };
      if (matchIndex !== -1) {
        data = {
          date,
          time: i,
          viewer: row[matchIndex].viewer
        };
      }
      outData.push(data);
    });
  });
  return outData;
};

const getHeatmapData = ({ connection, creatorId }) => new Promise((resolve, reject) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const selectQuery = `
  SELECT DATE_FORMAT(date(time), "%y-%m-%d") as date , hour(time) as time, sum(viewer) as viewer
  FROM twitchStreamDetail AS A
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId
  WHERE B.streamerId = ?
  AND date(time) < ?
  GROUP BY date(time), hour(time)
  ORDER BY date(time) desc, hour(time) asc
  `;

  doConnectionQuery({ connection, queryState: selectQuery, params: [creatorId, date] })
    .then((row) => {
      // 데이터 들고와서 일별로 빈시간을 채우는 전처리 시작.
      const heatmapData = preprocessingHeatmapData(row);
      const jsonHeatmapData = JSON.stringify({ data: heatmapData });
      return jsonHeatmapData;
    })
    .then((jsonHeatmapData) => {
      const queryState = `
      UPDATE creatorDetail 
      SET viewerHeatmapData = ?
      WHERE creatorId = ? 
      `;
      doTransacQuery({ connection, queryState, params: [jsonHeatmapData, creatorId] })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(`${creatorId}의 데이터를 저장하는 과정`);
          reject(error);
        });
    })
    .catch((err) => {
      console.log(`${creatorId}의 데이터를 저장하는 과정`);
      reject(err);
    });
});


const dividedGetDetail = (targetList) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      // 100개씩 잘라서 수행 시작.
      Promise.all(
        targetList.map((creatorId) => getCreatorDetail({ connection, creatorId }))
      ).then(() => {
        connection.release();
        setTimeout(() => {
          resolve();
        }, 10000);
      });
    }
  });
});


const dividedCalculation = async () => {
  const creatorList = await getDoQueryCreatorList();
  const turns = Math.ceil(creatorList.length / 30);
  const targetList = [];
  for (let i = 0; i < turns;) {
    const targets = creatorList.splice(0, 30);
    targetList.push(targets);
    i += 1;
  }

  return new Promise((resolve, reject) => {
    forEachPromise(targetList, dividedGetDetail)
      .then(() => {
        resolve();
      });
  });
};


const getDetaildoQueryList = () => new Promise((resolve, reject) => {
  const selectQuery = `
  select creatorId
  from creatorDetail
  `;
  doQuery(selectQuery, [])
    .then((row) => {
      const creatorList = row.result.map((element) => element.creatorId);
      resolve(creatorList);
    })
    .catch((err) => {
      console.log('creator list를 가져오는 과정');
      console.log(err);
      resolve([]);
    });
});

// 0. 구독자 수를 갱신하는 함수.
// creatorId에 대해 API요청으로 data를 가져온다.
const UpdateFollower = ({ creatorId, connection }) => new Promise((resolve, reject) => {
  const clientID = process.env.PRODUCTION_CLIENT_ID;
  // connection을 받아서 update query를 수행하는 함수 정의
  const config = {
    headers: {
      'Client-ID': clientID
    }
  };

  const url = `https://api.twitch.tv/helix/users/follows?to_id=${creatorId}`;
  axios.get(url, config)
    .then((res) => {
      // res.data.status를 보고 기다렸다가 판단.
      const followers = res.data.total;
      const queryState = `
      UPDATE creatorDetail 
      SET followers = ?
      WHERE creatorId = ? 
      `;
      doTransacQuery({ connection, queryState, params: [followers, creatorId] })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(`${creatorId}의 데이터를 저장하는 과정`);
          resolve();
        });
    })
    .catch((error) => {
      console.log('twitch API를 통한 구독자수 요청 실패');
      resolve();
    });
});

const dividedGetFollower = (targetList) => new Promise((resolve, reject) => {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log(err);
    } else {
      Promise.all(
        targetList.map((creatorId) => UpdateFollower({ creatorId, connection }))
      ).then(() => {
        connection.release();
        setTimeout(() => {
          resolve();
        }, 60000);
      });
    }
  });
});


const dividedUpdate = async () => {
  const creatorList = await getDetaildoQueryList();
  const turns = Math.ceil(creatorList.length / 30);
  const targetList = [];
  for (let i = 0; i < turns;) {
    const targets = creatorList.splice(0, 30);
    targetList.push(targets);
    i += 1;
  }

  return new Promise((resolve, reject) => {
    forEachPromise(targetList, dividedGetFollower)
      .then(() => {
        resolve();
      });
  });
};

async function main() {
  await dividedCalculation();
  await dividedUpdate();
  console.log('creator detail data update complete!');
}


const scheduler = schedule.scheduleJob('3 * * *', () => {
  console.log('creator detail data update start');
  main();
});

module.exports = scheduler;
