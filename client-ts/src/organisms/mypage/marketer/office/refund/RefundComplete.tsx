import React from 'react';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { StateInterface } from '../interface';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '5px auto'
  },
  newContentTitle: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    fontFamily: 'Noto Sans KR'
  },
  content: {
    color: 'black',
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 15,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  svg: {
    width: '6.5rem',
    height: '6.5rem',
    marginTop: theme.spacing(1),
    fill: theme.palette.primary.light,
    // marginBottom: theme.spacing(2),
  },
  complete: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.action.disabledBackground,
    paddingBottom: theme.spacing(2),
  },
  circle: {
    width: '12rem',
    height: '12rem',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    borderRadius: '50%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typo: {
    fontWeight: 'bold',
    fontFamily: 'Noto Sans KR'
  }
}));

const RefundComplete = (props: { state: StateInterface }): JSX.Element => {
  const { state } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { totalDebit } = state;

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.newContentTitle} variant="h6">
                잔여 캐시
              </Typography>
            </Grid>
            <Grid item className={classes.newContentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                {totalDebit}
                {' '}
                원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item>
          <Grid container direction="column" spacing={4} className={classes.complete}>
            <Grid item className={classes.circle}>
              <svg viewBox="0 0 104 88" className={classes.svg}>
                <path d="M44,85c-2.6,0-5.2-1-7.1-2.9l-32-32C1,46.2,1,39.8,4.9,35.9s10.2-3.9,14.1,0l23.8,23.8L84,5
                c3.3-4.4,9.6-5.3,14-2c4.4,3.3,5.3,9.6,2,14L52,81c-1.7,2.3-4.4,3.8-7.3,4C44.5,85,44.2,85,44,85z"
                />
              </svg>
            </Grid>
            <Grid item>
              <Typography variant="h5" className={classes.typo}>
                환불 요청이 완료되었습니다
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.typo}>
                환불에 대한 문의 사항은
                {' '}
                <span style={{ color: theme.palette.primary.main }}>OnAD 고객센터</span>
                에 연락주세요
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RefundComplete;
