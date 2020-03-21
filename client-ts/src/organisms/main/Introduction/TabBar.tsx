import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import useStyles from './style/TabBar.style';

interface Props {
  tabValue: number;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

function TabBar({ tabValue, handleTabChange }: Props): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <AppBar className={classes.tabs} position="static" color="inherit">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        TabIndicatorProps={
          tabValue
            ? { style: { backgroundColor: theme.palette.secondary.main } }
            : { style: { backgroundColor: theme.palette.primary.main } }
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
