import React from 'react';

import AppAppBar from './views/AppAppBar';
import AppFooter from './views/AppFooter';
import ProductHero from './views/ProductHero';
import ProductCategories from './views/ProductCategories';
import ProductHowItWorks from './views/ProductHowItWorks';
import withRoot from './withRoot';
// import ProductCTA from './views/ProductCTA';

export default withRoot(() => (
  <div>
    <AppAppBar />
    <ProductHero />
    <ProductCategories />
    <ProductHowItWorks />
    {/* 문의받기 섹션, 오픈베타에 추가 */
    /* <ProductCTA /> */}
    <AppFooter />
  </div>
));
