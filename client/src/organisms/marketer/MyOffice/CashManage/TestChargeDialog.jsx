import React, { useReducer, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Slide, Collapse
} from '@material-ui/core';
import axios from '../../../../utils/axios';
// customized component
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../utils/config';
import TestChargeAgreement from './sub/TestChargeAgreement';
import TestChargeAmount from './sub/TestChargeAmount';
import TestChargeComplete from './sub/TestChargeComplete';
import TestChargeSolution from './sub/TestChargeSolution';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import sources from '../source/sources';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'white'
  },
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
  },
  buttonContainer: {
    marginTop: 20,
    marginRight: '7%',
    paddingBottom: 20,
  },
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


function TestChargeDialog() {
  const marketerProfileData = useFetchData('/api/dashboard/marketer/profile');
  const classes = useStyles();
  const [vbankInfo, setVbankInfo] = useState({});

  // 충전금액, 결제방법에서 사용할(step2,3) State.
  const [stepState, stepDispatch] = useReducer(
    stepReducer,
    {
      currentCash: '',
      selectValue: '',
      chargeType: '',
      totalDebit: ''
    }
  );

  const { selectValue, chargeType } = stepState;


  // 전자 결제시스템
  function handleSubmitClick(e) {
    e.preventDefault();

    // merchant_uid 생성에 필요한 날짜 포맷
    const currentDate = new Date();
    const currentDateFormat = `${currentDate.getFullYear()}`
    + `${(currentDate.getMonth() + 1)}`
    + `${currentDate.getDate()}`
    + `${currentDate.getHours()}`
    + `${currentDate.getMinutes()}`
    + `${currentDate.getSeconds()}`;

    // 전역 객체에서 imp라이브러리 호출
    const { IMP } = window;

    // 가맹점 정보 넣기
    IMP.init('imp00026649');

    let buyerName;
    // 가상계좌 경우(와일트루)와 신용카드/계좌이체(마케터 이름) 경우 분기처리
    switch (chargeType) {
      case 'vbank':
        buyerName = '와일트루';
        break;
      case 'card':
        buyerName = marketerProfileData.payload.marketerName;
        break;
      case 'trans':
        buyerName = marketerProfileData.payload.marketerName;
        break;
      default: break;
    }

    // import 서버로 보낼 초기 데이터
    const paydata = {
      pg: 'danal_tpay',
      pay_method: chargeType, // 가상계좌 or 신용카드 or 계좌이체
      merchant_uid: marketerProfileData.payload.marketerId + currentDateFormat,
      name: 'ONAD캐시',
      amount: parseInt(selectValue * 1.1, 10),
      buyer_email: marketerProfileData.payload.marketerMail,
      buyer_name: buyerName,
      buyer_tel: marketerProfileData.payload.marketerPhoneNum,
      biz_num: '6590301549'
    };

    // 결제 완료 시 호출될 콜백함수
    const payCallback = (rsp) => {
      if (rsp.success) { // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
        axios.post(`${HOST}/api/dashboard/marketer/cash/testcharge`, {
          chargeCash: selectValue,
          chargeType,
          imp_uid: rsp.imp_uid,
          merchant_uid: rsp.merchant_uid
        }).then((data) => { // 결제 완료에 대한 응답처리
          switch (data.data.status) {
            // 가상계좌 발급 완료시 로직
            case 'vbankIssued':
              // 가상계좌 안내에 대한 데이터를 마케터에게 표시하기 위해 state에 담는다.
              setVbankInfo({
                vbankNum: `${rsp.vbank_num}`,
                vbankHolder: `${rsp.vbank_holder}`,
                vbankName: `${rsp.vbank_name}`,
                vbanDate: `${rsp.vbank_date}`,
                vbankAmount: `${rsp.paid_amount}`,
              });
              setIndex(preIndex => preIndex + 1);
              break;

            // 계좌이체 및 신용카드 결제 완료시 로직
            case 'success':
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
        const msg = '결제가 실패하였습니다. 다시 시도해 주세요';
        alert(msg);
        window.close();
      }
    };

    // 결제창 호출
    IMP.request_pay(paydata, payCallback);
  }

  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state

  const handleNext = go => (event) => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);

    if (index === 1) {
      if (selectValue < 10000) {
        alert('충전 최소 금액은 10000원 입니다');
        window.close();
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
            vbankInfo={vbankInfo}
          />
        );
      default:
        return <div />;
    }
  };

  // 취소 버튼 누를 시
  const DefaultIndex = () => {
    setIndex(0);
    stepDispatch({ key: 'reset' });
    window.close();
  };

  // 완료 버튼 누를 시
  const finishIndex = () => {
    window.opener.location.reload();
    window.close();
  };

  // 하단 step 조절 버튼
  const BottomButton = () => (
    <div className={classes.buttonContainer}>
      <Grid container direction="row" justify="flex-end">
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
  );

  useEffect(() => {
    axios.get(`${HOST}/api/dashboard/marketer/cash/defaultCash`)
      .then((res) => {
        if (res.data) {
          const currentCashNumber = res.data;
          stepDispatch({ key: 'currentCash', value: currentCashNumber });
        }
      });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.titleWrap}>
        <div style={{ fontSize: 18, paddingTop: 15 }}>
              OnAD 캐시 충전하기 Step
          {' '}
          {index + 1}
/4
        </div>
        <h4 className={classes.title}>{sources.title[index]}</h4>
      </div>
      <Slide direction="right" in={paperSwitch} mountOnEnter unmountOnExit timeout={{ exit: 500 }}>
        <div>
          {setSteps(index)}
        </div>
      </Slide>
      <BottomButton />
    </div>
  );
}

export default TestChargeDialog;
