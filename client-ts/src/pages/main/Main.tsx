import React from 'react';
// layout 계열 컴포넌트
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import AppFooter from '../../organisms/main/layouts/AppFooter';
// layout 내부 컨텐츠 계열 컴포넌트
import ProductHero from '../../organisms/main/main/Hero/ProductHero';
import ProductHowItWorks from '../../organisms/main/main/HowItWorks/ProductHowItWorks';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import sources from '../../organisms/main/main/source/sources';
import Inqurie from '../../organisms/main/main/Inquiry/Inquiry';
import InquiryCreator from '../../organisms/main/main/Inquiry/InquiryCreator';
import Indicator from '../../organisms/main/main/Indicators/Indicator';
import HowToUse from '../../organisms/main/main/HowToUse/HowToUse';
import Advantage from '../../organisms/main/main/Advantage/Advantage';
import IntroService from '../../organisms/main/main/IntroService/IntroService';
import Reference from '../../organisms/main/main/Reference/Reference';
// utill 계열 컴포넌트
import useLoginValue from '../../utils/hooks/useLoginValue';
import history from '../../history';
import RenewalDialog from '../../organisms/main/popup/RenewalDialog';
import { useDialog } from '../../utils/hooks';
import CreatorLoginForm from '../../organisms/main/main/login/CreatorLoginForm';

export default function Main(): JSX.Element {
  const {
    isLogin, repasswordOpen, logout, setRepassword,
  } = useLoginValue();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const MainUserType = history.location.pathname;

  // **************************************************
  // 리뉴얼 추가 작업 - 리뉴얼 알림창 및 크리에이터 로그인 다이얼로그 오픈 토글
  // 크리에이터 로그인창
  const creatorLoginDialog = useDialog();
  // 리뉴얼 알림 창
  const renewalDialog = useDialog();
  React.useEffect(() => {
    const now = new Date();
    const noShowDateString = localStorage.getItem('renewal-popup-no-show');
    if (noShowDateString) {
      const noShowDate = new Date(noShowDateString);
      const ONE_DAY = 1000 * 60 * 60 * 24;
      // 다시 보지 않기 클릭 이후 24시간이 지나지 않은 경우 열리지 않게
      if (now.getTime() - noShowDate.getTime() > ONE_DAY) {
        renewalDialog.handleOpen();
      }
    } else { // 다시보지않기를 한번도 누르지 않은 경우
      renewalDialog.handleOpen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {MainUserType === '/marketer' ? (
        <div>
          <AppAppBar isLogin={isLogin} logout={logout} MainUserType="marketer" />
          <ProductHero
            source={sources.hero}
            MainUserType="marketer"
          />
          <Indicator />
          <HowToUse
            source={sources.howTo}
            slideTime={1000}
            MainUserType="marketer"
          />
          <Advantage source={sources.advantage} MainUserType="marketer" />
          <Reference />
          <IntroService />
          <ProductHowItWorks source={sources.howitworks} MainUserType="marketer" logout={logout} />
          <Inqurie />
          <AppFooter />
          <RePasswordDialog
            repasswordOpen={repasswordOpen}
            setRepassword={setRepassword}
            logout={logout}
          />
        </div>
      )
        : (
          <div>
            {/* *******************************  */}
            {/* 온애드 리뉴얼 관련 임시 팝업  */}
            <RenewalDialog
              open={renewalDialog.open}
              onClose={renewalDialog.handleClose}
              onClick={creatorLoginDialog.handleOpen}
            />
            <CreatorLoginForm
              open={creatorLoginDialog.open}
              handleClose={creatorLoginDialog.handleClose}
            />
            {/* 온애드 리뉴얼 관련 임시 팝업  */}
            {/* *******************************  */}

            <AppAppBar isLogin={isLogin} logout={logout} MainUserType="creator" />
            <ProductHero
              source={sources.hero}
              MainUserType="creator"
            />
            <Indicator />
            <HowToUse
              source={sources.howTo}
              slideTime={1000}
              MainUserType="creator"
            />
            <Advantage source={sources.advantage} MainUserType="creator" />
            <Reference />
            <ProductHowItWorks source={sources.howitworks} MainUserType="creator" logout={logout} />
            <InquiryCreator />
            <AppFooter />
            <RePasswordDialog
              repasswordOpen={repasswordOpen}
              setRepassword={setRepassword}
              logout={logout}
            />
          </div>
        )}
    </div>
  );
}
