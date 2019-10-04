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
// core components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '../../atoms/Progress/CircularProgress';
// custum cores
import axios from '../../utils/axios';
import Table from '../../atoms/Table/Table';
import GridItem from '../../atoms/Grid/GridItem';
import GridContainer from '../../atoms/Grid/GridContainer';
import Card from '../../atoms/Card/Card';
import CardHeader from '../../atoms/Card/CardHeader';
import CardBody from '../../atoms/Card/CardBody';
import CardFooter from '../../atoms/Card/CardFooter';
import CardAvatar from '../../atoms/Card/CardAvatar';
import Button from '../../atoms/CustomButtons/Button';
import CardIcon from '../../atoms/Card/CardIcon';
import WarningTypo from '../../atoms/Typography/Warning';
import InfoTypo from '../../atoms/Typography/Info';
import Snackbar from '../../atoms/Snackbar/Snackbar';
import WithdrawalDialog from '../../organisms/creator/IncomeManage/WithdrawDialog';
import AccountDialog from '../../organisms/creator/IncomeManage/AccountDialog';
import DashboardStyle from '../../assets/jss/onad/views/dashboardStyle';
import HOST from '../../utils/config';
import setTimeFormat from '../../utils/lib/setTimeFormat';
import history from '../../history';

// data
const chartTheme = {
  first: [
    '#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc',
    '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dc8c67', '#dcaf67',
    '#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc',
    '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dc8c67', '#dcaf67'],
  second: [
    '#67b7fe', '#6794fc', '#6771fc', '#8067fc', '#a367fc', '#c767fc',
    '#dc67ee', '#dc67cb', '#dc6799', '#dc6987', '#dc8c87', '#dcaf87',
    '#67b7fe', '#6794fc', '#6771fc', '#8067fc', '#a367fc', '#c767fc',
    '#dc67ee', '#dc67cb', '#dc6799', '#dc6987', '#dc8c87', '#dcaf87'],
};

function setChartjsData(labels, data, label = '수익금') {
  const ChartjsLineData = {
    labels,
    datasets: [
      {
        label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: '',
        borderColor: '#ddd',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: chartTheme.first,
        pointBackgroundColor: chartTheme.first,
        pointBorderWidth: 1,
        pointHoverRadius: 14,
        pointHoverBackgroundColor: chartTheme.second,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointRadius: 8,
        pointHitRadius: 10,
        data,
      },
    ],
  };

  return ChartjsLineData;
}
// styles

// variable
const defaultWithdrawalData = {
  columns: [
    '출금날짜',
    '출금금액',
    '출금상태',
  ],
  data:
   [['-',
     '-',
     '-']],
};

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
  const { classes } = props;
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
    axios.get(`${HOST}/api/dashboard/creator/withdrawal/list`)
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


  return (
    <div>
      <GridContainer>
        {/* 수익금 및 수익금 그래프 */}
        <GridItem xs={12} sm={12} md={12} lg={8} xl={6}>
          <GridContainer>
            {/* 지금껏 총 수익금 */}
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                {incomeData.loading && <CircularProgress />}
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
                {incomeData.loading && <CircularProgress />}
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
                  {loading && <CircularProgress />}
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
                    {`Updated: ${setTimeFormat()}`}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        {/* 아바타 및 출금신청 */}
        <GridItem xs={12} sm={12} md={4} lg={4} xl={2}>
          <GridContainer>
            {/* 크리에이터 아바타 */}
            <Hidden mdDown>
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
            </Hidden>
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
                        ? (<span className={classes.dangerText} style={{ fontSize: '12px' }}>계좌정보를 정확히 입력하셨나요?</span>)
                        : (<span className={classes.dangerText} style={{ fontSize: '12px' }}>계좌정보를 입력하셔야 출금이 가능해요!</span>)
                      }
                    </div>
                  </Tooltip>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        {/* 출금내역 */}
        <GridItem xs={12} sm={12} md={8} lg={12} xl={8}>
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
        icon
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
};

export default withStyles(DashboardStyle)(Income);
