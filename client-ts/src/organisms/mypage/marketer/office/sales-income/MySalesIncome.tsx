import { Button, Chip, makeStyles, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import { useDialog } from '../../../../../utils/hooks';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import renderMarketerSettlementState, {
  광고주_정산등록상태_승인,
} from '../../../../../utils/render_funcs/renderMarketerSettlementState';
import SettlementRegDialog from '../../shared/settlement/SettlementRegDialog';
import SettlementViewer from '../../shared/settlement/SettlementViewer';
import { MarketerSalesIncome, MarketerSettlement } from '../interface';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
  bottomSpace: { marginBottom: theme.spacing(1) },
  topSpace: { marginTop: theme.spacing(2) },
}));

export type SalesIncomeSettlement = Array<string>;
export interface MySalesIncomeProps {
  salesIncomeData: UseGetRequestObject<MarketerSalesIncome>;
  settlementData: UseGetRequestObject<MarketerSettlement>;
}
export default function MySalesIncome({
  salesIncomeData,
  settlementData,
}: MySalesIncomeProps): JSX.Element {
  const classes = useStyles();

  const settlementDialog = useDialog();

  const salesIncome = useMemo(() => {
    if (!salesIncomeData.data) return 0;
    return salesIncomeData.data.receivable + salesIncomeData.data.receivableDeliveryFee;
  }, [salesIncomeData.data]);

  return (
    <Paper className={classes.root}>
      {salesIncomeData.loading && <CircularProgress />}
      {!salesIncomeData.loading && !salesIncomeData.error && !salesIncomeData.data && (
        <div className={classes.bottomSpace}>
          <div className={classes.bottomSpace}>
            <Typography variant="body2">아직 판매대금이 없습니다.</Typography>
            <Typography variant="body2">
              판매형 광고를 진행하고, 판매대금을 확보한 뒤, 출금하세요.
            </Typography>
          </div>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.button}
            to="/mypage/marketer/campaigncreate"
            component={Link}
          >
            캠페인 생성하러 가기
          </Button>
        </div>
      )}
      {!salesIncomeData.loading && salesIncomeData.data && (
        <div className={classes.bottomSpace}>
          <Typography style={{ fontWeight: 'bold' }}>보유 판매 대금</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>
            {`${salesIncome.toLocaleString()} 원`}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {`상품 판매 ${salesIncomeData.data.receivable.toLocaleString()} 원 + 배송비 ${salesIncomeData.data.receivableDeliveryFee.toLocaleString()} 원`}
          </Typography>
          {!salesIncomeData.loading && !salesIncomeData.error && salesIncomeData.data && (
            <Typography variant="caption" color="textSecondary">
              {`최근 판매 대금 변동: ${moment(salesIncomeData.data.createDate).fromNow()}`}
            </Typography>
          )}
        </div>
      )}
      {!settlementData.loading && (
        <div className={classes.bottomSpace}>
          <Typography component="div">
            {'정산등록상태: '}
            {!settlementData.data ? (
              <Chip label="미등록" size="small" />
            ) : (
              <Chip
                label={renderMarketerSettlementState(settlementData.data.state)}
                size="small"
                color={
                  settlementData.data.state === 광고주_정산등록상태_승인 ? 'primary' : 'default'
                }
              />
            )}
          </Typography>
        </div>
      )}

      <div>
        <Button
          className={classes.button}
          size="small"
          variant="outlined"
          color="primary"
          onClick={settlementDialog.handleOpen}
        >
          {settlementData.data ? '계좌 및 정산정보 수정' : '계좌 및 정산 등록'}
        </Button>
      </div>

      {settlementData.data && <SettlementViewer settlement={settlementData.data} />}

      <SettlementRegDialog
        open={settlementDialog.open}
        onClose={settlementDialog.handleClose}
        settlementData={settlementData}
      />
    </Paper>
  );
}
