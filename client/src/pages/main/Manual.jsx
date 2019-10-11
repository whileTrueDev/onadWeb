import React from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import withRoot from '../../organisms/main/Main/withRoot';
import textSource from './manualSource/textSource';
import Manual from '../../organisms/main/Manual/Manual';
import useLoginValue from '../../utils/lib/hooks/useLoginValue';


const MARKETER_TAB_NUMBER = 0;
const CREATOR_TAB_NUMBER = 1;

export default withRoot(() => {
  const { isLogin, logout, userType } = useLoginValue();

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <AppAppBar isLogin={isLogin} logout={logout} />
      <ProductHero
        isLogin={isLogin}
        source={textSource.heroSector}
      />
      <Manual
        textSource={textSource}
        userType={userType === 'marketer' ? MARKETER_TAB_NUMBER : CREATOR_TAB_NUMBER}
      />
      <AppFooter />
    </div>
  );
});
