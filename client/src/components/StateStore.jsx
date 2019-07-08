import React, { createContext, useReducer, useEffect } from 'react';
import { createBrowserHistory } from 'history';

// const initialState = {
//   history: {},
//   session: {},
// };

const StateContext = createContext({});

const myReducer = (state, action) => {
  switch (action.type) {
    case 'session': {
      return { ...state, session: action.data };
    }
    default: {
      console.log('Reducer의 올바르지 못한 사용 입니다.');
      return state;
    }
  }
};

const StateStore = ({ children, history }) => {
  const [state, dispatch] = useReducer(myReducer, { history, session: {} });

  // useEffect(() => {
  //   if (!(Object.entries(state.session).length === 0 && state.session.constructor === Object)) {
  //     console.log('localStorage에 저장.');
  //     window.localStorage.session = JSON.stringify(state.session);
  //   }
  //   console.log(window.localStorage);
  // }, [state.session]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};


export { StateContext, StateStore };
