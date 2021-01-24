import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
// custom
import { Paper, Typography } from '@material-ui/core';
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import CashUsageTable from '../../../../../atoms/Table/CashUsageTable';
import CashUsageDialog from './CashUsageDialog';
// import HOST from '../../../../../../config';
// import axios from '../../../../../../utils/axios';
// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';

const initialData = {
  columns: ['집행 날짜', '집행 금액', '상세보기'],
  data: [
    ['-', '-'],
  ],
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
}));

export interface UsageInterface { data: string[][] }
export interface CashUsageListProps {
  usageData: UseGetRequestObject<UsageInterface | null>;
}
export default function CashUsageList({
  usageData,
}: CashUsageListProps): JSX.Element {
  const classes = useStyles();
  const detailDialog = useDialog();

  const [selected, setSelected] = useState<number>();
  function handleSelected(index: number): void {
    setSelected(index);
    detailDialog.handleOpen();
  }
  return (
    <Paper className={classes.root}>
      {usageData.loading && (<CircularProgress small />)}
      {!usageData.loading && !usageData.error && usageData.data && (
        <>
          <Typography style={{ fontWeight: 'bold' }}>캐시 사용 내역</Typography>

          <CashUsageTable
            tableHead={initialData.columns}
            tableData={usageData.data.data}
            handleDialogOpen={handleSelected}
            detailButton
          />

        </>
      )}

      {!usageData.loading && usageData.data && (
        <div>
          {detailDialog.open && selected !== undefined && (
            <CashUsageDialog
              open={detailDialog.open}
              handleClose={detailDialog.handleClose}
              data={usageData.data.data[selected]}
            />
          )}
        </div>
      )}
    </Paper>
  );
}
