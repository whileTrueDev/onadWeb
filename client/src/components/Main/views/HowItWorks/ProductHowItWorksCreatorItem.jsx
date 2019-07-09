import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Subscriptions from '@material-ui/icons/Subscriptions';
import ShowChart from '@material-ui/icons/ShowChart';

import Button from '../../components/Button';
import Typography from '../../components/Typography';
import LoginForm from '../Login/LoginForm';

const creatorSource = {
  title: '간단한 설정만으로 광고료를 획득할 수 있습니다. 광고를 유치하세요.',
  first: 'OBS, Xsplit 등의 방송송출 프로그램에 오버레이 주소를 추가시키기만 하세요.',
  second: '한번 설정하기만 하면, 방송과 관련 있는 광고가 자동으로 송출됩니다.',
  third: '어떤 광고가 진행되어 왔는지, 나의 총 광고수익은 얼마인지. 대시보드에서 쉽게 확인하고 수익금을 출금하세요.',
};

function useDialog() {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}

export default function ProductHowItWorksCreatorItem(props) {
  const {
    classes, check, history, isLogin,
  } = props;

  const { open, handleOpen, handleClose } = useDialog();

  function handleClick() {
    axios.get('/api/dashboard/checkUserType').then((res) => {
      const { userType } = res.data;
      if (userType === undefined) {
        handleOpen();
      } else if (userType === 'creator') {
        history.push('/dashboard/creator/main');
      }
    });
  }

  return (
    <React.Fragment>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Typography
          variant="h4"
          marked="center"
          align="center"
          className={classes.title}
          component="h2"
        >
          {creatorSource.title}
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <div className={classes.number}>1.</div>
              <BrandingWatermark className={classes.icon} />
              <Typography variant="h5" align="center">
                {creatorSource.first}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <div className={classes.number}>2.</div>
              <Subscriptions className={classes.icon} />
              <Typography variant="h5" align="center">
                {creatorSource.second}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <div className={classes.number}>3.</div>
              <ShowChart className={classes.icon} />
              <Typography variant="h5" align="center">
                {creatorSource.third}
              </Typography>
            </div>
          </Grid>

        </Grid>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Button
          color="primary"
          size="large"
          variant="contained"
          className={classes.button}
          onClick={handleClick}
        >
          {isLogin ? '대시보드로 이동' : '크리에이터로 시작하기'}
        </Button>
      </Grow>

      <LoginForm
        open={open}
        isMarketer={false}
        history={history}
        handleClose={handleClose}
      />
    </React.Fragment>
  );
}
ProductHowItWorksCreatorItem.propTypes = {
  classes: PropTypes.object.isRequired,
  check: PropTypes.bool.isRequired,
};
