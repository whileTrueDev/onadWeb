import React from 'react';

import AppAppBar from '../Main/views/AppAppBar';
import AppFooter from '../Main/views/AppFooter';
import ProductHero from '../Main/views/ProductHero';
import withRoot from '../Main/withRoot';
// import ProductCTA from './views/ProductCTA';

const heroInfo = {
  text: {
    title: '매뉴얼을 통해 쉽게',
    subTitle: '당신의 광고를 실현하세요',
    body: '간단한 작업만으로 OnAd를 이용할 수 있습니다.',
    tail: '쉽게 따라하세요.',
  },
  backImage: 'https://images.unsplash.com/photo-1557509430-2f5317a45752?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
};

export default withRoot((props) => {
  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);

  return (
    <div>
      <AppAppBar />
      <ProductHero
        text={heroInfo.text}
        backgroundImage={heroInfo.backImage}
      />
      <AppFooter />
    </div>
  );
});
