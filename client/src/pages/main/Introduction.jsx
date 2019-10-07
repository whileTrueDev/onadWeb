import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import withRoot from '../../organisms/main/Main/withRoot';
import Introduce from '../../organisms/main/Introduction/Introduce';
import IntroduceTop from '../../organisms/main/Introduction/IntroduceTop';
import textSource from './introductionSource/textSource';
import HOST from '../../utils/config';
import history from '../../history';

const useLoginValue = () => {
  const [isLogin, setisLogin] = useState(false);
  const [userType, setUserType] = useState('');

  // logout function
  const logout = () => {
    setisLogin(false);
    axios.get(`${HOST}/api/login/logout`)
      .then(() => {
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios.get(`${HOST}/api/login/check`)
      .then((res) => {
        if (!res.data.error) {
          setisLogin(true);
          setUserType(res.data.userType);
        } else {
          setisLogin(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setisLogin(false);
      });
  }, []);

  return { isLogin, logout, userType };
};

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
