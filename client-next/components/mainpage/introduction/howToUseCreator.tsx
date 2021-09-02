// material-UI
import { Grid, Button, Typography, Dialog } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState } from 'react';
import { nanoid } from 'nanoid';
// 컴포넌트
// util 계열
import useDialog from '../../../utils/hooks/useDialog';
// 스타일
import useStyles from '../../../styles/mainpage/introduction/howToUseCreator.style';

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
  const [imgStep, setImgStep] = useState('contract');
  const UseStep = useDialog();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            1
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            이용동의하기
          </Typography>
          <div className={classes.Content}>
            {source.firstContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('creator_manual_1');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>

        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            2
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            배너 광고 설정
          </Typography>
          <div className={classes.Content}>
            {source.secondContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('creator_manual_2');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>
        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            3
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            클릭 광고 설정
          </Typography>
          <div className={classes.Content}>
            {source.thirdContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('creator_manual_3');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>
        <Grid item xs={12} md={3} className={classes.creatorUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            4
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            수익정산
          </Typography>
          <div className={classes.Content}>
            {source.fourthContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('creator_manual_4');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>
      </Grid>

      <Dialog open={Boolean(UseStep.open)} onClose={UseStep.handleClose} fullWidth maxWidth="md">
        <img src={`/introduction/${imgStep}.png`} alt="sample" className={classes.contentImg} />
      </Dialog>
    </div>
  );
}

export default HowToUseCreator;
