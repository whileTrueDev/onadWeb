// key ,value를 이용하여 state의 값에 접근
const step1Reducer = (state, action) => {
  switch (action.key) {
    case 'option0':
      return { ...state, option: 'option0' };
    case 'option1':
      return { ...state, option: 'option1' };
    case 'option2':
      return { ...state, option: 'option2' };
    case 'reset':
      return { option: '' };
    default:
      return state;
  }
};

const step2Reducer = (state, action) => {
  switch (action.type) {
    case 'type0':
      return { priorityType: 'type0' };
    case 'type1':
      return { priorityType: 'type1' };
    case 'type2':
      return { priorityType: 'type2' };
    case 'reset':
      return { priorityType: '' };
    default:
      return state;
  }
};

// array State를 사용하는 Reducer
const step2SelectReducer = (state, action) => {
  switch (action.type) {
    case 'push':
      if (action.value instanceof Array) {
        // 기존 state와 중복되지 않은 value만 선택
        const values = action.value.filter(v => !state.includes(v));
        return [...state, ...values];
      }
      return [...state, action.value];
    case 'delete':
      return state.filter(item => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const step3Reducer = (state, action) => {
  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'bannerId':
      return { ...state, bannerId: action.value };
    case 'budget':
      return { ...state, budget: action.value };
    case 'startDate':
      return { ...state, startDate: action.value };
    case 'finDate':
      return { ...state, finDate: action.value };
    case 'keyword0':
      return { ...state, keyword0: action.value };
    case 'keyword1':
      return { ...state, keyword1: action.value };
    case 'keyword2':
      return { ...state, keyword2: action.value };
    case 'mainLandingUrlName':
      return { ...state, mainLandingUrlName: action.value };
    case 'sub1LandingUrlName':
      return { ...state, sub1LandingUrlName: action.value };
    case 'sub2LandingUrlName':
      return { ...state, sub2LandingUrlName: action.value };
    case 'mainLandingUrl':
      return { ...state, mainLandingUrl: action.value };
    case 'sub1LandingUrl':
      return { ...state, sub1LandingUrl: action.value };
    case 'sub2LandingUrl':
      return { ...state, sub2LandingUrl: action.value };
    case 'time':
      return { ...state, time: action.value };
    case 'budgetReset':
      return { ...state, budget: '' };
    case 'dateReset':
      return { ...state, finDate: '' };
    case 'reset': {
      return {
        campaignName: '',
        bannerId: '',
        budget: '',
        startDate: new Date(),
        finDate: '',
        mainLandingUrl: '',
        sub1LandingUrl: '',
        sub2LandingUrl: '',
        mainLandingUrlName: '',
        sub1LandingUrlName: '',
        sub2LandingUrlName: '',
        time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      };
    }
    default:
      return state;
  }
};


export {
  step1Reducer,
  step2Reducer,
  step2SelectReducer,
  step3Reducer
};
