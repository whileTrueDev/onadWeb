import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import sources from '../source/sources';
import shortid from 'shortid';


const useStyles = makeStyles(theme => ({
  root: {
    width: `85%`,
    margin: `5px auto`
  },
  contentTitle: {
    fontWeight: 'bold',
    color: '#999',
    fontFamily: 'Noto Sans KR'
  },
  newContentTitle: {
    fontWeight: 'bold',
    color: '#FFAA00',
    fontFamily: 'Noto Sans KR'
  },
  warningTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Noto Sans KR'
  },
  contentDetail: {
    marginTop: theme.spacing(1),
  },
  selectValue: {
    color: '#333',
  },
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
    marginTop:3,
    fontSize: 12,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  warning: {
    background: 'rgba(0,0,0,0.05)',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));



const WithdrawalAmount = (props) => {
  const { setStepComplete, state, dispatch, stepComplete, accountNumber, realName} = props;
  const classes = useStyles();
  const {currentCash, selectValue, totalIncome } = state

  const handleChange = (event) => {
    dispatch({ key: 'selectValue', value: event.target.value})
    setStepComplete(true)
    dispatch({ key: 'totalIncome', value: Number(currentCash)-Number(event.target.value)})
  }

  const values = ["30000", "60000", "90000", "120000"]

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
              {realName}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.contentTitle} variant="h6">
                현재 보유 수익금
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
              {currentCash} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        { stepComplete && (
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.newContentTitle} variant="h6">
                출금 후 잔액
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                {totalIncome} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        )}
        <Divider />
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h6" style={{fontWeight: 'bold', fontFamily: 'Noto Sans KR'}}>
                출금 신청할 수익금
              </Typography>
            </Grid>
            <Grid container spacing={4} direction="row" justify="center">
              <Grid item>
                <RadioGroup
                  name="howmuch"
                  className={classes.contentDetail}
                  value={selectValue}
                  onChange={handleChange}
                >
                  {values.map(value => 
                    <FormControlLabel
                      value={value}
                      key={shortid.generate()}
                      control={<Radio color="primary" />}
                      label={(
                        currentCash >= value ? (
                          <Typography variant="subtitle1" className={classes.selectValue}>
                            {value} 원
                          </Typography>
                          )
                          : (
                          <Typography variant="subtitle1">
                            {value} 원
                          </Typography>
                        ))}
                      disabled={!(currentCash >= value)}
                    />
                    )
                  }
                  
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                <div >
                  <Tooltip title="직접입력 하십시오.">
                    <TextField
                      id="selectValue"
                      label={(
                        <Typography variant="subtitle1" className={classes.selectValue}>
                        출금 신청할 금액을 입력하세요
                        </Typography>
                      )}
                      type="number"
                      className={classes.textField}
                      value={selectValue}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      error={!((currentCash >= selectValue)) || !(selectValue >= 30000)}
                      helperText={((currentCash >= selectValue) && (selectValue >= 30000)) ? null : '올바른 입력 부탁드립니다'}
                    />
                  </Tooltip>
                </div>
              </Grid>
            </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.warning}>
            <Grid container direction="column">
              <Grid item>
                <Typography className={classes.warningTitle} variant="h6">
                  출금 신청 안내사항
                </Typography>
              </Grid>
              <Grid item className={classes.content}>
                {sources.contentWithdrawal.warning}
              </Grid>
          </Grid>
        </Grid>
        </Grid>
    </div>
  );

};

export default WithdrawalAmount