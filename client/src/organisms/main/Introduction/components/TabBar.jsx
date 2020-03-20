import React from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
// import { Subscriptions, Person } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';

const ORANGE_BACKGROUND = 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)';
const EMERALD_BACKGROUND = 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)';

const useStyles = makeStyles((theme) => ({
  tabs: {
    flexGrow: 1,
    marginBottom: theme.spacing(5),
    boxShadow: 'none',
    zIndex: '3',
  },
  tab: {
    height: 50,
    background: ORANGE_BACKGROUND,
    color: 'white',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: '600',
    // boxShadow: '0 2px 1px gainsboro',
  },
  tab2: {
    height: 50,
    background: EMERALD_BACKGROUND,
    color: 'white',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: '600',
    // boxShadow: '0 2px 1px gainsboro',
  },
  tab3: {
    height: 50,
    backgroundColor: 'white',
    color: 'gray',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: '600',
  },
  indicator_marketer: {
    indicator: {
      backgroundColor: EMERALD_BACKGROUND
    }
  },
  indicator_creator: {
    indicator: {
      backgroundColor: ORANGE_BACKGROUND
    }
  }
}));

function TabBar(props): JSX.Element {
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
          label="마케터"
        />
        <Tab
          className={tabValue ? (classes.tab) : (classes.tab3)}
          label="크리에이터"
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
