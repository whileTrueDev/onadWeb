// own components
import { Button, makeStyles, Paper } from '@material-ui/core';
// core
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CenterLoading from '../../../../../atoms/Loading/CenterLoading';
import Table from '../../../../../atoms/Table/Table';
import { REACT_HOST } from '../../../../../config';
import { useMarketerAccount } from '../../../../../utils/hooks/query/useMarketerAccount';
import { useMarketerAd } from '../../../../../utils/hooks/query/useMarketerAd';
import { useMarketerCash } from '../../../../../utils/hooks/query/useMarketerCash';
import { useMarketerCashChargeHistory } from '../../../../../utils/hooks/query/useMarketerCashChargeHistory';
import useDialog from '../../../../../utils/hooks/useDialog';
import RefundDialog from '../refund/RefundDialog';
import CashChargeDialog from './CashChargeDialog';

dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
}));

function MyCash(): JSX.Element {
  const classes = useStyles();

  // 데이텨 요청 훅 사용
  const account = useMarketerAccount();
  const cash = useMarketerCash();
  const ad = useMarketerAd();
  const chargeHistory = useMarketerCashChargeHistory();

  const chargeDialog = useDialog();
  const refundDialog = useDialog();

  const POPUP_WIDTH = process.env.NODE_ENV === 'production' ? 900 : 700;
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production' ? 800 : 700;
  const POPUP_X =
    process.env.NODE_ENV === 'production'
      ? window.screen.width / 2 - 450
      : window.screen.width / 2 - 350;
  const POPUP_Y =
    process.env.NODE_ENV === 'production'
      ? window.screen.height / 2 - 400
      : window.screen.height / 2 - 350;

  return (
    <Paper className={classes.root}>
      {ad.isLoading && <CenterLoading />}
      {!ad.isLoading && !ad.error && ad.data && (
        <div>
          <Typography style={{ fontWeight: 'bold' }}>보유 광고 캐시</Typography>
          <Typography gutterBottom variant="h4" style={{ fontWeight: 'bold' }}>
            {`${ad.data.cashAmount.toLocaleString()} 원`}
            <Typography component="span" variant="body2" color="textSecondary">
              &nbsp;
              {`현재 총 소진 캐시: ${ad.data.spendAll.toLocaleString()} 원`}
            </Typography>
          </Typography>
          {!cash.isLoading && !cash.error && cash.data && (
            <Typography variant="caption" color="textSecondary">
              {`최근 캐시 변동: ${dayjs(cash.data.date).fromNow()}`}
            </Typography>
          )}

          {/* 충전, 환불버튼 */}
          <div>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.button}
              onClick={(): void => {
                window.open(
                  `${REACT_HOST}/marketer/charge`,
                  '_blank',
                  `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${POPUP_X}, top=${POPUP_Y}`,
                );
              }}
            >
              캐시충전(전자결제)
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.button}
              onClick={(): void => {
                chargeDialog.handleOpen();
              }}
            >
              캐시충전(무통장)
            </Button>

            {!account.isLoading &&
              !account.error &&
              account.data &&
              !account.data.marketerAccountNumber && (
                <Tooltip title="환불계좌가 등록되지 않아 진행이 불가합니다.">
                  <span>
                    <Button
                      size="medium"
                      variant="outlined"
                      color="default"
                      disabled
                      className={classes.button}
                    >
                      환불요청
                    </Button>
                  </span>
                </Tooltip>
              )}
            {!account.isLoading &&
              !account.error &&
              account.data &&
              account.data.marketerAccountNumber && (
                <Button
                  size="medium"
                  variant="outlined"
                  color="default"
                  className={classes.button}
                  onClick={(): void => {
                    refundDialog.handleOpen();
                  }}
                >
                  환불요청
                </Button>
              )}
          </div>

          <div style={{ marginTop: 16 }}>
            <Typography style={{ fontWeight: 'bold' }}>충전내역</Typography>
            <Table
              rowPerPage={3}
              tableHead={['날짜', '충전금액', '결제수단', '진행상황']}
              tableData={
                chargeHistory.isLoading || !chargeHistory.data ? [] : chargeHistory.data.data
              }
              pagination
            />
          </div>
        </div>
      )}

      {/* Dialogs */}
      {!cash.isLoading && cash.data && !cash.error && (
        <CashChargeDialog
          open={chargeDialog.open}
          handleClose={chargeDialog.handleClose}
          currentCash={cash.data.cashAmount}
        />
      )}

      {!account.isLoading &&
        !account.error &&
        account.data &&
        cash.data &&
        account.data.marketerAccountNumber &&
        !cash.isLoading &&
        !account.error && (
          <RefundDialog
            open={refundDialog.open}
            handleClose={refundDialog.handleClose}
            accountNumber={account.data.marketerAccountNumber}
            accountHolder={account.data.accountHolder}
            currentCash={cash.data.cashAmount}
          />
        )}
    </Paper>
  );
}

export default MyCash;
