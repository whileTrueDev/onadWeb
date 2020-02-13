import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Grid, Paper, Collapse, Button
} from '@material-ui/core';
import ProrityPaper from '../../organisms/marketer/CampaignCreate/PriorityPaper';
import OptionPaper from '../../organisms/marketer/CampaignCreate/OptionPaper';
import CampaignCreateTable from '../../organisms/marketer/CampaignCreate/CampaignCreateTable';
import HOST from '../../utils/config';
import axios from '../../utils/axios';
import history from '../../history';
import {
  step1Reducer, step2Reducer, step2SelectReducer, step3Reducer
} from './campaignReducer';

const useStyles = makeStyles(_theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '12px',
    marginTop: '0px',
    padding: _theme.spacing(4),
    [_theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: _theme.spacing(1),
    },
  },
  button: {
    marginRight: _theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: _theme.spacing(1),
  }
}));


// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreateStepper = () => {
  const classes = useStyles();

  // 광고 송출형 유형선택시 사용하는 Reducer 기본값은 첫번째 옵션(CPM + CPC)
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { option: 'option1' });

  // 광고 선택형 유형선택시 사용하는 Reducer 기본값은 3번째 옵션인 무관
  const [step2State, step2Dispatch] = useReducer(step2Reducer, {});

  // 2 번째 prioritystep에서 사용할 State.
  const [checkedPriorities, checkedPrioritiesDispatch] = useReducer(step2SelectReducer, []);

  // 3 번째 캠페인 기본정보에서 사용할 State
  const [step3State, step3Dispatch] = useReducer(step3Reducer, {
    campaignName: '',
    bannerId: '',
    budget: '',
    startDate: new Date(),
    finDate: '',
    keyword0: '',
    keyword1: '',
    keyword2: '',
    mainLandingUrlName: '',
    sub1LandingUrlName: '',
    sub2LandingUrlName: '',
    mainLandingUrl: '',
    sub1LandingUrl: '',
    sub2LandingUrl: '',
    time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  });
  // 최종 step에서 handleSubmit을 하기위한 signal
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [checkName, setCheckName] = React.useState(false);
  const [budgetError, setBudgetError] = React.useState(false);
  const times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const defaultList = times.map(() => true);
  const [checkList, setCheckList] = React.useState(defaultList);

  const checkEmpty = (input) => {
    if (input.option.length === 0) {
      alert('광고 유형이 입력되지 않았습니다.');
      return false;
    }
    if (input.type.length === 0) {
      alert('우선형 유형이 입력되지 않았습니다.');
      return false;
    }
    if (checkName === false) {
      alert('캠페인 이름이 입력되지 않았습니다.');
      return false;
    }
    if (input.bannerId.length === 0) {
      alert('배너가 선택되지 않았습니다.');
      return false;
    }
    if (input.option !== 'type0' && (input.mainLandingUrl.replace(/ /gi, '').length === 0)) {
      alert('랜딩페이지 URL이 입력되지 않았습니다.');
      return false;
    }
    if (budgetError) {
      alert('일예산이 입력되지 않았습니다.');
      return false;
    }
    return true;
  };

  const getIndexArray = array => (array.reduce((acc, ele, index) => {
    if (ele) { acc.push(index); }
    return acc;
  }, []));

  const handleSubmit = (event) => {
    event.preventDefault();

    function typeToNum(type) {
      const NUM = type.replace(/[^0-9]/g, '');
      return NUM;
    }
    const priorityNum = typeToNum(step2State.priorityType);
    const optionNumType = typeToNum(step1State.option);

    const priorityList = ((priorityType) => {
      switch (priorityType) {
        case 'type0':
        case 'type1':
          return checkedPriorities; // 선택된 게임
        case 'type2':
        default:
          return ['무관']; // 카테고리 무관인 카테고리 ID
      }
    })(step2State.priorityType);

    const validateObject = {
      option: step1State.option,
      type: priorityNum,
      ...step3State,
      priority: priorityList,
    };
    getIndexArray(checkList);
    if (checkEmpty(validateObject)) {
      axios.post(`${HOST}/api/dashboard/marketer/campaign/push`, {
        optionType: optionNumType,
        priorityType: priorityNum,
        ...step3State,
        priorityList,
        selectedTime: getIndexArray(checkList)
      })
        .then((res) => {
          alert(res.data[1]);
          history.push('/dashboard/marketer/main');
        });
    }
  };

  const handleDatePickerOpen = () => {
    step3Dispatch({ key: 'dateReset' });
    setDatePickerOpen(!datePickerOpen);
  };

  const handleNext = (event) => {
    event.preventDefault();
    setStep(step + 1);
  };

  const handleDetailOpen = () => {
    step3Dispatch({ key: 'budgetReset' });
    setDetailOpen(!detailOpen);
  };

  const handleDateOpen = () => {
    setDateOpen(!dateOpen);
  };

  // '뒤로' 버튼 핸들러
  const handleBack = (event) => {
    event.preventDefault();
    if (step === 0) {
      history.push('/dashboard/marketer/main');
      return;
    }
    if (step === 2) {
      step2Dispatch({ type: 'reset' });
      checkedPrioritiesDispatch({ type: 'reset' });
    }
    setStep(step - 1);
  };

  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      {isDesktop ? (
        <React.Fragment>
          <Grid item xs={12} lg={10} xl={8}>
            <Paper>
              <Grid container direction="column" className={classes.root}>
                <Grid item xs={12}>
                  <OptionPaper
                    state={step1State}
                    dispatch={step1Dispatch}
                    step={step}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                  <Collapse in={step >= 1}>
                    <ProrityPaper
                      state={step2State}
                      dispatch={step2Dispatch}
                      step={step}
                      handleNext={handleNext}
                      handleBack={handleBack}
                      checkedPriorities={checkedPriorities}
                      checkedPrioritiesDispatch={checkedPrioritiesDispatch}
                    />
                  </Collapse>
                  <Collapse in={step === 2} timeout={{ enter: 800 }}>
                    <CampaignCreateTable
                      checkName={checkName}
                      setCheckName={setCheckName}
                      dispatch={step3Dispatch}
                      state={step3State}
                      setDetailOpen={setDetailOpen}
                      budgetError={budgetError}
                      setBudgetError={setBudgetError}
                      detailOpen={detailOpen}
                      step1State={step1State}
                      handleDetailOpen={handleDetailOpen}
                      dateOpen={dateOpen}
                      handleDateOpen={handleDateOpen}
                      handleDatePickerOpen={handleDatePickerOpen}
                      datePickerOpen={datePickerOpen}
                      checkState={checkList}
                      setCheckState={setCheckList}
                    />
                    <Grid item>
                      <Grid container direction="row-reverse">
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            className={classes.end}
                          >
                            완료
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button onClick={handleBack} className={classes.button}>
                            뒤로
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </React.Fragment>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          width: '100%'
        }}
        >
          <h4>캠페인 생성은 데스크탑에서 진행해주세요.</h4>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard/marketer/main"
          >
          대시보드로 이동
          </Button>
        </div>
      )}
    </Grid>
  );
};

export default CampaignCreateStepper;
