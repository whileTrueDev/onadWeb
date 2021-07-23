import { Socket } from 'socket.io';
import doQuery from '../models/doQuery';
import {
  CampaignIdOptionType,
  TimeData,
  ReturnDate,
  LinkJson,
  CreatorIds,
} from '../@types/bannerRequest';
import query from '../models/query';

interface Request {
  url: string;
  previousBannerName: string;
  programType: string;
}

function callImg(socket: Socket, request: Request): void {
  const fullUrl: string = request.url;
  const cutUrl = `/${fullUrl.split('/')[4]}`;
  const { previousBannerName } = request;
  const { programType } = request;
  const getTime: string = new Date().toLocaleString();

  const campaignObject: CampaignIdOptionType = {};

  let myCampaignId: string;
  let myGameId: string;
  // creatorId를 전달받아 creatorCampaign과 onff List를 도출.
  const getCreatorCampaignList = (creatorId: string): Promise<string[]> => {
    console.log(`${creatorId} / 특정 방송인 송출 광고 조회 / ${getTime}`);

    const { creatorCampaign } = query;

    return new Promise((resolve, reject) => {
      doQuery(creatorCampaign, [creatorId])
        .then(row => {
          if (row.result[0].length !== 0) {
            const jsonData = JSON.parse(row.result[0].campaignList);
            resolve(jsonData.campaignList);
          }
        })
        .catch(errorData => {
          errorData.point = 'getCreatorCampaignList()';
          errorData.description =
            'creatorCampaign table에서 creator에게 계약된 campaignList 가져오는 과정.';
          reject(errorData);
        });
    });
  };

  // 켜져있는 광고
  const getOnCampaignList = (): Promise<string[]> => {
    // 광고주 상태가 켜져있고, 캠페인이 켜져있으며 일일예산을 소진하지 않은 LIVE생방송배너광고(CPM+CPC) 이거나,
    // 광고주 상태가 켜져있고, 캠페인이 켜져있는 판매형광고(CPS)만 가져온다.
    const { activeCampaign } = query;

    return new Promise((resolve, reject) => {
      doQuery(activeCampaign)
        .then(row => {
          const filteredDate: ReturnDate = {};
          const campaignIdList: string[] = [];
          const nowDate = new Date();
          row.result.map((data: TimeData) => {
            if (
              data.startDate &&
              data.startDate < nowDate &&
              (data.finDate > nowDate || !data.finDate)
            ) {
              filteredDate[data.campaignId] = data.selectedTime;
              campaignObject[data.campaignId] = [
                data.optionType,
                data.campaignName,
                data.campaignDescription,
              ];
            }
          });
          Object.values(filteredDate).map((value: Date, index: number) => {
            const jsonData = JSON.parse(value.toLocaleString());
            if (jsonData.time.includes(nowDate.getHours())) {
              campaignIdList.push(Object.keys(filteredDate)[index]);
            }
          });
          resolve(campaignIdList);
        })
        .catch(errorData => {
          errorData.point = 'getOnCampaignList()';
          errorData.description = 'campaign table에서 현재 ON 되어있는 campaignList 가져오는 과정.';
          reject(errorData);
        });
    });
  };
  // 하나의 categoryId 에 해당하는 캠페인 리스트를 반환하는 Promise
  const getCategoryCampaignList = async (categoryId: string): Promise<string[]> => {
    const { categoryCampaign } = query;
    return new Promise((resolve, reject) => {
      doQuery(categoryCampaign, [categoryId])
        .then(row => {
          if (row.result.length > 0) {
            const jsonData = JSON.parse(row.result[0].campaignList);
            resolve(jsonData.campaignList);
          }
          resolve([]);
        })
        .catch(errorData => {
          errorData.point = 'getCategoryCampaignList()';
          errorData.description = '하나의 categoryId를 통하여 계약된 campaignList 가져오는 과정.';
          reject(errorData);
        });
    });
  };

  const getGameId = async (creatorId: string): Promise<string> => {
    console.log(`${creatorId} / get gameid / ${getTime}`);
    const { twitchGameIdForCreator } = query;
    const { afreecaGameIdForCreator } = query;
    try {
      const [{ result: twitchGameIdResult }, { result: afreecaGameIdResult }] = await Promise.all([
        doQuery(twitchGameIdForCreator, [creatorId]),
        doQuery(afreecaGameIdForCreator, [creatorId]),
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
    await Promise.all([getCategoryCampaignList(gameId), getCategoryCampaignList(CATEGORY_WHATEVER)])
      .then(([campaignList1, campaignList2]) => {
        returnList = campaignList1.concat(campaignList2);
      })
      .catch(errorData => {
        errorData.point = 'getGameCampaignList()';
        errorData.description = 'categoryCampaign에서 각각의 categoryId에 따른 캠페인 가져오기';
      });

    return Array.from(new Set(returnList));
  };

  const getBanList = (creatorId: string): Promise<any> => {
    const { banAndPausedCampaign } = query;

    return new Promise((resolve, reject) => {
      doQuery(banAndPausedCampaign, [creatorId])
        .then(row => {
          const banList = JSON.parse(row.result[0].banList).campaignList;
          const pausedList = JSON.parse(row.result[0].pausedList).campaignList;
          resolve({ banList, pausedList });
        })
        .catch(errorData => {
          errorData.point = 'getBanList()';
          errorData.description = '해당 creator의 banList를 가져오는 과정';
          reject(errorData);
        });
    });
  };

  const getBannerSrc = (campaignId: string): Promise<string> => {
    const { bannerSrc } = query;
    return new Promise((resolve, reject) => {
      doQuery(bannerSrc, [campaignId])
        .then(row => {
          console.log(row.result[0].bannerSrc);
          resolve(row.result[0].bannerSrc);
        })
        .catch(errorData => {
          errorData.point = 'getBannerSrc()';
          errorData.description = '하나의 campaignId를 통해 bannerSrc를 가져오는 과정';
          reject(errorData);
        });
    });
  };

  const getLinkName = (campaignId: string): Promise<string> => {
    const { linkUrl } = query;
    return new Promise((resolve, reject) => {
      doQuery(linkUrl, [campaignId])
        .then(row => {
          let linkName = '';
          const links = JSON.parse(row.result[0].links);
          links.links.map((data: LinkJson) => {
            if (data.primary === true) {
              linkName = data.linkName;
            }
          });
          resolve(linkName);
        })
        .catch(errorData => {
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
    const { onadMallItemUrl } = query;
    const { result } = await doQuery(onadMallItemUrl, [campaignId]);
    if (!(result.length > 0)) return '';
    return result[0].itemSiteUrl;
  };

  const getRandomInt = (length: number): number => {
    const max = Math.floor(length);
    return Math.floor(Math.random() * (max - 0)) + 0; // 최댓값은 제외, 최솟값은 포함
  };

  async function getBanner([creatorId, gameId]: string[]): Promise<
    [string | boolean, string | boolean, string | boolean]
  > {
    console.log(`-----------------------Id : ${creatorId} / ${getTime}---------------------------`);
    let linkToChatBot;
    const [creatorCampaignList, onCampaignList, checkList] = await Promise.all([
      getCreatorCampaignList(creatorId),
      getOnCampaignList(),
      getBanList(creatorId),
    ]);
    // *********************************************************
    // 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인 -> ON 상태 필터링
    const onCreatorcampaignList = creatorCampaignList.filter((campaignId: any) =>
      onCampaignList.includes(campaignId),
    );

    // 현재 ON상태인 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인 목록이 있는 경우
    if (onCreatorcampaignList.length !== 0) {
      const extractPausedCampaignList = onCreatorcampaignList.filter(
        (campaignId: any) => !checkList.pausedList.includes(campaignId),
      ); // 일시정지 배너 거르기.
      const extractBanCampaignList = extractPausedCampaignList.filter(
        (campaignId: any) => !checkList.banList.includes(campaignId),
      ); // 마지막에 banList를 통해 거르기.
      if (extractBanCampaignList) {
        const returnCampaignId =
          extractBanCampaignList[getRandomInt(extractBanCampaignList.length)];
        myCampaignId = returnCampaignId;
        console.log('방송인 에게만 송출될 캠페인 : ', myCampaignId);
      }
    } else {
      // *********************************************************
      // 현재 ON상태인 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인이 없는 경우
      const categoryCampaignList = await getGameCampaignList(gameId);
      console.log(
        `${creatorId} 방송인에게만 송출될 광고 없음. 카테고리 선택형 및 노출우선형 광고 검색 / ${getTime}`,
      );
      const onCategorycampaignList = categoryCampaignList.filter(campaignId =>
        onCampaignList.includes(campaignId),
      );
      const extractPausedCampaignList = onCategorycampaignList.filter(
        campaignId => !checkList.pausedList.includes(campaignId),
      ); // 일시정지 배너 거르기.
      const extractBanCampaignList = extractPausedCampaignList.filter(
        campaignId => !checkList.banList.includes(campaignId),
      ); // 마지막에 banList를 통해 거르기.
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
      const onCategorycampaignList = categoryCampaignList.filter(campaignId =>
        onCampaignList.includes(campaignId),
      );
      const extractPausedCampaignList = onCategorycampaignList.filter(
        campaignId => !checkList.pausedList.includes(campaignId),
      ); // 일시정지 배너 거르기.
      const extractBanCampaignList = extractPausedCampaignList.filter(
        campaignId => !checkList.banList.includes(campaignId),
      ); // 마지막에 banList를 통해 거르기.
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
    if (previousBannerName && myCampaignId === previousBannerName.split(',')[0]) {
      return [false, myCampaignId, linkToChatBot];
    }
    const bannerSrc = await getBannerSrc(myCampaignId);
    return [bannerSrc, myCampaignId, linkToChatBot];
  }

  async function getCreatorData(): Promise<CreatorIds> {
    const { creatorByUrl } = query;
    return new Promise((resolve, reject) => {
      doQuery(creatorByUrl, [cutUrl])
        .then(row => {
          if (row.result[0]) {
            resolve(row.result[0]);
          } else {
            socket.emit('url warning', []);
          }
        })
        .catch(errorData => {
          errorData.point = 'getCreatorData()';
          errorData.description = 'getCreatorData 불러오는 과정';
          reject(errorData);
        });
    });
  }

  function writeToDb(campaignId: string, creatorId: string, program: string): void {
    const { insertTimestamp } = query;
    doQuery(insertTimestamp, [campaignId, creatorId, program]);
  }

  async function init(): Promise<void> {
    const CREATOR_DATA = await getCreatorData();
    if (CREATOR_DATA.creatorId) {
      // 새로운 배너가 송출되는 경우
      myGameId = await getGameId(CREATOR_DATA.creatorId);
      const bannerInfo = await getBanner([CREATOR_DATA.creatorId, myGameId]);
      const checkOptionType =
        typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][0] : null;
      const campaignName =
        typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][1] : null;
      const linkName = typeof bannerInfo[1] === 'string' ? bannerInfo[2] : null;
      const campaignDescription =
        typeof bannerInfo[1] === 'string' ? campaignObject[bannerInfo[1]][2] : null;
      const descriptionToChat: string | boolean | null = campaignDescription || linkName;

      // 챗봇 관련 필요 정보
      const myCreatorTwitchId = CREATOR_DATA.creatorTwitchId;
      const myAdChatAgreement = CREATOR_DATA.adChatAgreement;
      // 트위치 챗봇 동의 및 옵션타입 cpm+cpc인 경우에 챗봇으로 데이터 전송
      const CHATBOT_ALLOWED_CAMPAIGN_OPTION_TYPE = [1, 3];
      if (
        myAdChatAgreement === 1 &&
        checkOptionType &&
        CHATBOT_ALLOWED_CAMPAIGN_OPTION_TYPE.includes(checkOptionType)
      ) {
        if (myCreatorTwitchId) {
          // 챗봇은 트위치 한정. 트위치 아이디가 없는 경우 에미팅 하지 않도록 추가
          // @by hwasurr 21.01.08
          console.log(
            `${CREATOR_DATA.creatorId} / next-campaigns-twitch-chatbot Emitting ${myCreatorTwitchId} / ${getTime}`,
          );
          socket.broadcast.emit('next-campaigns-twitch-chatbot', {
            campaignId: myCampaignId,
            creatorId: CREATOR_DATA.creatorId,
            creatorTwitchId: myCreatorTwitchId,
            campaignName,
            descriptionToChat,
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
        console.log(
          `${CREATOR_DATA.creatorId} / 같은 캠페인 송출 중이어서 재호출 안함 / ${getTime}`,
        );
      }
    }
  }
  // 실행
  init();
}

export default callImg;
