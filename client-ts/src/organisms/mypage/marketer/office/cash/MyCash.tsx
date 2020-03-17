import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// own components
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import ExpansionPanel from '../../../../../atoms/ExpansionPanel/ExpansionPanel';
import Button from '../../../../../atoms/CustomButtons/Button';
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
import CardIcon from '../../../../../atoms/Card/CardIcon';
import DashboardStyle from '../../../../../assets/jss/views/dashboardStyle';

import CashChargeDialog from './CashChargeDialog';
import RefundDialog from '../refund/RefundDialog';
import CashUsageList from './CashUsageList';

import { cashInterface, userInterface, accountInterface } from '../interface';
// hooks
import useGetRequest, { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import useDialog from '../../../../../utils/hooks/useDialog';

interface propInterface {
  classes: any;
  accountData: UseGetRequestObject<accountInterface | null>
  userData: UseGetRequestObject<userInterface | null>
}

function MyCash(props: propInterface) {
  const chargeDialog = useDialog();
  const refundDialog = useDialog();
  const cashData = useGetRequest<null, cashInterface | null>('/marketer/cash');


  const { classes, accountData, userData } = props;

  const POPUP_WIDTH = process.env.NODE_ENV === 'production' ? 900 : 700;
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production' ? 800 : 700;
  const POPUP_X = process.env.NODE_ENV === 'production' ? (window.screen.width / 2) - 450 : (window.screen.width / 2) - 350;
  const POPUP_Y = process.env.NODE_ENV === 'production' ? (window.screen.height / 2) - 400 : (window.screen.height / 2) - 350;
  // front HOST
  const FRONT_HOST = process.env.NODE_ENV === 'production' ? 'https://onad.io' : 'http://localhost:3001';

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
            && <Button color="primary" onClick={() => { window.open(`${FRONT_HOST}/marketer/charge`, '_blank', `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${POPUP_X}, top=${POPUP_Y}`); }}>캐시충전(전자결제)</Button>}
          {!userData.loading && !userData.error
            && <Button color="primary" onClick={() => { chargeDialog.handleOpen(); }}>캐시충전(무통장)</Button>}

          {!accountData.loading && !accountData.error && accountData.data
            && !accountData.data.marketerAccountNumber && (
              <Tooltip title="환불계좌가 등록되지 않아 진행이 불가합니다.">
                <span><Button color="default" disabled>환불요청</Button></span>
              </Tooltip>
            )}
          {!accountData.loading && !accountData.error && accountData.data
            && accountData.data.marketerAccountNumber && (
              <Button color="default" onClick={() => { refundDialog.handleOpen(); }}>
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
        {!cashData.loading && !cashData.error && cashData.data && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <Typography gutterBottom variant="h5">
              {`${cashData.data.cashAmount} 원`}
            </Typography>
          </div>
        )}
        <div className={classes.stats} style={{ display: 'flex', justifyContent: 'center' }}>
          {!cashData.loading && !cashData.error && cashData.data && cashData.data.date
            && (
              <div>
                <DateRange />
                <span>{`업데이트 : ${cashData.data.date}`}</span>
              </div>
            )}
        </div>


        <ExpansionPanel title="상세 캐시 소진내역 보기">
          <CashUsageList />
        </ExpansionPanel>


      </CardBody>

      {/* Dialogs */}
      {!cashData.loading && cashData.data && !cashData.error && (
        <CashChargeDialog
          open={chargeDialog.open}
          handleClose={chargeDialog.handleClose}
          currentCash={cashData.data.cashAmount}
        />
      )}

      {!accountData.loading
        && !accountData.error
        && accountData.data
        && cashData.data
        && accountData.data.marketerAccountNumber
        && !cashData.loading
        && !accountData.error && (
          <RefundDialog
            open={refundDialog.open}
            handleClose={refundDialog.handleClose}
            accountNumber={accountData.data.marketerAccountNumber}
            accountHolder={accountData.data.accountHolder}
            currentCash={cashData.data.cashAmount}
          />
        )}

    </Card>
  );
}

export default withStyles(DashboardStyle)(MyCash);
