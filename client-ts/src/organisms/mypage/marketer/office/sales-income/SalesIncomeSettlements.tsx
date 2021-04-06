import {
  CircularProgress, makeStyles, Paper, Typography
} from '@material-ui/core';
import React from 'react';
import MarketerSettlementLogsTable from '../../../../../atoms/Table/MarketerSettlementLogsTable';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
  bottomSpace: { marginBottom: theme.spacing(1) },
}));

export type SalesIncomeSettlement = Array<string>

interface SalesIncomeSettlementsProps {
  salesIncomeSettlementData: UseGetRequestObject<SalesIncomeSettlement[]>;
}

export default function SalesIncomeSettlements({
  salesIncomeSettlementData,
}: SalesIncomeSettlementsProps): React.ReactElement {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      {salesIncomeSettlementData.loading && (<CircularProgress />)}
      {!salesIncomeSettlementData.loading && !salesIncomeSettlementData.error
      && salesIncomeSettlementData.data && (
        <>
          <Typography style={{ fontWeight: 'bold' }}>판매 대금 정산 처리 목록</Typography>

          <MarketerSettlementLogsTable
            tableHead={['날짜', '금액']}
            tableData={salesIncomeSettlementData.data}
          />
        </>
      )}
    </Paper>
  );
}
