import React, { useEffect, useReducer } from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
  Grid, Paper, Button, Slide, Collapse
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import LinearStepper from '../../atoms/LinearStepper';
import CreatePaper from '../../organisms/marketer/CampaignCreate/CreatePaper';
import ProrityPaper from '../../organisms/marketer/CampaignCreate/PriorityPaper';
import CreatorSelect from '../../organisms/marketer/CampaignCreate/CreatorSelect';
import CategorySelect from '../../organisms/marketer/CampaignCreate/CategorySelect';
import OptionPaper from '../../organisms/marketer/CampaignCreate/OptionPaper';
import HOST from '../../utils/config';
import axios from '../../utils/axios';

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const useStyles = makeStyles(_theme => ({
  paper: {
    maxWidth: '1200px',
    width: '1200px',
    [_theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  root: {
    width: '100%',
    height: 'auto',
    margin: '12px',
    marginTop: '0px',
    padding: theme.spacing(4),
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

const steps = [{ label: '캠페인 기본정보 / 배너선택' }, { label: '광고 송출유형 선택' }, { label: '광고유형 선택' }];

// key ,value를 이용하여 state의 값에 접근
const step1Reducer = (state, action) => {
  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'bannerId':
      return { ...state, bannerId: action.value };
    default:
      return state;
  }
};

const step2Reducer = (state, action) => {
  switch (action.type) {
    case 'type0': {
      return { choose: 1, type: 0 };
    }
    case 'type1': {
      return { choose: 1, type: 1 };
    }
    case 'type2': {
      return { choose: 1, type: 2 };
    }
    case 'reset': {
      return { choose: 0, type: null };
    }
    default: {
      return state;
    }
  }
};

// array State를 사용하는 Reducer
const step3Reducer = (state, action) => {
  switch (action.type) {
    case 'push':
      return [...state, action.value];
    case 'delete':
      return state.filter(item => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const step4Reducer = (state, action) => {
  switch (action.key) {
    case 'option0': {
      return { ...state, choose: 1, option: 0 };
    }
    case 'option1': {
      return { ...state, choose: 1, option: 1 };
    }
    case 'noBudget': {
      return { ...state, noBudget: !state.noBudget };
    }
    case 'budget': {
      return { ...state, budget: action.value };
    }
    case 'reset': {
      return {
        choose: 0, option: null, noBudget: false, budget: ''
      };
    }
    default: {
      return state;
    }
  }
};

// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreateStepper = (props) => {
  const classes = useStyles();
  // const { bannerList } = props;
  const [bannerList, setbannerList] = React.useState([]);
  // 0번째 step에서 사용할 State.
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { campaignName: '', bannerId: '' });

  // 1 번째 step에서 사용할 State.
  const [step2State, step2Dispatch] = useReducer(step2Reducer, { choose: 0, type: null });

  // 2 번째 step에서 사용할 State.
  const [creatorList, setCreatorList] = React.useState([]);
  const [checkedCreators, checkedCreatorsDispatch] = useReducer(step3Reducer, []);

  // 3 번째 step에서 사용할 State.(캠페인 카테고리)
  const [categoryList, setCategoryList] = React.useState([]);
  const [checkedCategories, checkedCategoriesDispatch] = useReducer(step3Reducer, []);

  // 4번 쨰 step에서 사용할 State1
  const [step4State, step4Dispatch] = useReducer(step4Reducer, {
    choose: 0, option: null, noBudget: false, budget: ''
  });

  const [submitCheck, handleSubmitCheck] = React.useState(false); // 최종 step에서 handleSubmit을 하기위한 signal
  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state
  const [activeStep, setActiveStep] = React.useState(0); // linearStepper에서 현재 step을 정의하는 state

  const handleSubmit = (event) => {
    event.preventDefault();

    const priorityList = ((priorityType) => {
      switch (priorityType) {
        case 0: {
          return checkedCreators;
        }
        case 1: {
          return checkedCategories;
        }
        case 2: {
          return creatorList;
        }
        default: {
          return [];
        }
      }
    })(step2State.type);

    if (submitCheck) {
      // categorie에서 creator로 변경되어야함.
      axios.post(`${HOST}/api/dashboard/marketer/campaign/push`, {
        ...step1State,
        dailyLimit: step4State.budget,
        priorityType: step2State.type,
        optionType: step4State.option,
        noBudget: step4State.noBudget,
        priorityList
      })
        .then((res) => {
          alert(res.data[1]);
        });
    } else {
      alert('제출불가');
    }
  };


  const getCategoryList = () => {
    axios.get(`${HOST}/api/dashboard/marketer/category`,)
      .then((res) => {
        setCategoryList(res.data);
      })
      .catch((errorData) => {
        console.log('오류');
      });
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
          // setCreatorList(res.data[1]);
          // TODO : 위의 것으로 변경
          setCreatorList(['123', '1234']);
        } else {
          alert(res.data[1]);
        }
      });
  };

  useEffect(() => {
    console.log('data fetch');
    getCategoryList();
    getBannerList();
    getCreatorList();
  }, []);

  const handleNext = (additional = false, go) => (event) => {
    event.preventDefault();
    setPaperSwitch(false);
    setStepComplete(false);
    // linearStepper의 변화는 필요없다면.
    if (!additional) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
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
    if (index === 1) {
      step1Dispatch({ key: 'bannerId', value: '' });
    }
    if (index !== 2 && index !== 3) {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
    setTimeout(() => {
      // additional page의 경우, 반드시 이전 page로 넘어가게끔.
      if (index === 2 || index === 3 || index === 4) {
        checkedCategoriesDispatch({ type: 'reset' });
        step2Dispatch({ type: 'reset' });
        setIndex(1);
      } else {
        setIndex(preIndex => preIndex - 1);
      }
      setPaperSwitch(true);
    }, 500);
  };

  const setSteps = (_index) => {
    switch (_index) {
      case 0:
        return <CreatePaper bannerList={bannerList} dispatch={step1Dispatch} setStepComplete={setStepComplete} />;
      case 1:
        return <ProrityPaper handleNext={handleNext} state={step2State} dispatch={step2Dispatch} />;
      case 2:
        return <CreatorSelect setStepComplete={setStepComplete} />;
      case 3:
        return <CategorySelect setStepComplete={setStepComplete} categoryList={categoryList} checkedCategories={checkedCategories} checkedCategoriesDispatch={checkedCategoriesDispatch} />;
      case 4:
        return <OptionPaper setStepComplete={setStepComplete} handleSubmitCheck={handleSubmitCheck} state={step4State} dispatch={step4Dispatch} />;
      default:
        return <div />;
    }
  };

  // bannerId, campaignName이 변경됨에 따라 다음 step으로 넘어가는 state가 자동으로 변경되도록 함.
  useEffect(() => {
    if (step1State.campaignName && step1State.bannerId) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [step1State.bannerId, step1State.campaignName, step1State.checkedBannerId]);

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          <LinearStepper activeStep={activeStep} steps={steps} />
        </Grid>
        <Slide direction="right" in={paperSwitch} mountOnEnter unmountOnExit timeout={{ exit: 500 }}>
          <Grid item>
            {setSteps(index)}
          </Grid>
        </Slide>
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <Button disabled={index === 0} onClick={handleBack} className={classes.button}>
              뒤로
              </Button>
            </Grid>

            {index === 4
              ? (
                <Grid item>
                  <ThemeProvider theme={theme}>
                    <Button
                      disabled={!submitCheck}
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      className={classes.end}
                    >
                     완료
                    </Button>
                  </ThemeProvider>
                </Grid>
              )
              : (
                <Collapse in={stepComplete}>
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext()}
                        className={classes.end}
                      >
                      다음
                      </Button>
                    </ThemeProvider>
                  </Grid>
                </Collapse>
              )
            }

          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};


export default CampaignCreateStepper;
