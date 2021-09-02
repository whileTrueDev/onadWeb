// material-UI
import { Button } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// 내부 소스
// 프로젝트 내부 모듈
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import sources from '../source/clientMainSource';
// 컴포넌트
import NavTop from '../components/mainpage/layout/navTop';
import RePasswordDialog from '../components/mainpage/login/rePassword';
import ProductHero from '../components/mainpage/main/hero/productHero';
import Contact from '../components/mainpage/main/contact/contact';
import Indicator from '../components/mainpage/main/indicators/indicator';
import HowToUse from '../components/mainpage/main/howToUse/howToUse';
import Advantage from '../components/mainpage/main/advantage/advantage';
import Reference from '../components/mainpage/main/reference/reference';
// util 계열
// 컴포넌트
import ParallaxScroll from '../components/mainpage/main/parallaxScroll';
// 스타일
// utill 계열
import useLoginValue from '../utils/hooks/useLoginValue';
import axios from '../utils/axios';
import HOST from '../config';
import { useDialog } from '../utils/hooks';
import openKakaoChat from '../utils/openKakaoChat';

interface MainProps {
  nowBroadcastData: number;
  bannerViewData: number;
  contractedCreatorData: number;
  totoalFollowersData: number;
}

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

export default function Main({
  nowBroadcastData,
  bannerViewData,
  contractedCreatorData,
  totoalFollowersData,
}: MainProps): JSX.Element {
  const { isLogin, repasswordOpen, logout, setRepassword } = useLoginValue();
  const classes = useStyles();
  const [psIndex, setPsIndex] = useState(0);

  // **************************************************
  // 라이브커머스 이벤트 팝업
  const liveCommerceEventDialog = useDialog();
  useEffect(() => {
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
        <NavTop isLogin={isLogin} logout={logout} MainUserType />
        <ParallaxScroll
          isLogin={isLogin}
          setPsIndex={setPsIndex}
          psIndex={psIndex}
          bgfixedRange={[0, 3]}
          renewalDialog={liveCommerceEventDialog.open}
        >
          <div className={classes.parallax} data-parallax="0">
            {psIndex === 0 && (
              <ProductHero source={sources.hero} isLogin={isLogin} MainUserType logout={logout} />
            )}
          </div>

          <div className={classes.parallax} data-parallax="1">
            {psIndex === 1 && (
              <Indicator
                nowBroadcast={nowBroadcastData}
                bannerView={bannerViewData}
                contractedCreator={contractedCreatorData}
                totalFollower={totoalFollowersData}
              />
            )}
          </div>

          <div className={classes.parallax} data-parallax="2">
            {psIndex === 2 && <HowToUse source={sources.howTo} MainUserType />}
          </div>

          <div className={classes.parallax} data-parallax="3">
            {psIndex === 3 && <Advantage source={sources.advantage} MainUserType />}
          </div>

          <div className={classes.parallax} data-parallax="4">
            {psIndex === 4 && <Reference />}
          </div>

          <div className={classes.parallax} data-parallax="5">
            {psIndex === 5 && (
              <Contact source={sources.howitworks} MainUserType isLogin={isLogin} logout={logout} />
            )}
          </div>
        </ParallaxScroll>
        <RePasswordDialog
          repasswordOpen={repasswordOpen}
          setRepassword={setRepassword}
          logout={logout}
        />
      </div>
      <Button className={classes.kakaoContact} onClick={openKakaoChat} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const nowBroadcast = await axios.get(`${HOST}/creators/broadcast`);

  // 데이터 요청 시간이 길어서 일단 주석 처리
  // const bannerView = await axios.get(`${HOST}/banners/impression`)
  // const contractedCreator = await axios.get(`${HOST}/creators/contracted`)
  // const totoalFollowers = await axios.get(`${HOST}/creators/detail`)

  const nowBroadcastData = await nowBroadcast.data[0].nowBroadcast;
  // 데이터 요청 시간이 길어서 일단 주석 처리
  // const bannerViewData = await bannerView.data[0].bannerView
  // const contractedCreatorData = await contractedCreator.data[0].contractedCreator
  // const totoalFollowersData = await totoalFollowers.data[0].totalFollowers

  return {
    props: {
      nowBroadcastData,
      bannerViewData: 26654256,
      contractedCreatorData: 1476,
      totoalFollowersData: 265083,
    },
  };
};
