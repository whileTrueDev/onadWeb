// key ,value를 이용하여 state의 값에 접근
export type Action = { key: string; value: string }

export interface ArrayAction {
  type: string;
  value?: string[] | string;
}

export interface Step1Interface {
  option: string;
}

export interface Step2Interface {
  priorityType?: string;
}

export interface Step3Interface {
  bannerId: string;
  connectedLinkId: string;
}

export interface NameInterface {
  error: boolean;
  name?: string;
  msg?: string;
}

export interface BudgetInterface {
  budget: boolean;
  value?: number | string;
}

export interface TermInterface {
  term: boolean;
  startDate: Date | string | null;
  finDate: string | null;
}

export interface TimeAction {
  key: string;
  value: boolean[];
}

export interface TimeInterface {
  time: boolean;
  timeList: boolean[];
}

const step1Reducer = (state: Step1Interface, action: Action): Step1Interface => {
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

const step2Reducer = (state: Step2Interface, action: Action): Step2Interface => {
  switch (action.key) {
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
const step2SelectReducer = (state: any[], action: ArrayAction): string[] => {
  switch (action.type) {
    case 'push':
      if (action.value instanceof Array) {
        // 기존 state와 중복되지 않은 value만 선택
        const values = action.value.filter((v) => !state.includes(v));
        return [...state, ...values];
      }
      return [...state, action.value];
    case 'delete':
      return state.filter((item) => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const step3Reducer = (state: Step3Interface, action: Action): Step3Interface => {
  switch (action.key) {
    case 'bannerId':
      return { ...state, bannerId: action.value };
    case 'landingUrl':
      return { ...state, connectedLinkId: action.value };
    case 'reset': {
      return { bannerId: '', connectedLinkId: '' };
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

const nameReducer = (state: NameInterface, action: Action): NameInterface => {
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
const budgetReducer = (state: BudgetInterface, action: Action): BudgetInterface => {
  switch (action.key) {
    case 'noBudget':
      return { budget: false, value: 0 };
    case 'budget':
      return { budget: true, value: action.value };
    default:
      return state;
  }
};

const termReducer = (state: TermInterface, action: Action): TermInterface => {
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


const timeReducer = (state: TimeInterface, action: TimeAction): TimeInterface => {
  // [...Array(24).keys()]가 불가하다.
  const timeReset: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  switch (action.key) {
    case 'noTime':
      return { time: false, timeList: [] };
    case 'time':
      return { time: true, timeList: timeReset.map(() => true) };
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
