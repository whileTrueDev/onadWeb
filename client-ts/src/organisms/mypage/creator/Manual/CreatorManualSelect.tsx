import {
  makeStyles, Paper, Tab, Tabs
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tabs: { padding: theme.spacing(2, 0, 0), borderBottom: `2px solid ${theme.palette.divider}` },
  container: { padding: theme.spacing(2) },
}));

export default function CreatorManualSelect(): JSX.Element {
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState<number>(0);

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number): void {
    setTabValue(newValue);
  }

  return (
    <Paper>
      <Tabs
        className={classes.tabs}
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        variant="fullWidth"
      >
        <Tab label="1" />
        <Tab label="2" />
        <Tab label="3" />
        <Tab label="4" />
        <Tab label="5" />
      </Tabs>

      <div className={classes.container}>
        hi
      </div>
    </Paper>
  );
}
