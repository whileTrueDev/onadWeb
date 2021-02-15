import React from 'react';
import shortid from 'shortid';
import {
  Grid, Button, Typography, Dialog
} from '@material-ui/core';
import useStyles from './style/HowToUseCreator.style';
// import Typography from '../../Main/components/Typography';
import useDialog from '../../../utils/hooks/useDialog';

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
    <div className={classes.root}>
      <Grid container>

        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>1</Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            계약하기
          </Typography>
          <div className={classes.Content}>
            {source.firstContent.split('\n').map((row) => (
              <Typography variant="body2" key={shortid.generate()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button className={classes.sampleLink} onClick={() => { setImgStep('contract'); UseStep.handleOpen(); }}>
            샘플
          </Button>
        </Grid>

        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>2</Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            광고페이지 설정
          </Typography>
          <div className={classes.Content}>
            {source.secondContent.split('\n').map((row) => (
              <Typography variant="body2" key={shortid.generate()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button className={classes.sampleLink} onClick={() => { setImgStep('landingpage'); UseStep.handleOpen(); }}>
            샘플
          </Button>
        </Grid>
        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>3</Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            광고 송출 설정
          </Typography>
          <div className={classes.Content}>
            {source.thirdContent.split('\n').map((row) => (
              <Typography variant="body2" key={shortid.generate()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button className={classes.sampleLink} onClick={() => { setImgStep('broadcast'); UseStep.handleOpen(); }}>
            샘플
          </Button>
        </Grid>
        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>4</Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            수익정산
          </Typography>
          <div className={classes.Content}>
            {source.fourthContent.split('\n').map((row) => (
              <Typography variant="body2" key={shortid.generate()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button className={classes.sampleLink} onClick={() => { setImgStep('benefit'); UseStep.handleOpen(); }}>
            샘플
          </Button>
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
    </div>
  );
}

export default HowToUseCreator;
