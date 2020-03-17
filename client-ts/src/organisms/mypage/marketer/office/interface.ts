export interface businessInterface {
  marketerBusinessRegNum: string;
  marketerBusinessRegSrc: string;
}

export interface userInterface {
  marketerId: string;
  marketerName: string;
  marketerMail: string;
  marketerPhoneNum: string;
  marketerBusinessRegNum: string;
  marketerUserType: number;
  marketerContraction: number;
  platformType: number
}

export interface accountInterface {
  marketerAccountNumber: string;
  accountHolder: string;
}

export interface cashInterface {
  cashAmount: string;
  date: string;
}

export interface stateInterface {
  currentCash: number;
  selectValue: string;
  checked: boolean;
  totalDebit: number;
}

export type Action = {
  key: 'currentCash';
  value: number;
} |
{
  key: 'selectValue';
  value: string;
} |
{
  key: 'checked';
  value: boolean;
} |
{
  key: 'totalDebit';
  value: number;
} |
{ key: 'reset' }


// key ,value를 이용하여 state의 값에 접근
export const stepReducer = (state: stateInterface, action: Action): stateInterface => {
  switch (action.key) {
    case 'currentCash': {
      return { ...state, currentCash: action.value };
    }
    case 'selectValue': {
      return { ...state, selectValue: action.value };
    }
    case 'checked': {
      return { ...state, checked: action.value };
    }
    case 'totalDebit': {
      return { ...state, totalDebit: action.value };
    }
    case 'reset': {
      return { ...state, selectValue: '0', checked: false };
    }
    default: {
      return state;
    }
  }
};


