import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Slide, Collapse
} from '@material-ui/core';
import axios from '../../../../utils/axios';
// customized component
import Dialog from './sub/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../utils/config';
import history from '../../../../history';
import RefundAgreement from './refund/RefundAgreement';
import RefundConfirm from './refund/RefundConfirm';
import RefundAmount from './refund/RefundAmount';
import RefundComplete from './refund/RefundComplete';
import sources from '../source/sources';

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
    background: 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)',
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
    case 'totalDebit': {
      return { ...state, totalDebit: action.value };
    }
    case 'reset': {
      return { ...state, selectValue: '0', checked: false };
    }
    default: {
      return state;
    }
  }
};

function RefundDialog(props) {
  const classes = useStyles();
  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state

  const {
    open, handleClose, currentCash, accountNumber, accountHolder
  } = props;

  const currentCashNumber = Number(currentCash.replace(',', ''));

  // 환불 요청 절차에서 사용할(step2) State.
  const [stepState, stepDispatch] = useReducer(
    stepReducer,
    {
      currentCash: currentCashNumber,
      selectValue: '',
      checked: false,
      totalDebit: ''
    }
  );

  const { selectValue, checked } = stepState;

  function handleSubmitClick(event) {
    event.preventDefault();

    // 해당 금액 만큼 환불 내역에 추가하는 요청
    axios.post(`${HOST}/api/dashboard/marketer/cash/refund`, {
      withdrawCash: selectValue,
    }).then((res) => {
      setIndex(preIndex => preIndex + 1);
    }).catch((err) => {
      console.log(err);
      history.push('/dashboard/marketer/myoffice');
    });
  }

  const handleNext = go => (event) => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);

    if (index === 1) {
      if (currentCashNumber - selectValue < 0 || selectValue <= 1000) {
        alert('환불 신청 금액은 1000원 이하에서는 불가하며 환불 신청 금액이 보유 캐시보다 클 수 없습니다.');
        history.push('/dashboard/marketer/myoffice');
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
    if (index === 0 || index === 1 || index === 2) {
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
          <RefundAgreement
            setStepComplete={setStepComplete}
            checked={checked}
            dispatch={stepDispatch}
          />
        );
      case 1:
        return (
          <RefundAmount
            setStepComplete={setStepComplete}
            state={stepState}
            dispatch={stepDispatch}
            stepComplete={stepComplete}
            accountNumber={accountNumber}
            accountHolder={accountHolder}
          />
        );
      case 2:
        return (
          <RefundConfirm
            state={stepState}
            accountNumber={accountNumber}
            accountHolder={accountHolder}
          />
        );
      case 3:
        return (
          <RefundComplete
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
    history.push('/dashboard/marketer/myoffice');
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
            { (index === 0 || index === 1)
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
              OnAD 환불요청 Step
            {' '}
            {index + 1}
/4
          </div>
          <h4 className={classes.title}>{sources.titleRefund[index]}</h4>
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

RefundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired,
  currentCash: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default RefundDialog;
