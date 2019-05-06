import React from 'react';

import AppAppBar from './views/AppAppBar';
import AppFooter from './views/AppFooter';
import ProductHero from './views/ProductHero';
import ProductCategories from './views/ProductCategories';
import ProductHowItWorks from './views/ProductHowItWorks';
import ProductCTA from './views/ProductCTA';
import withRoot from './withRoot';

export default withRoot(() => (
  <div>
    <AppAppBar />
    <ProductHero />
    <ProductCategories />
    <ProductHowItWorks />
    <ProductCTA />
    <AppFooter />
  </div>
));
