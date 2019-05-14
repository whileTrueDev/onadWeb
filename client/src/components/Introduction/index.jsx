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
      <Introduce />
      {/* /<- footer layout */}
      <AppFooter />
    </div>
  );
});
