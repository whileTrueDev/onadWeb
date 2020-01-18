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
import RefundDialog from './RefundDialog';
import CashUsageList from './CashUsageList';
// hooks
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import useDialog from '../../../../utils/lib/hooks/useDialog';

function MyCash(props) {
  const chargeDialog = useDialog();
  const refundDialog = useDialog();
  const cashData = useFetchData('/api/dashboard/marketer/cash');

  const { classes, accountData, userData } = props;
  const POPUP_WIDTH = process.env.NODE_ENV === 'production'? 900 : 700; 
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production'? 800 : 700; 
  const POPUP_X = process.env.NODE_ENV === 'production' ? (window.screen.width/2) - 450: (window.screen.width/2) - 350;
  const POPUP_Y = process.env.NODE_ENV === 'production' ? (window.screen.height/2) - 400: (window.screen.height/2) - 350;
  // front HOST
  const FRONT_HOST = process.env.NODE_ENV === 'production' ? 'https://onad.io' : 'http://localhost:3001';

  return(
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
            && <Button color="info" onClick={() => { window.open(`${FRONT_HOST}/marketer/charge`, "_blank", `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${POPUP_X}, top=${POPUP_Y}`) }}>캐시충전(전자결제)</Button>
          }
          {!userData.loading && !userData.error
            && <Button color="info" onClick={() => { chargeDialog.handleOpen(); }}>캐시충전(무통장)</Button>
          }
           
          {!accountData.loading && !accountData.error
              && !accountData.payload.accountNumber ? (
                <Tooltip title="환불계좌가 등록되지 않아 진행이 불가합니다.">
                  <span><Button color="danger" disabled>환불요청</Button></span>
                </Tooltip>
            ) : (
              <Button color="danger" onClick={() => { refundDialog.handleOpen(); }}>
                  환불요청
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

      {!accountData.loading
      && !accountData.error
      && accountData.payload.accountNumber
      && !cashData.loading
      && !accountData.error && (
        <RefundDialog
          open={refundDialog.open}
          handleClose={refundDialog.handleClose}
          accountNumber={accountData.payload.accountNumber}
          accountHolder={accountData.payload.accountHolder}
          currentCash={cashData.payload.cashAmount}
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
