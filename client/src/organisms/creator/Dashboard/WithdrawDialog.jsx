import React, {useReducer} from 'react';
import PropTypes from 'prop-types';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../utils/axios';
import {
  Grid, Slide, Collapse
} from '@material-ui/core';
// customized component
import Button from '../../../atoms/CustomButtons/Button';
import Dialog from './Withdrawal/Dialog';
import HOST from '../../../utils/config';
import history from '../../../history';
import WithdrawalAgreement from './Withdrawal/WithdrawalAgreement'
import WithdrawalAmount from './Withdrawal/WithdrawalAmount'
import WithdrawalConfirm from './Withdrawal/WithdrawalConfirm'
import WithdrawalComplete from './Withdrawal/WithdrawalComplete'
import sources from './source/sources';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontWeight: 'bold',
  },
  selectValue: {
    color: '#333',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  paper: {
    maxWidth: '1200px',
    width: '1200px',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  button: {
    marginRight: theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: theme.spacing(1),
  },
  title: {
    marginTop: 5,
    paddingBottom: 10,
    fontWeight: '600',
  },
  titleWrap: {
    background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)',
    color: 'white',
    textAlign: 'center'
  }
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
      return { ...state, selectValue: '0', checked: false};
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
  
  const currentCashNumber = Number(receivable)

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

  function handleSubmitClick(event) {
    event.preventDefault();

    // 해당 금액 만큼 출금 내역에 추가하는 요청
    axios.post(`${HOST}/api/dashboard/creator/withdrawal`, {
      withdrawalAmount: selectValue,
    }).then((res) => {
      setIndex(preIndex => preIndex + 1);
    }).catch((err) => {
      console.log(err);
      history.push('/dashboard/creator/main');
    });
  }

  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state

  const handleNext = go => (event) => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);

    if (index === 1) {
      if (currentCashNumber - selectValue < 0 || selectValue < 30000) {
        alert('출금 신청 금액은 30000원 미만에서는 불가하며 출금 신청 금액이 보유 수익금보다 클 수 없습니다.');
        history.push('/dashboard/creator/main')
      } else {
        setTimeout(() => {
          if (go) {
            setIndex(go);
          } else {
            setIndex(preIndex => preIndex + 1);
          }
          setPaperSwitch(true);
        }, 500);
      }
    } else {
      setTimeout(() => {
        if (go) {
          setIndex(go);
        } else {
          setIndex(preIndex => preIndex + 1);
        }
        setPaperSwitch(true);
      }, 500);
    }
  };

  const handleBack = (event) => {
    event.preventDefault();
    setStepComplete(false);
    setPaperSwitch(false);
    if (index === 0 || index === 1 || index === 2 ) {
      stepDispatch({ key: 'reset' });
    }
    setTimeout(() => {
      setIndex(preIndex => preIndex - 1);
      setPaperSwitch(true);
    }, 500);
  };

  const setSteps = (_index) => {
    switch (_index) {
      case 0:
        return (
          <WithdrawalAgreement
            setStepComplete={setStepComplete}
            checked={checked}
            dispatch={stepDispatch}
          />
        );
      case 1:
        return (
          <WithdrawalAmount
            setStepComplete={setStepComplete}
            state={stepState}
            dispatch={stepDispatch}
            stepComplete={stepComplete}
            accountNumber={accountNumber}
            realName={realName}
          />
        );
      case 2:
        return (
          <WithdrawalConfirm
            state={stepState}
            accountNumber={accountNumber}
            realName={realName}
          />
        );
      case 3:
        return (
          <WithdrawalComplete
            state={stepState}
          />
        );
      default:
        return <div />;
    }
  };

  const DefaultIndex = () => {
    handleClose();
    setIndex(0);
    stepDispatch({ key: 'reset' });
  };

  const finishIndex = () => {
    handleClose();
    history.push('/dashboard/creator/main');
  };

  return (
    <Dialog
      open={open}
      onClose={index !== 3 ? (DefaultIndex) : (finishIndex)}
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Grid container direction="row">
            {index === 2
              && (
              <Grid item>
                <Collapse in={true}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleSubmitClick}
                    className={classes.end}
                  >
                    신청
                  </Button>
                </Collapse>
              </Grid>
              )}
            { (index === 0 || index === 1)
              && (
              <Grid item>
                <Collapse in={stepComplete}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleNext()}
                    className={classes.end}
                  >
                    다음
                  </Button>
                </Collapse>
              </Grid>
              )}
            { (index === 1 || index === 2) ? (
              <Grid item>
                <Button onClick={handleBack} className={classes.button}>
                뒤로
                </Button>
              </Grid>
            ) : null }
            {index !== 3
          && <Grid item><Button onClick={DefaultIndex}>취소</Button></Grid>
          }
            {index === 3
          && <Grid item><Button onClick={finishIndex}>완료</Button></Grid>
          }
          </Grid>
        </div>
      )}
    >
      <div>
        <div className={classes.titleWrap}>
          <div style={{ fontSize: 18, paddingTop: 15 }}>
              OnAD 출금신청 Step
            {' '}
            {index + 1}/4
          </div>
          <h4 className={classes.title}>{sources.titleWithdrawal[index]}</h4>
        </div>
        <Slide direction="right" in={paperSwitch} mountOnEnter unmountOnExit timeout={{ exit: 500 }}>
          <div>
            {setSteps(index)}
          </div>
        </Slide>
      </div>
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
