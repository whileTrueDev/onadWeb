import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
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

const useStyles = makeStyles(_theme => ({
  paper: {
    [_theme.breakpoints.down('sm')]: {
      width: '100%'
    },
  },
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

// key ,value를 이용하여 state의 값에 접근
const step1Reducer = (state, action) => {
  switch (action.key) {
    case 'option0':
      return { ...state, option: 'option0' };
    case 'option1':
      return { ...state, option: 'option1' };
    case 'option2':
      return { ...state, option: 'option2' };
    case 'reset': {
      return { option: '' };
    }
    default:
      return state;
  }
};

const step2Reducer = (state, action) => {
  switch (action.type) {
    case 'type0': {
      return { priorityType: 'type0' };
    }
    case 'type1': {
      return { priorityType: 'type1' };
    }
    case 'type2': {
      return { priorityType: 'type2' };
    }
    case 'reset': {
      return { priorityType: null };
    }
    default: {
      return state;
    }
  }
};

// array State를 사용하는 Reducer
const step2InnerReducer = (state, action) => {
  switch (action.type) {
    case 'push':
      if (action.value instanceof Array) {
        // 기존 state와 중복되지 않은 value만 선택
        const values = action.value.filter(v => !state.includes(v));
        return [...state, ...values];
      }
      return [...state, action.value];
    case 'delete':
      return state.filter(item => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const step3Reducer = (state, action) => {
  const todayDate = new Date(`${new Date().toString().split('GMT')[0]} UTC`).toISOString().split('.')[0];

  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'bannerId':
      return { ...state, bannerId: action.value };
    case 'budget':
      return { ...state, budget: action.value };
    case 'startDate':
      return { ...state, startDate: action.value };
    case 'finDate':
      return { ...state, finDate: action.value };
    case 'keyword0':
      return { ...state, keyword0: action.value };
    case 'keyword1':
      return { ...state, keyword1: action.value };
    case 'keyword2':
      return { ...state, keyword2: action.value };
    case 'mainLandingUrlName':
      return { ...state, mainLandingUrlName: action.value };
    case 'sub1LandingUrlName':
      return { ...state, sub1LandingUrlName: action.value };
    case 'sub2LandingUrlName':
      return { ...state, sub2LandingUrlName: action.value };
    case 'mainLandingUrl':
      return { ...state, mainLandingUrl: action.value };
    case 'sub1LandingUrl':
      return { ...state, sub1LandingUrl: action.value };
    case 'sub2LandingUrl':
      return { ...state, sub2LandingUrl: action.value };
    case 'time':
      return { ...state, time: action.value };
    case 'budgetReset':
      return { ...state, budget: '' };
    case 'dateReset':
      return { ...state, finDate: '' };
    case 'reset': {
      return {
        campaignName: '',
        bannerId: '',
        budget: '',
        startDate: new Date(todayDate),
        finDate: '',
        links: []
      };
    }
    default:
      return state;
  }
};

function typeToNum(type) {
  const NUM = type.replace(/[^0-9]/g, '');
  return NUM;
}

// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreateStepper = () => {
  const todayDate = new Date(`${new Date().toString().split('GMT')[0]} UTC`).toISOString().split('.')[0];
  const classes = useStyles();
  // 0번째 step에서 사용할 State.
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { option: '' });

  // 1 번째 step에서 사용할 State.
  const [step2State, step2Dispatch] = useReducer(step2Reducer, { priorityType: '' });

  // 2 번째 prioritystep에서 사용할 State.
  const [creatorList, setCreatorList] = React.useState([]);
  const [checkedCreators, checkedCreatorsDispatch] = useReducer(step2InnerReducer, []);
  const [checkedGames, checkedGamesDispatch] = useReducer(step2InnerReducer, []);
  // 캠페인 기본정보
  const [step3State, step3Dispatch] = useReducer(step3Reducer, {
    campaignName: '',
    bannerId: '',
    budget: '',
    startDate: new Date(todayDate),
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
    keywords: [],
    time: []
  });
  // 4번 쨰 step에서 사용할 State1

  // 최종 step에서 handleSubmit을 하기위한 signal
  const [priorityOpen, setPriorityOpen] = React.useState(false);
  const [creationOpen, setCreationOpen] = React.useState(false);
  const [bannerList, setbannerList] = React.useState([]);
  const [submitCheck, handleSubmitCheck] = React.useState(false);
  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [createPaperOpen, setCreatePaperOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [checkName, setCheckName] = React.useState(false);

  // const isTrue = currentValue => currentValue === true;

  const checkEmpty = (input) => {
    if (input[0].length === 0) {
      alert('광고 유형이 입력되지 않았습니다.');
      return false;
    }
    if (input[1].length === 0) {
      alert('우선형 유형이 입력되지 않았습니다.');
      return false;
    }
    if (checkName === false) {
      alert('캠페인 이름이 입력되지 않았습니다.');
      return false;
    }
    if (input[4].length === 0) {
      alert('배너가 선택되지 않았습니다.');
      return false;
    }
    if (input[0] !== 'type0' && (input[10].replace('https://').length === 0 || input[10].replace('http://').length === 0)) {
      alert('랜딩페이지 URL이 입력되지 않았습니다.');
      return false;
    }
    return true;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const priorityType = typeToNum(step2State.priorityType);
    const optionNumType = typeToNum(step1State.option);
    console.log({
      optionType: optionNumType,
      priorityType,
      campaignName: step3State.campaignName,
      bannerId: step3State.bannerId,
      budget: step3State.budget,
      mainLandingUrlName: step3State.mainLandingUrlName,
      sub1LandingUrlName: step3State.sub1LandingUrlName,
      sub2LandingUrlName: step3State.sub2LandingUrlName,
      mainUrl: step3State.mainLandingUrl,
      sub1Url: step3State.sub1LandingUrl,
      sub2Url: step3State.sub2LandingUrl,
      startDate: step3State.startDate,
      finDate: step3State.finDate,
      keyword0: step3State.keyword0,
      keyword1: step3State.keyword1,
      keyword2: step3State.keyword2,
      time: step3State.time
    });

    const priorityList = ((type) => {
      switch (type) {
        case 'type0': {
          // 선택된 크리에이터
          return checkedCreators;
        }
        case 'type1': {
          // 선택된 카테고리
          return checkedGames;
        }
        case 'type2': {
          // 카테고리 무관인 카테고리 ID
          return ['무관'];
        }
        default: {
          return [];
        }
      }
    })(step2State.priorityType);

    const validateArray = [
      step1State.option,
      priorityType,
      step3State.campaignName,
      step3State.budget,
      step3State.bannerId,
      step3State.startDate,
      step3State.finDate,
      step3State.keyword0,
      step3State.keyword1,
      step3State.keyword2,
      step3State.mainLandingUrl,
      step3State.sub1LandingUrl,
      step3State.sub2LandingUrl,
      priorityList,
      step3State.time
    ];

    if (checkEmpty(validateArray)) {
      axios.post(`${HOST}/api/dashboard/marketer/campaign/push`, {
        optionType: optionNumType,
        priorityType,
        campaignName: step3State.campaignName,
        bannerId: step3State.bannerId,
        budget: step3State.budget,
        startDate: step3State.startDate,
        finDate: step3State.finDate,
        keyword0: step3State.keyword0,
        keyword1: step3State.keyword1,
        keyword2: step3State.keyword2,
        mainLandingUrlName: step3State.mainLandingUrlName,
        sub1LandingUrlName: step3State.sub1LandingUrlName,
        sub2LandingUrlName: step3State.sub2LandingUrlName,
        mainLandingUrl: step3State.mainLandingUrl,
        sub1LandingUrl: step3State.sub1LandingUrl,
        sub2LandingUrl: step3State.sub2LandingUrl,
        priorityList,
        selectedTime: step3State.time
      })
        .then((res) => {
          alert(res.data[1]);
          // history.push('/dashboard/marketer/main');
        });
    }
  };

  // 오래걸리므로 props로 전달.
  const getBannerList = () => {
    axios.get(`${HOST}/api/dashboard/marketer/banner/registed`)
      .then((res) => {
        // 올바른 데이터가 전달되었다.
        if (res.data[0]) {
          setbannerList(res.data[1]);
        } else {
          alert(res.data[1]);
        }
      });
  };

  const getCreatorList = () => {
    axios.get(`${HOST}/api/dashboard/creator/list`)
      .then((res) => {
      // 올바른 데이터가 전달되었다.
        if (res.data[0]) {
          // {creatorId, creatorName, creatorLogo}의 형태이므로 creatorId만 남도록 재 array화.
          const creators = res.data[1].map(data => data.creatorId);
          setCreatorList(creators);
        } else {
          alert(res.data[1]);
        }
      });
  };

  useEffect(() => {
    getBannerList();
    getCreatorList();
  }, []);

  const handleDatePickerOpen = () => {
    step3Dispatch({ key: 'dateReset' });
    setDatePickerOpen(!datePickerOpen);
  };

  // const handleButton = (_step) => {
  //   switch (_step) {
  //     case 0: {
  //       setPriorityOpen(false);
  //       setCreationOpen(false);
  //       setCreatePaperOpen(false);
  //       setStep(0);
  //       console.log('campaignCreation line 256');
  //       return false;
  //     }
  //     case 1: {
  //       setPriorityOpen(true);
  //       setCreatePaperOpen(false);
  //       setStep(1);
  //       console.log('campaignCreation line 261');
  //       return false;
  //     }
  //     case 2: {
  //       setCreatePaperOpen(true);
  //       setStep(2);
  //       return false;
  //     }
  //     default: {
  //       return false; }
  //   }
  // };

  const handleNext = _step => (event) => {
    event.preventDefault();
    switch (_step) {
      case 0: {
        setPriorityOpen(true);
        setStep(1);
        console.log('campaignCreation line 249');
        return false;
      }
      case 1: {
        setCreationOpen(true);
        setCreatePaperOpen(true);
        setStep(2);
        console.log('campaignCreation line 255');
        return false;
      }
      default: {
        return false;
      }
    }
  };

  const handleDetailOpen = () => {
    step3Dispatch({ key: 'budgetReset' });
    setDetailOpen(!detailOpen);
  };

  const handleDateOpen = () => {
    console.log('campaignCreation 346');
    setDateOpen(!dateOpen);
  };

  const handleBack = (event) => {
    event.preventDefault();
    setStepComplete(true);
    switch (step) {
      case 0: {
        history.push('/dashboard/marketer/main');
        return false;
      }
      case 1: {
        setStep(step - 1);
        setPriorityOpen(false);
        return false;
      }
      case 2: {
        console.log('campaigncreation 348line');
        setStep(step - 1);
        setPriorityOpen(true);
        setCreationOpen(false);
        setCreatePaperOpen(false);
        return false;
      }
      default: return false;
    }
  };

  const nextButton = (_step) => {
    switch (_step) {
      case 0:
        return (
          <Collapse in={stepComplete}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext(_step)}
                className={classes.end}
              >
                다음
              </Button>
            </Grid>
          </Collapse>
        );
      case 1:
        return (
          <Collapse in={stepComplete}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext(_step)}
                className={classes.end}
              >
                다음
              </Button>
            </Grid>
          </Collapse>
        );
      case 2:
        return (
          <Collapse in={stepComplete}>
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
          </Collapse>
        );
      default:
        return <div />;
    }
  };
  // useEffect(() => {
  //   if (step1State.option) {
  //     console.log('campaignCration line 421');
  //     setStepComplete(true);
  //   } else {
  //     console.log('useeffect else');
  //     console.log(step1State.option, step2State.priorityType);
  //     setStepComplete(false);
  //   }
  // }, [step1State.option, step2State.priorityType]);

  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      {isDesktop ? (
        <React.Fragment>
          <Grid item xs={isDesktop ? 10 : 12}>
            <Paper className={classes.paper}>
              <Grid container direction="column" className={classes.root}>
                <Grid item>
                  <OptionPaper
                    setStepComplete={setStepComplete}
                    handleSubmitCheck={handleSubmitCheck}
                    priorityOpen={priorityOpen}
                    state={step1State}
                    dispatch={step1Dispatch}
                    selectedCategory={checkedGames}
                    setPriorityOpen={setPriorityOpen}
                    step={step}
                  />
                  {priorityOpen
                    ? (
                      <div>
                        <ProrityPaper
                          handleNext={handleNext}
                          step1State={step1State}
                          state={step2State}
                          dispatch={step2Dispatch}
                          setStepComplete={setStepComplete}
                          creationOpen={creationOpen}
                          creatorList={creatorList}
                          checkedCreators={checkedCreators}
                          checkedCreatorsDispatch={checkedCreatorsDispatch}
                          handleBack={handleBack}
                          stepComplete={stepComplete}
                          checkedGames={checkedGames}
                          checkedGamesDispatch={checkedGamesDispatch}
                          priorityOpen={priorityOpen}
                          createPaperOpen={createPaperOpen}
                        />
                      </div>
                    ) : <div />}
                  {createPaperOpen
                    ? (
                      <div>
                        <CampaignCreateTable
                          checkName={checkName}
                          setCheckName={setCheckName}
                          bannerList={bannerList}
                          dispatch={step3Dispatch}
                          setStepComplete={setStepComplete}
                          state={step3State}
                          setDetailOpen={setDetailOpen}
                          detailOpen={detailOpen}
                          step1State={step1State}
                          handleDetailOpen={handleDetailOpen}
                          handleDateOpen={handleDateOpen}
                          dateOpen={dateOpen}
                          handleDatePickerOpen={handleDatePickerOpen}
                          datePickerOpen={datePickerOpen}
                        />
                      </div>
                    ) : <div />}
                </Grid>
                <Grid item>
                  <Grid container direction="row">
                    <Grid item>
                      <Button onClick={handleBack} className={classes.button}>
                        뒤로
                      </Button>
                    </Grid>
                    {nextButton(step)}
                  </Grid>
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

CampaignCreateStepper.propTypes = {
  // open: PropTypes.object,
  handleClose: PropTypes.func,
};
