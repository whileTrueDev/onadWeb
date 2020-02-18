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
    case 'bannerId':
      return { ...state, bannerId: action.value };
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
    case 'reset': {
      return {
        bannerId: '',
        mainLandingUrl: '',
        sub1LandingUrl: '',
        sub2LandingUrl: '',
        mainLandingUrlName: '',
        sub1LandingUrlName: '',
        sub2LandingUrlName: '',
      };
    }
    // case 'keyword0':
    //   return { ...state, keyword0: action.value };
    // case 'keyword1':
    //   return { ...state, keyword1: action.value };
    // case 'keyword2':
    //   return { ...state, keyword2: action.value };
    default:
      return state;
  }
};

const nameReducer = (state, action) => {
  switch (action.key) {
    case 'set':
      return { error: false, name: action.value };
    case 'duplicate':
      return { error: true, msg: '캠페인 이름이 중복되었습니다.' };
    case 'min':
      return { error: true, msg: '2자 이상 입력하세요.' };
    default:
      return state;
  }
};

// 일일예산 설정 - 캠페인 일일예산 설정시 필요한 데이터
const budgetReducer = (state, action) => {
  switch (action.key) {
    case 'noBudget':
      return { budget: false, value: 0 };
    case 'budget':
      return { budget: true, value: action.value };
    default:
      return state;
  }
};

const termReducer = (state, action) => {
  switch (action.key) {
    case 'noTerm':
      return { ...state, term: false };
    case 'term':
      return { ...state, term: true };
    case 'startDate':
      return { ...state, startDate: action.value };
    case 'finDate':
      return { ...state, finDate: action.value };
    case 'reset':
      return { term: false, startDate: null, finDate: null };
    default:
      return state;
  }
};


const timeReducer = (state, action) => {
  switch (action.key) {
    case 'noTime':
      return { time: false };
    case 'time':
      return { time: true, timeList: [...Array(24).keys()].map(() => true) };
    case 'settime':
      return { time: true, timeList: action.value };
    default:
      return state;
  }
};


export {
  step1Reducer,
  step2Reducer,
  step2SelectReducer,
  step3Reducer,
  termReducer,
  timeReducer,
  nameReducer,
  budgetReducer
};
