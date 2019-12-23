import React from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import ProductCategories from '../../organisms/main/Main/views/Categories/ProductCategories';
import ProductHowItWorks from '../../organisms/main/Main/views/HowItWorks/ProductHowItWorks';
import RePasswordDialog from '../../organisms/main/Main/views/Login/RePassword';
import withRoot from '../../organisms/main/Main/withRoot';
import sources from '../../organisms/main/Main/source/sources';
import useLoginValue from '../../utils/lib/hooks/useLoginValue';
import MainCarousel from '../../organisms/main/Main/views/Carousel/MainCarousel';
import Inqurie from '../../organisms/main/Main/views/Inquire/Inqurie'

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { history, location } = props;
  const {
    isLogin, repasswordOpen, logout, setRepassword, userType
  } = useLoginValue(history, location);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      <MainCarousel />
      <AppAppBar isLogin={isLogin} logout={logout} />
      <ProductHero
        isLogin={isLogin}
        source={sources.hero}
        userType={userType}
      />
      <ProductCategories />
      <ProductHowItWorks isLogin={isLogin} source={sources.howitworks} />
      
      <Inqurie />

      <AppFooter />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
    </div>
  );
});
