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
import sources from './sources';
import { stateInterface, Action } from './interface';


const useStyles = makeStyles(theme => ({
  root: {
    width: '85%',
    margin: '5px auto'
  },
  contentTitle: {
    fontWeight: 'bold',
    color: '#999',
    fontFamily: 'Noto Sans KR'
  },
  newContentTitle: {
    fontWeight: 'bold',
    color: '#00DBDF',
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
    marginTop: 3,
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

interface propInterface {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  state: stateInterface;
  dispatch: React.Dispatch<Action>;
  stepComplete: boolean;
  accountNumber: string;
  accountHolder: string;
}


const RefundAmount = (props: propInterface) => {
  const {
    setStepComplete, state, dispatch, stepComplete, accountNumber, accountHolder
  } = props;
  const classes = useStyles();
  const { currentCash, selectValue, totalDebit } = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ key: 'selectValue', value: event.target.value });
    setStepComplete(true);
    dispatch({ key: 'totalDebit', value: Number(currentCash) - Number(event.target.value) });
  };

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
              <Typography className={classes.contentTitle} variant="h6">
                현재 보유 캐시
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
                {`${currentCash} 원`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {stepComplete && (
          <Grid item>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Typography className={classes.newContentTitle} variant="h6">
                  환불 후 잔액
              </Typography>
              </Grid>
              <Grid item className={classes.contentTitle}>
                <Typography className={classes.newContentTitle} variant="h6">
                  {`${totalDebit} 원`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Divider />
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontFamily: 'Noto Sans KR' }}>
                환불 요청할 ONAD 캐시
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
                  <FormControlLabel
                    value="10000"
                    control={<Radio color="primary" />}
                    label={(
                      currentCash >= 10000 ? (
                        <Typography variant="subtitle1" className={classes.selectValue}>
                          10,000 원
                        </Typography>
                      )
                        : (
                          <Typography variant="subtitle1">
                            10,000 원
                          </Typography>
                        ))}
                    disabled={!(currentCash >= 10000)}
                  />
                  <FormControlLabel
                    value="30000"
                    control={<Radio color="primary" />}
                    label={(
                      currentCash >= 30000 ? (
                        <Typography variant="subtitle1" className={classes.selectValue}>
                          30,000 원
                        </Typography>
                      )
                        : (
                          <Typography variant="subtitle1">
                            30,000 원
                          </Typography>
                        ))}
                    disabled={!(currentCash >= 30000)}
                  />
                  <FormControlLabel
                    value="50000"
                    control={<Radio color="primary" />}
                    label={(
                      currentCash >= 50000 ? (
                        <Typography variant="subtitle1" className={classes.selectValue}>
                          50,000 원
                        </Typography>
                      )
                        : (
                          <Typography variant="subtitle1">
                            50,000 원
                          </Typography>
                        ))}
                    disabled={!(currentCash >= 50000)}
                  />
                  <FormControlLabel
                    value="100000"
                    control={<Radio color="primary" />}
                    label={(
                      currentCash >= 100000 ? (
                        <Typography variant="subtitle1" className={classes.selectValue}>
                          100,000 원
                        </Typography>
                      )
                        : (
                          <Typography variant="subtitle1">
                            100,000 원
                          </Typography>
                        ))}
                    disabled={!(currentCash >= 100000)}
                  />
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                <div>
                  <Tooltip title="직접입력 하십시오.">
                    <TextField
                      id="selectValue"
                      label={(
                        <Typography variant="subtitle1" className={classes.selectValue}>
                          환불 요청할 금액을 입력하세요
                        </Typography>
                      )}
                      type="number"
                      className={classes.textField}
                      value={selectValue}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      error={!((currentCash >= parseInt(selectValue))) || !(parseInt(selectValue) > 1000)}
                      helperText={((currentCash >= parseInt(selectValue)) && (parseInt(selectValue) > 1000)) ? null : '올바른 입력 부탁드립니다'}
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
                환불 요청 안내사항
              </Typography>
            </Grid>
            <Grid item className={classes.content}>
              {sources.contentRefund.warning}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RefundAmount;
