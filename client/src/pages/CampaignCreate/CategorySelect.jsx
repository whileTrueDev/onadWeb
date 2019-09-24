import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid, ListItemText, Checkbox, Paper, Divider,
} from '@material-ui/core';
import Table from '../../components/NewCreates/Table';
import CustomizedCard from '../../components/NewCreates/CustomizedCard';
import StyledItemText from '../../components/NewCreates/StyledItemText';
import tableColumnConfig from './tableColumnConfig';

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

const CategorySelect = (props) => {
  const { setStepComplete } = props;
  const classes = useStyles();

  useEffect(() => {
    setStepComplete(true);
  });

  const tableData = [[
    '제101공수사단', 'just chatting', '3', '4', '0.34', '1600']
  ];
  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item className={classes.item}>
            <StyledItemText primary="넷째,&nbsp;&nbsp; 카테고리 선택" secondary="해당 캠페인의 배너가 송출될 배너를 선택하세요." className={classes.label} />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>
          <Grid item>
            <Table
              tableHeaderColor="info"
              tableHead={tableColumnConfig}
              tableData={tableData}
              pagination
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategorySelect;
