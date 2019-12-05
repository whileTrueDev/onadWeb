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

export default function ReportTabs(props) {
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
        label="통합분석"
        classes={{
          wrapper: classes.wrapper
        }}
      />
      <Tab
        className={classes.tab}
        label="배너광고"
        classes={{
          wrapper: classes.wrapper,
          labelIcon: classes.labelIcon
        }}
      />
      <Tab
        className={classes.tab}
        label="클릭광고"
        classes={{
          wrapper: classes.wrapper
        }}
      />
    </Tabs>
  );
}
