import React from 'react';
import {
  Paper, Typography, Divider, Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import useDialog from '../../../utils/lib/hooks/useDialog';
import UploadDialog from './banner/UploadDialog';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    margin: '0px 12px',
    backgroundColor: theme.palette.background.default,
  },
  img: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'block',
  },
}));

export default function BannerList(props) {
  const CONFIRMED = 1;
  const { bannerData } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = bannerData.payload.length;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const bannerUploadDialog = useDialog();

  return (
    <Paper style={{ minHeight: 220, maxheight: 460 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          배너 목록
        </Typography>
        <Button variant="contained" color="primary" onClick={bannerUploadDialog.handleOpen}>
          배너 등록하기
        </Button>
      </div>
      <Divider />

      {!(bannerData.payload.length > 0) ? (
        <div>
          <Grid container justify="center" alignItems="center" direction="column" style={{ marginTop: 40 }}>
            <Typography variant="body1">업로드한 배너가 없습니다.</Typography>
            <Typography variant="body1">배너를 업로드하여 광고를 진행하세요.</Typography>
          </Grid>
        </div>
      ) : (
        <div className={classes.root}>
          <div style={{ position: 'relative' }}>
            <img
              className={classes.img}
              src={bannerData.payload[activeStep].bannerSrc}
              alt={bannerData.payload[activeStep].bannerDescription}
            />
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              backgroundColor: bannerData.payload[activeStep].confirmState === CONFIRMED ? '#898989' : '#dddddd',
            }}
            >
              {bannerData.payload[activeStep].confirmState === CONFIRMED ? (
                <Typography variant="body1" style={{ color: '#fff' }}>
                승인됨
                </Typography>
              ) : (
                <Typography variant="body1" style={{ color: 'red' }}>
                미승인
                </Typography>
              )}
            </div>
          </div>
          <Divider />

          <Paper square elevation={0} alignitems="center" style={{ padding: 20 }}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography variant="body2">{bannerData.payload[activeStep].bannerDescription}</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  style={{ textDecoration: 'underline', color: '#00acc1', cursor: 'pointer' }}
                  onClick={() => { window.open(bannerData.payload[activeStep].landingUrl); }}
                  component="a"
                  align="right"
                >
                  랜딩 페이지 URL 바로가기
                </Typography>
              </Grid>
              {/* <Grid item>
                <Typography variant="body2" style={{ fontSize: '0.3rem' }} display="block">{bannerData.payload[activeStep].landingUrl}</Typography>
              </Grid> */}
            </Grid>
          </Paper>
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            activeStep={activeStep}
            nextButton={(
              <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              다음
                <KeyboardArrowRight />
              </Button>
          )}
            backButton={(
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
              이전
              </Button>
            )}
          />
        </div>
      )}

      <UploadDialog open={bannerUploadDialog.open} onClose={bannerUploadDialog.handleClose} />
    </Paper>
  );
}
