import React from 'react';
import shortid from 'shortid';
import {
  Grid, Button, Container, Typography
} from '@material-ui/core';
import useStyles from './style/HowToUseMarketer.style';
// import Typography from '../../Main/components/Typography';
import useDialog from '../../../utils/hooks/useDialog';
// import Dialog from './Dialog';
import Inquire from '../main/Inquiry/Inquiry';
import Dialog from '../../../atoms/Dialog/Dialog';


interface Props {
  source: {
    firstContent: string;
    secondContent: string;
    thirdContent: string;
    fourthContent: string;
  };
}

function HowToUsemarketer({ source }: Props): JSX.Element {
  const classes = useStyles();
  const InquireDialog = useDialog();
  const [imgStep, setImgStep] = React.useState('banner');
  const UseStep = useDialog();

  return (
    <Container className={classes.root} component="section">
      <Grid className={classes.marketerUse}>
        <Grid container className={classes.numbertable}>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>1</div>
            <Typography variant="h5" component="h2" className={classes.semiTitle}>
              배너등록
            </Typography>
            <div className={classes.Content}>
              {source.firstContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('banner'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
            <Button className={classes.inquireLink} onClick={() => { InquireDialog.handleOpen(); }}>
              배너가 아직 없으시다면 클릭!
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>2</div>
            <Typography variant="h5" component="h2" className={classes.semiTitle}>
              캠페인생성
            </Typography>
            <div className={classes.Content}>
              {source.secondContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('campaign'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>3</div>
            <Typography variant="h5" component="h2" className={classes.semiTitle}>
              광고송출확인
            </Typography>
            <div className={classes.Content}>
              {source.thirdContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('confirm'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>4</div>
            <Typography variant="h5" component="h2" className={classes.semiTitle}>
              세금계산서 발행
            </Typography>
            <div className={classes.Content}>
              {source.fourthContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('taxbill'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth
        maxWidth="md"
        buttons={(
          <div>
            <Button onClick={InquireDialog.handleClose}>
              취소
            </Button>
          </div>
        )}
      >
        <Inquire confirmClose={InquireDialog.handleClose} />
      </Dialog>
      <Dialog
        open={Boolean(UseStep.open)}
        onClose={UseStep.handleClose}
        fullWidth
        maxWidth="md"
      >
        <img src={`/pngs/introduction/${imgStep}.png`} className={classes.contentImg} alt="sample" />
      </Dialog>
    </Container>
  );
}

export default HowToUsemarketer;
