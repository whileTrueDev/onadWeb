import moment from 'moment';
import React, { useEffect, useState } from 'react';
// core
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// own components
import { Paper, Button, CircularProgress, makeStyles } from '@material-ui/core';

import CashChargeDialog from './CashChargeDialog';
import RefundDialog from '../refund/RefundDialog';
import Table from '../../../../../atoms/Table/Table';

import { CashInterface, AccountInterface } from '../interface';
// hooks
import useGetRequest, { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import useDialog from '../../../../../utils/hooks/useDialog';
import HOST, { REACT_HOST } from '../../../../../config';
import { AdInterface } from '../../dashboard/interfaces';
import axiosInstance from '../../../../../utils/axios';

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

interface MyCashProps {
  accountData: UseGetRequestObject<AccountInterface | null>;
  cashData: UseGetRequestObject<CashInterface | null>;
  adData: UseGetRequestObject<AdInterface | null>;
}

function MyCash(props: MyCashProps): JSX.Element {
  const classes = useStyles();
  const chargeDialog = useDialog();
  const refundDialog = useDialog();

  const { accountData, cashData, adData } = props;

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
  // front HOST

  const [vbankload, setVbankload] = useState<boolean>(false);

  const { data, loading } = useGetRequest<null, { data: string[][] }>(
    '/marketer/cash/history/charge',
  );

  useEffect(() => {
    axiosInstance.post<boolean[]>(`${HOST}/marketer/cash/vbank`).then(row => {
      setVbankload(row.data[0]);
    });
  }, [setVbankload, vbankload]);

  return (
    <Paper className={classes.root}>
      {adData.loading && <CircularProgress />}
      {!adData.loading && !adData.error && adData.data && (
        <div>
          <Typography style={{ fontWeight: 'bold' }}>보유 광고 캐시</Typography>
          <Typography gutterBottom variant="h4" style={{ fontWeight: 'bold' }}>
            {`${adData.data.cashAmount.toLocaleString()} 원`}
            <Typography component="span" variant="body2" color="textSecondary">
              &nbsp;
              {`현재 총 소진 캐시: ${adData.data.spendAll.toLocaleString()} 원`}
            </Typography>
          </Typography>
          {!cashData.loading && !cashData.error && cashData.data && (
            <Typography variant="caption" color="textSecondary">
              {`최근 캐시 변동: ${moment(cashData.data.date).fromNow()}`}
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

            {!accountData.loading &&
              !accountData.error &&
              accountData.data &&
              !accountData.data.marketerAccountNumber && (
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
            {!accountData.loading &&
              !accountData.error &&
              accountData.data &&
              accountData.data.marketerAccountNumber && (
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
              tableData={loading || !data ? [] : data.data}
              pagination
            />
          </div>
        </div>
      )}

      {/* Dialogs */}
      {!cashData.loading && cashData.data && !cashData.error && (
        <CashChargeDialog
          open={chargeDialog.open}
          handleClose={chargeDialog.handleClose}
          currentCash={cashData.data.cashAmount}
        />
      )}

      {!accountData.loading &&
        !accountData.error &&
        accountData.data &&
        cashData.data &&
        accountData.data.marketerAccountNumber &&
        !cashData.loading &&
        !accountData.error && (
          <RefundDialog
            open={refundDialog.open}
            handleClose={refundDialog.handleClose}
            accountNumber={accountData.data.marketerAccountNumber}
            accountHolder={accountData.data.accountHolder}
            currentCash={cashData.data.cashAmount}
          />
        )}
    </Paper>
  );
}

export default MyCash;
