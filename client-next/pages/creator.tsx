// material-UI
import { Button, Hidden } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// 내부 소스
// 프로젝트 내부 모듈
import { useState, useEffect } from 'react';
import * as React from 'react';
// 컴포넌트
import NavTop from '../components/layout/navTop';
import RePasswordDialog from '../components/login/rePassword';
import ProductHero from '../components/main/hero/productHero';
import Contact from '../components/main/contact/contact';
import sources from '../source/clientMainSource';
import Indicator from '../components/main/indicators/indicator';
import HowToUse from '../components/main/howToUse/howToUse';
import Advantage from '../components/main/advantage/advantage';
import Reference from '../components/main/reference/reference';
// util 계열
// 컴포넌트
import ParallaxScroll from '../components/main/parallaxScroll';
import ReferralCodeEventDialog from '../components/shared/referralCodeEventDialog';
// 스타일
// utill 계열
import useLoginValue from '../utils/hooks/useLoginValue';
import axios from '../utils/axios';
import HOST from '../config';
import { useDialog } from '../utils/hooks';
import openKakaoChat from '../utils/openKakaoChat';

const useStyles = makeStyles(theme => ({
  parallax: {
    width: '100%',
    height: 'calc(100vh)',
  },
  root: {
    position: 'relative',
  },
  kakaoContact: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    zIndex: 300,
    [theme.breakpoints.up('sm')]: {
      width: 270.5,
      height: 50,
      background: "url('/main/contact/liveContactSpreaded.png') no-repeat center center",
      backgroundSize: 'cover',
      right: 10,
      bottom: 10,
    },
    [theme.breakpoints.down('xs')]: {
      background: "url('/main/contact/liveContact.svg') no-repeat center center",
      width: 40,
      height: 40,
      right: 10,
      bottom: 10,
    },
  },
}));

export default function Main(): JSX.Element {
  const { isLogin, repasswordOpen, logout, setRepassword } = useLoginValue();
  const classes = useStyles();
  const [psIndex, setPsIndex] = useState(0);
  const [nowBroadcast, setNowBroadcast] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${HOST}/creators/broadcast`).then(res => {
      if (res.data) {
        setNowBroadcast(res.data[0].nowBroadcast);
        setLoading(true);
      }
    });
  }, [psIndex]);

  // **************************************************
  // 라이브커머스 이벤트 팝업
  const liveCommerceEventDialog = useDialog();
  React.useEffect(() => {
    const now = new Date();
    const noShowDateString = localStorage.getItem('renewal-popup-no-show');
    if (noShowDateString) {
      const noShowDate = new Date(noShowDateString);
      const ONE_DAY = 1000 * 60 * 60 * 24;
      // 다시 보지 않기 클릭 이후 24시간이 지나지 않은 경우 열리지 않게
      if (now.getTime() - noShowDate.getTime() > ONE_DAY) {
        liveCommerceEventDialog.handleOpen();
      }
    } else {
      // 다시보지않기를 한번도 누르지 않은 경우
      liveCommerceEventDialog.handleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
        <div>
        <NavTop isLogin={isLogin} logout={logout} MainUserType={false} />
          <ParallaxScroll
            isLogin={isLogin}
            setPsIndex={setPsIndex}
            psIndex={psIndex}
            loading={loading}
            bgfixedRange={[0, 3]}
            // timer={timer}
            // setTimer={setTimer}
            renewalDialog={liveCommerceEventDialog.open}
          >
            <div className={classes.parallax} data-parallax="0">
              {psIndex === 0 && (
                <ProductHero
                  source={sources.hero}
                  isLogin={isLogin}
                  MainUserType={false}
                  logout={logout}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="1">
              {psIndex === 1 && loading && <Indicator nowBroadcast={nowBroadcast} />}
            </div>

            <div className={classes.parallax} data-parallax="2">
              {psIndex === 2 && (
                <HowToUse
                  source={sources.howTo}
                  MainUserType={false}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="3">
              {psIndex === 3 && (
                <Advantage source={sources.advantage} MainUserType={false} />
              )}
            </div>

            <div className={classes.parallax} data-parallax="4">
              {psIndex === 4 && <Reference />}
            </div>

            <div className={classes.parallax} data-parallax="5">
              {psIndex === 5 && (
                <Contact
                  source={sources.howitworks}
                  MainUserType={false}
                  isLogin={isLogin}
                  logout={logout}
                />
              )}
            </div>
          </ParallaxScroll>
          <RePasswordDialog
            repasswordOpen={repasswordOpen}
            setRepassword={setRepassword}
            logout={logout}
          />

          {/* CPS  관련 임시 팝업  */}
          <Hidden xsDown>
            <ReferralCodeEventDialog
              open={liveCommerceEventDialog.open}
              onClose={liveCommerceEventDialog.handleClose}
            />
          </Hidden>
          {/* 온애드 리뉴얼 관련 임시 팝업  */}
          {/* *******************************  */}
        </div>
      <Button className={classes.kakaoContact} onClick={openKakaoChat} />
    </div>
  );
}
