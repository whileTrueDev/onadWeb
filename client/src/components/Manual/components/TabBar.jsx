import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { Subscriptions, Person } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles(theme => ({
  tabs: {
    flexGrow: 1,
    marginBottom: theme.spacing(5),
    boxShadow: 'none',
    zIndex: 0,
  },
  tab: {
    height: 85,
    borderRadius: '40px 40px 0px 0px',
  },
  deactivated: {
    backgroundColor: grey[300],
    transitionDuration: '1s',
  },
}));

function TabBar(props) {
  const classes = useStyles();

  const { tabValue, handleTabChange } = props;

  return (
    <AppBar className={classes.tabs} position="static" color="inherit">
      {
        tabValue === 0
          ? (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="white"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab className={classes.tab} icon={<Person />} label="마케터 또는 광고주" />
              <Tab className={clsx(classes.tab, classes.deactivated)} icon={<Subscriptions />} label="크리에이터 또는 1인미디어 방송인" />
            </Tabs>
          )
          : (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="white"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab className={clsx(classes.tab, classes.deactivated)} icon={<Person />} label="마케터 또는 광고주" />
              <Tab className={classes.tab} icon={<Subscriptions />} label="크리에이터 또는 1인미디어 방송인" />

            </Tabs>
          )
      }

    </AppBar>

  );
}

TabBar.propTypes = {
  tabValue: PropTypes.oneOf([0, 1]).isRequired,
  handleTabChange: PropTypes.func.isRequired,
};

export default TabBar;
