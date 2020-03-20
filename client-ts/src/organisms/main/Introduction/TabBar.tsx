import React from 'react';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
// import { Subscriptions, Person } from '@material-ui/icons';
import Tabs from '@material-ui/core/Tabs';
import useStyles from './style/TabBar.style';

const ORANGE_BACKGROUND = 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)';
const EMERALD_BACKGROUND = 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)';


interface Props {
  tabValue: number;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

function TabBar({ tabValue, handleTabChange }: Props): JSX.Element {
  const classes = useStyles();

  return (
    <AppBar className={classes.tabs} position="static" color="inherit">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
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

export default TabBar;
