const withdrawalDialogReducer = (
  state: WithdrawalDialogState,
  action: WithdrawlDialogAction
): WithdrawalDialogState => {
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
    case 'totalIncome': {
      return { ...state, totalIncome: action.value };
    }
    case 'reset': {
      return { ...state, selectValue: '0', checked: false };
    }
    default: {
      return state;
    }
  }
};

export interface WithdrawalDialogState {
  currentCash: string | number;
  selectValue: string | number;
  totalIncome: string | number;
  checked: boolean;
}

export type WithdrawlDialogAction = { key: 'currentCash'; value: any}
  | {key: 'selectValue'; value: number | string}
  | {key: 'checked'; value: boolean}
  | {key: 'totalIncome'; value: number | string}
  | {key: 'reset'}

export default withdrawalDialogReducer;
