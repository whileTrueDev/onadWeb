import React from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
// import { Subscriptions, Person } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';

const useStyles = makeStyles(theme => ({
  tabs: {
    flexGrow: 1,
    marginBottom: theme.spacing(5),
    boxShadow: '0 1px 1px gainsboro',
    zIndex: '3',
  },
  tab: {
    height: 50,
    background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)',
    color: 'white',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: '600',
    boxShadow: '0 2px 1px gainsboro',
  },
  tab2: {
    height: 50,
    background: 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)',
    color: 'white',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: '600',
    boxShadow: '0 2px 1px gainsboro',
  },
  tab3: {
    height: 50,
    backgroundColor: 'white',
    color: 'gray',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: '600',
    boxShadow: '0 2px 1px gainsboro',
  },
  indicator_marketer: {
    indicator: {
      backgroundColor: '#00DBE0'
    }
  },
  indicator_creator: {
    indicator: {
      backgroundColor: '#FFAA00'
    }
  }
}));

function TabBar(props) {
  const classes = useStyles();

  const { tabValue, handleTabChange } = props;

  return (
    <AppBar className={classes.tabs} position="static" color="inherit">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        // indicatorColor="primary"
        TabIndicatorProps={
          tabValue
            ? { style: { backgroundColor: '#FFAA00' } }
            : { style: { backgroundColor: '#00DBE0' } }
        }
      >
        <Tab
          className={tabValue ? (classes.tab3) : (classes.tab2)}
          label="마케터 배너광고"
        />
        <Tab
          className={tabValue ? (classes.tab) : (classes.tab3)}
          label="크리에이터 배너광고"
        />
      </Tabs>
    </AppBar>

  );
}

TabBar.propTypes = {
  tabValue: PropTypes.oneOf([0, 1]).isRequired,
  handleTabChange: PropTypes.func.isRequired,
};

export default TabBar;
