import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Slide, Collapse, Typography
} from '@material-ui/core';
import axios from '../../../utils/axios';
// customized component
import Button from '../../../atoms/CustomButtons/Button';
import Dialog from '../../../atoms/Dialog/Dialog';
import HOST from '../../../utils/config';
import history from '../../../history';
import WithdrawalAgreement from './Withdrawal/WithdrawalAgreement';
import WithdrawalAmount from './Withdrawal/WithdrawalAmount';
import WithdrawalConfirm from './Withdrawal/WithdrawalConfirm';
import WithdrawalComplete from './Withdrawal/WithdrawalComplete';
import sources from './source/sources';

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: '1200px',
    width: '1200px',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  title: { marginTop: theme.spacing(1) },
}));

// key ,value를 이용하여 state의 값에 접근
const stepReducer = (state, action) => {
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

function WithdrawDialog(props) {
  const classes = useStyles();
  const {
    open, handleClose, accountNumber, receivable, realName
  } = props;

  const currentCashNumber = Number(receivable);

  // 출금 신청 절차에서 사용할 (step) state
  const [stepState, stepDispatch] = useReducer(
    stepReducer,
    {
      currentCash: currentCashNumber,
      selectValue: '',
      checked: false,
      totalIncome: ''
    }
  );

  const { selectValue, checked } = stepState;

  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [activeStep, setActiveStep] = React.useState(0); // 각 step을 정의하는  state

  const handleNext = (go) => (event) => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);

    if (activeStep === 1) {
      if (currentCashNumber - selectValue < 0 || selectValue < 30000) {
        alert('출금 신청 금액은 30000원 미만에서는 불가하며 출금 신청 금액이 보유 수익금보다 클 수 없습니다.');
        history.push('/dashboard/creator/main');
      } else {
        setTimeout(() => {
          if (go) {
            setActiveStep(go);
          } else {
            setActiveStep((preIndex) => preIndex + 1);
          }
          setPaperSwitch(true);
        }, 500);
      }
    } else {
      setTimeout(() => {
        if (go) {
          setActiveStep(go);
        } else {
          setActiveStep((preIndex) => preIndex + 1);
        }
        setPaperSwitch(true);
      }, 500);
    }
  };

  function handleSubmitClick(event) {
    event.preventDefault();

    // 해당 금액 만큼 출금 내역에 추가하는 요청
    axios.post(`${HOST}/api/dashboard/creator/withdrawal`, {
      withdrawalAmount: selectValue,
    }).then((res) => {
      setActiveStep((preIndex) => preIndex + 1);
    }).catch((err) => {
      console.log(err);
      history.push('/dashboard/creator/main');
    });
  }

  const handleBack = (event) => {
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

  const DefaultIndex = () => {
    handleClose();
    setActiveStep(0);
    stepDispatch({ key: 'reset' });
  };

  const finishIndex = () => {
    handleClose();
    history.push('/dashboard/creator/main');
  };

  return (
    <Dialog
      open={open}
      title={(
        <div className={classes.titleWrap}>
          <>
            OnAD 출금신청 Step
            {' '}
            {activeStep + 1}
            /4
          </>
          <Typography variant="h6" className={classes.title}>{sources.titleWithdrawal[activeStep]}</Typography>
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
                    className={classes.end}
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
                    className={classes.end}
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
          && <Grid item><Button onClick={finishIndex}>완료</Button></Grid>}
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

WithdrawDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired,
  receivable: PropTypes.number.isRequired,
};

export default WithdrawDialog;
