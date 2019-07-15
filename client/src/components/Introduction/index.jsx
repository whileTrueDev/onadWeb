import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppAppBar from '../Main/views/Layout/AppAppBar';
import AppFooter from '../Main/views/Layout/AppFooter';
import ProductHero from '../Main/views/Hero/ProductHero';
import withRoot from '../Main/withRoot';
import Introduce from './Introduce';
import textSource from './source/textSource';
import HOST from '../../config';


const useLoginValue = (location) => {
  const [isLogin, setisLogin] = useState(null);

  useEffect(() => {
    axios.get(`${HOST}/api/login/check`)
      .then((res) => {
        if (res.data) {
          const { userType } = res.data.user;
          setisLogin(userType);
        } else {
          console.log('로그인이 되어있지 않습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location]);

  return { isLogin };
};

const MARKETER_TAB_NUMBER = 0;
const CREATOR_TAB_NUMBER = 1;

// this is layout compoent
export default withRoot((props) => {
  const { heroSector } = textSource;
  const { location } = props;
  const { isLogin } = useLoginValue(location);

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);

  return (
    <div>
      <AppAppBar isLogin={isLogin} />
      <ProductHero
        text={heroSector}
        backgroundImage={heroSector.backImage}
      />
      {/* ->/ header layout */}

      <Introduce
        textSource={textSource}
        userType={isLogin === 'marketer' ? MARKETER_TAB_NUMBER : CREATOR_TAB_NUMBER}
      />
      {/* footer layout ->/ */}
      <AppFooter />
    </div>
  );
});
