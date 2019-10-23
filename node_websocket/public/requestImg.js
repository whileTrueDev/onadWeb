const gameDict = require('./models/gameCategorieDic');
const doQuery = require('./models/doQuery');

module.exports = function (sql, socket, msg) {
  const fullUrl = msg[0];
  const cutUrl = `/${fullUrl.split('/')[4]}`;
  const prevBannerName = msg[1];
  const getTime = new Date().toLocaleString();
  let myCreatorId;
  let myCampaignId;
  let myGameId;
  // creatorId를 전달받아 creatorCampaign과 onff List를 도출.
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

    const campaignListQuery = `
                              SELECT campaignId 
                              FROM campaign
                              WHERE onOff = 1
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
            myGameId = row.result[0].gameId;
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

  // 하나의 gameId에 해당하는 모든 캠페인 리스트를 반환하는 Promise
  const getGameCampaignList = async (gameId) => {
    console.log('게임의 카테고리에 계약되어있는 캠페인 List를 가져옵니다.');
    const categoryList = gameDict[gameId];
    let returnList = [];
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
    return Array.from(new Set(returnList));
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

  async function getBanner([creatorId, gameId]) {
    console.log(`-----------------------Id : ${creatorId} / ${getTime}---------------------------`);
    const [creatorCampaignList, onCampaignList] = await Promise.all(
      [
        getCreatorCampaignList(creatorId),
        getOnCampaignList(),
      ]
    );
    const categoryCampaignList = await getGameCampaignList(gameId);
    const onCreatorcampaignList = creatorCampaignList.filter(campaignId => onCampaignList.includes(campaignId));
    const onCategorycampaignList = categoryCampaignList.filter(campaignId => onCampaignList.includes(campaignId));
    const campaignList = Array.from(new Set(onCreatorcampaignList.concat(onCategorycampaignList)));
    const campaignId = campaignList[getRandomInt(campaignList.length)];
    myCampaignId = campaignId;
    if (myCampaignId) {
      console.log(`이번에 광고될 캠페인은 ${myCampaignId} 입니다.`);
    } else {
      console.log('켜져있는 광고가 없습니다.');
      socket.emit('img clear', []);
      return false;
    }

    if (prevBannerName && myCampaignId === prevBannerName.split(',')[0]) {
      return false;
    }
    const bannerSrc = await getBannerSrc(campaignId);
    return [bannerSrc, myCampaignId, creatorId];
  }

  const getQuery = sql(`SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${cutUrl}"`);
  getQuery.select(async (err, data) => {
    if (err) {
      console.log(err);
    } else if (data[0]) {
      myCreatorId = data[0].creatorId;
      myGameId = await getGameId(myCreatorId);
      const bannerInfo = await getBanner([myCreatorId, myGameId]);
      if (bannerInfo) {
        socket.emit('img receive', [bannerInfo[0], [bannerInfo[1], bannerInfo[2]]]);
      } else {
        console.log('같은 캠페인 송출 중이어서 재호출 안합니다.');
      }
    } else {
      socket.emit('url warning', []);
    }
  });
};
