import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import sources from './withdrawalSources';
import StyledSelectText from '../../../../../atoms/StyledSelectText';
import { WithdrawalDialogState } from '../WithdrawalDialog.reducer';
import useWithdrawalConfirmStyles from './Confirm.style';

interface WithdrawalConfirmProps {
  state: WithdrawalDialogState;
  accountNumber: string;
  realName: string;
}

const WithdrawalConfirm = ({
  state,
  accountNumber,
  realName,
}: WithdrawalConfirmProps): JSX.Element => {
  const classes = useWithdrawalConfirmStyles();
  const { selectValue, totalIncome } = state;

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
              <StyledSelectText
                primary="실입금될 금액"
                secondary="소득세 제함"
                className={classes.contentTitle}
              />
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.contentTitle} variant="h6">
                {parseInt(String(Number(selectValue) * 0.967), 10)} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.newContentTitle} variant="h6">
                출금 후 수익금
              </Typography>
            </Grid>
            <Grid item className={classes.contentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                &#45;
                {selectValue} &rarr;{totalIncome} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider />
        <Grid item className={classes.warning}>
          <Grid container direction="column">
            <Grid item>
              <Typography className={classes.warningTitle} variant="h6">
                출금 신청 안내사항
              </Typography>
            </Grid>
            <Grid item className={classes.content}>
              {sources.contentWithdrawal.confirmWarning}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default WithdrawalConfirm;
