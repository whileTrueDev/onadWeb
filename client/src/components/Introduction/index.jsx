import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import AppAppBar from '../Main/views/Layout/AppAppBar';
import AppFooter from '../Main/views/Layout/AppFooter';
import ProductHero from '../Main/views/Hero/ProductHero';
import withRoot from '../Main/withRoot';
import Introduce from './Introduce';
import textSource from './source/textSource';
import HOST from '../../config';

const useLoginValue = (history) => {
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
export default withRoot((props) => {
  const { heroSector } = textSource;
  const { history } = props;
  const { isLogin, logout, userType } = useLoginValue(history);

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <AppAppBar isLogin={isLogin} logout={logout} />
      <ProductHero
        text={heroSector}
        backgroundImage={heroSector.backImage}
      />
      {/* ->/ header layout */}

      <Introduce
        textSource={textSource}
        userType={userType === 'marketer' ? MARKETER_TAB_NUMBER : CREATOR_TAB_NUMBER}
      />
      {/* footer layout ->/ */}
      <AppFooter />
    </div>
  );
});
