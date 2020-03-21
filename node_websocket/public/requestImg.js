const gameDict = require('./models/gameCategorieDic');
const doQuery = require('./models/doQuery');

module.exports = function (sql, socket, msg) {
  const fullUrl = msg[0];
  const cutUrl = `/${fullUrl.split('/')[4]}`;
  const prevBannerName = msg[1];
  const getTime = new Date().toLocaleString();
  const campaignObject = {};

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
    SELECT campaignId, optionType, startDate, finDate, selectedTime
    FROM campaign
    LEFT JOIN marketerInfo
    ON campaign.marketerId = marketerInfo.marketerId
    WHERE marketerInfo.marketerContraction = 1
    AND campaign.onOff = 1
    AND NOT campaign.optionType = 2
    AND campaign.limitState = 0
    `;

    return new Promise((resolve, reject) => {
      doQuery(campaignListQuery)
        .then((row) => {
          const filteredDate = {};
          const campaignIdList = [];
          const nowDate = new Date();
          row.result.map(
            (data) => {
              if (data.startDate && data.startDate < nowDate && (data.findate > nowDate || !data.finDate)) {
                filteredDate[data.campaignId] = data.selectedTime;
              }
            }
          );
          Object.values(filteredDate).map((value, index) => {
            const jsonData = JSON.parse(value);
            if (jsonData.time.includes(nowDate.getHours())) {
              campaignIdList.push(Object.keys(filteredDate)[index]);
            }
          });
          resolve(campaignIdList);
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

  const insertTwitchGameUnchecked = (gameId, creatorId) => {
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
        categoryList.map((categoryId) => getCategoryCampaignList(categoryId)
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

  const insertLandingPage = (campaignId, creatorId) => {
    // campaignId를 가져와서 optionType 0,1check후 삽입.
    const optionType = campaignObject[campaignId];
    if (optionType === 0) {
      return false;
    }
    const insertLandingQuery = 'INSERT IGNORE INTO landingClick(campaignId, creatorId) values(?,?);';
    return new Promise((resolve, reject) => {
      doQuery(insertLandingQuery, [campaignId, creatorId])
        .then((row) => {
          resolve(row.result);
        })
        .catch((errorData) => {
          errorData.point = 'insertLandingPage()';
          errorData.description = 'landingClick에 새로운 랜딩페이지 입력 과정';
          reject(errorData);
        });
    });
  };

  async function getBanner([creatorId, gameId]) {
    console.log(`-----------------------Id : ${creatorId} / ${getTime}---------------------------`);
    const [creatorCampaignList, onCampaignList, banList] = await Promise.all(
      [
        getCreatorCampaignList(creatorId),
        getOnCampaignList(),
        getBanList(creatorId)
      ]
    );
    const categoryCampaignList = await getGameCampaignList(gameId, creatorId);
    const onCreatorcampaignList = creatorCampaignList.filter((campaignId) => onCampaignList.includes(campaignId));
    const onCategorycampaignList = categoryCampaignList.filter((campaignId) => onCampaignList.includes(campaignId));
    const campaignList = Array.from(new Set(onCreatorcampaignList.concat(onCategorycampaignList)));
    const cutCampaignList = campaignList.filter((campaignId) => !banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
    const returnCampaignId = cutCampaignList[getRandomInt(cutCampaignList.length)];
    myCampaignId = returnCampaignId;
    if (myCampaignId) {
      console.log(`${creatorId} : 광고될 캠페인은 ${myCampaignId} 입니다. at : ${getTime}`);
    } else {
      socket.emit('img clear', []);
      console.log(`${creatorId} : 켜져있는 광고가 없습니다. at : ${getTime}`);
      return false;
    }

    if (prevBannerName && myCampaignId === prevBannerName.split(',')[0]) {
      return false;
    }
    const bannerSrc = await getBannerSrc(myCampaignId);
    return [bannerSrc, myCampaignId, creatorId];
  }

  const getQuery = sql(`SELECT creatorId, creatorTwitchId, adChatAgreement FROM creatorInfo WHERE advertiseUrl = "${cutUrl}"`);
  getQuery.select(async (err, data) => {
    if (err) {
      console.log(err);
    } else if (data[0]) {
      myCreatorId = data[0].creatorId;
      const myCreatorTwitchId = data[0].creatorTwitchId;
      const myAdChatAgreement = data[0].adChatAgreement;
      myGameId = await getGameId(myCreatorId);
      const bannerInfo = await getBanner([myCreatorId, myGameId]);
      if (bannerInfo) {
        const doInsert = await insertLandingPage(bannerInfo[1], bannerInfo[2]);
        socket.emit('img receive', [bannerInfo[0], [bannerInfo[1], bannerInfo[2]]]);
        // to chatbot
        if (myAdChatAgreement === 1) {
          socket.broadcast.emit('next-campaigns-twitch-chatbot', { campaignId: myCampaignId, creatorId: myCreatorId, creatorTwitchId: myCreatorTwitchId });
        }
      } else {
        // to chatbot
        if (myAdChatAgreement === 1) {
          socket.broadcast.emit('next-campaigns-twitch-chatbot', { campaignId: myCampaignId, creatorId: myCreatorId, creatorTwitchId: myCreatorTwitchId });
        }
        console.log(`${myCreatorId} : 같은 캠페인 송출 중이어서 재호출 안합니다. at ${getTime}`);
      }
    } else {
      socket.emit('url warning', []);
    }
  });
};
