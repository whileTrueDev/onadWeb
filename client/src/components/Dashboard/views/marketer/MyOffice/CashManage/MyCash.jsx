import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// own components
import CircularProgress from '../../../../components/Progress/CircularProgress';
import Button from '../../../../components/CustomButtons/Button';
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';
import CardIcon from '../../../../components/Card/CardIcon';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import CashChargeDialog from './CashChargeDialog';
import RefundDialog from './RefundDialog';
// hooks
import useFetchData from '../../../../lib/hooks/useFetchData';
import useDialog from '../../../../lib/hooks/useDialog';

function MyCash(props) {
  const chargeDialog = useDialog();
  const refundDialog = useDialog();
  const cashData = useFetchData('/api/dashboard/marketer/cash');
  const { classes, accountData } = props;

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
          <Button color="info" onClick={chargeDialog.handleOpen}>충전</Button>
          {!accountData.loading && !accountData.error
              && !accountData.payload.accountNumber ? (
                <Tooltip title="환불계좌가 등록되지 않아 진행이 불가합니다.">
                  <span><Button color="danger" disabled>환불</Button></span>
                </Tooltip>
            ) : (
              <Button color="danger" onClick={refundDialog.handleOpen}>
                  환불
              </Button>
            )}
        </div>

      </CardHeader>

      <CardBody>
        <div>
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
            <DateRange />
            {!cashData.loading && !cashData.error
            && (<span>{`업데이트 : ${cashData.payload.date}`}</span>)}
          </div>
        </div>

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
