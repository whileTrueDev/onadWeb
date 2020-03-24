import React, { useReducer } from 'react';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Slide, Collapse, Typography
} from '@material-ui/core';
// customized component
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import WithdrawalAgreement from './Withdrawal/Agreement';
import WithdrawalAmount from './Withdrawal/Amount';
import WithdrawalConfirm from './Withdrawal/Confirm';
import WithdrawalComplete from './Withdrawal/Complete';
// reducer
import withdrawalDialogReducer, {
  WithdrawalDialogState
} from './WithdrawalDialog.reducer';
// utils
import usePostRequest from '../../../../utils/hooks/usePostRequest';
import history from '../../../../history';
import withdrawalSources from './source/withdrawalSources';

const useWithdrawalDialogStyles = makeStyles((theme) => ({
  title: { marginTop: theme.spacing(1) },
}));

interface WithdrawalDialogProps {
  open: boolean;
  handleClose: () => void;
  accountNumber: string;
  receivable: number;
  realName: string;
}

function WithdrawDialog({
  open,
  handleClose,
  accountNumber,
  receivable,
  realName
}: WithdrawalDialogProps): JSX.Element {
  const classes = useWithdrawalDialogStyles();

  const currentCashNumber = Number(receivable);

  // 출금 신청 절차에서 사용할 (step) state
  const defaultState: WithdrawalDialogState = {
    currentCash: currentCashNumber,
    selectValue: '',
    checked: false,
    totalIncome: ''
  };
  const [stepState, stepDispatch] = useReducer(
    withdrawalDialogReducer, defaultState
  );

  const { selectValue, checked } = stepState;

  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [activeStep, setActiveStep] = React.useState(0); // 각 step을 정의하는  state

  const handleNext = (targetStep?: number) => (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);

    if (activeStep === 1) {
      if (currentCashNumber - Number(selectValue) < 0 || Number(selectValue) < 30000) {
        alert('출금 신청 금액은 30000원 미만에서는 불가하며 출금 신청 금액이 보유 수익금보다 클 수 없습니다.');
        history.push('/mypage/creator/main');
      } else {
        setTimeout(() => {
          if (targetStep) {
            setActiveStep(targetStep);
          } else {
            setActiveStep((preIndex) => preIndex + 1);
          }
          setPaperSwitch(true);
        }, 500);
      }
    } else {
      setTimeout(() => {
        if (targetStep) {
          setActiveStep(targetStep);
        } else {
          setActiveStep((preIndex) => preIndex + 1);
        }
        setPaperSwitch(true);
      }, 500);
    }
  };

  // 출금 POST 요청객체 생성
  const withdrawalPost = usePostRequest('/creator/income/withdrawal', () => {
    // 요청 성공시 Success callback 함수
    setActiveStep((preIndex) => preIndex + 1);
  });

  function handleSubmitClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    // 해당 금액 만큼 출금 내역에 추가하는 요청 실시
    withdrawalPost.doPostRequest({ withdrawalAmount: selectValue });
  }

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setStepComplete(false);
    setPaperSwitch(false);
    if (activeStep === 0 || activeStep === 1 || activeStep === 2) {
      stepDispatch({ key: 'reset' });
    }
    setTimeout(() => {
      setActiveStep((preIndex) => preIndex - 1);
      setPaperSwitch(true);
    }, 500);
  };

  const DefaultIndex = (): void => {
    handleClose();
    setActiveStep(0);
    stepDispatch({ key: 'reset' });
  };

  const finishIndex = (): void => {
    handleClose();
    history.push('/mypage/creator/main');
  };

  return (
    <Dialog
      open={open}
      title={(
        <div>
          <>
            OnAD 출금신청 Step
            {' '}
            {activeStep + 1}
            /4
          </>
          <Typography variant="h6" className={classes.title}>
            {withdrawalSources.titleWithdrawal[activeStep]}
          </Typography>
        </div>
      )}
      onClose={activeStep !== 3 ? (DefaultIndex) : (finishIndex)}
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Grid container direction="row">
            {activeStep === 2
              && (
              <Grid item>
                <Collapse in>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitClick}
                  >
                    신청
                  </Button>
                </Collapse>
              </Grid>
              )}
            { (activeStep === 0 || activeStep === 1)
              && (
              <Grid item>
                <Collapse in={stepComplete}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext()}
                  >
                    다음
                  </Button>
                </Collapse>
              </Grid>
              )}
            { (activeStep === 1 || activeStep === 2) ? (
              <Grid item>
                <Button onClick={handleBack}>
                  뒤로
                </Button>
              </Grid>
            ) : null }
            {activeStep !== 3
          && <Grid item><Button onClick={DefaultIndex}>취소</Button></Grid>}
            {activeStep === 3
          && <Grid item><Button color="primary" onClick={finishIndex}>완료</Button></Grid>}
          </Grid>
        </div>
      )}
    >
      <Slide direction="right" in={paperSwitch} mountOnEnter unmountOnExit timeout={{ exit: 500 }}>
        <div>
          {activeStep === 0 && (
          <WithdrawalAgreement
            setStepComplete={setStepComplete}
            checked={checked}
            dispatch={stepDispatch}
          />
          )}
          {activeStep === 1 && (
          <WithdrawalAmount
            setStepComplete={setStepComplete}
            state={stepState}
            dispatch={stepDispatch}
            stepComplete={stepComplete}
            accountNumber={accountNumber}
            realName={realName}
          />
          )}
          {activeStep === 2 && (
            <WithdrawalConfirm
              state={stepState}
              accountNumber={accountNumber}
              realName={realName}
            />
          )}
          {activeStep === 3 && (<WithdrawalComplete state={stepState} />)}
        </div>
      </Slide>
    </Dialog>
  );
}

export default WithdrawDialog;
