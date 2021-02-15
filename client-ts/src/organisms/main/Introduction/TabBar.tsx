import React from 'react';
import { Typography, Button } from '@material-ui/core';
import useStyles from './style/TabBar.style';

interface Props {
  tabValue: number;
  handleTabChange: React.Dispatch<React.SetStateAction<number>>;
}

function TabBar({ tabValue, handleTabChange }: Props): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button className={tabValue ? classes.notSelected : classes.Selected} onClick={() => handleTabChange(0)}>
        <Typography variant="subtitle1">마케터 이용약관</Typography>
      </Button>
      <Button className={tabValue ? classes.Selected : classes.notSelected} onClick={() => handleTabChange(1)}>
        <Typography variant="subtitle1">크리에이터 이용약관</Typography>
      </Button>
    </div>
  );
}

export default TabBar;
