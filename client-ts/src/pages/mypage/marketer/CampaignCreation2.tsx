import React, { useReducer, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Paper, Collapse, Button, useMediaQuery
} from '@material-ui/core';
// atoms
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
// organisms
import ProrityPaper from '../../../organisms/mypage/marketer/campaign-create2/StepForPriorityType/PriorityPaper';
import OptionPaper from '../../../organisms/mypage/marketer/campaign-create2/StepForAdType/OptionPaper';
import CampaignFormPaper from '../../../organisms/mypage/marketer/campaign-create2/StepForInformation/CampaignFormPaper';
import {
  step1Reducer, step2Reducer, step2SelectReducer, step3Reducer,
  budgetReducer, termReducer, timeReducer, nameReducer,
  descriptionReducer
} from '../../../organisms/mypage/marketer/campaign-create/campaignReducer';
import ButtonSet from '../../../organisms/mypage/marketer/campaign-create2/shared/ButtonSet';
// others
import HOST from '../../../config';
import axios from '../../../utils/axios';
import history from '../../../history';


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
  end: {
    color: _theme.palette.text.primary,
    marginRight: _theme.spacing(1),
  },
  button: { marginRight: _theme.spacing(1) },
}));


// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreation = (): JSX.Element => {
  const classes = useStyles();
  // 진행 단계에 대한 스테이트 값.
  const [step, setStep] = React.useState(0);

  // 캠페인 생성은 Desktop only 이므로, Desktop 인지 불린값.
  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  // 광고 송출형 유형선택시 사용하는 Reducer 기본값은 첫번째 옵션(CPM + CPC)
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { option: 'option1' });

  // 광고 선택형 유형선택시 사용하는 Reducer 기본값은 3번째 옵션인 무관
  const [step2State, step2Dispatch] = useReducer(step2Reducer, {});

  // 2 번째 prioritystep에서 사용할 State.
  const [checkedPriorityType, checkedPriorityTypeDispatch] = useReducer(step2SelectReducer, []);

  // 3 번째 캠페인 기본정보에서 사용할 State
  const [budgetState, budgetDispatch] = useReducer(budgetReducer, { budget: false, value: 0 });
  const [termState, termDispatch] = useReducer(termReducer,
    { term: false, startDate: new Date(), finDate: null });
  const [nameState, nameDispatch] = useReducer(nameReducer, { error: true, name: '' });
  const [descriptionState, descriptionDispatch] = useReducer(descriptionReducer, { error: false, description: '' });
  const [timeState, timeDispatch] = useReducer(timeReducer, { time: false, timeList: [] });
  const [step3State, step3Dispatch] = useReducer(step3Reducer, {
    bannerId: '', connectedLinkId: '',
  });


  const step3Reset = (): void => {
    checkedPriorityTypeDispatch({ type: 'reset' });
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
    if (input.campaignDescription === '') {
      alert('캠페인 홍보 문구가 올바르게 입력되지 않았습니다.');
      return false;
    }
    if (input.bannerId.length === 0) {
      alert('배너가 선택되지 않았습니다.');
      return false;
    }
    if (input.optionType !== '0' && !input.connectedLinkId) {
      alert('랜딩페이지 URL이 선택되지 않았습니다.');
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
          return checkedPriorityType; // 선택된 게임
        case 'type2':
        default:
          return ['무관']; // 카테고리 무관인 카테고리 ID
      }
    })(step2State.priorityType);

    const validateObject = {
      campaignName: error ? null : name,
      campaignDescription: descriptionState.error ? null : descriptionState.description,
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

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      <Grid item xs={12}>
        <Paper>
          <Grid container direction="column" className={classes.root}>
            <Grid item xs={12}>

              {/* 광고 유형 선택 단계 */}
              <Collapse in={step >= 0}>
                <OptionPaper step={step} state={step1State} dispatch={step1Dispatch} />
              </Collapse>

              {/* 광고 유형 선택 단계 */}
              <Collapse in={step >= 1}>
                <ProrityPaper
                  step={step}
                  state={step2State}
                  dispatch={step2Dispatch}
                  checkedPriorityType={checkedPriorityType}
                  checkedPriorityTypeDispatch={checkedPriorityTypeDispatch}
                />
              </Collapse>

              {/* 캠페인 정보 입력 단계 */}
              <Collapse in={step === 2} timeout={{ enter: 800 }}>
                <CampaignFormPaper
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
                  descriptionState={descriptionState}
                  descriptionDispatch={descriptionDispatch}
                  step={step}
                />
              </Collapse>

              {/* 뒤로, 다음(완료) 버튼셋 */}
              <GridItem>
                <GridContainer direction="row-reverse" item>
                  <ButtonSet
                    handleNext={step === 2 ? handleCallbackSubmit : handleNext}
                    handleBack={handleBack}
                    collapseOpen={Boolean(1)}
                  />
                </GridContainer>
              </GridItem>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CampaignCreation;
