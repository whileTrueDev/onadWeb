import React, { useState } from 'react';
import axios from '../../../../../utils/axios';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Router from '@material-ui/icons/Router';
import BarChart from '@material-ui/icons/BarChart';

import Typography from '../../components/Typography';
import Button from '../../components/Button';
import LoginForm from '../Login/LoginForm';
import HOST from '../../../../config';

const marketerSource = {
  title: '빠르고 쉽게 광고를 집행하고 투명하게 확인하세요',
  first: '배너를 등록하고 관련성 매칭을 통해 추천된 크리에이터 목록을 확인하세요.',
  second: '클릭 한번으로 간단하게 광고를 집행하세요.',
  third: '광고가 어떻게 진행되고 있는지, 실시간으로 집행된 금액은 얼마인지, 광고의 효과는 어떻게 되는지 확인하세요.',
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

export default function ProductHowItWorksMarketerItem(props) {
  const {
    classes, check, history, isLogin,
  } = props;

  const { open, handleOpen, handleClose } = useDialog();
  function handleClick() {
    axios.get(`${HOST}/api/dashboard/checkUserType`).then((res) => {
      const { userType } = res.data;
      if (userType === undefined) {
        // 로그인창
        handleOpen();
      } else if (userType === 'marketer') {
        history.push('/dashboard/marketer/main');
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
          {marketerSource.title}
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
                {marketerSource.first}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <div className={classes.number}>2.</div>
              <Router className={classes.icon} />
              <Typography variant="h5" align="center">
                {marketerSource.second}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <div className={classes.number}>3.</div>
              <BarChart className={classes.icon} />
              <Typography variant="h5" align="center">
                {marketerSource.third}
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
          {isLogin ? '대시보드로 이동' : '마케터로 시작하기'}
        </Button>
      </Grow>

      <LoginForm
        open={open}
        isMarketer
        history={history}
        handleClose={handleClose}
      />
    </React.Fragment>
  );
}
ProductHowItWorksMarketerItem.propTypes = {
  classes: PropTypes.object,
  check: PropTypes.bool,
};

ProductHowItWorksMarketerItem.defaultProps = {
  classes: {},
  check: null,
};
