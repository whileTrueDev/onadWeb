import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import sources from '../sources';
import StyledSelectText from '../../../../../atoms/StyledSelectText';
import { StateInterface } from '../interface';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '5px auto'
  },
  contentTitle: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    fontFamily: 'Noto Sans KR'
  },
  newContentTitle: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    fontFamily: 'Noto Sans KR'
  },
  warningTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Noto Sans KR'
  },
  contentDetail: { marginTop: theme.spacing(1) },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: 'black',
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 12,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  warning: {
    background: theme.palette.action.disabledBackground,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));


interface RefundConfirmProps {
  state: StateInterface;
  accountNumber: string;
  accountHolder: string;
}


const RefundConfirm = (props: RefundConfirmProps): JSX.Element => {
  const { state, accountNumber, accountHolder } = props;
  const classes = useStyles();
  const { selectValue, totalDebit } = state;

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.contentTitle} variant="h6">
                계좌번호
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
                {`${accountNumber.split('_')[0]} ${accountNumber.split('_')[1]}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.contentTitle} variant="h6">
                예금주
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
                {accountHolder}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <StyledSelectText primary="환불 요청 금액" secondary="수수료 제함" className={classes.contentTitle} />
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
                {parseInt(selectValue, 10) < 10000
                  ? parseInt(selectValue, 10) - 1000
                  : parseInt(selectValue, 10) * 0.9}
                {' '}
                원
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.newContentTitle} variant="h6">
                환불 후 잔액
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                &#45;
                {selectValue}
                {' '}
                &rarr;
                {' '}
                {totalDebit}
                {' '}
                원
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider />
        <Grid item className={classes.warning}>
          <Grid container direction="column">
            <Grid item>
              <Typography className={classes.warningTitle} variant="h6">
                환불 요청 안내사항
              </Typography>
            </Grid>
            <Grid item className={classes.content}>
              {sources.contentRefund.confirmWarning}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RefundConfirm;
