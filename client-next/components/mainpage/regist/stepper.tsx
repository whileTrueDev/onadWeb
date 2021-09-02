import { Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { myReducer, initialState } from './stepper.reducer';
// 컴포넌트
import PlatformRegistForm from './platformRegistForm';
import RegistForm from './registForm';
import PaperSheet from './paper';
import IdentityVerification from './identityVerification';
// util 계열
import { useMarketerSignupMutation } from '../../../utils/hooks/mutation/useMarketerSignupMutation';
import { useMarketerSignupWithPlatformMutation } from '../../../utils/hooks/mutation/useMarketerSignupWithPlatformMutation';
// 스타일
import useStyles from '../../../styles/mainpage/regist/stepper.style';

function RegistStepper({ platform }: { platform: string }): JSX.Element {
  const classes = useStyles();
  const router = useRouter();
  const [activeStep, setStep] = useState(0);
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [loading, setLoading] = useState(0);
  const [open, setOpen] = useState(0);
  const platformList = ['main', 'google', 'naver', 'kakao'];
  useEffect(() => {
    if (platform !== 'main') {
      alert('최초 로그인 이므로 회원가입을 시작합니다.');
    }
  }, [platform]);

  function handleNext(): void {
    setStep(activeStep + 1);
  }

  function handleBack(): void {
    if (activeStep - 1 === -1) router.push('/marketer');
    dispatch({ type: 'reset' });
    setStep(activeStep - 1);
  }

  function handleReset(): void {
    dispatch({ type: 'reset' });
    setStep(0);
  }

  const signupMutation = useMarketerSignupMutation();
  const signupPlatformMutation = useMarketerSignupWithPlatformMutation();
  function handleUserSubmit(user: any): void {
    const platformType = platformList.indexOf(platform);
    const returnUser = {
      ...user,
      platformType,
    };
    if (platform === 'main') {
      signupMutation
        .mutateAsync(user)
        .then(res => {
          const { error } = res.data;
          if (!error) {
            alert('회원가입이 완료되었습니다. 다시 로그인 해주세요.');
            setLoading(0);
            router.push('/');
          } else {
            alert('등록중 오류가 발생 하였습니다. 잠시 후 다시 시도해주세요.');
            setLoading(0);
            router.push('/');
          }
        })
        .catch(() => {
          alert('등록중 오류가 발생 하였습니다. 잠시 후 다시 시도해주세요.');
          setLoading(0);
          router.push('/');
        });
    } else {
      signupPlatformMutation
        .mutateAsync(returnUser)
        .then(res => {
          const { error } = res.data;
          if (!error) {
            alert('회원가입이 완료되었습니다. 다시 로그인 하세요.');
            setLoading(0);
            router.push('/');
          } else {
            alert('등록중 오류가 발생 하였습니다. 잠시 후 다시 시도해주세요.');
            setLoading(0);
            router.push('/');
          }
        })
        .catch(err => {
          alert('등록중 오류가 발생 하였습니다. 잠시 후 다시 시도해주세요.');
          setLoading(0);
          router.push('/');
        });
    }
  }

  return (
    <div className={classes.container}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="0">
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
        <Step key="1">
          <StepLabel>정보 동의 및 계약</StepLabel>
          <StepContent>
            <PaperSheet handleNext={handleNext} handleBack={handleReset} />
          </StepContent>
        </Step>
        <Step key="2">
          <StepLabel>개인정보 입력</StepLabel>
          {platform === 'main' ? (
            <StepContent>
              <RegistForm
                handleUserSubmit={handleUserSubmit}
                handleBack={handleBack}
                formState={state}
                dispatch={dispatch}
                loading={loading}
                setLoading={setLoading}
              />
            </StepContent>
          ) : (
            <StepContent>
              <PlatformRegistForm
                handleUserSubmit={handleUserSubmit}
                handleBack={handleBack}
                formState={state}
                dispatch={dispatch}
                loading={loading}
                setLoading={setLoading}
              />
            </StepContent>
          )}
        </Step>
      </Stepper>
    </div>
  );
}

export default RegistStepper;
