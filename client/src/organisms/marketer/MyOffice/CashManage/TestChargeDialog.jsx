import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Slide, Collapse
} from '@material-ui/core';
import axios from '../../../../utils/axios';
// customized component
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from './sub/Dialog';
import HOST from '../../../../utils/config';
import history from '../../../../history';
import TestChargeAgreement from './sub/TestChargeAgreement';
import TestChargeAmount from './sub/TestChargeAmount';
import TestChargeComplete from './sub/TestChargeComplete';
import TestChargeSolution from './sub/TestChargeSolution';
import sources from '../source/sources';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontWeight: 'bold',
  },
  contentDetail: {
    marginTop: theme.spacing(1),
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
    case 'totalDebit': {
      return { ...state, totalDebit: action.value };
    }
    case 'chargeType': {
      return { ...state, chargeType: action.value };
    }
    case 'reset': {
      return { ...state, selectValue: '0', chargeType: '' };
    }
    default: {
      return state;
    }
  }
};


function TestChargeDialog(props) {
  const classes = useStyles();
  const {
    open, handleClose, currentCash, marketerProfileData
  } = props;

  const currentCashNumber = currentCash.replace(',', '');

  // 충전금액, 결제방법에서 사용할(step2,3) State.
  const [stepState, stepDispatch] = useReducer(
    stepReducer,
    {
      currentCash: currentCashNumber,
      selectValue: '',
      chargeType: '',
      totalDebit: ''
    }
  );

  const { selectValue, chargeType } = stepState;

  function handleSubmitClick(event) {
    event.preventDefault();

    // 캐시 충전 날짜 조회
    const currentDate = new Date();
    const currentDateFormat = `${currentDate.getFullYear()}`
    + `${(currentDate.getMonth() + 1)}`
    + `${currentDate.getDate()}`
    + `${currentDate.getHours()}`
    + `${currentDate.getMinutes()}`
    + `${currentDate.getSeconds()}`;

    const { IMP } = window;
    IMP.init('imp00026649');

    // IMP.request_pay(param, callback) 호출
    IMP.request_pay({ // param
      pg: "danal_tpay", // useState 써야함
      pay_method: chargeType , // useState 써야함
      merchant_uid: marketerProfileData.payload.marketerId + currentDateFormat,
      name: 'OnAD 광고캐시',
      amount: parseInt(selectValue * 1.1),
      buyer_email: marketerProfileData.payload.marketerMail,
      buyer_name: marketerProfileData.payload.marketerName,
      buyer_tel: marketerProfileData.payload.marketerPhoneNum,
      company: 'OnAD'
    }, (rsp) => { // callback
      if (rsp.success) { // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
        // axios로 HTTP 요청
        axios.post(`${HOST}/api/dashboard/marketer/cash/testcharge`, {
          chargeCash: selectValue,
          chargeType,
          imp_uid: rsp.imp_uid,
          merchant_uid: rsp.merchant_uid
        }).then((data) => { // 응답처리
          switch (data.data.status) {
            case 'vbankIssued':
              // 가상계좌 발급 시 로직(추가로직이 더 필요함)

              alert('가상계좌발급이 완료 되었습니다.');

              break;

            case 'success':
              // 결제 성공 시 로직
              if (!data[0]) {
                setIndex(preIndex => preIndex + 1);
              } else {
                console.log('cash - charge - error!');
              }
              break;
            default: break;
          }
        }).catch((err) => {
          console.log(err);
        });
      } else {
        // 결제 실패시
        let msg = '결제가 실패하였습니다. ';
        msg += `${rsp.error_msg}..`;
        msg += `${rsp.merchant_uid}..`;
        msg += `${rsp.imp_uid}..`;
        alert(msg);
        handleClose();
        history.push('/dashboard/marketer/myoffice');
      }
    });
  }

  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state

  const handleNext = go => (event) => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);

    setTimeout(() => {
      if (go) {
        setIndex(go);
      } else {
        setIndex(preIndex => preIndex + 1);
      }
      setPaperSwitch(true);
    }, 500);
  };

  const handleBack = (event) => {
    event.preventDefault();
    setStepComplete(false);
    setPaperSwitch(false);
    if (index === 1 || index === 2) {
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
          <TestChargeAgreement
            setStepComplete={setStepComplete}
          />
        );
      case 1:
        return (
          <TestChargeAmount
            setStepComplete={setStepComplete}
            state={stepState}
            dispatch={stepDispatch}
            stepComplete={stepComplete}
          />
        );
      case 2:
        return (
          <TestChargeSolution
            setStepComplete={setStepComplete}
            state={stepState}
            dispatch={stepDispatch}
            stepComplete={stepComplete}
          />
        );
      case 3:
        return (
          <TestChargeComplete
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
                <Collapse in={stepComplete}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleSubmitClick}
                    className={classes.end}
                  >
                    결제
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
            {index === 1 || index === 2 ? (
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
              OnAD 캐시 충전하기 Step
            {' '}
            {index + 1}/4
          </div>
          <h4 className={classes.title}>{sources.title[index]}</h4>
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

TestChargeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default TestChargeDialog;
