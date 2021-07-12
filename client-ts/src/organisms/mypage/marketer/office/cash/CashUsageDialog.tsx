import { CircularProgress, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import Table from '../../../../../atoms/Table/CashUsageTable';
import { useMarketerCashUsageHistoryMonth } from '../../../../../utils/hooks/query/useMarketerCashUsageHistoryMonth';

const initialData = {
  data: [['-', '-', '-']],
};

const useStyles = makeStyles(() => ({
  flex: { display: 'flex', alignItems: 'center' },
}));

interface CashUsageDialogProps {
  open: boolean;
  handleClose: () => void;
  data: string[];
}

export default function CashUsageDialog(props: CashUsageDialogProps): JSX.Element {
  const classes = useStyles();
  const { open, handleClose, data } = props;

  const usagePerMonthData = useMarketerCashUsageHistoryMonth(data[0]); // data[0] = "00년 00월"

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={`${data[0]} 상세보기`} // data[0] = "00년 00월"
      maxWidth="sm"
      fullWidth
    >
      <div>
        <div className={classes.flex}>
          <Typography variant="body1" gutterBottom>
            집행 금액:&emsp;
          </Typography>
          {/* data[1] = 해당 월의 총 광고 집행 금액 */}
          <Typography variant="h6" gutterBottom>{`${data[1]} 원`}</Typography>
        </div>

        {usagePerMonthData.isLoading && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        )}
        {!usagePerMonthData.isLoading && usagePerMonthData.data && (
          <div className={classes.flex}>
            {usagePerMonthData.data.metaData.map(meta => (
              <div key={`month_data_${meta.type}${meta.cash}`} className={classes.flex}>
                <Typography variant="body1" gutterBottom>
                  &emsp;
                  {`${meta.type}: `}
                </Typography>
                <Typography variant="h6" gutterBottom>{` ${meta.cash} 원`}</Typography>
              </div>
            ))}
          </div>
        )}
        {!usagePerMonthData.isLoading && usagePerMonthData.data && (
          <Table
            // tableHeaderColor="info"
            tableHead={['집행 날짜', '집행 금액', '광고 타입']}
            tableData={usagePerMonthData.isLoading ? initialData.data : usagePerMonthData.data.data}
            perMonth
          />
        )}
      </div>
    </Dialog>
  );
}
