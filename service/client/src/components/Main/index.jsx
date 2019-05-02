import React from 'react';

import AppAppBar from './views/AppAppBar';
import AppFooter from './views/AppFooter';
import ProductHero from './views/ProductHero';
import withRoot from './withRoot';

export default withRoot(() => (
  <div>
    <AppAppBar />
    <ProductHero />
    <AppFooter />
  </div>
));
