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
import sources from '../../source/sources'


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



const TestChargeAmount = (props) => {
  const { setStepComplete, state, dispatch, stepComplete } = props;
  const classes = useStyles();
  const {currentCash, selectValue, totalDebit } = state

  const handleChange = (event) => {
    dispatch({ key: 'selectValue', value: event.target.value})
    setStepComplete(true)
    dispatch({ key: 'totalDebit', value: Number(currentCash)+Number(event.target.value)})
  }

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.contentTitle} variant="h6">
                현재 잔액
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
                결제 후 잔액
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                {totalDebit} 원
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
                충전할 OnAD 캐시
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
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        10,000 원
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="30000"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        30,000 원
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="50000"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        50,000 원
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="100000"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        100,000 원
                      </Typography>
                    )}
                  />
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                <div >
                  <Tooltip title="직접입력 하십시오.">
                    <TextField
                      id="selectValue"
                      label={(
                        <Typography variant="subtitle1" className={classes.selectValue}>
                        충전할 금액을 입력하세요
                        </Typography>
                      )}
                      type="number"
                      className={classes.textField}
                      value={selectValue}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
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
                  구매전 안내 사항
                </Typography>
              </Grid>
              <Grid item className={classes.content}>
                {sources.content.buyCash}
              </Grid>
          </Grid>
        </Grid>
        </Grid>
    </div>
  );

};

export default TestChargeAmount