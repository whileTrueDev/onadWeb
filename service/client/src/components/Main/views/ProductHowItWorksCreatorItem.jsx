import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Grow } from '@material-ui/core';
import Button from '../components/Button';
import Typography from '../components/Typography';

export default function ProductHowItWorksCreatorItem(props) {
  const { classes, check } = props;
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
        간단한 설정만으로 광고료를 획득할 수 있습니다. 광고를 유치하세요.
        </Typography>
      </Grow>
      <div>
        <Grow
          in={check}
          {...(check ? { timeout: 1500 } : {})}
        >
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <img
                  src="/images/productValues3.svg"
                  alt="suitcase"
                  className={classes.image}
                />
                <Typography variant="h5" align="center">
                    OBS, Xsplit 등의 방송송출 프로그램에 오버레이 주소를 추가시키기만 하세요.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>
                <img
                  src="/images/productValues1.svg"
                  alt="graph"
                  className={classes.image}
                />
                <Typography variant="h5" align="center">
                    한번 설정하기만 하면, 방송과 관련 있는 광고가 자동으로 송출됩니다.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <img
                  src="/images/productValues2.svg"
                  alt="clock"
                  className={classes.image}
                />
                <Typography variant="h5" align="center">
                  어떤 광고가 진행되어 왔는지, 내 총 광고수익은 얼마인지, 대시보드에서 쉽게 확인하고, 수익금을 출금하세요.
                </Typography>
              </div>
            </Grid>

          </Grid>
        </Grow>
      </div>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Button
          color="secondary"
          size="large"
          variant="contained"
          className={classes.button}
          component="a"
          href="/dashboard"
        >
        크리에이터로 시작하기
        </Button>
      </Grow>
    </React.Fragment>
  );
}
ProductHowItWorksCreatorItem.propTypes = {
  classes: PropTypes.object.isRequired,
  check: PropTypes.bool.isRequired,
};
