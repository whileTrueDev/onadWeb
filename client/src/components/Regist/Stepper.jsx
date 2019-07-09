import React, { useState, useReducer } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  withStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';

import Usertype from './Usertype';
import RegistForm from './RegistForm';
import PaperSheet from './Paper';
import AppAppBar from '../Main/views/Layout/AppAppBar';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(1) * 3,
  },
});

const initialState = {
  passwordValue: '',
  id: false,
  password: false,
  repasswd: false,
  checkDuplication: true,
  email: false,
  phoneNum: '',
  domain: '',
};

// reducer를 사용하여 Error를 handling하자
const myReducer = (state, action) => {
  switch (action.type) {
    case 'id': {
      const idReg = /^[A-za-z]+[a-z0-9]{4,15}$/g;
      if (idReg.test(action.value)) {
        return { ...state, id: false, checkDuplication: true };
      }
      return { ...state, id: true, checkDuplication: true };
    }
    case 'password': {
      const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
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
      const emailReg = /^[a-z0-9]+[a-z0-9]{4,15}$/g;
      if (emailReg.test(action.value)) {
        return { ...state, email: false };
      }
      return { ...state, email: true };
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
};

const RegistStepper = (props) => {
  const {
    classes, history,
  } = props;
  const [activeStep, setStep] = useState(0);
  const [userType, setType] = useState(0);
  const [userInfo, setInfo] = useState({});
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [loading, setLoading] = useState(0);
  const handleNext = () => {
    setStep(activeStep + 1);
  };

  const handleBack = () => {
    dispatch({ type: 'reset' });
    setStep(activeStep - 1);
  };

  const handleReset = () => {
    dispatch({ type: 'reset' });
    setStep(0);
  };

  const typeChange = (type) => {
    setType(type);
  };

  const handleUserInfo = (user) => {
    setInfo(user);
  };

  const handleUserSubmit = () => {
    axios.post('/api/regist/marketer',
      userInfo)
      .then((res) => {
        const { error } = res.data;
        if (!error) {
          alert('등록한 이메일로 인증메일을 발송하였습니다. 이메일을 확인하세요!');
          setLoading(0);
          history.push('/');
        } else {
          alert('등록중 오류가 났습니다. 다시 회원가입을 시작하세요.');
          setLoading(0);
          history.push('/');
        }
      });
  };

  return (
    <div className={classes.root}>
      <AppAppBar />
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="0">
          <StepLabel>사업자 유형 선택</StepLabel>
          <StepContent>
            <Usertype typeChange={typeChange} handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="1">
          <StepLabel>개인정보 입력</StepLabel>
          <StepContent>
            <RegistForm
              userType={userType}
              handleNext={handleNext}
              handleBack={handleBack}
              handleUserInfo={handleUserInfo}
              state={state}
              dispatch={dispatch}
            />
          </StepContent>
        </Step>
        <Step key="2">
          <StepLabel>정보 동의 및 계약</StepLabel>
          <StepContent>
            <PaperSheet
              handleNext={handleNext}
              handleReset={handleReset}
              handleUserSubmit={handleUserSubmit}
              loading={loading}
              setLoading={setLoading}
            />
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

RegistStepper.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

RegistStepper.defaultProps = {
  classes: {},
};

export default withStyles(styles)(RegistStepper);
