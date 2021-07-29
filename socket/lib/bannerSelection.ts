/* eslint-disable no-console */
/* eslint-disable import/first */

import dotenv from 'dotenv';

dotenv.config();

import doQuery from '../models/doQuery';
import {
  Campaign,
  ReturnDate,
  LinkJson,
  CreatorIds,
  BanPausedCampaign,
  CampaignObject,
} from '../@types/bannerRequest';
import { CreatorStatus, Banner } from '../@types/shared';
import query from '../models/query';

class BannerSelection {
  fullUrl: string;
  cutUrl: string;
  previousBannerName: string;
  programType: string;
  timestamp: string;
  campaignObject: CampaignObject;
  creatorId: string;
  banOrPausedCampaigns: BanPausedCampaign;
  constructor(requestMessage: CreatorStatus) {
    this.fullUrl = requestMessage.url;
    this.cutUrl = `/${this.fullUrl.split('/')[4]}`;
    this.previousBannerName = requestMessage.previousBannerName;
    this.programType = requestMessage.programType;
    this.timestamp = new Date().toLocaleString();
    this.campaignObject = {};
    this.creatorId = '';
    this.banOrPausedCampaigns = {};
  }

  getCreatorIdAndChatAgreement = async (): Promise<CreatorIds | boolean> => {
    const { creatorByUrl } = query;
    return new Promise((resolve, reject) => {
      doQuery(creatorByUrl, [this.cutUrl])
        .then(row => {
          if (row.result[0]) {
            const creator = row.result[0];
            this.creatorId = creator.creatorId;
            resolve(row.result[0]);
          }
          resolve(false);
        })
        .catch(errorData => {
          console.log(errorData);
          reject(errorData);
        });
    });
  };

  getGameId = async (): Promise<string> => {
    console.log(`${this.creatorId} / get gameid / ${this.timestamp}`);
    const { assignedTwitchGameId } = query;
    const { assignedAfreecaGameId } = query;
    try {
      const [{ result: twitchGameIdResult }, { result: afreecaGameIdResult }] = await Promise.all([
        doQuery(assignedTwitchGameId, [this.creatorId]),
        doQuery(assignedAfreecaGameId, [this.creatorId]),
      ]);

      // 트위치 방송 중인 경우, 트위치 현재 진행 중 카테고리
      if (twitchGameIdResult.length > 0) {
        const creatorGameId = twitchGameIdResult[0].gameId;
        return creatorGameId;
      }

      // 트위치 방송중이 아니며, 아프리카티비 방송 중 -> 아프리카 tv 카테고리
      // 즉, 동시 송출 중이라면, twitch 카테고리를 우선시 함. @by hwasurr
      if (!(twitchGameIdResult.length > 0) && afreecaGameIdResult.length > 0) {
        const creatorGameId = afreecaGameIdResult[0].gameId;
        return creatorGameId;
      }
      return '';
    } catch (errorData) {
      errorData.point = 'getGameId()';
      errorData.description = 'TWITCHSTREAMDETAIL 또는 AFREECABROAD 에서 GAMEID 가져오기';
      throw errorData;
    }
  };

  getCreatorCampaignList = (): Promise<string[]> => {
    console.log(`${this.creatorId} / 특정 방송인 송출 광고 조회 / ${this.timestamp}`);

    const { creatorCampaign } = query;
    return new Promise((resolve, reject) => {
      doQuery(creatorCampaign, [this.creatorId])
        .then(row => {
          if (row.result[0].length !== 0) {
            const creatorCampaigns = JSON.parse(row.result[0].campaignList);
            resolve(creatorCampaigns.campaignList);
          }
        })
        .catch(errorData => {
          reject(errorData);
        });
    });
  };

  getActiveCampaigns = (): Promise<string[]> => {
    // 광고주 상태가 켜져있고, 캠페인이 켜져있으며 일일예산을 소진하지 않은 LIVE생방송배너광고(CPM+CPC) 이거나,
    // 광고주 상태가 켜져있고, 캠페인이 켜져있는 판매형광고(CPS)만 가져온다.
    const { activeCampaign } = query;

    return new Promise((resolve, reject) => {
      doQuery(activeCampaign)
        .then(row => {
          const filteredDate: ReturnDate = {};
          const campaignIds: string[] = [];
          const nowDate = new Date();
          row.result.map((data: Campaign) => {
            if (
              data.startDate &&
              data.startDate < nowDate &&
              (data.finDate > nowDate || !data.finDate)
            ) {
              filteredDate[data.campaignId] = data.selectedTime;
              this.campaignObject[data.campaignId] = {
                optionType: data.optionType,
                campaignName: data.campaignName,
                campaignDescription: data.campaignDescription,
              };
            }
          });
          Object.values(filteredDate).map((value: Date, index: number) => {
            const activeTime = JSON.parse(value.toLocaleString());
            if (activeTime.time.includes(nowDate.getHours())) {
              campaignIds.push(Object.keys(filteredDate)[index]);
            }
          });
          resolve(campaignIds);
        })
        .catch(errorData => {
          reject(errorData);
        });
    });
  };

  getBanOrPausedCampaignsByCreator = (): Promise<BanPausedCampaign> => {
    const { banAndPausedCampaign } = query;

    return new Promise((resolve, reject) => {
      doQuery(banAndPausedCampaign, [this.creatorId])
        .then(row => {
          const bannedCampaigns = JSON.parse(row.result[0].banList).campaignList;
          const pausedCampaigns = JSON.parse(row.result[0].pausedList).campaignList;
          resolve({ bannedCampaigns, pausedCampaigns });
        })
        .catch(errorData => {
          reject(errorData);
        });
    });
  };

  getCategoryCampaigns = async (categoryId: string): Promise<string[]> => {
    const { categoryCampaign } = query;
    return new Promise((resolve, reject) => {
      doQuery(categoryCampaign, [categoryId])
        .then(row => {
          if (row.result.length > 0) {
            const categoryCampaigns = JSON.parse(row.result[0].campaignList);
            resolve(categoryCampaigns.campaignList);
          }
          resolve([]);
        })
        .catch(errorData => {
          reject(errorData);
        });
    });
  };

  getGameCampaigns = async (gameId: string, isDefault = false): Promise<string[]> => {
    // ************************************************************
    // 트위치 카테고리의 경우
    const CATEGORY_WHATEVER = '14';

    let campaigns: string[] = [];
    if (isDefault) {
      campaigns = await this.getCategoryCampaigns(gameId);
      return campaigns;
    }
    await Promise.all([
      this.getCategoryCampaigns(gameId),
      this.getCategoryCampaigns(CATEGORY_WHATEVER),
    ])
      .then(([categoryCampaignByGameId, AnyCategoryCampaign]) => {
        campaigns = categoryCampaignByGameId.concat(AnyCategoryCampaign);
      })
      .catch(errorData => {
        console.log(errorData);
      });

    return Array.from(new Set(campaigns));
  };

  getBannerSrc = (campaignId: string): Promise<string> => {
    const { bannerSrc } = query;
    return new Promise((resolve, reject) => {
      doQuery(bannerSrc, [campaignId])
        .then(row => {
          resolve(row.result[0].bannerSrc);
        })
        .catch(errorData => {
          reject(errorData);
        });
    });
  };

  getLinkName = (campaignId: string): Promise<string> => {
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
          reject(errorData);
        });
    });
  };

  getMerchandiseSiteUrl = async (campaignId: string): Promise<string> => {
    const { onadMallItemUrl } = query;
    const { result } = await doQuery(onadMallItemUrl, [campaignId]);
    if (!(result.length > 0)) return '';
    return result[0].itemSiteUrl;
  };

  getRandomInt = (length: number): number => {
    const max = Math.floor(length);
    return Math.floor(Math.random() * (max - 0)) + 0; // 최댓값은 제외, 최솟값은 포함
  };

  markTimestamp = (campaignId: string, creatorId: string, program: string): void => {
    const { insertTimestamp } = query;
    doQuery(insertTimestamp, [campaignId, creatorId, program]);
  };

  filterCampaign = (
    activeCreatorCampaigns: string[],
    banOrPausedCampaigns: BanPausedCampaign,
  ): string[] => {
    const extractPausedCampaignList = activeCreatorCampaigns.filter(
      (campaignId: string) => !banOrPausedCampaigns.pausedCampaigns.includes(campaignId),
    ); // 일시정지 배너 거르기.
    const filterdCampaigns = extractPausedCampaignList.filter(
      (campaignId: string) => !banOrPausedCampaigns.bannedCampaigns.includes(campaignId),
    ); // 마지막에 banList를 통해 거르기.
    return filterdCampaigns;
  };

  getDefaultBanner = async (banOrPausedCampaigns: BanPausedCampaign): Promise<string> => {
    const categoryCampaignList = await this.getGameCampaigns('-1', true);
    console.log(`${this.creatorId} 기본 배너 검색 / ${this.timestamp}`);
    const onCategorycampaignList = categoryCampaignList.filter(campaignId =>
      categoryCampaignList.includes(campaignId),
    );

    const filteredCampaigns = this.filterCampaign(onCategorycampaignList, banOrPausedCampaigns);
    const selectedActiveCampaign = filteredCampaigns.length !== 0 ? filteredCampaigns[0] : '';
    return selectedActiveCampaign;
  };

  getCampaign = async ([creatorId, gameId]: string[]): Promise<string> => {
    console.log(
      `-----------------------Id : ${creatorId} / ${this.timestamp}---------------------------`,
    );
    let selectedActiveCampaign = '';
    const [creatorCampaigns, activeCampaigns] = await Promise.all([
      this.getCreatorCampaignList(),
      this.getActiveCampaigns(),
    ]);
    this.banOrPausedCampaigns = await this.getBanOrPausedCampaignsByCreator();
    // *********************************************************
    // 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인 -> ON 상태 필터링
    const activeCreatorCampaigns = creatorCampaigns.filter((campaignId: string) =>
      activeCampaigns.includes(campaignId),
    );

    // 현재 ON상태인 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인 목록이 있는 경우
    if (activeCreatorCampaigns.length !== 0) {
      const filteredCampaigns = this.filterCampaign(
        activeCreatorCampaigns,
        this.banOrPausedCampaigns,
      );
      if (filteredCampaigns) {
        selectedActiveCampaign = filteredCampaigns[this.getRandomInt(filteredCampaigns.length)];
        console.log('방송인 에게만 송출될 캠페인 : ', selectedActiveCampaign);
      }
    } else {
      // *********************************************************
      // 현재 ON상태인 크리에이터 개인에게 할당된(크리에이터 에게 송출) 캠페인이 없는 경우
      const categoryCampaignList = await this.getGameCampaigns(gameId);
      console.log(
        `${creatorId} 방송인에게만 송출될 광고 없음. 카테고리 선택형 및 노출우선형 광고 검색 / ${this.timestamp}`,
      );
      const onCategorycampaignList = categoryCampaignList.filter(campaignId =>
        activeCampaigns.includes(campaignId),
      );
      const filteredCampaigns = this.filterCampaign(
        onCategorycampaignList,
        this.banOrPausedCampaigns,
      );
      selectedActiveCampaign = filteredCampaigns[this.getRandomInt(filteredCampaigns.length)];
    }
    return selectedActiveCampaign;
  };

  getBanner = async (selectedActiveCampaign: string): Promise<Banner> => {
    // RETRUN 섹션
    const OPTION_TYPE_LIVE_BANNER_CAMPAIGN = 1; // 생방송 라이브 배너광고 캠페인의 경우
    const OPTION_TYPE_CPS_CAMPAIGN = 3; // 판매형광고(CPS) 캠페인의 경우
    const campaignToStream = {
      bannerSrc: '',
      campaignId: '',
      linkToChatBot: '',
    };
    let linkToChatBot;
    let onadDefaultBanner = '';
    if (
      selectedActiveCampaign &&
      this.campaignObject[selectedActiveCampaign].optionType === OPTION_TYPE_LIVE_BANNER_CAMPAIGN
    ) {
      // 송출될 캠페인의 link 를 가져와 트위치 챗봇에 챗봇광고 이벤트를 에밋하기 위한 정보를 가져온다.
      console.log(
        `${this.creatorId} / 광고될 캠페인은 ${selectedActiveCampaign} / ${this.timestamp}`,
      );
      linkToChatBot = await this.getLinkName(selectedActiveCampaign);
    } else if (
      selectedActiveCampaign &&
      this.campaignObject[selectedActiveCampaign].optionType === OPTION_TYPE_CPS_CAMPAIGN
    ) {
      console.log(
        `${this.creatorId} / 광고될 캠페인은 ${selectedActiveCampaign} / ${this.timestamp}`,
      );
      linkToChatBot = await this.getMerchandiseSiteUrl(selectedActiveCampaign);
    } else {
      // 송출할 배너가 없어서 기본 배너 검색
      onadDefaultBanner = await this.getDefaultBanner(this.banOrPausedCampaigns);
      if (onadDefaultBanner) {
        // 기본 배너 송출
        console.log(`${this.creatorId} 기본 배너 송출 / ${this.timestamp}`);
        linkToChatBot = await this.getLinkName(onadDefaultBanner);
      } else {
        console.log(`${this.creatorId} / 켜져있는 광고 없음 / ${this.timestamp}`);
        return campaignToStream;
      }
    }

    if (
      this.previousBannerName &&
      selectedActiveCampaign === this.previousBannerName.split(',')[0]
    ) {
      campaignToStream.campaignId = selectedActiveCampaign;
      campaignToStream.linkToChatBot = linkToChatBot;
      return campaignToStream;
    }
    const bannerSrc = await this.getBannerSrc(selectedActiveCampaign || onadDefaultBanner);

    campaignToStream.bannerSrc = bannerSrc;
    campaignToStream.campaignId = selectedActiveCampaign || onadDefaultBanner;
    campaignToStream.linkToChatBot = linkToChatBot;
    return campaignToStream;
  };
}

export default BannerSelection;
