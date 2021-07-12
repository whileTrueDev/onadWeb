import { Button, Chip, makeStyles, Paper, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import { useDialog } from '../../../../../utils/hooks';
import { useMarketerSalesIncome } from '../../../../../utils/hooks/query/useMarketerSalesIncome';
import { useMarketerSettlement } from '../../../../../utils/hooks/query/useMarketerSettlement';
import renderMarketerSettlementState, {
  광고주_정산등록상태_승인,
} from '../../../../../utils/render_funcs/renderMarketerSettlementState';
import SettlementRegDialog from '../../shared/settlement/SettlementRegDialog';
import SettlementViewer from '../../shared/settlement/SettlementViewer';

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
  bottomSpace: { marginBottom: theme.spacing(1) },
  topSpace: { marginTop: theme.spacing(2) },
}));

export default function MySalesIncome(): JSX.Element {
  const classes = useStyles();

  // CPS 판매 광고 대금 정보 조회
  const salesIncomeData = useMarketerSalesIncome();
  // 판매대금 출금정산을 위한 정산 등록 정보 조회
  const settlement = useMarketerSettlement();

  const settlementDialog = useDialog();

  const salesIncome = useMemo(() => {
    if (!salesIncomeData.data) return 0;
    return salesIncomeData.data.receivable + salesIncomeData.data.receivableDeliveryFee;
  }, [salesIncomeData.data]);

  return (
    <Paper className={classes.root}>
      {salesIncomeData.isLoading && <CircularProgress />}
      {!salesIncomeData.isLoading && !salesIncomeData.error && !salesIncomeData.data && (
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
      {!salesIncomeData.isLoading && salesIncomeData.data && (
        <div className={classes.bottomSpace}>
          <Typography style={{ fontWeight: 'bold' }}>보유 판매 대금</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>
            {`${salesIncome.toLocaleString()} 원`}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {`상품 판매 ${salesIncomeData.data.receivable.toLocaleString()} 원 + 배송비 ${salesIncomeData.data.receivableDeliveryFee.toLocaleString()} 원`}
          </Typography>
          {!salesIncomeData.isLoading && !salesIncomeData.error && salesIncomeData.data && (
            <Typography variant="caption" color="textSecondary">
              {`최근 판매 대금 변동: ${dayjs(salesIncomeData.data.createDate).fromNow()}`}
            </Typography>
          )}
        </div>
      )}
      {!settlement.isLoading && (
        <div className={classes.bottomSpace}>
          <Typography component="div">
            {'정산등록상태: '}
            {!settlement.data ? (
              <Chip label="미등록" size="small" />
            ) : (
              <Chip
                label={renderMarketerSettlementState(settlement.data.state)}
                size="small"
                color={settlement.data.state === 광고주_정산등록상태_승인 ? 'primary' : 'default'}
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
          {settlement.data ? '계좌 및 정산정보 수정' : '계좌 및 정산 등록'}
        </Button>
      </div>

      {settlement.data && <SettlementViewer settlement={settlement.data} />}

      <SettlementRegDialog open={settlementDialog.open} onClose={settlementDialog.handleClose} />
    </Paper>
  );
}
