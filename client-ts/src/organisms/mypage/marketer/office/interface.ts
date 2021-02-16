export interface BusinessInterface {
  marketerBusinessRegNum: string;
  marketerBusinessRegSrc: string;
}

export interface MarketerInfo {
  marketerId: string;
  marketerName: string;
  marketerMail: string;
  marketerPhoneNum: string;
  marketerBusinessRegNum: string;
  marketerContraction: number;
  platformType: number;
  profileImage?: string;
}

export interface AccountInterface {
  marketerAccountNumber: string;
  accountHolder: string;
}

export interface CashInterface {
  cashAmount: string;
  date: string;
}

export interface StateInterface {
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
export const stepReducer = (state: StateInterface, action: Action): StateInterface => {
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

export interface ChargeInterface {
  currentCash: string;
  selectValue: string;
  chargeType: string;
  totalDebit: string;
}

export type ChargeAction =
  {
    key: 'currentCash'; value: string;
  } |
  {
    key: 'selectValue'; value: string;
  } |
  {
    key: 'totalDebit'; value: string;
  } |
  {
    key: 'chargeType'; value: string;
  } |
  {
    key: 'reset';
  }

// key ,value를 이용하여 state의 값에 접근
export const chargeReducer = (state: ChargeInterface, action: ChargeAction) => {
  switch (action.key) {
    case 'currentCash': {
      return { ...state, currentCash: action.value };
    }
    case 'selectValue': {
      return { ...state, selectValue: action.value };
    }
    case 'totalDebit': {
      return { ...state, totalDebit: action.value };
    }
    case 'chargeType': {
      return { ...state, chargeType: action.value };
    }
    case 'reset': {
      return { ...state, selectValue: '0', chargeType: '' };
    }
    default: {
      return state;
    }
  }
};


export interface VbankInterface {
  vbankNum: string;
  vbankHolder: string;
  vbankName: string;
  vbanDate: string;
  vbankAmount: string;
}
