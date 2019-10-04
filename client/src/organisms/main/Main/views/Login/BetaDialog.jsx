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

const text = `
안녕하세요. 스트리머 여러분🖐!! 약속한 베타 테스트 기간이 끝났습니다.🎉🎉 
공식적으로 2019년 8월 30일 오후 6시에 서버가 닫히고 이 시간까지 적립한 수익금에 대해서 정산해 드리겠습니다.
정산된 금액은 설문조사에 참여해 주신 분들에 한해 2019년 9월 15일 이내로 지급될 예정입니다.
설레임 가득한 이번 첫 베타 테스트에 참여해 주셔서 감사합니다.
여러분의 피드백을 받아 더욱더 발전한 모습으로 10월 중으로 2차 테스트로 찾아 뵙도록 하겠습니다.
저희 와일트루는 여러분들의 성장과 1인 미디어 시장의 성장을 목표로 하고 있습니다.
함께 성장하고 믿을 수 있는 와일트루가 되겠습니다.👨‍👩‍👧‍👦  
아래 설문 조사 링크를 클릭하시고 저희 서비스를 이용한 피드백을 주시면 감사하겠습니다. 
`;
const list = text.split(/\r\n|\r|\n/);


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
      title="베타 테스트 종료 안내"
      maxWidth="md"
      fullWidth
    >
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center" spacing={2}>
        {list.map((typo, i) => (
          <Grid item key={i}>
            <Typography className={classes.font}>{typo}</Typography>
          </Grid>
        ))}
        <Grid item style={{ marginBottom: '10px' }} className={classes.font}>
          <span role="img" aria-label="heart">💌</span>
        설문조사 링크 :
          {' '}
          <a href="https://forms.gle/BTXTpvEpQJWfgPDz5" className={classes.link}>https://forms.gle/BTXTpvEpQJWfgPDz5</a>
          <span role="img" aria-label="heart">💌</span>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default withStyles(style)(BetaDialog);
