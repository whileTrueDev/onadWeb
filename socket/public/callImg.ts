import { gameDict } from '../models/gameCategory';
import doQuery from '../models/doQuery';

function callImg(socket: any, msg: string[]): void {
  const fullUrl: string = msg[0];
  const cutUrl = `/${fullUrl.split('/')[4]}`;
  const prevBannerName: string = msg[1];
  const programType: string = msg[2];
  const getTime: string = new Date().toLocaleString();
  interface CampaignIdOptionType {
    [_: string]: [number, string];
  }
  const campaignObject: CampaignIdOptionType = {};

  let myCampaignId: string;
  let myGameId: string;
  // creatorId를 전달받아 creatorCampaign과 onff List를 도출.
  const getCreatorCampaignList = (creatorId: string): Promise<string[]> => {
    console.log(`${creatorId}의 특정 크리에이터 송출 광고 조회`);

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

  const getOnCampaignList = (): Promise<string[]> => {
    console.log('현재 ON되어있는 campaign List를 조회한다.');
    const campaignListQuery = `
    SELECT campaignId, campaignName, optionType, startDate, finDate, selectedTime
    FROM campaign
    LEFT JOIN marketerInfo
    ON campaign.marketerId = marketerInfo.marketerId
    WHERE marketerInfo.marketerContraction = 1
    AND campaign.onOff = 1
    AND NOT campaign.optionType = 2
    AND campaign.limitState = 0
    `;
    interface TimeData {
      startDate: Date;
      finDate: Date;
      campaignId: string;
      campaignName: string;
      selectedTime: Date;
      optionType: number;
    }
    interface ReturnDate {
      [key: string]: Date;
    }
    return new Promise((resolve, reject) => {
      doQuery(campaignListQuery)
        .then((row) => {
          const filteredDate: ReturnDate = {};
          const campaignIdList: string[] = [];
          const nowDate = new Date();
          row.result.map(
            (data: TimeData) => {
              if (data.startDate && data.startDate < nowDate && (data.finDate > nowDate || !data.finDate)) {
                filteredDate[data.campaignId] = data.selectedTime;
                campaignObject[data.campaignId] = [data.optionType, data.campaignName];
              }
            }
          );
          Object.values(filteredDate).map((value: Date, index: number) => {
            const jsonData = JSON.parse(value.toLocaleString());
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
  const getCategoryCampaignList = (categoryId: number): Promise<string[]> => {
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

  const getGameId = async (creatorId: string): Promise<string> => {
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

  const insertTwitchGameUnchecked = (gameId: string, creatorId: string) => {
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
  const getGameCampaignList = async (gameId: string, creatorId: string): Promise<string[]> => {
    console.log('게임의 카테고리에 계약되어있는 캠페인 List를 가져옵니다.');
    const categoryList: number[] = gameDict[gameId] ? gameDict[gameId].concat(gameDict.default) : gameDict.default;
    let returnList: string[] = [];
    if (categoryList) {
      if (categoryList.includes(14) && categoryList.length === 1) {
        insertTwitchGameUnchecked(gameId, creatorId);
      }
      await Promise.all(
        categoryList.map((categoryId) => getCategoryCampaignList(categoryId)
          .then((campaignList: any) => {
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

  const getBanList = (creatorId: string): Promise<string[]> => {
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

  const getBannerSrc = (campaignId: string): Promise<string> => {
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

  interface LinkJson {
    linkName: string;
    linkTo: string;
    primary: boolean;
  }

  const getLinkName = (campaignId: string): Promise<string> => {
    const selectQuery = `
                          SELECT links 
                          FROM linkRegistered 
                          WHERE linkId = (SELECT connectedLinkId FROM campaign WHERE campaignId = ?) 
                        `;
    return new Promise((resolve, reject) => {
      doQuery(selectQuery, [campaignId])
        .then((row) => {
          let linkName;
          const links = JSON.parse(row.result[0].links);
          links.links.map((data: LinkJson) => {
            if (data.primary === true) {
              linkName = data.linkName;
            }
          });
          resolve(linkName);
        })
        .catch((errorData) => {
          errorData.point = 'getLinkName()';
          errorData.description = '하나의 campaignId를 통해 linkName 가져오는 과정';
          reject(errorData);
        });
    });
  };

  const getRandomInt = (length: number): number => {
    const max = Math.floor(length);
    return Math.floor(Math.random() * (max - 0)) + 0; // 최댓값은 제외, 최솟값은 포함
  };

  async function getBanner([creatorId, gameId]: string[]): Promise<[string | boolean, string | boolean, string | boolean]> {
    console.log(`-----------------------Id : ${creatorId} / ${getTime}---------------------------`);
    let linkToChatBot;
    const [creatorCampaignList, onCampaignList, banList] = await Promise.all(
      [
        getCreatorCampaignList(creatorId),
        getOnCampaignList(),
        getBanList(creatorId)
      ]
    );
    const categoryCampaignList = await getGameCampaignList(gameId, creatorId);
    const onCreatorcampaignList = creatorCampaignList.filter((campaignId) => onCampaignList.includes(campaignId));
    if (onCreatorcampaignList.length !== 0) {
      console.log(onCreatorcampaignList);
      const extractBanCampaignList = onCreatorcampaignList.filter((campaignId) => !banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
      if (extractBanCampaignList) {
        const returnCampaignId = extractBanCampaignList[getRandomInt(extractBanCampaignList.length)];
        console.log(returnCampaignId);
        myCampaignId = returnCampaignId;
      }
    } else {
      console.log(`${creatorId} 크리에이터에게만 송출될 광고 없음. 카테고리 선택형 및 노출우선형 광고 검색`);
      const onCategorycampaignList = categoryCampaignList.filter((campaignId) => onCampaignList.includes(campaignId));
      // const campaignList = Array.from(new Set(onCreatorcampaignList.concat(onCategorycampaignList)));
      const extractBanCampaignList = onCategorycampaignList.filter((campaignId) => !banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
      const returnCampaignId = extractBanCampaignList[getRandomInt(extractBanCampaignList.length)];
      myCampaignId = returnCampaignId;
    }

    if (myCampaignId && campaignObject[myCampaignId][0] === 1) {
      console.log(`${creatorId} : 광고될 캠페인은 ${myCampaignId} 입니다. at : ${getTime}`);
      linkToChatBot = await getLinkName(myCampaignId);
    } else {
      socket.emit('img clear', []);
      console.log(`${creatorId} : 켜져있는 광고가 없습니다. at : ${getTime}`);
      return [false, false, false];
    }

    if (prevBannerName && myCampaignId === prevBannerName.split(',')[0]) {
      return [false, myCampaignId, linkToChatBot];
    }
    const bannerSrc = await getBannerSrc(myCampaignId);
    return [bannerSrc, myCampaignId, linkToChatBot];
  }
  interface CreatorIds {
    creatorId: string;
    creatorTwitchId: string;
    adChatAgreement: number;
  }
  async function getCreatorData(): Promise<CreatorIds> {
    const initQuery = 'SELECT creatorId, creatorTwitchId, adChatAgreement FROM creatorInfo WHERE advertiseUrl = ?';
    return new Promise((resolve, reject) => {
      doQuery(initQuery, [cutUrl])
        .then((row) => {
          if (row.result[0]) {
            resolve(row.result[0]);
          } else {
            socket.emit('url warning', []);
          }
        })
        .catch((errorData) => {
          errorData.point = 'getCreatorData()';
          errorData.description = 'getCreatorData 불러오는 과정';
          reject(errorData);
        });
    });
  }

  function writeToDb(campaignId: string, creatorId: string, program: string): void {
    const writeQuery = 'INSERT INTO campaignTimestamp (campaignId, creatorId, program) VALUES (?, ?, ?);';
    doQuery(writeQuery, [campaignId, creatorId, program]);
  }

  async function init(): Promise<void> {
    const CREATOR_DATA = await getCreatorData();
    if (CREATOR_DATA.creatorId) { // 새로운 배너가 송출되는 경우
      myGameId = await getGameId(CREATOR_DATA.creatorId);
      const myCreatorTwitchId = CREATOR_DATA.creatorTwitchId;
      const myAdChatAgreement = CREATOR_DATA.adChatAgreement;
      const bannerInfo = await getBanner([CREATOR_DATA.creatorId, myGameId]);
      const checkOptionType = typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][0] : null;
      const campaignName = typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][1] : null;
      const linkName = typeof bannerInfo[1] === 'string' ? bannerInfo[2] : null;

      if (myAdChatAgreement === 1 && checkOptionType === 1) { // 채봇 동의 및 옵션타입 cpm+cpc인 경우에 챗봇으로 데이터 전송
        console.log(CREATOR_DATA.creatorId, 'next-campaigns-twitch-chatbot Emitting!! - ', myCreatorTwitchId);
        socket.broadcast.emit('next-campaigns-twitch-chatbot', {
          campaignId: myCampaignId, creatorId: CREATOR_DATA.creatorId, creatorTwitchId: myCreatorTwitchId, campaignName, linkName
        });
      }

      if (typeof bannerInfo[0] === 'string' && typeof bannerInfo[1] === 'string') {
        writeToDb(myCampaignId, CREATOR_DATA.creatorId, programType);
        // [bannerSrc, myCampaignId]
        socket.emit('img receive', [bannerInfo[0], [bannerInfo[1], CREATOR_DATA.creatorId]]);
        // to chatbot
      } else {
        if (myCampaignId) {
          writeToDb(myCampaignId, CREATOR_DATA.creatorId, programType);
        }
        console.log(`${CREATOR_DATA.creatorId} : 같은 캠페인 송출 중이어서 재호출 안합니다. at ${getTime}`);
      }
    }
  }
  // 실행
  init();
}

export default callImg;
