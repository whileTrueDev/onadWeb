import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from '@material-ui/core';
import InputName from './CampaignFormComponents/InputName';
import SelectBanner from './CampaignFormComponents/SelectBanner';
import SelectLandingUrl from './CampaignFormComponents/SelectLandingUrl';
import InputDescription from './CampaignFormComponents/InputDescription';
import SelectBudget from './CampaignFormComponents/SelectBudget';
import SelectDateTerm from './CampaignFormComponents/SelectDateTerm';
import SelectTime from './CampaignFormComponents/SelectTime';

import BannerUploadDialog from '../shared/BannerUploadDialog';
import UrlUploadDialog from '../shared/UrlUploadDialog';
import CampaignCreateStepLayout from './shared/StepLayout';
import ButtonSet from './shared/ButtonSet';

import useDialog from '../../../../utils/hooks/useDialog';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import { CampaignCreateAction, CampaignCreateInterface } from './reducers/campaignCreate.reducer';
import SelectMerchandise from './CampaignFormComponents/SelectMerchandise';
import MerchandiseUploadDialog from '../shared/MerchandiseUploadDialog';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: { fontSize: 14, },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  tableContainer: { marginBottom: theme.spacing(2) },
  table: { },
}));

interface CampaignFormPaperProps {
  nameInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
  descriptionInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
  budgetInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
  step: number;
  optionType: string;
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function CampaignFormPaper({
  nameInputRef,
  descriptionInputRef,
  budgetInputRef,
  state,
  dispatch,
  optionType,
  step,
  handleBack,
}: CampaignFormPaperProps): JSX.Element {
  const classes = useStyles();

  const landingUrlData = useGetRequest('/marketer/landing-url/list');
  const bannerData = useGetRequest('/marketer/banner/list/active');
  const merchandiseData = useGetRequest('/marketer/merchandises', { onlyNotConnected: true });

  const bannerUploadDialog = useDialog();
  const landingUrlUploadDialog = useDialog();
  const merchandiseUploadDialog = useDialog();

  const inputsteps: Array<{ title: string; component: JSX.Element } | false> = [
    {
      title: '캠페인 이름 입력',
      component: <InputName nameInputRef={nameInputRef} />
    },
    {
      title: '송출 배너 선택',
      component: (
        <SelectBanner
          bannerData={bannerData}
          dispatch={dispatch}
          handleDialogOpen={bannerUploadDialog.handleOpen}
          step={step}
        />
      )
    },
    (optionType === 'option1') && {
      title: '랜딩페이지 URL 선택',
      component: (
        <SelectLandingUrl
          state={state}
          dispatch={dispatch}
          handleDialogOpen={landingUrlUploadDialog.handleOpen}
          landingUrlData={landingUrlData}
        />
      )
    },
    (optionType === 'option3') && {
      title: '판매 상품 선택',
      component: (
        <SelectMerchandise
          state={state}
          dispatch={dispatch}
          handleDialogOpen={merchandiseUploadDialog.handleOpen}
          merchandiseData={merchandiseData}
        />
      )
    },
    {
      title: '홍보 문구 입력',
      component: <InputDescription descriptionInputRef={descriptionInputRef} />
    },
    (optionType === 'option1') && {
      title: '일예산 설정',
      component: <SelectBudget budgetInputRef={budgetInputRef} />
    },
    {
      title: '송출 기간 설정',
      component: <SelectDateTerm state={state} dispatch={dispatch} />
    },
    {
      title: '송출 시간 설정',
      component: <SelectTime state={state} dispatch={dispatch} />
    },
  ];

  return (
    <CampaignCreateStepLayout
      primaryText="셋째,&nbsp;&nbsp; 캠페인 정보 입력"
      secondaryText="캠페인의 세부 정보를 입력해주세요."
    >
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="campaign-create-form-table">
          <TableBody>
            {inputsteps.map((_step: false | { title: string; component: JSX.Element }) => (
              <React.Fragment key={_step ? _step.title : 'campaign-create-no-landing-url'}>
                {_step ? (
                  <StyledTableRow>
                    <StyledTableCell style={{ width: 300 }}>
                      <Typography variant="h6" style={{ fontWeight: 700 }}>{_step.title}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      {_step.component}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : null}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ButtonSet
        type="submit"
        handleBack={handleBack}
        nextButtonOpen
        disabled={state.loading}
      />

      {/* 배너 생성 다이얼로그 */}
      <BannerUploadDialog
        open={bannerUploadDialog.open}
        onClose={bannerUploadDialog.handleClose}
        recallRequest={bannerData.doGetRequest} // 배너 데이터 재요청
      />

      {/* 랜딩페이지URL 생성 다이얼로그 */}
      <UrlUploadDialog
        open={landingUrlUploadDialog.open}
        handleClose={landingUrlUploadDialog.handleClose}
        recallRequest={landingUrlData.doGetRequest}
      />

      {/* 상품 생성 다이얼로그 */}
      <MerchandiseUploadDialog
        open={merchandiseUploadDialog.open}
        onClose={merchandiseUploadDialog.handleClose}
        onSuccess={merchandiseData.doGetRequest}
      />
    </CampaignCreateStepLayout>
  );
}


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


export default CampaignFormPaper;
