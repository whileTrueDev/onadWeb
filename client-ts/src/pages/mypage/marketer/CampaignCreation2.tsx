import React, { useReducer, MouseEvent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Paper, Collapse, useMediaQuery
} from '@material-ui/core';
// atoms
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
// organisms
import ProrityPaper from '../../../organisms/mypage/marketer/campaign-create2/PriorityPaper';
import OptionPaper from '../../../organisms/mypage/marketer/campaign-create2/OptionPaper';
import CampaignFormPaper from '../../../organisms/mypage/marketer/campaign-create2/CampaignFormPaper';
import {
  stepForInformationReducer, defaultState as step3DefaultState
} from '../../../organisms/mypage/marketer/campaign-create2/reducers/campaignCreate.reducer';
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

  // 전체적 state 리듀서
  const [campaignCreateState, campaignCreateDispatch] = useReducer(
    stepForInformationReducer, step3DefaultState
  );

  // '뒤로' 버튼 핸들러
  const handleBack = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (step === 0) {
      history.push('/mypage/marketer/main');
      return;
    }
    campaignCreateDispatch({ type: 'ALL_RESET', value: '' });
    setStep(step - 1);
  };

  // '다음' 핸들러
  const handleNext = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setStep(step + 1);
  };

  // 캠페인 생성은 Desktop only 이므로, Desktop 인지 불린값.
  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  // 3 번째 캠페인정보 입력 핸들러
  const nameInputRef = React.useRef<HTMLInputElement>();
  const descriptionInputRef = React.useRef<HTMLInputElement>();
  const budgetInputRef = React.useRef<HTMLInputElement>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Submit Clicked!');
    if (nameInputRef && nameInputRef.current) {
      console.log('nameInputRef: ', nameInputRef.current.value);
    }
    if (descriptionInputRef && descriptionInputRef.current) {
      console.log('descriptionInput: ', descriptionInputRef.current.value);
    }
    if (budgetInputRef && budgetInputRef.current) {
      console.log('budgetInputRef: ', budgetInputRef.current.value);
    }
    console.log(campaignCreateState);
    if (!campaignCreateState.selectedBannerId) {
      alert('캠페인의 배너가 선택되지 않았습니다. 송출할 배너를 선택해 주세요.');
      return;
    }
    if (!campaignCreateState.selectedLandingUrl) {
      alert('캠페인의 랜딩 페이지 URL이 선택되지 않았습니다.');
      return;
    }
    if (campaignCreateState.campaignTerm.finDate && (
      campaignCreateState.campaignTerm.finDate < campaignCreateState.campaignTerm.startDate)
    ) {
      alert('시작일은 종료일보다 빠를 수 없습니다.');
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
                  <OptionPaper
                    step={step}
                    state={campaignCreateState}
                    dispatch={campaignCreateDispatch}
                    handleBack={handleBack}
                    handleNext={handleNext}
                  />
                </Collapse>

                {/* 광고 유형 선택 단계 */}
                <Collapse in={step >= 1}>
                  <ProrityPaper
                    step={step}
                    state={campaignCreateState}
                    dispatch={campaignCreateDispatch}
                    handleBack={handleBack}
                    handleNext={handleNext}
                  />
                </Collapse>

                {/* 캠페인 정보 입력 단계 */}
                <Collapse in={step === 2} timeout={{ enter: 800 }}>
                  <CampaignFormPaper
                    step={step}
                    optionType={campaignCreateState.selectedOption}
                    nameInputRef={nameInputRef}
                    descriptionInputRef={descriptionInputRef}
                    budgetInputRef={budgetInputRef}
                    state={campaignCreateState}
                    dispatch={campaignCreateDispatch}
                  />
                </Collapse>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CampaignCreation;
