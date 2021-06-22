import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import parseParams from '../../../../../utils/parseParams';
import MonthlySettlement from './sub/MonthlySettlement';
import SettlementByOrder from './sub/SettlementByOrder';

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
  const history = useHistory();

  const [value, setValue] = React.useState<number>(0);
  const handleChange = (e: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
    if (newValue === 0) {
      history.push(history.location.pathname);
    }
  };

  const params = useMemo(() => parseParams(history.location.search), [history.location.search]);
  useEffect(() => {
    if (params.settlementLogId) {
      setValue(1);
    }
  }, [params.settlementLogId]);

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
