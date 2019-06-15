import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Payment from '@material-ui/icons/Payment';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import Warning from '@material-ui/icons/Warning';
import Table from '../../../components/Table/Table';
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import Button from '../../../components/CustomButtons/Button';
import CardIcon from '../../../components/Card/CardIcon';
import Snackbar from '../../../components/Snackbar/Snackbar';
import CashModal from './CashModal';
import ReturnCashModal from './ReturnCashModal';
import AccountDialog from './AccountDialog';
// styles
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
// variable
import { defaultCashData } from '../../../variables/marketerCashlist';

function useCashModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);

  function handleCashModalOpen() {
    setModalOpen(true);
  }

  function handleCashModalOpen2() {
    setModalOpen2(true);
  }

  function handleCashModalClose() {
    setModalOpen(false);
  }

  function handleCashModalClose2() {
    setModalOpen2(false);
  }

  return {
    modalOpen,
    modalOpen2,
    handleCashModalOpen,
    handleCashModalClose,
    handleCashModalOpen2,
    handleCashModalClose2,
  };
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


const CashManage = (props) => {
  const { classes, history } = props;

  // 수익금 출금 모달창
  const {
    modalOpen,
    modalOpen2,
    handleCashModalOpen,
    handleCashModalOpen2,
    handleCashModalClose,
    handleCashModalClose2,
  } = useCashModal();

  // 계좌 입력 다이얼로그
  const { accountDialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

  // 마케터 계좌 데이터
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    axios.get('/dashboard/marketer/accountNumber')
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          if (res.data) {
            setAccountNumber(res.data);
          } else { setAccountNumber(''); }
        }
      }).catch((res) => {
        console.log(res);
        setAccountNumber('');
      });
  }, []);

  // 광고캐시 데이터
  const [cash, setCash] = useState('');

  // 광고캐시 DB값 요
  useEffect(() => {
    axios.get('/dashboard/marketer/cash')
      .then((res) => {
        if (res.data) {
          if (res.data) {
            setCash(res.data);
          } else { setCash(''); }
        }
      }).catch((res) => {
        console.log(res); // 오류처리 요망
        setCash('');
      });
  }, []);

  // 광고캐시 충전,환불 데이터
  const [cashlist, setcashlist] = useState(defaultCashData);

  // 충전 및 환불 DB값 요
  useEffect(() => {
    axios.get('/dashboard/marketer/cashlist')
      .then((res) => {
        if (res.data) {
          if (res.data) {
            setcashlist(res.data);
          } else { setcashlist(defaultCashData); }
        }
      }).catch((res) => {
        console.log(res);
        setcashlist(defaultCashData);
      });
  }, []);

  // 충전 및 환불 페이지네이션
  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(3); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, cashlist.length - page * rowsPerPage,
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
        {/* 광고캐시 충전  START */}
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="rose">
              <h4 className={classes.cardTitleWhite}>
                  광고캐시 충전 하시겠어요?
              </h4>
              <p className={classes.cardCategoryWhite}>
                  간단하게 진행해보세요!
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.buttonWrapper}>
                <Button
                  color="info"
                  round
                  onClick={handleCashModalOpen}
                >
                  <Payment />
                  {'캐시충전'}
                </Button>
              </div>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <span>추후 도입 기능입니다.</span>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        {/* 광고캐쉬 신청 팝업 */}
        <CashModal
          open={modalOpen}
          history={history}
          handleOpen={handleCashModalOpen}
          handleClose={handleCashModalClose}
          chargeCash={cash.marketerDebit}
        />

        {/* 보유 광고캐시 START */}
        <GridItem xs={12} sm={12} md={4} style={{ position: 'relative', top: 70 }}>
          <Card>
            <CardHeader color="rose" stats icon>
              <CardIcon color="rose">
                <AttachMoney />
              </CardIcon>
              <p className={classes.cardCategory} style={{ position: 'relative', top: 10 }}>보유 광고캐시</p>
              <h3 className={classes.cardTitle} style={{ position: 'relative', top: 10 }}>
                {`${cash.marketerDebit}`}
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                <span>{`Updated : ${cash.date}`}</span>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        {/* 광고캐시 환불  START */}
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="rose">
              <h4 className={classes.cardTitleWhite}>
                  광고캐시 환불 하시겠어요?
              </h4>
              <p className={classes.cardCategoryWhite}>
                  간단하게 진행해보세요!
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.buttonWrapper}>
                <Button
                  color="danger"
                  round
                  onClick={handleCashModalOpen2}
                  disabled={!accountNumber.marketerAccountNumber}
                >
                  <Payment />
                  {'캐시환불'}
                </Button>
              </div>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <span>추후 도입 기능입니다.</span>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        {/* 환불 신청 팝업 */}
        {accountNumber.marketerAccountNumber && (
          <ReturnCashModal
            open={modalOpen2}
            history={history}
            handleOpen={handleCashModalOpen2}
            handleClose={handleCashModalClose2}
            accountNumber={accountNumber.marketerAccountNumber}
            chargeCash={cash.marketerDebit}
          />
        )}
      </GridContainer>


      {/* 충전 및 환불 내역 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose">
              <h4 className={classes.cardTitleWhite}>
                캐시 충전 및 환불내역
              </h4>
              <p className={classes.cardCategoryWhite}>
                지금껏의 충전 및 환불내역을 확인하세요.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={cashlist.columns}
                tableData={cashlist.data}
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

      {/* 계좌 입력 안했을 시 링크 문구 notification창 */}
      { !accountNumber.marketerAccountNumber
        && (
        <Snackbar
          place="bl"
          color="danger"
          icon={Warning}
          message="아직 계좌정보를 입력하지 않았어요.. 계좌정보 입력 이후 환불신청하세요!"
          open={!accountNumber.marketerAccountNumber}
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
};

CashManage.propTypes = {
  classes: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(CashManage);
