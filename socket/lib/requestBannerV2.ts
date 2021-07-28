/* eslint-disable no-console */
/* eslint-disable import/first */

import { Socket } from 'socket.io';
import RequestBanner from './requestBanner copy';
import { CreatorStatus } from '../@types/shared';

const requestBanner = async (socket: Socket, requestMessage: CreatorStatus) => {
  const requestModule = new RequestBanner(requestMessage);
  const creatorIdAndChatAgreement = await requestModule.getCreatorIdAndChatAgreement();
  const { creatorId } = creatorIdAndChatAgreement;

  let creatorGameId;
  if (creatorId) {
    creatorGameId = await requestModule.getGameId();
    const bannerInfo = await requestModule.getBanner([creatorId, creatorGameId]);

    const checkOptionType = bannerInfo.campaignId
      ? requestModule.campaignObject[bannerInfo.campaignId].optionType
      : null;
    const campaignName = bannerInfo.campaignId
      ? requestModule.campaignObject[bannerInfo.campaignId].campaignName
      : null;
    const linkName = bannerInfo.campaignId ? bannerInfo.linkToChatBot : null;
    const campaignDescription = bannerInfo.campaignId
      ? requestModule.campaignObject[bannerInfo.campaignId].campaignDescription
      : null;
    const descriptionToChat: string | boolean | null = campaignDescription || linkName;

    const { creatorTwitchId } = creatorIdAndChatAgreement;
    const { adChatAgreement } = creatorIdAndChatAgreement;
    // 트위치 챗봇 동의 및 옵션타입 cpm+cpc인 경우에 챗봇으로 데이터 전송
    const CHATBOT_ALLOWED_CAMPAIGN_OPTION_TYPE = [1, 3];
    if (
      adChatAgreement === 1 &&
      checkOptionType &&
      CHATBOT_ALLOWED_CAMPAIGN_OPTION_TYPE.includes(checkOptionType)
    ) {
      if (creatorTwitchId) {
        // 챗봇은 트위치 한정. 트위치 아이디가 없는 경우 에미팅 하지 않도록 추가
        // @by hwasurr 21.01.08
        console.log(
          `${creatorId} / next-campaigns-twitch-chatbot Emitting ${creatorTwitchId} / {timestamp}`,
        );
        socket.broadcast.emit('next-campaigns-twitch-chatbot', {
          campaignId: requestModule.myCampaignId,
          creatorId,
          creatorTwitchId,
          campaignName,
          descriptionToChat,
        });
      }
    }
    console.log(bannerInfo.optionType && bannerInfo.campaignName);
    if (bannerInfo.optionType && bannerInfo.campaignName) {
      requestModule.markTimestamp(requestModule.myCampaignId, creatorId, requestModule.programType);
      console.log(bannerInfo.bannerSrc, [bannerInfo.campaignName, creatorId]);
      socket.emit('img receive', [bannerInfo.bannerSrc, [bannerInfo.campaignName, creatorId]]);
      // to chatbot
    } else {
      if (requestModule.myCampaignId) {
        requestModule.markTimestamp(
          requestModule.myCampaignId,
          creatorId,
          requestModule.programType,
        );
      }
      console.log(
        `${creatorId} / 같은 캠페인 송출 중이어서 재호출 안함 / ${requestModule.timestamp}`,
      );
    }
  }
};

export default requestBanner;
