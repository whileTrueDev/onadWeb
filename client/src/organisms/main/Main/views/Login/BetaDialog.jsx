import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '../../components/Dialog/Dialog';

const style = theme => ({
  font: {
    fontSize: '15px',
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      fontSize: '11px',
    },
  },
  link: {
    fontSize: '13px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },
});

const BetaDialog = (props) => {
  const { open, handleClose, classes } = props;

  // useEffect(() => {
  //   const script = document.createElement('script');

  //   script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
  //   script.async = true;

  //   document.body.appendChild(script);
  // });


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="베타 서비스 안내"
      maxWidth="sm"
      fullWidth
    >
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography className={classes.font}>안녕하세요 온애드입니다. 먼저 홈페이지를 방문해주셔서 감사합니다. </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.font}>클로즈베타 시작일 (8월 12일) 부터 회원가입 및 로그인이 가능합니다.</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.font}>클로즈베타 신청은 아래의 링크를 통해서 신청하시면 됩니다.</Typography>
        </Grid>
        <Grid item>
          <a href="https://forms.gle/Ymjz6ZoVAuwoY71W7" className={classes.link}>클로즈 베타 신청하러가기</a>
        </Grid>
        <Grid item>
          <Typography className={classes.font}>자세한 문의사항은 카카오톡 플러스친구로 문의해주시기 바랍니다.</Typography>
        </Grid>
        <Grid item style={{ marginBottom: '10px' }}>
          <a href="http://pf.kakao.com/_xoyxmfT/chat" className={classes.link}>1:1 채팅하기</a>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default withStyles(style)(BetaDialog);
