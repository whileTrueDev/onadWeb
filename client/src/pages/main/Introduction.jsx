import React from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import withRoot from '../../organisms/main/Main/withRoot';
import Introduce from '../../organisms/main/Introduction/Introduce';
import IntroduceTop from '../../organisms/main/Introduction/IntroduceTop';
import textSource from './introductionSource/textSource';
import history from '../../history';

import useLoginValue from '../../utils/lib/hooks/useLoginValue';

const MARKETER_TAB_NUMBER = 0;
const CREATOR_TAB_NUMBER = 1;

// this is layout compoent
export default withRoot(() => {
  const { isLogin, logout, userType } = useLoginValue(history);

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
      {/* ->/ header layout */}
      <IntroduceTop source={textSource.topSector} />

      <Introduce
        textSource={textSource}
        userType={userType === 'marketer' ? MARKETER_TAB_NUMBER : CREATOR_TAB_NUMBER}
      />
      {/* footer layout ->/ */}
      <AppFooter />
    </div>
  );
});
