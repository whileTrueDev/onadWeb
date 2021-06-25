import * as React from 'react';
import shortid from 'shortid';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
// styles
import { WithdrawlDialogAction, WithdrawalDialogState } from '../WithdrawalDialog.reducer';
import useWithdrawalAmountStyles from './Amount.style';
import sources from './withdrawalSources';

interface WithdrawalAmountProps {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  state: WithdrawalDialogState;
  dispatch: React.Dispatch<WithdrawlDialogAction>;
  stepComplete: boolean;
  accountNumber: string;
  realName: string;
}

const WithdrawalAmount = ({
  state,
  dispatch,
  stepComplete,
  accountNumber,
  setStepComplete,
  realName,
}: WithdrawalAmountProps): JSX.Element => {
  const classes = useWithdrawalAmountStyles();
  const { currentCash, selectValue, totalIncome } = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ key: 'selectValue', value: event.target.value });
    setStepComplete(true);
    dispatch({ key: 'totalIncome', value: Number(currentCash) - Number(event.target.value) });
  };

  const values = ['30000', '60000', '90000', '120000'];

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
                {accountNumber.split('_')}
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
        {stepComplete && (
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
              <Typography variant="h6" style={{ fontWeight: 'bold', fontFamily: 'Noto Sans KR' }}>
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
                  {values.map(value => (
                    <FormControlLabel
                      value={value}
                      key={shortid.generate()}
                      control={<Radio color="primary" />}
                      label={
                        currentCash >= Number(value) ? (
                          <Typography variant="subtitle1">{value} 원</Typography>
                        ) : (
                          <Typography variant="subtitle1">{value} 원</Typography>
                        )
                      }
                      disabled={!(currentCash >= Number(value))}
                    />
                  ))}
                </RadioGroup>
              </Grid>
              <Grid item className={classes.valueContainer}>
                <div>
                  <Tooltip title="직접입력 하십시오.">
                    <TextField
                      id="selectValue"
                      label={
                        <Typography variant="subtitle1">출금 신청할 금액을 입력하세요</Typography>
                      }
                      type="number"
                      className={classes.textField}
                      value={selectValue}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      error={
                        !(currentCash >= Number(selectValue)) || !(Number(selectValue) >= 30000)
                      }
                      helperText={
                        currentCash >= Number(selectValue) && Number(selectValue) >= 30000
                          ? null
                          : '올바른 입력 부탁드립니다'
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

export default WithdrawalAmount;
