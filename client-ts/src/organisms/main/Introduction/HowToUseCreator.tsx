import React from 'react';
import shortid from 'shortid';
import {
  Grid, Button, Typography, Dialog, Container
} from '@material-ui/core';
import useStyles from './style/HowToUseCreator.style';
// import Typography from '../../Main/components/Typography';
import useDialog from '../../../utils/hooks/useDialog';
// import Dialog from './Dialog';


interface Source {
  source: {
    firstContent: string;
    secondContent: string;
    thirdContent: string;
    fourthContent: string;
  };
}

function HowToUseCreator({ source }: Source): JSX.Element {
  const classes = useStyles();
  const [imgStep, setImgStep] = React.useState('contract');
  const UseStep = useDialog();

  return (
    <Container className={classes.root} component="section">
      <Grid className={classes.creatorUse}>
        <Grid container className={classes.numbertable}>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>1</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: 600 }}>
              계약하기
            </Typography>
            <div className={classes.Content}>
              {source.firstContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('contract'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>2</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: 600 }}>
              광고페이지설정
            </Typography>
            <div className={classes.Content}>
              {source.secondContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('landingpage'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>3</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: 600 }}>
              광고송출설정
            </Typography>
            <div className={classes.Content}>
              {source.thirdContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('broadcast'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>4</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: 600 }}>
              수익정산
            </Typography>
            <div className={classes.Content}>
              {source.fourthContent.split('\n').map((row) => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('benefit'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
        </Grid>
      </Grid>
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

export default HowToUseCreator;
