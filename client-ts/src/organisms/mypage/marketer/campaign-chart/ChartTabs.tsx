import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(() => ({
  wrapper: {
    alignItems: 'start'
  },
  labelIcon: {
    display: 'flex'
  },
  tab: {
    minWidth: 0,
    fontSize: 17
  }
}));

interface propInterface {
  value: number;
  handleChange: (event: React.ChangeEvent<{}>, value: number) => void
}

export default function ReportTabs(props: propInterface) {
  const classes = useStyles();
  const { value, handleChange } = props;

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
      <Tab
        className={classes.tab}
        label="비용"
        classes={{
          wrapper: classes.wrapper
        }}
      />
      <Tab
        className={classes.tab}
        label="송출크리에이터"
        classes={{
          wrapper: classes.wrapper,
          labelIcon: classes.labelIcon
        }}
      />
    </Tabs>
  );
}
