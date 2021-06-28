import banks from '../../../../../constants/banks';

export interface AccountNumberFormState {
  name: string;
  code: string;
}
export type AccountNumberFormAction = { type: 'set'; name: string };

const SettlementFormReducer = (
  state: AccountNumberFormState,
  action: AccountNumberFormAction,
): AccountNumberFormState => {
  const bank = banks.find(_bank => _bank.bankName === action.name);
  if (!bank) {
    throw Error('Invalid Bank Code');
  }
  switch (action.type) {
    case 'set':
      return {
        name: action.name,
        code: bank.bankCode,
      };
    default:
      return { name: 'NH농협은행', code: '010' };
  }
};

export default SettlementFormReducer;
