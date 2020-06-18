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
import withRoot from './withRoot';

export default withRoot(() => {
  const {
    isLogin, repasswordOpen, logout, setRepassword,
  } = useLoginValue();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const MainUserType = history.location.pathname;

  return (
    <div>
      {/* <CssBaseline /> */}
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
          {/* <Inqurie /> */}
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
            {/* <InquiryCreator /> */}
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
});
