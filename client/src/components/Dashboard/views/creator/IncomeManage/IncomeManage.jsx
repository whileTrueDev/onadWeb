
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// react plugin for creating charts
import { Line } from 'react-chartjs-2';

// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// } from 'recharts';

// @material-ui/icons
import AccessTime from '@material-ui/icons/AccessTime';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountDialog from './AccountDialog';
// core components
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import CardAvatar from '../../../components/Card/CardAvatar';
// data
import setChartjsData from '../../../variables/charts';
// styles
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

// data Fetch hooks
function useFetchData(url) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url);
      if (res.data.length !== 0) {
        setPayload(res.data);
      } else {
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError('데이터가 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [url]);

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

function useWithdrawModal() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleWithdrawModalOpen() {
    setModalOpen(true);
  }

  function handleWithdrawModalClose() {
    setModalOpen(false);
  }

  return { modalOpen, handleWithdrawModalOpen, handleWithdrawModalClose };
}


function Income(props) {
  const { classes, session, history } = props;
  // 날짜 범위 데이터
  const { value, handleChange } = useSelectValue();
  // data 요청
  const { payload, loading, error } = useFetchData('/dashboard/creator/chartdata', value);
  // 날짜 범위 칸의 크기를 동적으로 하기위한 훅
  const { inputLabel, labelWidth } = useInputWidth();
  // 수익금 데이터
  const incomeData = useFetchData('/dashboard/creator/income');
  // 수익금 출금 모달창
  const {
    modalOpen,
    handleWithdrawModalOpen,
    handleWithdrawModalClose,
  } = useWithdrawModal();
  // 출금신청 스낵바
  const { withdrawalSnack, handleClose, handleSnackOpen } = useWithdrawalSnack();
  // 계좌 입력 다이얼로그
  const { accountDialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

  return (
    <GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card chart>
            <CardHeader color="success">
              {loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!loading && error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!loading && payload
          && (
          <Line
            data={setChartjsData(payload.labels, payload.totalIncomeData)}
            options={{ tooltips: { mode: 'index', intersect: false } }}
          />
          )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle} style={{ textAlign: 'left' }}>나의 수익금</h4>

            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
            updated:
                {' '}
                {Date()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#avatar" onClick={e => e.preventDefault()}>
                <img src={session.creatorLogo} alt="creator" />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h5 className={classes.cardCategory} style={{ marginBottom: 30 }}>크리에이터</h5>
              <h4 className={classes.cardTitle}>{session.creatorDisplayName}</h4>
              <p className={classes.description}>
                {`Don't be scared of the truth because we need to restart the
              human foundation in truth And I love you like Kanye loves Kanye
              I love Rick Owens’ bed design but the back is...`}
              </p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer style={{ position: 'relative', top: -70 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                출금 신청 내역
              </h4>
              <p className={classes.cardCategoryWhite}>
                지금껏의 출금 신청 내역을 확인하세요.
              </p>
            </CardHeader>

          </Card>
        </GridItem>
      </GridContainer>

      {/* 출금 신청 팝업 */}
      {!incomeData.loading && incomeData.payload.creatorAccountNumber
      && (
      <WithdrawlModal
        open={modalOpen}
        handleOpen={handleWithdrawModalOpen}
        handleClose={handleWithdrawModalClose}
        accountNumber={incomeData.payload.creatorAccountNumber}
        receivable={incomeData.payload.creatorReceivable}
        handleSnackOpen={handleSnackOpen}
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

      {/* 출금 신청 완료 시의 notification */}
      <Snackbar
        place="bc"
        color="success"
        message="출금신청이 완료되었어요!! 입금에는 1일 ~ 2일정도 걸려요."
        open={withdrawalSnack}
        close
        closeNotification={handleClose}
      />
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
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(Income);
