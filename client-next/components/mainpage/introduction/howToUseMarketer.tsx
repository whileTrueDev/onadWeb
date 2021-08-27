// material-UI
import { Grid, Button, Typography } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState } from 'react';
import { nanoid } from 'nanoid';
// 컴포넌트
import Inquire from '../main/inquiry/inquiry';
import Dialog from '../../../atoms/dialog/dialog';
import CustomButtons from '../../../atoms/button/customButton';
// util 계열
import useDialog from '../../../utils/hooks/useDialog';
// 스타일
import useStyles from '../../../styles/mainpage/introduction/howToUseMarketer.style';

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
  const [imgStep, setImgStep] = useState('banner');
  const UseStep = useDialog();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={3} className={classes.marketerUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            1
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            배너등록
          </Typography>
          <div className={classes.Content}>
            {source.firstContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Typography
            variant="body2"
            className={classes.inquiryLink}
            onClick={(): void => {
              InquireDialog.handleOpen();
            }}
          >
            배너가 아직 없으시다면 클릭!
          </Typography>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('marketer_manual_1');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
          <CustomButtons
            load
            className={classes.guideButton}
            onClick={(): Window | null =>
              window.open(
                'https://onad-static-files.s3.ap-northeast-2.amazonaws.com/pdfs/bannerGuide.pdf',
                '_blank',
              )
            }
          >
            배너가이드
          </CustomButtons>
        </Grid>
        <Grid item xs={12} md={3} className={classes.marketerUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            2
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            캠페인생성
          </Typography>
          <div className={classes.Content}>
            {source.secondContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('marketer_manual_2');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>
        <Grid item xs={12} md={3} className={classes.marketerUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            3
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            광고송출확인
          </Typography>
          <div className={classes.Content}>
            {source.thirdContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('marketer_manual_3');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>
        <Grid item xs={12} md={3} className={classes.marketerUse}>
          <div className={classes.lineDecoration} />
          <Typography variant="h1" className={classes.useNumber}>
            4
          </Typography>
          <Typography variant="h5" className={classes.semiTitle}>
            세금계산서/현금영수증
          </Typography>
          <div className={classes.Content}>
            {source.fourthContent.split('\n').map(row => (
              <Typography variant="body2" key={nanoid()}>{`${row}`}</Typography>
            ))}
          </div>
          <Button
            className={classes.sampleLink}
            onClick={(): void => {
              setImgStep('marketer_manual_4');
              UseStep.handleOpen();
            }}
          >
            샘플
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth
        maxWidth="md"
        buttons={
          <div>
            <Button onClick={InquireDialog.handleClose}>취소</Button>
          </div>
        }
      >
        <Inquire confirmClose={InquireDialog.handleClose} />
      </Dialog>
      <Dialog open={Boolean(UseStep.open)} onClose={UseStep.handleClose} fullWidth maxWidth="md">
        <img src={`/introduction/${imgStep}.png`} alt="sample" className={classes.contentImg} />
      </Dialog>
    </div>
  );
}

export default HowToUsemarketer;
