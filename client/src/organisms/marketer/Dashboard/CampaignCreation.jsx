import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Paper, Collapse
} from '@material-ui/core';
import Button from '../../../atoms/CustomButtons/Button';
import ProrityPaper from '../CampaignCreate/PriorityPaper';
import OptionPaper from '../CampaignCreate/OptionPaper';
import Selector from '../CampaignCreate/StepSelector';
import CampaignCreateTable from '../CampaignCreate/CampaignCreateTable';
import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';

const useStyles = makeStyles(_theme => ({
  paper: {
    [_theme.breakpoints.down('sm')]: {
      width: '100%'
    }
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

// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreateStepper = (props) => {
  const { open, handleClose } = props;
  const classes = useStyles();
  // 0번째 step에서 사용할 State.
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { option: '' });

  // 1 번째 step에서 사용할 State.
  const [step2State, step2Dispatch] = useReducer(step2Reducer, { priorityType: '' });

  // 2 번째 prioritystep에서 사용할 State.
  const [creatorList, setCreatorList] = React.useState([]);
  const [checkedCreators, checkedCreatorsDispatch] = useReducer(step2InnerReducer, []);
  const [categoryList, setCategoryList] = React.useState([]);
  const [checkedCategories, checkedCategoriesDispatch] = useReducer(step2InnerReducer, []);
  // 캠페인 기본정보
  const [step3State, step3Dispatch] = useReducer(step3Reducer, { campaignName: '', bannerId: '' });
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
  const [landingUrlState, setLandingUrlState] = React.useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(step1State, step2State, checkedCreators, categoryList, step3State);
    // if(detailOpen){console.log()}
    // axios.post(`${HOST}/api/dashboard/marketer/campaign/push`, {
    //   optyionType: step1State.option,
    //   // dailyLimit: step4State.budget,
    //   priorityType: step2State.priorityType,
    //   // optionType: step4State.option,
    //   // noBudget: step4State.noBudget,
    //   // priorityList
    // })
    //   .then((res) => {
    //     alert(res.data[1]);
    //     history.push('/dashboard/marketer/main');
    //   });
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

  const handleDatePickerOpen = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const handleButton = (_step) => {
    switch (_step) {
      case 0: {
        setPriorityOpen(false);
        setCreationOpen(false);
        setCreatePaperOpen(false);
        setStep(0);
        console.log('campaignCreation line 256');
        return false;
      }
      case 1: {
        setPriorityOpen(true);
        setStep(1);
        console.log('campaignCreation line 261');
        return false;
      }
      default: {
        return false; }
    }
  };

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
    console.log('budgetinput 147');
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

  const handleSetLandingUrlState = (index) => {
    setLandingUrlState(index + 1);
  };

  const nextButton = (_step) => {
    switch (_step) {
      case 0:
        return (
          <Collapse in={stepComplete}>
            <Grid item>
              <Button
                variant="contained"
                color="info"
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
                color="info"
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
                color="info"
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

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      <Grid item xs={2}>
        <Selector
          handleButton={handleButton}
        />
      </Grid>
      <Grid item xs={10}>
        <Paper className={classes.paper}>
          <Grid container direction="column" className={classes.root}>
            <Grid item>
              <OptionPaper
                setStepComplete={setStepComplete}
                handleSubmitCheck={handleSubmitCheck}
                priorityOpen={priorityOpen}
                state={step1State}
                dispatch={step1Dispatch}
                selectedCategory={checkedCategories}
                setPriorityOpen={setPriorityOpen}
              />
              {priorityOpen
                ? (
                  <div>
                    <ProrityPaper
                      handleNext={handleNext}
                      state={step2State}
                      dispatch={step2Dispatch}
                      setStepComplete={setStepComplete}
                      creationOpen={creationOpen}
                      creatorList={creatorList}
                      checkedCreators={checkedCreators}
                      checkedCreatorsDispatch={checkedCreatorsDispatch}
                      handleBack={handleBack}
                      stepComplete={stepComplete}
                      categoryList={categoryList}
                      checkedCategories={checkedCategories}
                      checkedCategoriesDispatch={checkedCategoriesDispatch}
                      priorityOpen={priorityOpen}
                      createPaperOpen={createPaperOpen}
                    />
                  </div>
                ) : <div />}
              {createPaperOpen
                ? (
                  <div>
                    <CampaignCreateTable
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
                      handleSetLandingUrlState={handleSetLandingUrlState}
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
    </Grid>
  );
};

export default CampaignCreateStepper;

CampaignCreateStepper.propTypes = {
  // open: PropTypes.object,
  handleClose: PropTypes.func,
};
