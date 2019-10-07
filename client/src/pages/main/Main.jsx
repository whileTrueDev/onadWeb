import React from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import ProductCategories from '../../organisms/main/Main/views/Categories/ProductCategories';
import ProductHowItWorks from '../../organisms/main/Main/views/HowItWorks/ProductHowItWorks';
import RePasswordDialog from '../../organisms/main/Main/views/Login/RePassword';
import withRoot from '../../organisms/main/Main/withRoot';
import sources from '../../organisms/main/Main/source/sources';
import BetaDialog from '../../organisms/main/Main/views/Login/BetaDialog';

import useLoginValue from '../../utils/lib/hooks/useLoginValue';
import useDialog from '../../utils/lib/hooks/useDialog';


export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { location } = props;
  const {
    isLogin, repasswordOpen, logout, setRepassword,
  } = useLoginValue(location);

  // for betaDIalog
  const { open, handleClose } = useDialog();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      <AppAppBar isLogin={isLogin} logout={logout} />
      <ProductHero
        isLogin={isLogin}
        source={sources.hero}
      />
      <ProductCategories />
      <ProductHowItWorks isLogin={isLogin} />
      {/* 문의받기 섹션, 오픈베타에 추가 */
          /* <ProductCTA /> */}
      <AppFooter />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
      <BetaDialog
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
});
