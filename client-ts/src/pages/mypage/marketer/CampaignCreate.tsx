import React, { useReducer, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Paper, Collapse, useMediaQuery, Button
} from '@material-ui/core';
// organisms
import ProrityPaper from '../../../organisms/mypage/marketer/campaign-create2/AdPriorityPaper';
import OptionPaper from '../../../organisms/mypage/marketer/campaign-create2/AdOptionPaper';
import CampaignFormPaper from '../../../organisms/mypage/marketer/campaign-create2/CampaignFormPaper';
import {
  CampaignCreateReducer, defaultState as step3DefaultState
} from '../../../organisms/mypage/marketer/campaign-create2/reducers/campaignCreate.reducer';
// others
import HOST from '../../../config';
import axios from '../../../utils/axios';
import history from '../../../history';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import { useDialog } from '../../../utils/hooks';
import parseParams from '../../../utils/parseParams';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';


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

const CampaignCreate = (): JSX.Element => {
  const classes = useStyles();

  // *****************************************************
  // url search parameter를 토대로 캠페인 생성 이후 보낼 redirect uri를 가져온다.
  const location = useLocation();
  const urlParams = parseParams(location.search);

  // *****************************************************
  // 캠페인 생성은 Desktop only 이므로, Desktop 인지 불린값.
  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  // *****************************************************
  // 진행 단계에 대한 스테이트 값.
  const [step, setStep] = React.useState(0);
  // 전체적 캠페인 생성 state 리듀서
  const [campaignCreateState, campaignCreateDispatch] = useReducer(
    CampaignCreateReducer, step3DefaultState
  );

  // *****************************************************
  // '뒤로' 버튼 핸들러
  const handleBack = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    // step 0의 경우 마이페이지 - 대시보드로 이동
    if (step === 0) {
      history.push('/mypage/marketer/main');
      return;
    }
    campaignCreateDispatch({ type: 'ALL_RESET', value: '' });
    setStep(step - 1);
  };

  // '다음' 버튼 핸들러
  const handleNext = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setStep(step + 1);
  };

  // *****************************************************
  const errorSnack = useDialog();

  // *****************************************************
  // 캠페인정보 - 이름, 홍보문구, 예산 ref
  const nameInputRef = React.useRef<HTMLInputElement>();
  const descriptionInputRef = React.useRef<HTMLInputElement>();
  const budgetInputRef = React.useRef<HTMLInputElement>();

  // *****************************************************
  // 캠페인 생성 요청 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // ***********************************************************
    // 필수 값 체크
    if (!campaignCreateState.selectedBannerId) {
      alert('캠페인의 배너가 선택되지 않았습니다. 송출할 배너를 선택해 주세요.');
      return;
    }
    if (campaignCreateState.selectedOption === 'option1' && !campaignCreateState.selectedLandingUrl) {
      alert('캠페인의 랜딩 페이지 URL이 선택되지 않았습니다. URL을 선택해 주세요.');
      return;
    }
    if (campaignCreateState.selectedOption === 'option3' && !campaignCreateState.selectedMerchandiseId) {
      alert('캠페인의 판매 상품이 선택되지 않았습니다. 상품을 선택해 주세요.');
    }
    if (campaignCreateState.campaignTerm.finDate && (
      campaignCreateState.campaignTerm.finDate < campaignCreateState.campaignTerm.startDate)
    ) {
      alert('시작일은 종료일보다 빠를 수 없습니다.');
    }
    // ***********************************************************
    // option, priority type 설정
    function typeToNum(type: string): string {
      const NUM = type.replace(/[^0-9]/g, '');
      return NUM;
    }
    const campaignCreateDTO: any = {
      optionType: typeToNum(campaignCreateState.selectedOption),
      // 아프리카 카테고리 선택형의 경우 type1-1이므로 11이 됨.
      // 하지만 "카테고리 선택형" 이라는 동일한 유형이므로 동일하게 처리되어야 함. => 1로 수정함.
      priorityType: campaignCreateState.selectedPriorityType === 'type1-1'
        ? '1-1' : typeToNum(campaignCreateState.selectedPriorityType),
    };
    // ***********************************************************
    // 필수 ref 값 설정
    if (nameInputRef && nameInputRef.current) {
      campaignCreateDTO.campaignName = nameInputRef.current.value;
    }
    if (descriptionInputRef && descriptionInputRef.current) {
      campaignCreateDTO.campaignDescription = descriptionInputRef.current.value;
    }
    // ***********************************************************
    // 옵셔널 ref 값 설정
    if (budgetInputRef && budgetInputRef.current) {
      campaignCreateDTO.dailyLimit = budgetInputRef.current.value;
    } else {
      campaignCreateDTO.dailyLimit = -1;
    }
    // ***********************************************************
    // 필수 state 값 설정
    campaignCreateDTO.bannerId = campaignCreateState.selectedBannerId;
    campaignCreateDTO.connectedLinkId = campaignCreateState.selectedLandingUrl;
    campaignCreateDTO.merchandiseId = campaignCreateState.selectedMerchandiseId;
    // ***********************************************************
    // optional state 값 설정
    if (campaignCreateState.selectedPriorityType === 'type0'
      && campaignCreateState.selectedCreators.length > 0) {
      campaignCreateDTO.priorityList = campaignCreateState.selectedCreators.map((c) => c.creatorId);
    }
    if ((campaignCreateState.selectedPriorityType === 'type1'
      && campaignCreateState.selectedGames.length > 0)
      || (campaignCreateState.selectedPriorityType === 'type1-1'
      && campaignCreateState.selectedGames.length > 0)) {
      campaignCreateDTO.priorityList = campaignCreateState.selectedGames;
    }
    if (campaignCreateState.selectedPriorityType === 'type2') {
      campaignCreateDTO.priorityList = ['무관'];
    }
    if (campaignCreateState.campaignTime.length > 0) {
      campaignCreateDTO.selectedTime = campaignCreateState.campaignTime
        .map((x) => Number(x))
        .sort();
    } else {
      campaignCreateDTO.selectedTime = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
      ];
    }
    if (campaignCreateState.campaignTerm.startDate) {
      campaignCreateDTO.startDate = campaignCreateState.campaignTerm.startDate;
      if (!campaignCreateState.campaignTerm.finDate) {
        campaignCreateDTO.finDate = null;
      } else {
        campaignCreateDTO.finDate = campaignCreateState.campaignTerm.finDate;
      }
    }
    campaignCreateDTO.keyword = ['', '', '']; // keyword추가후 수정

    campaignCreateDispatch({ type: 'LOADING_START', value: '' });
    axios.post(`${HOST}/marketer/campaign`, campaignCreateDTO)
      .then((res) => {
        campaignCreateDispatch({ type: 'LOADING_DONE', value: '' });
        if (res.data[0]) {
          alert(res.data[1]);
          if (urlParams && urlParams.to) history.push(`/mypage/marketer/${urlParams.to}`);
          else history.push('/mypage/marketer/main');
        } else {
          alert(res.data[1]);
        }
      })
      .catch((err) => {
        console.error(err);
        errorSnack.handleOpen();
      });
  };

  useMypageScrollToTop();
  return (
    <Grid container direction="row" spacing={2} wrap="wrap">

      {/* 요청 실패 스낵바 */}
      <Snackbar
        open={errorSnack.open}
        onClose={errorSnack.handleClose}
        color="error"
        message="캠페인 생성 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      />

      {isDesktop ? (
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
                      handleBack={handleBack}
                    />
                  </Collapse>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
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
          <Button variant="contained" color="primary" component={Link} to="/mypage/marketer/main">
            대시보드로 이동
          </Button>
        </div>
      )}
    </Grid>
  );
};

export default CampaignCreate;
