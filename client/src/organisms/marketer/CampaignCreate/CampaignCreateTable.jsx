import React from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
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
import BudgetInput from './BudgetInput';
import CampaignTimeSet from './CampaignTimeSet';
import DatePicker from './DatePicker';
import KeywordInput from './KeywordInput';
import TimeSelector from './TimeSelector';
import TimeSelectorSet from './TimeSelectorSet';
import BannerUploadDialog from '../Inventory/UploadDialog';
import LandingUrlInventoryDialog from './LandingUrlInventoryDialog';
import useDialog from '../../../utils/lib/hooks/useDialog';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';

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
    handleDetailOpen, detailOpen, step1State,
    state, dispatch, handleDateOpen, dateOpen, setCheckName, checkName,
    budgetError, setBudgetError, checkState, setCheckState
  } = props;
  const [timeSelectorOpen, setTimeSelectorOpen] = React.useState(false);
  const IS_CAMPAIGN_CREATE_PAGE = true; // 캠페인생성 페이지 구분을 위한 변수
  const landingUrlData = useFetchData('/api/dashboard/marketer/inventory/landingurl/all');
  const bannerData = useFetchData('/api/dashboard/marketer/banner/registered');

  const uploadDialog = useDialog();
  const landingUrlInventoryDialog = useDialog();

  const handleTimeSelectorOpen = () => {
    setTimeSelectorOpen(!timeSelectorOpen);
  };
  return (
    <CampaignCreateStepLayout
      primaryText="셋째,&nbsp;&nbsp; 캠페인 정보 입력"
      secondaryText="캠페인의 세부 정보를 입력해주세요."
    >
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>
              캠페인 이름 입력
              </StyledTableCell>
              <StyledTableCell>
                <CampaignNaming
                  dispatch={dispatch}
                  setCheckName={setCheckName}
                  checkName={checkName}
                />
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
              배너 선택
              </StyledTableCell>
              <StyledTableCell>
                <CampaignBannerReg
                  bannerData={bannerData}
                  dispatch={dispatch}
                  handleDialogOpen={uploadDialog.handleOpen}
                />
              </StyledTableCell>
            </StyledTableRow>
            {step1State.option !== 'option0' ? (
              <StyledTableRow>
                <TableCell>
              랜딩페이지 URL
                </TableCell>
                <StyledTableCell>
                  <LandingUrlInput
                    dispatch={dispatch}
                    state={state}
                    handleDialogOpen={landingUrlInventoryDialog.handleOpen}
                  />

                </StyledTableCell>
              </StyledTableRow>
            ) : null }
            <StyledTableRow>
              <TableCell>
              키워드 입력
              </TableCell>
              <TableCell>
                <KeywordInput
                  dispatch={dispatch}
                  state={state}
                />
              </TableCell>
            </StyledTableRow>

            <StyledTableRow>
              <TableCell>
              예산설정
              </TableCell>
              <StyledTableCell>
                <CampaignBudgetSet
                  handleDetailOpen={handleDetailOpen}
                  detailOpen={detailOpen}
                />
                {detailOpen
                  ? (
                    <BudgetInput
                      state={state}
                      dispatch={dispatch}
                      budgetError={budgetError}
                      setBudgetError={setBudgetError}
                    />
                  ) : null
              }
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <TableCell>
              기간 설정
              </TableCell>
              <StyledTableCell>
                <CampaignTimeSet
                  handleDateOpen={handleDateOpen}
                  dateOpen={dateOpen}
                />
                {dateOpen ? (
                  <DatePicker
                    dispatch={dispatch}
                    state={state}
                  />
                ) : null}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <TableCell>
              시간대 설정
              </TableCell>
              <StyledTableCell>
                <TimeSelectorSet
                  handleTimeSelectorOpen={handleTimeSelectorOpen}
                  timeSelectorOpen={timeSelectorOpen}
                />
                {timeSelectorOpen ? (
                  <TimeSelector
                    checkState={checkState}
                    setCheckState={setCheckState}
                  />
                ) : null}
              </StyledTableCell>
            </StyledTableRow>
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

export default CampaignCreateTable;
