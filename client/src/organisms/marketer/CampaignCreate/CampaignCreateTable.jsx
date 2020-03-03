import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CampaignNaming from './CampaignNaming';
import CampaignBannerReg from './CampaignBannerReg';
import LandingUrlInput from './LandingUrlInput';
import CampaignBudgetSet from './CampaignBudgetSet';
import CampaignTimeSet from './CampaignTimeSet';
// import KeywordInput from './KeywordInput';
import TimeSelectorSet from './TimeSelectorSet';
import BannerUploadDialog from '../Inventory/UploadDialog';
import LandingUrlInventoryDialog from './LandingUrlInventoryDialog';
import useDialog from '../../../utils/lib/hooks/useDialog';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';
import useTestData from '../../../utils/lib/hooks/useTestData';

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

const CampaignCreateTable = (props) => {
  const classes = useStyles();
  const {
    state, dispatch, budgetState, budgetDispatch, termState, termDispatch, timeState, timeDispatch,
    optionType, step,
    nameState, nameDispatch
  } = props;

  const IS_CAMPAIGN_CREATE_PAGE = true; // 캠페인생성 페이지 구분을 위한 변수
  // const landingUrlData = useFetchData('/api/dashboard/marketer/inventory/landingurl/all');
  const landingUrlData = useTestData('/marketer/landing-url/list');


  // const bannerData = useFetchData('/api/dashboard/marketer/banner/registered');
  const bannerData = useTestData('/marketer/banner/list/active');


  const uploadDialog = useDialog();
  const landingUrlInventoryDialog = useDialog();

  const inputsteps = [
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
            {inputsteps.map(_step => (
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
        recallRequest={bannerData.callUrl} // 배너 데이터 재요청
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
CampaignCreateTable.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  budgetState: PropTypes.object.isRequired,
  budgetDispatch: PropTypes.func.isRequired,
  termState: PropTypes.object.isRequired,
  termDispatch: PropTypes.func.isRequired,
  timeState: PropTypes.object.isRequired,
  timeDispatch: PropTypes.func.isRequired,
  nameState: PropTypes.object.isRequired,
  nameDispatch: PropTypes.func.isRequired,
  optionType: PropTypes.string.isRequired,
  step: PropTypes.number.isRequired
};

export default CampaignCreateTable;
