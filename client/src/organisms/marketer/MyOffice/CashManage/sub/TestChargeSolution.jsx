import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import StyledSelectText from '../../../../../atoms/StyledSelectText';


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
  newContentTitle: {
    fontWeight: 'bold',
    color: '#00DBDF',
    fontFamily: 'Noto Sans KR'
  },
  content: {
    color: 'black',
    paddingLeft: 5,
    marginTop:3,
    fontSize: 15,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  warning: {
    background: 'rgba(0,0,0,0.05)',
    marginTop: theme.spacing(2),
  }
}));



const TestChargeSolution = (props) => {
  const { setStepComplete, state, dispatch } = props;
  const classes = useStyles();
  const {totalDebit, selectValue, chargeType} = state

  const handleChange = (event) => {
    dispatch({ key: 'chargeType', value: event.target.value})
    setStepComplete(true)
  }

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <StyledSelectText primary="자동 충전금액" secondary="부가세 포함" className={classes.contentTitle}/>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
              {parseInt(selectValue*1.1)} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.newContentTitle} variant="h6">
                충전 후 잔액
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                &#43;{selectValue} &rarr; {totalDebit} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h6" style={{fontWeight: 'bold', fontFamily: 'Noto Sans KR'}}>
                결제방법 선택
              </Typography>
            </Grid>
            <Grid container spacing={4} direction="row" justify='space-around'>
              <Grid item>
                <RadioGroup
                  name="howmuch"
                  className={classes.contentDetail}
                  value={chargeType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        신용카드
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="trans"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        계좌이체
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="vbank"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography variant="subtitle1" className={classes.selectValue}>
                        가상계좌
                      </Typography>
                    )}
                  />
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                
                <img src={`/pngs/Charge/${chargeType}.png`} alt={`${chargeType}`} width="150" hegith="120" />
              </Grid>
            </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.warning}>
            <Grid container>
              <Grid item className={classes.content}>
                결제방법을 선택해주세요, 차후에 다양한 결제방법 도입예정입니다.
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    </div>
  );

};

export default TestChargeSolution