import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// react plugin for creating charts
import { Line } from 'react-chartjs-2';
// @material-ui/icons
import AccessTime from '@material-ui/icons/AccessTime';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Check from '@material-ui/icons/Check';
import Money from '@material-ui/icons/Money';
import Warning from '@material-ui/icons/Warning';
import Payment from '@material-ui/icons/Payment';
import CircularProgress from '@material-ui/core/CircularProgress';
// core components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import axios from '../../../../../utils/axios';
// custum cores
import Table from '../../../components/Table/Table';
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import CardAvatar from '../../../components/Card/CardAvatar';
import Button from '../../../components/CustomButtons/Button';
import CardIcon from '../../../components/Card/CardIcon';
import WarningTypo from '../../../components/Typography/Warning';
import InfoTypo from '../../../components/Typography/Info';
import Snackbar from '../../../components/Snackbar/Snackbar';
import WithdrawalDialog from './WithdrawDialog';
import AccountDialog from './AccountDialog';
// data
import setChartjsData from '../../../variables/charts';
// styles
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
// variable
import { defaultWithdrawalData } from '../../../variables/creatorWithdrawal';
import HOST from '../../../../../config';


DashboardStyle.select = {
  marginTop: 5,
  // float: 'right',
};

DashboardStyle.buttonWrapper = {
  textAlign: 'center',
  marginTop: 35,
  marginBottom: 30,
};

// data Fetch hooks
function useFetchData(url, dateRange) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url, {
        params: { dateRange },
      });
      if (res.data.length !== 0) {
        setPayload(res.data);
      } else {
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError(`데이터가 없습니다.${url}`);
    } finally {
      setLoading(false);
    }
  }, [url, dateRange]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

function useDialog() {
  const [accountDialogOpen, setDialogOpen] = useState(false);

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }
  return { accountDialogOpen, handleDialogOpen, handleDialogClose };
}

function useInputWidth() {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return { inputLabel, labelWidth };
}

function useSelectValue() {
  const [value, setValue] = React.useState(7);

  function handleChange(event) {
    setValue(event.target.value);
  }
  return { value, handleChange };
}

function useWithdrawDialog() {
  const [DialogOpen, setDialogOpen] = useState(false);

  function handleWithdrawDialogOpen() {
    setDialogOpen(true);
  }

  function handleWithdrawDialogClose() {
    setDialogOpen(false);
  }

  return { DialogOpen, handleWithdrawDialogOpen, handleWithdrawDialogClose };
}

function Income(props) {
  const { classes, history } = props;
  // 날짜 범위 데이터
  const { value, handleChange } = useSelectValue();

  // data 요청
  const { payload, loading, error } = useFetchData(`${HOST}/api/dashboard/creator/chartdata`, value);

  // 수익금 데이터
  const incomeData = useFetchData(`${HOST}/api/dashboard/creator/income`);

  // 수익금 출금 모달창
  const {
    DialogOpen,
    handleWithdrawDialogOpen,
    handleWithdrawDialogClose,
  } = useWithdrawDialog();

  // 계좌 입력 다이얼로그
  const { accountDialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

  // 출금내역 데이터
  const [WithdrawalData, setWithdrawalData] = useState(defaultWithdrawalData);

  // 날짜 범위 칸의 크기를 동적으로 하기위한 훅
  const { inputLabel, labelWidth } = useInputWidth();

  // 출금리스트 데이터 axios 요청
  useEffect(() => {
    axios.get(`${HOST}/api/dashboard/creator/listOfWithdrawal`)
      .then((res) => {
        if (res.data) {
          setWithdrawalData(res.data);
        } else {
          setWithdrawalData(defaultWithdrawalData);
        }
      }).catch((res) => {
        console.log(res); // 오류처리 요망
        setWithdrawalData(defaultWithdrawalData);
      });
  }, []);


  const [session, setSession] = useState({});
  useEffect(() => {
    // Banner 데이터 axios 요청
    axios.get(`${HOST}/api/dashboard/checkUserType`)
      .then((res) => {
        if (res.data) {
          setSession(res.data);
        }
      }).catch((err) => {
        console.log(err); // 오류처리 요망
      });
  }, []);

  // 출금신청 페이지네이션
  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(7); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, WithdrawalData.length - page * rowsPerPage,
  );

  // page handler
  function handleChangeTablePage(event, newPage) {
    setPage(newPage);
  }
  // page per row handler
  function handleChangeTableRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  return (
    <div>
      <GridContainer>
        {/* 수익금 및 수익금 그래프 */}
        <GridItem xs={12} sm={12} md={8}>
          <GridContainer>
            {/* 지금껏 총 수익금 */}
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                {incomeData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
                {!incomeData.loading && incomeData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
                {!incomeData.loading && incomeData.payload
                  && (
                    <CardHeader color="blueGray" stats icon>
                      <CardIcon color="blueGray">
                        <AttachMoney />
                      </CardIcon>
                      <p className={classes.cardCategory}>지금껏 총 수익금</p>
                      <h3 className={classes.cardTitle}>
                        {`${incomeData.payload.creatorTotalIncome} `}
                        <small>원</small>
                      </h3>
                    </CardHeader>
                  )}
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    {!incomeData.loading && incomeData.payload
                  && <span>{`Updated : ${incomeData.payload.date}`}</span>
                  }
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            {/* 출금 가능 수익금 */}
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                {incomeData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
                {!incomeData.loading && incomeData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
                {!incomeData.loading && incomeData.payload
                  && (
                    <CardHeader color="blueGray" stats icon>
                      <CardIcon color="blueGray">
                        <Check />
                      </CardIcon>
                      <p className={classes.cardCategory}>출금가능한 수익금</p>
                      <h3 className={classes.cardTitle}>
                        {`${incomeData.payload.creatorReceivable} `}
                        <small>원</small>
                      </h3>
                    </CardHeader>
                  )}
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Money />
                    <InfoTypo>출금 신청 버튼</InfoTypo>
                    {' 으로 출금신청하세요!'}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            {/* 총 수익금 그래프 */}
            <GridItem xs={12} sm={12} md={12}>
              <Card chart>
                <CardHeader color="blueGray">
                  <h4
                    className={classes.cardTitleWhite}
                  >
                  나의 총 수익금
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    지금껏의 수익금을 보여줍니다.
                  </p>
                </CardHeader>
                <CardBody>
                  <FormControl variant="outlined" className={classes.select}>
                    <InputLabel ref={inputLabel} htmlFor="selectDateRange">
                  범위
                    </InputLabel>
                    <Select
                      onChange={handleChange}
                      input={(
                        <OutlinedInput
                          labelWidth={labelWidth}
                          name="dateRange"
                          id="selectDateRange"
                          value={value}
                        />
                      )}
                    >
                      <MenuItem value={7}>최근 7 일</MenuItem>
                      <MenuItem value={14}>최근 14 일</MenuItem>
                      <MenuItem value={30}>최근 30 일</MenuItem>
                    </Select>
                  </FormControl>
                  {loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
                  {!loading && error && <span>최근 수익금 내역이 존재하지 않습니다.</span>}
                  {!loading && payload
                && (
                <Line
                  data={setChartjsData(payload.labels, payload.totalIncomeData)}
                  options={{ tooltips: { mode: 'index', intersect: false } }}
                />
                )}
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime />
                    {`updated: ${Date()}`}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        {/* 아바타 및 출금신청 */}
        <GridItem xs={12} sm={12} md={4}>
          <GridContainer>
            {/* 크리에이터 아바타 */}
            <GridItem xs={12} sm={12} md={12}>
              <Card profile>
                <CardAvatar profile>
                  <a href="#avatar" onClick={e => e.preventDefault()}>
                    <img src={session.creatorLogo} alt="creator" />
                  </a>
                </CardAvatar>
                <CardBody profile>
                  <h5 className={classes.cardCategory}>크리에이터</h5>
                  <h4 className={classes.cardTitle}>{session.creatorDisplayName}</h4>
                </CardBody>
              </Card>
            </GridItem>
            {/* 크리에이터 출금 신청 */}
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="blueGray">
                  <h4 className={classes.cardTitleWhite}>
                  출금 신청하시겠어요?
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                  간단하게 진행해보세요!
                  </p>
                </CardHeader>
                <CardBody>
                  <div className={classes.buttonWrapper}>
                    {!incomeData.loading && incomeData.payload
                  && (
                  <Button
                    color="info"
                    round
                    onClick={handleWithdrawDialogOpen}
                    disabled={!incomeData.payload.creatorAccountNumber}
                  >
                    <Payment />
                    {'출금신청'}
                  </Button>
                  )}
                  </div>
                </CardBody>
                <CardFooter stats>
                  <Tooltip title="만일 그렇지 않다면 계정 관리탭에서 계좌 정보를 수정하세요!" placement="bottom-start">
                    <div className={classes.stats}>
                      <WarningTypo><Warning /></WarningTypo>
                      {!incomeData.loading && incomeData.payload
                        ? (<span className={classes.dangerText}>계좌정보를 정확히 입력하셨나요?</span>)
                        : (<span className={classes.dangerText}>계좌정보를 입력하셔야 출금이 가능해요!</span>)
                      }
                    </div>
                  </Tooltip>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

      {/* 출금내역 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>
                출금 신청 내역
              </h4>
              <p className={classes.cardCategoryWhite}>
                지금껏의 출금 신청 내역을 확인하세요.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="danger"
                tableHead={WithdrawalData.columns}
                tableData={WithdrawalData.data}
                pagination
                handleChangeTablePage={handleChangeTablePage}
                handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
                emptyRows={emptyRows}
                rowsPerPage={rowsPerPage}
                page={page}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      {/* 출금 신청 팝업 */}
      {!incomeData.loading && incomeData.payload.creatorAccountNumber
      && (
      <WithdrawalDialog
        open={DialogOpen}
        history={history}
        handleOpen={handleWithdrawDialogOpen}
        handleClose={handleWithdrawDialogClose}
        accountNumber={incomeData.payload.creatorAccountNumber}
        receivable={incomeData.payload.creatorReceivable}
      />
      )}

      {/* 계좌 입력 안했을 시 링크 문구 notification창 */}
      {!incomeData.loading && incomeData.payload
      && (
      <Snackbar
        place="bl"
        color="danger"
        icon={Warning}
        message="아직 계좌정보를 입력하지 않았어요.. 계좌정보 입력 이후 출금신청하세요!"
        open={!incomeData.payload.creatorAccountNumber}
        Link={
          // 계좌정보 입력 팝업
          <Button color="warning" onClick={handleDialogOpen}>계좌입력하기</Button>
        }
      />
      )}

      {/* 계좌입력 다이얼로그 */}

      <AccountDialog
        open={accountDialogOpen}
        history={history}
        handleDialogClose={handleDialogClose}
      />
    </div>
  );
}

Income.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(Income);
