// key ,value를 이용하여 state의 값에 접근
export type StepForInformationAction = {
  type: 'SET_NAME'
    | 'SET_BANNER'
    | 'SET_LANDING_URL'
    | 'SET_DESCRIPTION'
    | 'SET_BUDGET'
    | 'SET_TERM_START_DATE'
    | 'SET_TERM_FIN_DATE'
    | 'RESET';
  value: string;
}

export interface StepForInformationInterface {
  selectedBannerId: string;
  selectedLandingUrl: string;
  campaignName: string;
  campaignDescription: string;

  useBudgetSetting: boolean;
  campaignBudget: number | string;

  useTermSetting: boolean;
  campaignTerm: {
    startDate: Date | string | null;
    finDate: string | null;
  };

  useTimeSetting: boolean;
  campaignTime: {
    timeList: boolean[];
  };
}

export const defaultState = {
  campaignName: '',
  selectedBannerId: '',
  selectedLandingUrl: '',
  campaignDescription: '',
  useBudgetSetting: false,
  campaignBudget: '',
  useTermSetting: false,
  campaignTerm: {
    startDate: '',
    finDate: '',
  },
  useTimeSetting: false,
  campaignTime: {
    timeList: []
  }
};
const stepForInformationReducer = (
  state: StepForInformationInterface,
  action: StepForInformationAction
): StepForInformationInterface => {
  const { type, value } = action;
  switch (type) {
    case 'SET_NAME':
      return { ...state, campaignName: value };
    case 'SET_BANNER':
      return { ...state, selectedBannerId: value };
    case 'SET_LANDING_URL':
      return { ...state, selectedLandingUrl: value };
    case 'SET_DESCRIPTION':
      return { ...state, campaignDescription: value };
    case 'SET_BUDGET':
      return { ...state, campaignBudget: value };
    case 'SET_TERM_START_DATE':
      return { ...state, campaignTerm: { ...state.campaignTerm, startDate: value } };
    case 'SET_TERM_FIN_DATE':
      return { ...state, campaignTerm: { ...state.campaignTerm, finDate: value } };
    // case 'SET_TIME':
    //   return { ...state, campaignTime: { ...state.campaignTime, timeList: action.value }};
    case 'RESET':
      return defaultState;
    default:
      throw new Error('action.type is not defined');
  }
};

export { stepForInformationReducer };
