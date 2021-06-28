import { AdpickCampaignTypeEnum } from './AdpickTypes';

// Rendering Campaign types
export function renderType(typeNum: string): string {
  switch (typeNum) {
    case AdpickCampaignTypeEnum.INSTALL:
      return '앱설치';
    case AdpickCampaignTypeEnum.SIGNUP:
      return '회원가입';
    case AdpickCampaignTypeEnum.EVENT:
      return '이벤트';
    case AdpickCampaignTypeEnum.RESERVATION:
      return '사전예약';
    default:
      return typeNum;
  }
}

export default { renderType };
