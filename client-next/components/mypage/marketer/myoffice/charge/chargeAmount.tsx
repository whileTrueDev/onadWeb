import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import sources from '../../sources/sources';
import { ChargeAction, ChargeInterface } from '../interface';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '5px auto',
  },
  contentTitle: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    fontFamily: 'Noto Sans KR',
  },
  newContentTitle: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    fontFamily: 'Noto Sans KR',
  },
  warningTitle: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    fontFamily: 'Noto Sans KR',
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
  content: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2, 0),
  },
  warning: {
    background: theme.palette.action.disabledBackground,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface TestChargeAmountProps {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  state: ChargeInterface;
  dispatch: React.Dispatch<ChargeAction>;
  stepComplete: boolean;
}

const TestChargeAmount = (props: TestChargeAmountProps): JSX.Element => {
  const { setStepComplete, state, dispatch, stepComplete } = props;
  const classes = useStyles();
  const { currentCash, selectValue, totalDebit } = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ key: 'selectValue', value: event.target.value });
    dispatch({
      key: 'totalDebit',
      value: (Number(currentCash.replace(/,/gi, '')) + Number(event.target.value)).toString(),
    });
    setStepComplete(true);
  };

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justifyContent="space-between">
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
        {stepComplete && (
          <Grid item>
            <Grid container direction="row" justifyContent="space-between">
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
              <Typography color="textPrimary" variant="h6" style={{ fontWeight: 'bold' }}>
                충전할 OnAD 캐시
              </Typography>
            </Grid>
            <Grid container spacing={4} direction="row" justifyContent="center">
              <Grid item>
                <RadioGroup
                  name="howmuch"
                  className={classes.contentDetail}
                  value={selectValue}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="50000"
                    control={<Radio color="primary" />}
                    label={
                      <Typography color="textPrimary" variant="subtitle1">
                        50,000 원
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="100000"
                    control={<Radio color="primary" />}
                    label={
                      <Typography color="textPrimary" variant="subtitle1">
                        100,000 원
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="300000"
                    control={<Radio color="primary" />}
                    label={
                      <Typography color="textPrimary" variant="subtitle1">
                        300,000 원
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="500000"
                    control={<Radio color="primary" />}
                    label={
                      <Typography color="textPrimary" variant="subtitle1">
                        500,000 원
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                <div>
                  <Tooltip title="직접입력 하십시오.">
                    <TextField
                      id="selectValue"
                      label={<Typography variant="subtitle1">충전할 금액을 입력하세요</Typography>}
                      type="number"
                      className={classes.textField}
                      value={selectValue}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      error={
                        !(parseInt(selectValue, 10) > 10000) || parseInt(selectValue, 10) > 1000001
                      }
                      helperText={
                        parseInt(selectValue, 10) > 10000
                          ? '최대 1000만원까지 가능합니다.'
                          : '10000원 이상 충전가능'
                      }
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
              <Typography variant="body2">{sources.content.buyCash}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestChargeAmount;
