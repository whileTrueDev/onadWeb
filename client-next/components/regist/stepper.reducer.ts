import passwordRegex from '../../utils/inputs/regex/password.regex';
import phoneNumRegex from '../../utils/inputs/regex/phoneNum.regex';
import companyNumRegex from '../../utils/inputs/regex/companyNum.regex';

export const initialState = {
  passwordValue: '',
  password: false,
  repasswd: false,
  email: '',
  phoneNum: '',
  phoneNumValidationCheck: false,
  domain: '',
  name: '',
};
export interface StepState {
  passwordValue: string;
  password: boolean;
  repasswd: boolean;
  email: string;
  phoneNum: string;
  phoneNumValidationCheck: boolean;
  domain: string;
  name: string;
}

export type StepAction =
  | { type: 'password'; value: string }
  | { type: 'repasswd'; value: string }
  | { type: 'email'; value: string }
  | { type: 'phoneNum'; value: string }
  | { type: 'companyNum'; value: string }
  | { type: 'domain'; value: string }
  | { type: 'name'; value: string }
  | { type: 'reset' };

// reducer를 사용하여 Error를 handling하자
export function myReducer(state: StepState, action: StepAction): StepState {
  switch (action.type) {
    case 'email': {
      // if (emailReg.test(action.value)) {
      //   return { ...state, email: false };
      // }
      // return { ...state, email: true };
      // 오류가 존재하지 않으면 email이 false가 되어야한다.
      return { ...state, email: action.value };
    }
    // (?=.*[0-9])
    case 'password': {
      if (passwordRegex.test(action.value)) {
        return { ...state, passwordValue: action.value, password: false };
      }
      return { ...state, passwordValue: action.value, password: true };
    }
    case 'repasswd': {
      if (state.passwordValue === action.value) {
        return { ...state, repasswd: false };
      }
      return { ...state, repasswd: true };
    }
    case 'phoneNum': {
      if (phoneNumRegex.test(action.value)) {
        return { ...state, phoneNum: action.value, phoneNumValidationCheck: false };
      }
      return { ...state, phoneNum: action.value, phoneNumValidationCheck: true };
    }
    case 'domain': {
      return { ...state, domain: action.value };
    }
    case 'companyNum': {
      // 동일한 값, state를 공유한다.
      if (companyNumRegex.test(action.value)) {
        return { ...state, phoneNum: action.value, phoneNumValidationCheck: false };
      }
      return { ...state, phoneNum: action.value, phoneNumValidationCheck: true };
    }
    case 'name': {
      return { ...state, name: action.value };
    }
    case 'reset': {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export default { myReducer, initialState };
