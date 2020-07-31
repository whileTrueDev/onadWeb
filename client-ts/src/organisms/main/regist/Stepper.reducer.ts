export const initialState = {
  passwordValue: '',
  id: false,
  password: false,
  repasswd: false,
  checkDuplication: true,
  email: '',
  phoneNum: '',
  domain: '',
  name: '',
  idValue: '',
};
export interface StepState {
  passwordValue: string | number;
  id: string | boolean;
  idValue: string;
  password: boolean;
  repasswd: boolean;
  checkDuplication: boolean;
  email: string;
  phoneNum: string | number;
  domain: string;
  name: string;
}

export type StepAction = { type: 'id'; value: string }
  | { type: 'password'; value: string }
  | { type: 'repasswd'; value: string }
  | { type: 'email'; value: string }
  | { type: 'phoneNum'; value: string | number }
  | { type: 'domain'; value: string }
  | { type: 'checkDuplication'; value: boolean }
  | { type: 'name'; value: string }
  | { type: 'reset' }


// reducer를 사용하여 Error를 handling하자
export function myReducer(
  state: StepState,
  action: StepAction
): StepState {
  switch (action.type) {
    case 'id': {
      const idReg = /^[A-za-z]+[a-z0-9]{4,15}$/g;
      if (idReg.test(action.value)) {
        return {
          ...state, id: false, checkDuplication: true, idValue: action.value
        };
      }
      return {
        ...state, id: true, checkDuplication: true, idValue: action.value
      };
    }
    // (?=.*[0-9])
    case 'password': {
      const regx = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;
      if (regx.test(action.value)) {
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
    case 'email': {
      // if (emailReg.test(action.value)) {
      //   return { ...state, email: false };
      // }
      // return { ...state, email: true };
      // 오류가 존재하지 않으면 email이 false가 되어야한다.
      return { ...state, email: action.value };
    }
    case 'phoneNum': {
      return { ...state, phoneNum: action.value };
    }
    case 'domain': {
      return { ...state, domain: action.value };
    }
    // case 'businessRegNum': {
    //   return { ...state, businessRegNum: action.value };
    // }
    case 'name': {
      return { ...state, name: action.value };
    }
    case 'checkDuplication': {
      return { ...state, checkDuplication: action.value };
    }
    case 'reset': {
      console.log('모든 State를 reset합니다');
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export default { myReducer, initialState };
