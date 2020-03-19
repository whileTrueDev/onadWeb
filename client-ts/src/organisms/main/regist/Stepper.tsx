import React, { useState, useEffect, useReducer } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import axios from '../../../utils/axios';
import PlatformRegistForm from './PlatformRegistForm';
import Usertype from './Usertype';
import RegistForm from './RegistForm';
import PaperSheet from './Paper';
import HOST from '../../../config';
import history from '../../../history';
import IdentityVerification from './IdentityVerification';
import { myReducer, initialState } from './Stepper.reducer';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(5),
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
}));

function RegistStepper({ platform }: { platform: string }): JSX.Element {
  const classes = useStyles();
  const [activeStep, setStep] = useState(0);
  const [userType, setType] = useState(0);
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [loading, setLoading] = useState(0);
  const [open, setOpen] = useState(0);
  const platformList = ['', 'google', 'naver', 'kakao'];
  useEffect(() => {
    if (platform !== undefined) {
      alert('최초 로그인 이므로 회원가입을 시작합니다.');
    }
  }, [platform]);

  function handleNext(): void {
    setStep(activeStep + 1);
  }

  function handleBack(): void {
    dispatch({ type: 'reset' });
    setStep(activeStep - 1);
  }

  function handleReset(): void {
    dispatch({ type: 'reset' });
    setStep(0);
  }

  function typeChange(type: number): void {
    setType(type);
  }

  function handleUserSubmit(user: any): void {
    const platformType = platformList.indexOf(platform);
    const returnUser = {
      ...user,
      platformType
    };
    if (platform === undefined) {
      axios.post(`${HOST}/marketer`, user)
        .then((res) => {
          const { error } = res.data;
          if (!error) {
            alert('등록한 이메일로 인증메일을 발송하였습니다. 이메일을 확인하세요!');
            setLoading(0);
            history.push('/');
          } else {
            alert('등록중 오류가 났습니다. 잠시 후 다시 시도해주세요.');
            setLoading(0);
            history.push('/');
          }
        })
        .catch(() => {
          alert('등록중 오류가 났습니다. 잠시 후 다시 시도해주세요.');
          setLoading(0);
          history.push('/');
        });
    } else {
      axios.post(`${HOST}/marketer/platform`, returnUser)
        .then((res) => {
          const { error } = res.data;
          if (!error) {
            alert('회원가입이 완료되었습니다. 다시 로그인 하세요.');
            setLoading(0);
            history.push('/');
          } else {
            alert('등록중 오류가 났습니다. 잠시 후 다시 시도해주세요.');
            setLoading(0);
            history.push('/');
          }
        })
        .catch(() => {
          alert('등록중 오류가 났습니다. 잠시 후 다시 시도해주세요.');
          setLoading(0);
          history.push('/');
        });
    }
  }

  function getRegistComponent(): JSX.Element {
    if (platform === undefined) {
      return (
        <RegistForm
          userType={userType}
          handleUserSubmit={handleUserSubmit}
          handleBack={handleBack}
          state={state}
          dispatch={dispatch}
          loading={loading}
          setLoading={setLoading}
        />
      );
    }
    return (
      <PlatformRegistForm
        userType={userType}
        handleUserSubmit={handleUserSubmit}
        handleBack={handleBack}
        state={state}
        dispatch={dispatch}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return (

    <div className={classes.container}>

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="0">
          <StepLabel>마케터 유형 선택</StepLabel>
          <StepContent>
            <Usertype typeChange={typeChange} handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="1">
          <StepLabel>미성년자 확인</StepLabel>
          <StepContent>
            <IdentityVerification
              handleNext={handleNext}
              handleBack={handleBack}
              open={open}
              setOpen={setOpen}
            />
          </StepContent>
        </Step>
        <Step key="2">
          <StepLabel>정보 동의 및 계약</StepLabel>
          <StepContent>
            <PaperSheet
              handleNext={handleNext}
              handleBack={handleReset}
            />
          </StepContent>
        </Step>
        <Step key="3">
          <StepLabel>개인정보 입력</StepLabel>
          <StepContent>
            {getRegistComponent()}
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
}

export default RegistStepper;
