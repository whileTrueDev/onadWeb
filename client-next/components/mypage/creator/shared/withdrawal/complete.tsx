import { useTheme } from '@material-ui/core/styles';
import { Grid, Typography, Divider } from '@material-ui/core';
import useWithdrawalCompleteStyles from './complete.style';
import { WithdrawalDialogState } from './withdrawalDialog.reducer';

interface WithdrawalCompleteProps {
  state: WithdrawalDialogState;
}

const WithdrawalComplete = ({ state }: WithdrawalCompleteProps) => {
  const classes = useWithdrawalCompleteStyles();
  const theme = useTheme();
  const { totalIncome } = state;

  return (
    <div>
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item>
              <Typography className={classes.newContentTitle} variant="h6">
                잔여 수익금
              </Typography>
            </Grid>
            <Grid item className={classes.newContentTitle}>
              <Typography className={classes.newContentTitle} variant="h6">
                {totalIncome} 원
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item>
          <Grid container direction="column" spacing={4} className={classes.complete}>
            <Grid item className={classes.circle}>
              <svg viewBox="0 0 104 88" className={classes.svg}>
                <path
                  d="M44,85c-2.6,0-5.2-1-7.1-2.9l-32-32C1,46.2,1,39.8,4.9,35.9s10.2-3.9,14.1,0l23.8,23.8L84,5
                c3.3-4.4,9.6-5.3,14-2c4.4,3.3,5.3,9.6,2,14L52,81c-1.7,2.3-4.4,3.8-7.3,4C44.5,85,44.2,85,44,85z"
                />
              </svg>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Noto Sans KR' }}>
                출금 신청이 완료되었습니다
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="subtitle1"
                style={{ fontWeight: 'bold', fontFamily: 'Noto Sans KR' }}
              >
                출금에 대한 문의 사항은{' '}
                <span style={{ color: theme.palette.secondary.main }}>OnAD 고객센터</span>에
                연락주세요
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default WithdrawalComplete;
