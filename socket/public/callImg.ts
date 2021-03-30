import { Socket } from 'socket.io';
import doQuery from '../models/doQuery';

function callImg(socket: Socket, msg: string[]): void {
  const fullUrl: string = msg[0];
  const cutUrl = `/${fullUrl.split('/')[4]}`;
  const prevBannerName: string = msg[1];
  const programType: string = msg[2];
  const getTime: string = new Date().toLocaleString();
  interface CampaignIdOptionType {
    [_: string]: [number, string, string];
  }
  const campaignObject: CampaignIdOptionType = {};

  let myCampaignId: string;
  let myGameId: string;
  // creatorId를 전달받아 creatorCampaign과 onff List를 도출.
  const getCreatorCampaignList = (creatorId: string): Promise<string[]> => {
    console.log(`${creatorId} / 특정 방송인 송출 광고 조회 / ${getTime}`);

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

  // 켜져있는 광고
  const getOnCampaignList = (): Promise<string[]> => {
    const campaignListQuery = `
    SELECT campaignId, campaignName, optionType, startDate, finDate, selectedTime, campaignDescription
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
      campaignDescription: string;
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
                campaignObject[data.campaignId] = [data.optionType, data.campaignName, data.campaignDescription];
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
  const getCategoryCampaignList = async (categoryId: string): Promise<string[]> => {
    const campaignListQuery = 'SELECT campaignList FROM categoryCampaign WHERE categoryId = ?';
    return new Promise((resolve, reject) => {
      doQuery(campaignListQuery, [categoryId])
        .then((row) => {
          if (row.result.length > 0) {
            const jsonData = JSON.parse(row.result[0].campaignList);
            resolve(jsonData.campaignList);
          }
          resolve([]);
        })
        .catch((errorData) => {
          errorData.point = 'getCategoryCampaignList()';
          errorData.description = '하나의 categoryId를 통하여 계약된 campaignList 가져오는 과정.';
          reject(errorData);
        });
    });
  };

  const getGameId = async (creatorId: string): Promise<string> => {
    console.log(`${creatorId} / get gameid / ${getTime}`);
    const getGameIdQuery = `
    SELECT gameId FROM twitchStreamDetail AS tsd 
    WHERE streamId = (
      SELECT streamId FROM twitchStream
      JOIN creatorInfo ON creatorTwitchOriginalId = streamerId
      WHERE creatorId = ?
      ORDER BY startedAt DESC LIMIT 1
    ) AND time > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    ORDER BY tsd.time DESC LIMIT 1;`;

    const getAfreecaGameIdQuery = `
    SELECT broadCategory AS gameId FROM AfreecaBroadDetail AS ABD
    WHERE broadId = (
      SELECT broadId FROM AfreecaBroad JOIN creatorInfo ON afreecaId = userId
      WHERE creatorId = ? ORDER BY broadStartedAt DESC LIMIT 1
    ) AND createdAt > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    ORDER BY createdAt DESC LIMIT 1
    `;

    try {
      const [
        { result: twitchGameIdResult },
        { result: afreecaGameIdResult }
      ] = await Promise.all([
        doQuery(getGameIdQuery, [creatorId]),
        doQuery(getAfreecaGameIdQuery, [creatorId])
      ]);

      // 트위치 방송 중인 경우, 트위치 현재 진행 중 카테고리
      if (twitchGameIdResult.length > 0) {
        myGameId = twitchGameIdResult[0].gameId;
      }

      // 트위치 방송중이 아니며, 아프리카티비 방송 중 -> 아프리카 tv 카테고리
      // 즉, 동시 송출 중이라면, twitch 카테고리를 우선시 함. @by hwasurr
      if (!(twitchGameIdResult.length > 0) && afreecaGameIdResult.length > 0) {
        myGameId = afreecaGameIdResult[0].gameId;
      }
      return myGameId;
    } catch (errorData) {
      errorData.point = 'getGameId()';
      errorData.description = 'TWITCHSTREAMDETAIL 또는 AFREECABROAD 에서 GAMEID 가져오기';
      throw errorData;
    }
  };

  /**
   * @deprecated 2021.01.11 by hwasurr
   * store uncehcked game
   * @param gameId gameId
   * @param creatorId creatorId
   */
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

  // "하나의 gameId" + "카테고리무관" 에 해당하는 모든 캠페인 리스트를 반환하는 Promise
  const getGameCampaignList = async (gameId: string, isDefault = false): Promise<string[]> => {
    // ************************************************************
    // 트위치 카테고리의 경우
    const CATEGORY_WHATEVER = '14';

    let returnList: string[] = [];
    if (isDefault) {
      returnList = await getCategoryCampaignList(gameId);
      return returnList;
    }
    await Promise.all([
      getCategoryCampaignList(gameId),
      getCategoryCampaignList(CATEGORY_WHATEVER)
    ])
      .then(([campaignList1, campaignList2]) => {
        returnList = campaignList1.concat(campaignList2);
      })
      .catch((errorData) => {
        errorData.point = 'getGameCampaignList()';
        errorData.description = 'categoryCampaign에서 각각의 categoryId에 따른 캠페인 가져오기';
      });

    return Array.from(new Set(returnList));
  };

  const getBanList = (creatorId: string): Promise<any> => {
    const selectQuery = `
    SELECT banList, pausedList
    FROM creatorCampaign
    WHERE creatorId = ?
    `;

    return new Promise((resolve, reject) => {
      doQuery(selectQuery, [creatorId])
        .then((row) => {
          const banList = JSON.parse(row.result[0].banList).campaignList;
          const pausedList = JSON.parse(row.result[0].pausedList).campaignList;
          resolve({ banList, pausedList });
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
          let linkName = '';
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

  /**
   * 해당 캠페인에 연결된 상품의 온애드몰 URL을 가져옵니다.
   * @param campaignId 캠페인 아이디
   * @returns 상품 사이트 URL 문자열
   */
  const getMerchandiseSiteUrl = async (campaignId: string): Promise<string> => {
    const query = `SELECT itemSiteUrl
    FROM merchandiseMallItems
    JOIN campaign on campaign.merchandiseId = merchandiseMallItems.merchandiseId
    WHERE campaignId = ?`;
    const { result } = await doQuery(query, [campaignId]);
    if (!(result.length > 0)) return '';
    return result[0].itemSiteUrl;
  };

  const getRandomInt = (length: number): number => {
    const max = Math.floor(length);
    return Math.floor(Math.random() * (max - 0)) + 0; // 최댓값은 제외, 최솟값은 포함
  };

  async function getBanner(
    [creatorId, gameId]: string[]
  ): Promise<[string | boolean, string | boolean, string | boolean]> {
    console.log(`-----------------------Id : ${creatorId} / ${getTime}---------------------------`);
    let linkToChatBot;
    const [creatorCampaignList, onCampaignList, checkList] = await Promise.all(
      [
        getCreatorCampaignList(creatorId),
        getOnCampaignList(),
        getBanList(creatorId)
      ]
    );
    // *********************************************************
    // 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인 -> ON 상태 필터링
    const onCreatorcampaignList = creatorCampaignList.filter(
      (campaignId: any) => onCampaignList.includes(campaignId)
    );

    // 현재 ON상태인 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인 목록이 있는 경우
    if (onCreatorcampaignList.length !== 0) {
      const extractPausedCampaignList = onCreatorcampaignList
        .filter((campaignId: any) => !checkList.pausedList.includes(campaignId)); // 일시정지 배너 거르기.
      const extractBanCampaignList = extractPausedCampaignList
        .filter((campaignId: any) => !checkList.banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
      if (extractBanCampaignList) {
        const returnCampaignId = extractBanCampaignList[
          getRandomInt(extractBanCampaignList.length)
        ];
        myCampaignId = returnCampaignId;
        console.log('캠페인 : ', myCampaignId);
      }
    } else {
      // *********************************************************
      // 현재 ON상태인 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인이 없는 경우
      const categoryCampaignList = await getGameCampaignList(gameId);
      console.log(`${creatorId} 방송인에게만 송출될 광고 없음. 카테고리 선택형 및 노출우선형 광고 검색 / ${getTime}`);
      const onCategorycampaignList = categoryCampaignList
        .filter((campaignId) => onCampaignList.includes(campaignId));
      const extractPausedCampaignList = onCategorycampaignList
        .filter((campaignId) => !checkList.pausedList.includes(campaignId)); // 일시정지 배너 거르기.
      const extractBanCampaignList = extractPausedCampaignList
        .filter((campaignId) => !checkList.banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
      const returnCampaignId = extractBanCampaignList[getRandomInt(extractBanCampaignList.length)];
      myCampaignId = returnCampaignId;
    }

    // *********************************************************
    // RETRUN 섹션
    const OPTION_TYPE_LIVE_BANNER_CAMPAIGN = 1; // 생방송 라이브 배너광고 캠페인의 경우
    const OPTION_TYPE_CPS_CAMPAIGN = 3; // 판매형광고(CPS) 캠페인의 경우

    if (myCampaignId && campaignObject[myCampaignId][0] === OPTION_TYPE_LIVE_BANNER_CAMPAIGN) {
      // 송출될 캠페인의 link 를 가져와 트위치 챗봇에 챗봇광고 이벤트를 에밋하기 위한 정보를 가져온다.
      console.log(`${creatorId} / 광고될 캠페인은 ${myCampaignId} / ${getTime}`);
      linkToChatBot = await getLinkName(myCampaignId);
    } else if (myCampaignId && campaignObject[myCampaignId][0] === OPTION_TYPE_CPS_CAMPAIGN) {
      console.log(`${creatorId} / 광고될 캠페인은 ${myCampaignId} / ${getTime}`);
      linkToChatBot = await getMerchandiseSiteUrl(myCampaignId);
    } else {
      // 송출할 광고 없다.
      // 기본배너 검색
      const categoryCampaignList = await getGameCampaignList('-1', true);
      console.log(`${creatorId} 기본 배너 검색 / ${getTime}`);
      const onCategorycampaignList = categoryCampaignList
        .filter((campaignId) => onCampaignList.includes(campaignId));
      const extractPausedCampaignList = onCategorycampaignList
        .filter((campaignId) => !checkList.pausedList.includes(campaignId)); // 일시정지 배너 거르기.
      const extractBanCampaignList = extractPausedCampaignList
        .filter((campaignId) => !checkList.banList.includes(campaignId)); // 마지막에 banList를 통해 거르기.
      const returnCampaignId = extractBanCampaignList[getRandomInt(extractBanCampaignList.length)];
      myCampaignId = returnCampaignId;
      if (myCampaignId) {
        // 기본 배너 송출
        console.log(`${creatorId} 기본 배너 송출 / ${getTime}`);
        linkToChatBot = await getLinkName(myCampaignId);
      } else {
        // 기본 배너도 꺼둔 경우
        socket.emit('img clear', []);
        console.log(`${creatorId} / 켜져있는 광고 없음 / ${getTime}`);
        return [false, false, false];
      }
    }

    // 이전 송출하던 배너와 현재 배너가 같은 경우
    if (prevBannerName && myCampaignId === prevBannerName.split(',')[0]) {
      return [false, myCampaignId, linkToChatBot];
    }
    const bannerSrc = await getBannerSrc(myCampaignId);
    return [bannerSrc, myCampaignId, linkToChatBot];
  }
  interface CreatorIds {
    creatorId: string;
    creatorTwitchId?: string;
    afreecaId?: string;
    adChatAgreement: number;
  }
  async function getCreatorData(): Promise<CreatorIds> {
    const initQuery = `
    SELECT creatorId, creatorTwitchId, adChatAgreement, afreecaId
    FROM creatorInfo
    WHERE advertiseUrl = ?
    `;
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
      const bannerInfo = await getBanner([CREATOR_DATA.creatorId, myGameId]);
      const checkOptionType = typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][0] : null;
      const campaignName = typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][1] : null;
      const linkName = typeof bannerInfo[1] === 'string' ? bannerInfo[2] : null;
      const campaignDescription = typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][2] : null;
      const descriptionToChat: string | boolean | null = campaignDescription || linkName;

      // 챗봇 관련 필요 정보
      const myCreatorTwitchId = CREATOR_DATA.creatorTwitchId;
      const myAdChatAgreement = CREATOR_DATA.adChatAgreement;
      // 트위치 챗봇 동의 및 옵션타입 cpm+cpc인 경우에 챗봇으로 데이터 전송
      if (myAdChatAgreement === 1 && checkOptionType === 1) {
        if (myCreatorTwitchId) {
          // 챗봇은 트위치 한정. 트위치 아이디가 없는 경우 에미팅 하지 않도록 추가
          // @by hwasurr 21.01.08
          console.log(`${CREATOR_DATA.creatorId} / next-campaigns-twitch-chatbot Emitting ${myCreatorTwitchId} / ${getTime}`);
          socket.broadcast.emit('next-campaigns-twitch-chatbot', {
            campaignId: myCampaignId,
            creatorId: CREATOR_DATA.creatorId,
            creatorTwitchId: myCreatorTwitchId,
            campaignName,
            descriptionToChat
          });
        }
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
        console.log(`${CREATOR_DATA.creatorId} / 같은 캠페인 송출 중이어서 재호출 안함 / ${getTime}`);
      }
    }
  }
  // 실행
  init();
}

export default callImg;
