import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Paper, Slide, Collapse
} from '@material-ui/core';
import LinearStepper from '../../../../atoms/LinearStepper';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import CreatePaper from '../../CampaignCreate/CreatePaper';
import ProrityPaper from '../../CampaignCreate/PriorityPaper';
import CreatorSelectDialog from '../../CampaignCreate/CreatorSelectDialog';
import CategorySelect from '../../CampaignCreate/CategorySelect';
import OptionPaper from '../../CampaignCreate/OptionPaper';
import HOST from '../../../../utils/config';
import axios from '../../../../utils/axios';
import history from '../../../../history';

const useStyles = makeStyles(_theme => ({
  paper: {
    [_theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  root: {
    width: '100%',
    height: 'auto',
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

const steps = [{ label: '캠페인 기본정보 / 배너선택' }, { label: '광고 송출유형 선택' }, { label: '광고유형 선택' }];

// key ,value를 이용하여 state의 값에 접근
const step1Reducer = (state, action) => {
  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'bannerId':
      return { ...state, bannerId: action.value };
    case 'reset': {
      return { campaignName: '', bannerId: '' };
    }
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
    case 'option2': {
      return { ...state, choose: 1, option: 2 };
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
  const { open, handleClose } = props;
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

  // 최종 step에서 handleSubmit을 하기위한 signal
  const [submitCheck, handleSubmitCheck] = React.useState(false);
  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state
  const [activeStep, setActiveStep] = React.useState(0); // linearStepper에서 현재 step을 정의하는 state

  const handleSubmit = (event) => {
    event.preventDefault();
    const priorityList = ((priorityType) => {
      switch (priorityType) {
        case 0: {
          // 선택된 크리에이터
          return checkedCreators;
        }
        case 1: {
          // 선택된 카테고리
          return checkedCategories;
        }
        case 2: {
          // 카테고리 무관인 카테고리 ID
          return ['무관'];
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
          history.push('/dashboard/marketer/main');
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
          // {creatorId, creatorName, creatorLogo}의 형태이므로 creatorId만 남도록 재 array화.
          const creators = res.data[1].map(data => data.creatorId);
          setCreatorList(creators);
        } else {
          alert(res.data[1]);
        }
      });
  };

  useEffect(() => {
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
    if (index === 0) {
      handleClose();
    }
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
        checkedCreatorsDispatch({ type: 'reset' });
        step2Dispatch({ type: 'reset' });
        step4Dispatch({ type: 'reset' });
        setIndex(1);
      } else if (index === 0) {
        handleClose();
      } else {
        setIndex(preIndex => preIndex - 1);
      }
      setPaperSwitch(true);
    }, 500);
  };

  const setSteps = (_index) => {
    switch (_index) {
      case 0:
        return (
          <CreatePaper
            bannerList={bannerList}
            dispatch={step1Dispatch}
            setStepComplete={setStepComplete}
          />
        );
      case 1:
        return (
          <ProrityPaper
            handleNext={handleNext}
            state={step2State}
            dispatch={step2Dispatch}
          />
        );
      case 2:
        return (
          <CreatorSelectDialog
            setStepComplete={setStepComplete}
            creatorList={creatorList}
            checkedCreators={checkedCreators}
            checkedCreatorsDispatch={checkedCreatorsDispatch}
            handleBack={handleBack}
            handleNext={handleNext}
            stepComplete={stepComplete}
          />
        );
      case 3:
        return (
          <CategorySelect
            setStepComplete={setStepComplete}
            categoryList={categoryList}
            checkedCategories={checkedCategories}
            checkedCategoriesDispatch={checkedCategoriesDispatch}
          />
        );
      case 4:
        return (
          <OptionPaper
            setStepComplete={setStepComplete}
            handleSubmitCheck={handleSubmitCheck}
            step2State={step2State}
            state={step4State}
            dispatch={step4Dispatch}
            selectedCategory={checkedCategories}
          />
        );
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

  // 해당 다이얼로그를 클로즈할 때, 여러가지 setup들을 갱신한다.
  const wrapHandleClose = (event) => {
    event.preventDefault();
    setIndex(0);
    setActiveStep(0);
    step1Dispatch({ type: 'reset' });
    setStepComplete(false);
    checkedCategoriesDispatch({ type: 'reset' });
    checkedCreatorsDispatch({ type: 'reset' });
    step2Dispatch({ type: 'reset' });
    step4Dispatch({ type: 'reset' });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={wrapHandleClose}
      fullWidth
      maxWidth="lg"
      title="캠페인 등록"
    >
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
                <Button onClick={handleBack} className={classes.button}>
                뒤로
                </Button>
              </Grid>

              {index === 4
                ? (
                  <Grid item>
                    <Button
                      disabled={!submitCheck}
                      variant="contained"
                      color="info"
                      onClick={handleSubmit}
                      className={classes.end}
                    >
                      완료
                    </Button>
                  </Grid>
                )
                : (
                  <Collapse in={stepComplete}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={handleNext()}
                        className={classes.end}
                      >
                        다음
                      </Button>
                    </Grid>
                  </Collapse>
                )
              }

            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Dialog>
  );
};


export default CampaignCreateStepper;

CampaignCreateStepper.propTypes = {
  // open: PropTypes.object,
  handleClose: PropTypes.func
};
