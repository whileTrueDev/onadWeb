import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// own components
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import ExpansionPannel from '../../../../atoms/ExpansionPannel/ExpansionPannel';
import Button from '../../../../atoms/CustomButtons/Button';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import CardIcon from '../../../../atoms/Card/CardIcon';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import CashChargeDialog from './CashChargeDialog';
import TestChargeDialog from './TestChargeDialog';
import RefundDialog from './RefundDialog';
import CashUsageList from './CashUsageList';
// hooks
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import useDialog from '../../../../utils/lib/hooks/useDialog';

function MyCash(props) {
  const chargeDialog = useDialog();
  const refundDialog = useDialog();
  const testChargeDialog = useDialog();
  const cashData = useFetchData('/api/dashboard/marketer/cash');
  const marketerProfileData = useFetchData('/api/dashboard/marketer/profile');
  
  const { classes, accountData, userData } = props;

  return (
    <Card>
      <CardHeader color="blueGray" stats icon>
        <CardIcon color="blueGray">
          <AttachMoney />
        </CardIcon>
        {/* 충전, 환불버튼 */}
        <div style={{
          display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', padding: 5
        }}
        >
          {!userData.loading && !userData.error
            && userData.payload.marketerId === 'admin' ? (
              <Button color="info" onClick={() => { testChargeDialog.handleOpen(); }}>전자결제충전</Button>
            ) : (
              null
            )}
          
          <Button color="info" onClick={() => { chargeDialog.handleOpen(); }}>충전</Button>
          {!accountData.loading && !accountData.error
              && !accountData.payload.accountNumber ? (
                <Tooltip title="환불계좌가 등록되지 않아 진행이 불가합니다.">
                  <span><Button color="danger" disabled>환불</Button></span>
                </Tooltip>
            ) : (
              <Button color="danger" onClick={() => { refundDialog.handleOpen(); }}>
                  환불
              </Button>
            )}
        </div>

      </CardHeader>

      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography gutterBottom variant="body1">보유 광고캐시</Typography>
        </div>
        {cashData.loading && (<CircularProgress small />)}
        {!cashData.loading && !cashData.error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <Typography gutterBottom variant="h5">
              {`${cashData.payload.cashAmount} 원`}
            </Typography>
          </div>
        )}
        <div className={classes.stats} style={{ display: 'flex', justifyContent: 'center' }}>
          {!cashData.loading && !cashData.error && cashData.payload.date
            && (
              <div>
                <DateRange />
                <span>{`업데이트 : ${cashData.payload.date}`}</span>
              </div>
            )}
        </div>


        <ExpansionPannel title="상세 캐시 소진내역 보기">
          <CashUsageList />
        </ExpansionPannel>


      </CardBody>

      {/* Dialogs */}
      {!cashData.loading && !cashData.error && (
        <CashChargeDialog
          open={chargeDialog.open}
          handleClose={chargeDialog.handleClose}
          currentCash={cashData.payload.cashAmount}
        />
      )}

      {/* 결제 테스트를 위한 다이얼로그 Start*/}
      {!cashData.loading && !cashData.error && (
        <TestChargeDialog
          open={testChargeDialog.open}
          handleClose={testChargeDialog.handleClose}
          currentCash={cashData.payload.cashAmount}
          marketerProfileData={marketerProfileData}
        />
      )}
      {/* 결제 테스트를 위한 다이얼로그 End*/}

      {!accountData.loading
      && !accountData.error
      && accountData.payload.accountNumber && (
        <RefundDialog
          open={refundDialog.open}
          handleClose={refundDialog.handleClose}
          accountNumber={accountData.payload.accountNumber}
          currentCash={!cashData.loading && !cashData.error
            ? cashData.payload.cashAmount : 0}
        />
      )}

    </Card>
  );
}

MyCash.propTypes = {
  classes: PropTypes.object.isRequired,
  accountData: PropTypes.object
};

MyCash.defaultProps = {
  accountData: { payload: null, loading: true, error: '' }
};

export default withStyles(DashboardStyle)(MyCash);
