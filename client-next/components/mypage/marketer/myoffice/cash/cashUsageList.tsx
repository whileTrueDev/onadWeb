// custom
import { Paper, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useState } from 'react';
import CenterLoading from '../../../../../atoms/loading/centerLoading';
import CashUsageTable from '../../../../../atoms/table/cashUsageTable';
import { useMarketerCashUsageHistory } from '../../../../../utils/hooks/query/useMarketerCashUsageHistory';
// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import CashUsageDialog from './cashUsageDialog';

const initialData = {
  columns: ['집행 날짜', '집행 금액', '상세보기'],
  data: [['-', '-']],
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
}));

export default function CashUsageList(): JSX.Element {
  const classes = useStyles();

  const usage = useMarketerCashUsageHistory();

  const detailDialog = useDialog();

  const [selected, setSelected] = useState<number>();
  function handleSelected(index: number): void {
    setSelected(index);
    detailDialog.handleOpen();
  }
  return (
    <Paper className={classes.root}>
      {usage.isLoading && <CenterLoading />}
      {!usage.isLoading && !usage.error && usage.data && (
        <>
          <Typography style={{ fontWeight: 'bold' }}>캐시 사용 내역</Typography>

          <CashUsageTable
            tableHead={initialData.columns}
            tableData={usage.data.data}
            handleDialogOpen={handleSelected}
            detailButton
          />
        </>
      )}

      {!usage.isLoading && usage.data && (
        <div>
          {detailDialog.open && selected !== undefined && (
            <CashUsageDialog
              open={detailDialog.open}
              handleClose={detailDialog.handleClose}
              data={usage.data.data[selected]}
            />
          )}
        </div>
      )}
    </Paper>
  );
}
