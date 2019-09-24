import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid, ListItemText, Checkbox, Paper, Divider,
} from '@material-ui/core';
import Table from '../../components/NewCreates/Table';
import CustomizedCard from '../../components/NewCreates/CustomizedCard';
import StyledItemText from '../../components/NewCreates/StyledItemText';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
}));

const CreatorSelectPaper = (props) => {
  const classes = useStyles();
  const tableData = [[
    'chanwoo', 'twitch', 'eat', '3000', '7000']
  ];

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item className={classes.item}>
            <StyledItemText primary="넷째,&nbsp;&nbsp; 크리에이터 선택" secondary="해당 캠페인의 배너가 송출될 크리에이터를 선택하세요." className={classes.label} />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>
          <Grid item>
            <Table
              tableHeaderColor="info"
              tableHead={['활동명', '주 컨텐츠', '평균 시청자 수', '평균 방송시간', '충성도', '일일 예상 비용']}
              tableData={tableData}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreatorSelectPaper;
