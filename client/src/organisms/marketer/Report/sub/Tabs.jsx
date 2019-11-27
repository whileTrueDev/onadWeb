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
    minWidth: 0
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
        label="Total"
        classes={{
          wrapper: classes.wrapper
        }}
      />
      <Tab
        className={classes.tab}
        label="CPM"
        classes={{
          wrapper: classes.wrapper,
          labelIcon: classes.labelIcon
        }}
      />
      <Tab
        className={classes.tab}
        label="CPC"
        classes={{
          wrapper: classes.wrapper
        }}
      />
    </Tabs>
  );
}
