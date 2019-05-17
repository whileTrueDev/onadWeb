import React from 'react';

import AppAppBar from '../Main/views/AppAppBar';
import AppFooter from '../Main/views/AppFooter';
import ProductHero from '../Main/views/ProductHero';
import withRoot from '../Main/withRoot';
import Introduce from './Introduce';
import textSource from './source/textSource';

// this is layout compoent
export default withRoot((props) => {
  const { heroSector } = textSource;

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);

  return (
    <div>
      <AppAppBar />
      <ProductHero
        text={heroSector}
        backgroundImage={heroSector.backImage}
      />
      {/* ->/ header layout */}

      {/* Login에 따라 크리에이터, 마케터로 나뉘어 기본 탭 설정 하기위해 */}
      {/* <Introduce isLogin={{ userType: 1 }} /> */}

      <Introduce textSource={textSource} />
      {/* footer layout ->/ */}
      <AppFooter />
    </div>
  );
});
