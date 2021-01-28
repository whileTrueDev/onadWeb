import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChargeAction, ChargeInterface } from '../interface';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '5px auto'
  },
  contentTitle: {
    fontWeight: 'bold',
  },
  contentDetail: {
    marginTop: theme.spacing(1),
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
    color: theme.palette.primary.main,
    fontFamily: 'Noto Sans KR'
  },
  content: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2, 0)
  },
  warning: {
    background: theme.palette.action.disabledBackground,
    marginTop: theme.spacing(2),
  }
}));

interface TestChargeSolutionProps {
  state: ChargeInterface;
  dispatch: React.Dispatch<ChargeAction>;
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const TestChargeSolution = (props: TestChargeSolutionProps): JSX.Element => {
  const { setStepComplete, state, dispatch } = props;
  const classes = useStyles();
  const { totalDebit, selectValue, chargeType } = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ key: 'chargeType', value: event.target.value });
    setStepComplete(true);
  };

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography color="textPrimary" className={classes.contentTitle} variant="h6">
                자동 충전금액
              </Typography>
              <Typography color="textPrimary" variant="caption" style={{ fontFamily: 'Noto Sans KR' }}>
                부가세 포함
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography color="textPrimary" className={classes.contentTitle} variant="h6">
                {Math.round(parseInt(selectValue, 10) * 1.1)}
                {' '}
                원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography color="textPrimary" className={classes.newContentTitle} variant="h6">
                충전 후 잔액
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                &#43;
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
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography color="textPrimary" variant="h6" style={{ fontWeight: 'bold', fontFamily: 'Noto Sans KR' }}>
                결제방법 선택
              </Typography>
            </Grid>
            <Grid container spacing={4} direction="row" justify="space-around">
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
                      <Typography color="textPrimary" variant="subtitle1">
                        신용카드
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="trans"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography color="textPrimary" variant="subtitle1">
                        계좌이체
                      </Typography>
                    )}
                  />
                  <FormControlLabel
                    value="vbank"
                    control={<Radio color="primary" />}
                    label={(
                      <Typography color="textPrimary" variant="subtitle1">
                        가상계좌
                      </Typography>
                    )}
                  />
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                {chargeType && (
                <img src={`/pngs/Charge/${chargeType}.png`} alt={`${chargeType}`} width="100" height="75" />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.warning}>
          <Grid container>
            <Grid item className={classes.content}>
              <Typography variant="body2" color="textPrimary">
                자동 충전 금액에는 부가세가 적용되며 &apos;계좌이체&apos;의 경우 1인 1계좌 하루 최대 50만원까지 결제 가능합니다.
                또한, 신용카드 결제시 및 프로모션 이벤트 금액에 대한 세금계산서 발급은 불가합니다.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestChargeSolution;
