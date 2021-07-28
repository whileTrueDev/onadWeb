import socketio, { Socket } from 'socket.io';
import RequestBanner from './requestBanner copy';
import { CreatorStatus } from '../@types/shared';

const requestMessage: CreatorStatus = {
  url: 'http://localhost:3002/banner/onad',
  previousBannerName: '',
  programType: '',
};

const test = new RequestBanner(requestMessage);

const getCreatorIdAndChatAgreementTest = async () => {
  const creatorId = await test.getCreatorIdAndChatAgreement();
  console.log(creatorId.creatorId);
};

const getOnCampaignListTest = async () => {
  const campaigns = await test.getActiveCampaigns();
  console.log(campaigns);
};
// const getCreatorDataTest = async () => {
//   const creatorId = await test.getCreatorData();
//   console.log(creatorId);
// };

getCreatorIdAndChatAgreementTest();
