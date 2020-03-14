import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CampaignNaming from './sub/CampaignNaming';
import CampaignBannerReg from './sub/BannerReg';
import LandingUrlInput from './sub/LandingUrlInput';
import CampaignBudgetSet from './sub/BudgetSet';
import CampaignTimeSet from './sub/TermSet';
// import KeywordInput from './KeywordInput';
import TimeSelectorSet from './sub/TimeSet';
import BannerUploadDialog from './sub/BannerUploadDialog';
import LandingUrlInventoryDialog from './sub/LandingUrlDialog';
import useDialog from '../../../../utils/hooks/useDialog';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import CampaignCreateStepLayout from './sub/StepLayout';
import {
  Step3Interface,
  BudgetInterface,
  Action,
  TermInterface,
  TimeInterface,
  TimeAction,
  NameInterface
} from '../../../../pages/mypage/marketer/campaignReducer';


const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

interface propInterface {
  optionType: string;
  state: Step3Interface;
  dispatch: React.Dispatch<Action>;
  budgetState: BudgetInterface;
  budgetDispatch: React.Dispatch<Action>;
  termState: TermInterface;
  termDispatch: React.Dispatch<Action>;
  timeState: TimeInterface;
  timeDispatch: React.Dispatch<TimeAction>;
  nameState: NameInterface;
  nameDispatch: React.Dispatch<Action>;
  step: number;
}

const CampaignCreateTable = (props: propInterface) => {
  const classes = useStyles();
  const {
    state, dispatch, budgetState, budgetDispatch, termState, termDispatch, timeState, timeDispatch,
    optionType, step,
    nameState, nameDispatch
  } = props;

  const IS_CAMPAIGN_CREATE_PAGE = true; // 캠페인생성 페이지 구분을 위한 변수
  const landingUrlData = useGetRequest('/marketer/landing-url/list');
  const bannerData = useGetRequest('/marketer/banner/list/active');

  const uploadDialog = useDialog();
  const landingUrlInventoryDialog = useDialog();

  const inputsteps: {
    title: string;
    component: JSX.Element;
  }[] | any[] = [
      {
        title: '캠페인 이름 입력',
        component: (
          <CampaignNaming
            nameState={nameState}
            nameDispatch={nameDispatch}
          />
        )
      },
      {
        title: '배너 선택',
        component: (
          <CampaignBannerReg
            bannerData={bannerData}
            dispatch={dispatch}
            handleDialogOpen={uploadDialog.handleOpen}
            step={step}
          />
        )
      }, // check 완료
      (optionType !== 'option0')
      && {
        title: '랜딩페이지 URL',
        component: (
          <LandingUrlInput
            dispatch={dispatch}
            state={state}
            handleDialogOpen={landingUrlInventoryDialog.handleOpen}
          />
        )
      }, // react-hooks-form 사용.

      // {
      //   title: '키워드 입력',
      //   component: (
      //     <KeywordInput
      //       dispatch={dispatch}
      //       state={state}
      //     />
      //   )
      // },
      {
        title: '예산설정',
        component: (
          <CampaignBudgetSet
            state={budgetState}
            dispatch={budgetDispatch}
          />
        )
      },
      {
        title: '기간 설정',
        component: (
          <CampaignTimeSet
            dispatch={termDispatch}
            state={termState}
          />
        )
      },
      {
        title: '시간대 설정',
        component: (
          <TimeSelectorSet
            state={timeState}
            dispatch={timeDispatch}
          />
        )
      },
    ];


  return (
    <CampaignCreateStepLayout
      primaryText="셋째,&nbsp;&nbsp; 캠페인 정보 입력"
      secondaryText="캠페인의 세부 정보를 입력해주세요."
    >
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            {inputsteps.map((_step: {
              title: string;
              component: JSX.Element;
            }) => (
                <StyledTableRow key={_step.title}>
                  <StyledTableCell>
                    {_step.title}
                  </StyledTableCell>
                  <StyledTableCell>
                    {_step.component}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* 배너 생성 다이얼로그 */}
      <BannerUploadDialog
        open={uploadDialog.open}
        onClose={uploadDialog.handleClose}
        isCampaignPage={IS_CAMPAIGN_CREATE_PAGE}
        recallRequest={bannerData.doGetRequest} // 배너 데이터 재요청
      />

      {/* 랜딩페이지URL 생성 다이얼로그 */}
      <LandingUrlInventoryDialog
        open={landingUrlInventoryDialog.open}
        onClose={landingUrlInventoryDialog.handleClose}
        landingUrlData={landingUrlData}
        dispatch={dispatch}
      />
    </CampaignCreateStepLayout>
  );
};


/**
 * @description
 해당 캠페인의 입력값을 저장하는 컴포넌트
 모든 state에 대한 초기값 및 reducer는 campaignReducer.js 내부에 저장.

 * @param {*} state ? bannerId를 저장하는 object
 * @param {*} dispatch ? bannerId를 변경하는 func
 * @param {*} budgetState ? budget을 저장하는 object
 * @param {*} budgetDispatch ? budget을 변경하는 func
 * @param {*} termState ? 기간을 저장하는 object
 * @param {*} termDispatch ? 기간을 변경하는 func
 * @param {*} timeState ? 시간대를 저장하는 object
 * @param {*} timeDispatch ? 시간대를 변경하는 func
 * @param {*} nameState ? 이름를 저장하는 object
 * @param {*} nameDispatch ? 이름를 변경하는 func
 * @param {*} optionType ? 송출옵션에 대한 state, 배너광고의 경우 랜딩페이지 입력을 제거하기 위한 용도
 * @param {*} step ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */


export default CampaignCreateTable;
