import React, { useReducer, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Grid, Paper, Collapse, Button
} from '@material-ui/core';
import ProrityPaper from '../../../organisms/mypage/marketer/campaign-create/PriorityPaper';
import OptionPaper from '../../../organisms/mypage/marketer/campaign-create/OptionPaper';
import CampaignCreateTable from '../../../organisms/mypage/marketer/campaign-create/CampaignCreateTable';
import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';
import {
  step1Reducer, step2Reducer, step2SelectReducer, step3Reducer,
  budgetReducer, termReducer, timeReducer, nameReducer
} from '../../../organisms/mypage/marketer/campaign-create/campaignReducer';

const useStyles = makeStyles((_theme: Theme) => ({
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
    color: _theme.palette.text.primary,
    marginRight: _theme.spacing(1),
  }
}));


// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreation = (): JSX.Element => {
  const classes = useStyles();
  const [step, setStep] = React.useState(0);

  // 광고 송출형 유형선택시 사용하는 Reducer 기본값은 첫번째 옵션(CPM + CPC)
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { option: 'option1' });

  // 광고 선택형 유형선택시 사용하는 Reducer 기본값은 3번째 옵션인 무관
  const [step2State, step2Dispatch] = useReducer(step2Reducer, {});

  // 2 번째 prioritystep에서 사용할 State.
  const [checkedPriorities, checkedPrioritiesDispatch] = useReducer(step2SelectReducer, []);

  // 3 번째 캠페인 기본정보에서 사용할 State
  const [budgetState, budgetDispatch] = useReducer(budgetReducer, { budget: false, value: 0 });
  const [termState, termDispatch] = useReducer(termReducer,
    { term: false, startDate: new Date(), finDate: null });
  const [nameState, nameDispatch] = useReducer(nameReducer, { error: true, name: '' });

  const [timeState, timeDispatch] = useReducer(timeReducer, { time: false, timeList: [] });
  const [step3State, step3Dispatch] = useReducer(step3Reducer, {
    bannerId: '',
    mainLandingUrlName: '',
    sub1LandingUrlName: '',
    sub2LandingUrlName: '',
    mainLandingUrl: '',
    sub1LandingUrl: '',
    sub2LandingUrl: '',
  });


  const step3Reset = (): void => {
    checkedPrioritiesDispatch({ type: 'reset' });
    budgetDispatch({ key: 'noBudget', value: '' });
    termDispatch({ key: 'reset', value: '' });
    timeDispatch({ key: 'noTime', value: [] });
    step3Dispatch({ key: 'reset', value: '' });
  };

  const checkEmpty = (input: any): boolean => {
    if (input.campaignName === '') {
      alert('캠페인 명이 올바르게 입력되지 않았습니다.');
      return false;
    }
    if (input.bannerId.length === 0) {
      alert('배너가 선택되지 않았습니다.');
      return false;
    }
    if (input.optionType !== '0' && (input.mainLandingUrl.replace(/ /gi, '').length === 0)) {
      alert('랜딩페이지 URL이 입력되지 않았습니다.');
      return false;
    }
    if (input.budget && (input.dailyLimit === null || input.dailyLimit < 5000)) {
      alert('일일예산이 올바르게 입력되지 않았습니다.');
      return false;
    }
    // if (input.term && input.startDate === null) {
    //   alert('시작일이 입력되지 않았습니다.');
    //   return false;
    // }
    if (input.finDate && (input.finDate < input.startDate)) {
      alert('시작일은 종료일보다 빠를 수 없습니다.');
      return false;
    }

    return true;
  };

  const getIndexArray = (arr: boolean[] | undefined): number[] => {
    if (arr) {
      return arr.reduce((acc: number[], ele: boolean, index: number) => {
        if (ele) { acc.push(index); }
        return acc;
      }, []);
    }
    return [];
  };

  const handleCallbackSubmit = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    const { name, error } = nameState;
    const { time, timeList } = timeState;
    const { budget, value } = budgetState;
    const { term, startDate, finDate } = termState;

    function typeToNum(type: string): string {
      const NUM = type.replace(/[^0-9]/g, '');
      return NUM;
    }
    let priorityType = '';
    if (step2State.priorityType) {
      priorityType = typeToNum(step2State.priorityType);
    }
    const optionType = typeToNum(step1State.option);
    const priorityList = ((type) => {
      switch (type) {
        case 'type0':
        case 'type1':
          return checkedPriorities; // 선택된 게임
        case 'type2':
        default:
          return ['무관']; // 카테고리 무관인 카테고리 ID
      }
    })(step2State.priorityType);

    const validateObject = {
      campaignName: error ? null : name,
      optionType,
      priorityType,
      priorityList,
      selectedTime: time ? getIndexArray(timeList) : [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      dailyLimit: budget ? value : -1,
      startDate,
      finDate,
      budget,
      term,
      keyword: ['', '', ''], // keyword추가후 수정
      ...step3State,
    };

    if (checkEmpty(validateObject)) {
      axios.post(`${HOST}/marketer/campaign`, validateObject)
        .then((res) => {
          if (res.data[0]) {
            alert(res.data[1]);
            history.push('/mypage/marketer/main');
          } else {
            alert(res.data[1]);
          }
        });
    }
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setStep(step + 1);
  };

  // '뒤로' 버튼 핸들러
  const handleBack = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (step === 0) {
      history.push('/mypage/marketer/main');
      return;
    }
    step2Dispatch({ key: 'reset', value: '' });
    if (step === 2) {
      step3Reset();
    }
    setStep(step - 1);
  };

  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      {isDesktop ? (
        <>
          <Grid item xs={12} lg={12} xl={12}>
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
                      dispatch={step3Dispatch}
                      state={step3State}
                      budgetState={budgetState}
                      optionType={step1State.option}
                      budgetDispatch={budgetDispatch}
                      termState={termState}
                      termDispatch={termDispatch}
                      timeState={timeState}
                      timeDispatch={timeDispatch}
                      nameState={nameState}
                      nameDispatch={nameDispatch}
                      step={step}
                    />
                    <Grid item>
                      <Grid container direction="row-reverse">
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCallbackSubmit}
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
        </>
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

export default CampaignCreation;
