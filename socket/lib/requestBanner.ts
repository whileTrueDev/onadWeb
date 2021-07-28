/* eslint-disable no-console */
import { Socket } from 'socket.io';
import BannerSelection from './bannerSelection';
import { CreatorStatus } from '../@types/shared';

const requestBanner = async (socket: Socket, requestMessage: CreatorStatus): Promise<void> => {
  const bannerSelection = new BannerSelection(requestMessage);
  const creatorIdAndChatAgreement = await bannerSelection.getCreatorIdAndChatAgreement();
  const { creatorId } = creatorIdAndChatAgreement;

  if (creatorId) {
    const creatorGameId = await bannerSelection.getGameId();
    const selectedCampaign = await bannerSelection.getCampaign([creatorId, creatorGameId]);
    const bannerInfo = await bannerSelection.getBanner(selectedCampaign);
    const checkOptionType = bannerInfo.campaignId
      ? bannerSelection.campaignObject[bannerInfo.campaignId].optionType
      : null;
    const campaignName = bannerInfo.campaignId
      ? bannerSelection.campaignObject[bannerInfo.campaignId].campaignName
      : null;
    const linkName = bannerInfo.campaignId ? bannerInfo.linkToChatBot : null;
    const campaignDescription = bannerInfo.campaignId
      ? bannerSelection.campaignObject[bannerInfo.campaignId].campaignDescription
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
          `${creatorId} / next-campaigns-twitch-chatbot Emitting ${creatorTwitchId} / ${bannerSelection.timestamp}`,
        );
        socket.broadcast.emit('next-campaigns-twitch-chatbot', {
          campaignId: bannerInfo.campaignId,
          creatorId,
          creatorTwitchId,
          campaignName,
          descriptionToChat,
        });
      }
    }
    if (bannerInfo.bannerSrc && bannerInfo.campaignId) {
      bannerSelection.markTimestamp(bannerInfo.campaignId, creatorId, bannerSelection.programType);
      socket.emit('img receive', [bannerInfo.bannerSrc, [bannerInfo.campaignId, creatorId]]);
      // to chatbot
    } else {
      if (bannerInfo.campaignId) {
        bannerSelection.markTimestamp(
          bannerInfo.campaignId,
          creatorId,
          bannerSelection.programType,
        );
      }
      console.log(
        `${creatorId} / 같은 캠페인 송출 중이어서 재호출 안함 / ${bannerSelection.timestamp}`,
      );
    }
  }
};

export default requestBanner;
