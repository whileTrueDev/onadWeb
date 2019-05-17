import React from 'react';

import AppAppBar from '../Main/views/AppAppBar';
import AppFooter from '../Main/views/AppFooter';
import ProductHero from '../Main/views/ProductHero';
import withRoot from '../Main/withRoot';
// import ProductCTA from './views/ProductCTA';
import textSource from './source/textSource';
import Manual from './Manual';


export default withRoot((props) => {
  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);

  return (
    <div>
      <AppAppBar />
      <ProductHero
        text={textSource.heroSector}
        backgroundImage={textSource.heroSector.backImage}
      />
      {/* Login에 따라 크리에이터, 마케터로 나뉘어 기본 탭 설정 하기위해 */}
      {/* <Manual textSource={textSource} isLogin={{ userType: 1 }} /> */}

      <Manual textSource={textSource} />
      <AppFooter />
    </div>
  );
});
