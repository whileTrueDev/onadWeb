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
import {
  stepForInformationReducer, defaultState as step3DefaultState
} from '../../../organisms/mypage/marketer/campaign-create2/reducers/stepForInformation';
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

  // Step 3 Reducer
  const [step3State, step3Dispatch] = useReducer(stepForInformationReducer, step3DefaultState);

  // '뒤로' 버튼 핸들러
  const handleBack = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (step === 0) {
      history.push('/mypage/marketer/main');
      return;
    }
    step2Dispatch({ key: 'reset', value: '' });
    if (step === 2) {
      // step3Reset();
    }
    setStep(step - 1);
  };

  // '다음' 핸들러
  const handleNext = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setStep(step + 1);
  };

  // 3 번째 캠페인정보 입력 핸들러
  const nameInputRef = React.useRef<HTMLInputElement>();
  const descriptionInputRef = React.useRef<HTMLInputElement>();
  const budgetInputRef = React.useRef<HTMLInputElement>();
  const handleCallbackSubmit = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (nameInputRef && nameInputRef.current) {
      console.log(nameInputRef.current.value);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (nameInputRef && nameInputRef.current) {
      console.log(nameInputRef.current.value);
    }
  };

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      <Grid item xs={12}>
        <Paper>
          <form onSubmit={handleSubmit}>
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
                    nameInputRef={nameInputRef}
                    descriptionInputRef={descriptionInputRef}
                    budgetInputRef={budgetInputRef}
                    state={step3State}
                    dispatch={step3Dispatch}
                    optionType={step1State.option}
                    step={step}
                  />
                </Collapse>

                {/* 뒤로, 다음(완료) 버튼셋 */}
                <GridItem>
                  <GridContainer direction="row-reverse" item>
                    <ButtonSet
                      nextButtonName={step === 2 ? '완료' : undefined}
                      handleNext={step === 2 ? handleCallbackSubmit : handleNext}
                      handleBack={handleBack}
                      collapseOpen={Boolean(1)}
                    />
                    <input type="submit" value="캠페인 생성" />
                  </GridContainer>
                </GridItem>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CampaignCreation;
