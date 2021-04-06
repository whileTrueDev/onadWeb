import React, { useState, useEffect } from 'react';
import { Button, Hidden } from '@material-ui/core';
// layout 계열 컴포넌트
import makeStyles from '@material-ui/core/styles/makeStyles';
import NavTop from '../../organisms/main/layouts/NavTop';
// layout 내부 컨텐츠 계열 컴포넌트
import ProductHero from '../../organisms/main/main/Hero/ProductHero';
import Contact from '../../organisms/main/main/Contact/Contact';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import sources from '../../organisms/main/main/source/sources';
import Indicator from '../../organisms/main/main/Indicators/Indicator';
import HowToUse from '../../organisms/main/main/HowToUse/HowToUse';
import Advantage from '../../organisms/main/main/Advantage/Advantage';
import Reference from '../../organisms/main/main/Reference/Reference';
// utill 계열 컴포넌트
import useLoginValue from '../../utils/hooks/useLoginValue';
import history from '../../history';
import ParallaxScroll from './sub/ParallaxScroll';
import axios from '../../utils/axios';
import HOST from '../../config';
import CPSEventDialog from '../../organisms/shared/popup/CPSEventDialog';
import { useDialog } from '../../utils/hooks';
import openKakaoChat from '../../utils/openKakaoChat';


const useStyles = makeStyles((theme) => ({
  parallax: {
    width: '100%',
    height: 'calc(100vh)',
  },
  root: {
    position: 'relative'
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
      background: 'url(\'/contact/liveContactSpreaded.png\') no-repeat center center',
      backgroundSize: 'cover',
      right: 10,
      bottom: 10,
    },
    [theme.breakpoints.down('xs')]: {
      background: 'url(\'/contact/liveContact.svg\') no-repeat center center',
      width: 40,
      height: 40,
      right: 10,
      bottom: 10,
    }
  }
}));

export default function Main(): JSX.Element {
  const {
    isLogin, repasswordOpen, logout, setRepassword,
  } = useLoginValue();

  const classes = useStyles();
  const [psIndex, setPsIndex] = useState(0);
  // const [isDown, setIsDown] = useState(false)
  // const [offsetY, setOffsetY] = useState(0)
  const [nowBroadcast, setNowBroadcast] = useState(50);
  const [loading, setLoading] = useState(false);
  // const [timer, setTimer] = useState<NodeJS.Timeout>();

  const MainUserType = (history.location.pathname === '/marketer');
  React.useEffect(() => {
    document.title = '온애드 | 1인 미디어 실시간 광고 플랫폼';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axios.get(`${HOST}/creators/broadcast`)
      .then((res) => {
        if (res.data) {
          setNowBroadcast(res.data[0].nowBroadcast);
          setLoading(true);
        }
      });

    // 모바일, 태블릿 pointer Event 임시 주석
    // function onUp() {
    //   setIsDown(false)
    // }
    // document.addEventListener('pointerup', onUp);

    // return () => {
    //   document.removeEventListener('pointerup', onUp);
    // }
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
    } else { // 다시보지않기를 한번도 누르지 않은 경우
      liveCommerceEventDialog.handleOpen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      {MainUserType ? (
        <div>
          <NavTop isLogin={isLogin} logout={logout} MainUserType={MainUserType} />
          <ParallaxScroll
            isLogin={isLogin}
            setPsIndex={setPsIndex}
            psIndex={psIndex}
            loading={loading}
            bgfixedRange={[0, 3]}
            // timer={timer}
            // setTimer={setTimer}
            renewalDialog={liveCommerceEventDialog.open}
            // isDown={isDown}
            // setIsDown={setIsDown}
            // offsetY={offsetY}
            // setOffsetY={setOffsetY}
          >
            <div className={classes.parallax} data-parallax="0">
              { psIndex === 0 && (
                <ProductHero
                  source={sources.hero}
                  isLogin={isLogin}
                  MainUserType={MainUserType}
                  logout={logout}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="1">
              { psIndex === 1 && loading && (
                <Indicator nowBroadcast={nowBroadcast} />
              )}
            </div>

            <div className={classes.parallax} data-parallax="2">
              { psIndex === 2 && (
                <HowToUse
                  source={sources.howTo}
                  MainUserType={MainUserType}
                  // timer={timer}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="3">
              { psIndex === 3 && (
                <Advantage
                  source={sources.advantage}
                  MainUserType={MainUserType}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="4">
              { psIndex === 4 && (
                <Reference />
              )}
            </div>

            <div className={classes.parallax} data-parallax="5">
              { psIndex === 5 && (
                <Contact
                  source={sources.howitworks}
                  MainUserType={MainUserType}
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
        </div>
      )
        : (
          <div>
            <NavTop isLogin={isLogin} logout={logout} MainUserType={MainUserType} />
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
                { psIndex === 0 && (
                <ProductHero
                  source={sources.hero}
                  isLogin={isLogin}
                  MainUserType={MainUserType}
                  logout={logout}
                />
                )}
              </div>

              <div className={classes.parallax} data-parallax="1">
                { psIndex === 1 && loading && (
                <Indicator nowBroadcast={nowBroadcast} />
                )}
              </div>

              <div className={classes.parallax} data-parallax="2">
                { psIndex === 2 && (
                <HowToUse
                  source={sources.howTo}
                  MainUserType={MainUserType}
                  // timer={timer}
                />
                )}
              </div>

              <div className={classes.parallax} data-parallax="3">
                { psIndex === 3 && (
                <Advantage
                  source={sources.advantage}
                  MainUserType={MainUserType}
                />
                )}
              </div>

              <div className={classes.parallax} data-parallax="4">
                { psIndex === 4 && (
                <Reference />
                )}
              </div>

              <div className={classes.parallax} data-parallax="5">
                { psIndex === 5 && (
                <Contact
                  source={sources.howitworks}
                  MainUserType={MainUserType}
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
              <CPSEventDialog
                open={liveCommerceEventDialog.open}
                onClose={liveCommerceEventDialog.handleClose}
              />
            </Hidden>
            {/* 온애드 리뉴얼 관련 임시 팝업  */}
            {/* *******************************  */}
          </div>
        )}
      <Button
        className={classes.kakaoContact}
        onClick={openKakaoChat}
      />
    </div>
  );
}
