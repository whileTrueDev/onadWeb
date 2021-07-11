// material-UI
import { Typography, Button } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import * as React from 'react';
// 컴포넌트
// util 계열
// 스타일
import useStyles from '../../styles/policy/tabBar.style';


interface Props {
  tabValue: number;
  handleTabChange: React.Dispatch<React.SetStateAction<number>>;
}

function TabBar({ tabValue, handleTabChange }: Props): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        className={tabValue ? classes.notSelected : classes.Selected}
        onClick={() => handleTabChange(0)}
      >
        <Typography variant="subtitle1">마케터 이용약관</Typography>
      </Button>
      <Button
        className={tabValue ? classes.Selected : classes.notSelected}
        onClick={() => handleTabChange(1)}
      >
        <Typography variant="subtitle1">방송인 이용약관</Typography>
      </Button>
    </div>
  );
}

export default TabBar;
