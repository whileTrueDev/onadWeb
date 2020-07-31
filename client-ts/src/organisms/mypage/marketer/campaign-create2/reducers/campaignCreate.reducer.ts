// key ,value를 이용하여 state의 값에 접근
export type CampaignCreateAction = {
  type:
    | 'SET_OPTION'
    | 'SET_PRIORITY_TYPE'
    | 'RESET_PRIORITY_TYPE'
    | 'SET_BANNER'
    | 'SET_LANDING_URL'
    | 'SET_TERM_START_DATE'
    | 'SET_TERM_FIN_DATE'
    | 'RESET_TERM_FIN_DATE'
    | 'SET_TIME'
    | 'RESET_TIME'
    | 'ALL_RESET'
    | 'SET_SELECTED_CREATORS'
    | 'DELETE_SELECTED_CREATORS'
    | 'SET_SELECTED_CREATOR_NAMES'
    | 'DELETE_SELECTED_CREATOR_NAMES'
    | 'RESET_SELECTED_CREATORS'
    | 'SET_SELECTED_GAMES'
    | 'DELETE_SELECTED_GAMES'
    | 'RESET_SELECTED_GAMES';
  value: string;
}

export interface CampaignCreateInterface {
  selectedOption: string;
  selectedPriorityType: string;
  selectedCreators: string[];
  selectedCreatorNames: string[];
  selectedGames: string[];
  selectedBannerId: string;
  selectedLandingUrl: string;
  campaignTerm: {
    startDate: Date | string;
    finDate?: string;
  };
  campaignTime: string[];
}

export const defaultState: CampaignCreateInterface = {
  selectedOption: 'option1',
  selectedPriorityType: '',
  selectedCreators: [],
  selectedCreatorNames: [],
  selectedGames: [],
  selectedBannerId: '',
  selectedLandingUrl: '',
  campaignTime: [],
  campaignTerm: {
    startDate: new Date(),
    finDate: undefined,
  },
};
export const CampaignCreateReducer = (
  state: CampaignCreateInterface,
  action: CampaignCreateAction
): CampaignCreateInterface => {
  const { type, value } = action;
  switch (type) {
    case 'SET_OPTION':
      return { ...state, selectedOption: value };
    case 'SET_PRIORITY_TYPE':
      return { ...state, selectedPriorityType: value };
    case 'RESET_PRIORITY_TYPE':
      return { ...state, selectedPriorityType: '' };
    case 'SET_BANNER':
      return { ...state, selectedBannerId: value };
    case 'SET_LANDING_URL':
      return { ...state, selectedLandingUrl: value };
    // 광고 타겟 기간 선택 관련
    case 'SET_TERM_START_DATE':
      return { ...state, campaignTerm: { ...state.campaignTerm, startDate: value } };
    case 'SET_TERM_FIN_DATE':
      return { ...state, campaignTerm: { ...state.campaignTerm, finDate: value } };
    case 'RESET_TERM_FIN_DATE':
      return { ...state, campaignTerm: { ...state.campaignTerm, finDate: undefined } };
    // 광고 타겟 시간 선택 관련
    case 'SET_TIME':
      if (state.campaignTime.includes(value)) {
        return { ...state, campaignTime: state.campaignTime.filter((x) => x !== value) };
      }
      return { ...state, campaignTime: [...state.campaignTime, value] };
    case 'RESET_TIME':
      return { ...state, campaignTime: [] };
    // 광고 송출 크리에이터 선택 관련
    case 'SET_SELECTED_CREATORS':
      return { ...state, selectedCreators: [...state.selectedCreators, action.value] };
    case 'DELETE_SELECTED_CREATORS':
      return {
        ...state,
        selectedCreators: state.selectedCreators.filter((item: string) => item !== value)
      };
    // 광고 송출 크리에이터 이름 (선택된 이름을 보여주기 위해)
    case 'SET_SELECTED_CREATOR_NAMES':
      return { ...state, selectedCreatorNames: [...state.selectedCreatorNames, action.value] };
    case 'DELETE_SELECTED_CREATOR_NAMES':
      return {
        ...state,
        selectedCreatorNames: state.selectedCreatorNames.filter((item: string) => item !== value)
      };
    case 'RESET_SELECTED_CREATORS':
      return { ...state, selectedCreators: [], selectedCreatorNames: [] };
    // 광고 송출 게임 선택 관련
    case 'SET_SELECTED_GAMES':
      return { ...state, selectedGames: [...state.selectedGames, action.value] };
    case 'DELETE_SELECTED_GAMES':
      return {
        ...state,
        selectedGames: state.selectedGames.filter((item: string) => item !== value)
      };
    case 'RESET_SELECTED_GAMES':
      return { ...state, selectedGames: [] };
    // 모두 초기화
    case 'ALL_RESET':
      return defaultState;
    default:
      throw new Error(`action.type is not defined or there is no handler for ${type}`);
  }
};
