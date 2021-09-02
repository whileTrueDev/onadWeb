import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import { useEffect } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';

import MonthlySettlement from './sub/monthlySettlement';
import SettlementByOrder from './sub/settlementByOrder';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  textfield: {
    width: 200,
  },
}));

export interface FilterValue {
  month?: string | null;
  year?: string | null;
  roundInMonth?: string | null;
}

export default function SalesIncomeSettlementLog(): React.ReactElement {
  const classes = useStyles();
  const router = useRouter();

  const [value, setValue] = React.useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (e: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
    if (newValue === 0) {
      router.push(router.pathname);
    }
  };

  useEffect(() => {
    if (router.query.settlementLogId) {
      setValue(1);
    }
  }, [router.query.settlementLogId]);

  return (
    <Paper className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary">
        <Tab label="월별 보기" />
        <Tab label="주문별 보기" />
      </Tabs>
      {value === 0 && <MonthlySettlement />}
      {value === 1 && <SettlementByOrder />}
    </Paper>
  );
}
