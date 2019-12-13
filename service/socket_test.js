require('dotenv').config();

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}


const express = require('express');
const doQuery = require('./model/doQuery');
const gameDict = require('./middlewares/gameCategorieDic');

const router = express.Router();

// loop천국에서 피하기위한 전략으로 socket과 서버를 연결하여 data를 서버에서 처리하고 값만 받는 걸로 변경.

const getCreatorCampaignList = (creatorId) => {
  console.log(`${creatorId}에게 계약된 creatorCampaign의 campaignList를 가져옵니다.`);

  const campaignListQuery = `
                              SELECT campaignList 
                              FROM creatorCampaign
                              WHERE creatorId = ? 
                              `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [creatorId])
      .then((row) => {
        if (row.result[0].length !== 0) {
          const jsonData = JSON.parse(row.result[0].campaignList);
          resolve(jsonData.campaignList);
        }
      })
      .catch((errorData) => {
        errorData.point = 'getCreatorCampaignList()';
        errorData.description = 'creatorCampaign table에서 creator에게 계약된 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};

const getOnCampaignList = () => {
  console.log('현재 ON되어있는 campaign List를 조회한다.');

  // 랜딩페이지가 아닌 경우,
  const campaignListQuery = `
                            SELECT campaignId 
                            FROM campaign
                            WHERE onOff = 1
                            AND NOT optionType = 2
                            `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery)
      .then((row) => {
        const list = row.result.map(data => data.campaignId);
        resolve(list);
      })
      .catch((errorData) => {
        errorData.point = 'getOnCampaignList()';
        errorData.description = 'campaign table에서 현재 ON 되어있는 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};

// 하나의 categoryId 에 해당하는 캠페인 리스트를 반환하는 Promise
const getCategoryCampaignList = (categoryId) => {
  const campaignListQuery = `
                            SELECT campaignList 
                            FROM categoryCampaign
                            WHERE categoryId = ? 
                            `;
  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [categoryId])
      .then((row) => {
        const jsonData = JSON.parse(row.result[0].campaignList);
        resolve(jsonData.campaignList);
      })
      .catch((errorData) => {
        errorData.point = 'getCategoryCampaignList()';
        errorData.description = '하나의 categoryId를 통하여 계약된 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};

const getGameId = async (creatorId) => {
  console.log(`크리에이터 ${creatorId}의 gameid를 받아옵니다`);
  const getGameIdQuery = `SELECT gameId 
                          FROM twitchStreamDetail AS tsd 
                          WHERE streamId = (SELECT streamId FROM twitchStream WHERE streamerId = ? ORDER BY startedAt DESC LIMIT 1)
                          ORDER BY tsd.time DESC LIMIT 1;`;
  return new Promise((resolve, reject) => {
    doQuery(getGameIdQuery, [creatorId])
      .then((row) => {
        if (row.result.length !== 0) {
          const myGameId = row.result[0].gameId;
          resolve(myGameId);
        } else {
          console.log('GETGAMEID ERROR');
        }
      })
      .catch((errorData) => {
        errorData.point = 'getGameId()';
        errorData.description = 'TWITCHSTREAMDETAIL에서 GAMEID 가져오기';
        reject(errorData);
      });
  });
};

const insertTwitchGameUnchecked = (gameId, creatorId) => {
  const getTime = new Date().toLocaleString();
  const insertTwitchGameUncheckedQuery = 'INSERT IGNORE INTO twitchGame_unchecked(gameId, creatorId) values(?,?)';
  return new Promise((resolve, reject) => {
    doQuery(insertTwitchGameUncheckedQuery, [gameId, creatorId])
      .then((row) => {
        console.log(`새로운 game : ${gameId} 추가 / cretorId ${creatorId} / at : ${getTime}`);
        resolve(row.result);
      })
      .catch((errorData) => {
        errorData.point = 'insertTwitchGameUnchecked()';
        errorData.description = 'twitchGameUnchecked 새게임 insert 과정';
        reject(errorData);
      });
  });
};

// 하나의 gameId에 해당하는 모든 캠페인 리스트를 반환하는 Promise
const getGameCampaignList = async (gameId, creatorId) => {
  console.log('게임의 카테고리에 계약되어있는 캠페인 List를 가져옵니다.');
  const categoryList = gameDict[gameId] ? gameDict[gameId].concat(gameDict.default) : gameDict.default;
  let returnList = [];
  if (categoryList) {
    if (categoryList.includes(14) && categoryList.length === 1) {
      insertTwitchGameUnchecked(gameId, creatorId);
    }
    await Promise.all(
      categoryList.map(categoryId => getCategoryCampaignList(categoryId)
        .then((campaignList) => {
          returnList = returnList.concat(campaignList);
        }))
    )
      .catch((errorData) => {
        console.log(errorData);
        errorData.point = 'getGameCampaignList()';
        errorData.description = 'categoryCampaign에서 각각의 categoryId에 따른 캠페인 가져오기';
      });
  }
  return Array.from(new Set(returnList));
};

const getBanList = (creatorId) => {
  const selectQuery = `
  SELECT banList 
  FROM creatorCampaign
  WHERE creatorId = ?
  `;

  return new Promise((resolve, reject) => {
    doQuery(selectQuery, [creatorId])
      .then((row) => {
        const banList = JSON.parse(row.result[0].banList).campaignList;
        resolve(banList);
      })
      .catch((errorData) => {
        errorData.point = 'getBanList()';
        errorData.description = '해당 creator의 banList를 가져오는 과정';
        reject(errorData);
      });
  });
};

const getBannerSrc = (campaignId) => {
  const selectQuery = `
                      SELECT br.bannerSrc
                      FROM campaign
                      JOIN bannerRegistered as br
                      ON br.bannerId = campaign.bannerId
                      WHERE campaign.campaignId = ?
                      `;
  return new Promise((resolve, reject) => {
    doQuery(selectQuery, [campaignId])
      .then((row) => {
        resolve(row.result[0].bannerSrc);
      })
      .catch((errorData) => {
        errorData.point = 'getBannerSrc()';
        errorData.description = '하나의 campaignId를 통해 bannerSrc를 가져오는 과정';
        reject(errorData);
      });
  });
};

const getRandomInt = (length) => {
  const max = Math.floor(length);
  return Math.floor(Math.random() * (max - 0)) + 0; // 최댓값은 제외, 최솟값은 포함
};

// 해당 camapaign의 optionType체크 후, 0(배너광고만)일경우에는 패스한다.
const insertLandingPage = (campaignId, creatorId) => {
  const insertLandingQuery = 'INSERT IGNORE INTO landingClick(campaignId, creatorId) values(?,?);';
  const selectTypeQuery = `
  SELECT optionType
  FROM campaign
  WHERE campaignId = ? 
  `;

  return new Promise((resolve, reject) => {
    doQuery(selectTypeQuery, [campaignId])
      .then((inrow) => {
        const { optionType } = inrow.result[0];
        if (optionType !== 0) {
          doQuery(insertLandingQuery, [campaignId, creatorId])
            .then(() => {
              resolve();
            });
        } else {
          resolve();
        }
      })
      .catch((errorData) => {
        errorData.point = 'insertLandingPage()';
        errorData.description = 'landingClick에 새로운 랜딩페이지 입력 과정';
        reject(errorData);
      });
  });
};

async function getBanner([creatorId, gameId, prevBannerName]) {
  const [creatorCampaignList, onCampaignList, banList] = await Promise.all(
    [
      getCreatorCampaignList(creatorId),
      getOnCampaignList(),
      getBanList(creatorId)
    ]
  );

  const categoryCampaignList = await getGameCampaignList(gameId, creatorId);
  const onCreatorcampaignList = creatorCampaignList.filter(campaignId => onCampaignList.includes(campaignId));
  const onCategorycampaignList = categoryCampaignList.filter(campaignId => onCampaignList.includes(campaignId));
  const campaignList = Array.from(new Set(onCreatorcampaignList.concat(onCategorycampaignList)));
  const cutCampaignList = campaignList.filter(campaignId => !banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
  const campaignId = cutCampaignList[getRandomInt(cutCampaignList.length)];

  if (!campaignId) {
    // socket.emit('img clear', []); 광고 송출할 것이 없다.
    return {
      route: 'img clear',
      data: []
    };
  }

  if (prevBannerName && campaignId === prevBannerName.split(',')[0]) {
    return {
      route: '',
      data: []
    };
  }

  const bannerSrc = await getBannerSrc(campaignId);
  return {
    route: 'img receive',
    data: [bannerSrc, campaignId, creatorId]
  };
}

const calculateCampaignId = ({ cutUrl, prevBannerName }) => {
  const creatorIdSelectQuery = `
  SELECT creatorId 
  FROM creatorInfo 
  WHERE advertiseUrl = ?
  `;

  return new Promise((resolve, reject) => {
    doQuery(creatorIdSelectQuery, [cutUrl])
      .then(async (row) => {
        const { creatorId } = row.result[0];
        const gameId = await getGameId(creatorId);
        const bannerData = await getBanner([creatorId, gameId, prevBannerName]);
        resolve(bannerData);
      })
      .catch((err) => {
        console.log('calculateCampaignId > creatorIdSelectQuery');
        reject(err);
      });
  });
};

// // body에 advertiseUrl만을 전달받는다.
// router.post('/', async (req, res, _) => {
//   const { cutUrl, prevBannerName } = req.body;

//   calculateCampaignId({ cutUrl, prevBannerName })
//     .then(({ route, data }) => {
//       if (data.length !== 0) {
//         insertLandingPage(data[1], data[2]);
//       }
//       res.send({ route, data });
//     })
//     .catch(() => {
//       console.log('socket router error!');
//       res.send({
//         route: 'error',
//         data: []
//       });
//     });
// });

// module.exports = router;

calculateCampaignId({ cutUrl: '/8s5g3f0n', prevBannerName: 'jinsagalbi_01' });
