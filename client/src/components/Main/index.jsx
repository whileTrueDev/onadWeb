import React from 'react';

import AppAppBar from './views/AppAppBar';
import AppFooter from './views/AppFooter';
import ProductHero from './views/ProductHero';
import ProductCategories from './views/ProductCategories';
import ProductHowItWorks from './views/ProductHowItWorks';
import withRoot from './withRoot';
// import ProductCTA from './views/ProductCTA';

const heroInfo = {
  backImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80',
};

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);
  return (
    <div>
      <AppAppBar />
      <ProductHero backgroundImage={heroInfo.backImage} />
      <ProductCategories />
      <ProductHowItWorks />
      {/* 문의받기 섹션, 오픈베타에 추가 */
      /* <ProductCTA /> */}
      <AppFooter />
    </div>
  );
});
