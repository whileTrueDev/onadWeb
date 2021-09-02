// own components
import { Button, makeStyles, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CenterLoading from '../../../../../atoms/loading/centerLoading';
import Table from '../../../../../atoms/table/table';
import { useMarketerAccount } from '../../../../../utils/hooks/query/useMarketerAccount';
import { useMarketerCashRefundHistory } from '../../../../../utils/hooks/query/useMarketerCashRefundHistory';
// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import AccountRegistDialog from '../accountRegistDialog';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
}));

const initialData = {
  columns: ['날짜', '환불금액', '진행상황'],
  data: [['-', '-', '-']],
};

function RefundAccountForm(): JSX.Element {
  const classes = useStyles();

  const account = useMarketerAccount();

  const { open, handleOpen, handleClose } = useDialog();

  // 환불 목록 데이터
  const refundHistory = useMarketerCashRefundHistory();
  return (
    <Paper className={classes.root}>
      {account.isLoading && <CenterLoading />}

      {!account.isLoading && !account.error && account.data && (
        <>
          <Typography style={{ fontWeight: 'bold' }}>광고 캐시 환불 계좌 정보</Typography>
          {!account.isLoading && account.data && account.data.marketerAccountNumber ? (
            <div>
              <Typography gutterBottom variant="body1">
                계좌번호 : {account.data.marketerAccountNumber}
              </Typography>
              <Typography gutterBottom variant="body1">
                예금주 : {account.data.accountHolder}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={(): void => {
                  handleOpen();
                }}
              >
                환불계좌 변경
              </Button>
            </div>
          ) : (
            <div>
              <div>
                <Typography gutterBottom variant="body2">
                  아직 등록된 환불계좌가 없습니다.
                </Typography>
                <Typography gutterBottom variant="body2">
                  등록 버튼을 눌러 환불계좌를 등록해주세요.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={(): void => {
                    handleOpen();
                  }}
                >
                  환불계좌 등록
                </Button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <Typography style={{ fontWeight: 'bold' }}>환불 처리 내역</Typography>
            <div>
              <Table
                rowPerPage={3}
                tableHead={initialData.columns}
                tableData={
                  refundHistory.isLoading || !refundHistory.data
                    ? initialData.data
                    : refundHistory.data.data
                }
                pagination
              />
            </div>
          </div>

          <AccountRegistDialog open={open} handleDialogClose={handleClose} />
        </>
      )}
    </Paper>
  );
}

export default RefundAccountForm;
