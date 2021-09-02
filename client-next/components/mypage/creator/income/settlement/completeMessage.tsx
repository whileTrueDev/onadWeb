import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../../../atoms/button/customButton';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: '20px 0',
  },
  wraper: {
    width: '80%',
    margin: 'auto',
  },
}));

interface CompleteMessageProps {
  handleClose: () => void;
}

function CompleteMessage({ handleClose }: CompleteMessageProps): JSX.Element {
  const classes = useStyles();
  function handleClick(): void {
    handleClose();
    window.location.reload();
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className={classes.wraper}
      >
        <Grid item className={classes.title}>
          방송인님의 소중한 개인정보를 입력해주셔서 감사합니다.
        </Grid>
        <Grid item>
          정산등록 신청서에 대한 관리자의 승인 완료시 언제든지 출금신청을 하실 수 있습니다.
        </Grid>
        <Grid item>정산관리 승인여부는 정산관리 신청서 상단에서 확인가능합니다.</Grid>
        <Grid item className={classes.title}>
          개인정보 변경시 정산등록 신청서에 반영하여 재신청 해주십시오.
        </Grid>
        <Grid item className={classes.title}>
          승인완료까지는 최대 하루가 소요됩니다.
        </Grid>
        <Grid item className={classes.title}>
          <Button color="primary" onClick={handleClick}>
            확인
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default CompleteMessage;
