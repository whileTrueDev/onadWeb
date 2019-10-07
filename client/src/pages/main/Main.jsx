import React, { useState, useEffect } from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import ProductCategories from '../../organisms/main/Main/views/Categories/ProductCategories';
import ProductHowItWorks from '../../organisms/main/Main/views/HowItWorks/ProductHowItWorks';
import RePasswordDialog from '../../organisms/main/Main/views/Login/RePassword';
import withRoot from '../../organisms/main/Main/withRoot';
import sources from '../../organisms/main/Main/source/sources';
import BetaDialog from '../../organisms/main/Main/views/Login/BetaDialog';

import axios from '../../utils/axios';
import HOST from '../../utils/config';
import history from '../../history';

const useLoginValue = () => {
  const [isLogin, setisLogin] = useState(false);
  const [repasswordOpen, setRepassword] = useState(false);

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
          if (res.data.state) {
            // 임시 로그인되었습니다.
            console.log('임시로그인 되었습니다.');
            setRepassword(true);
          }
          setisLogin(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return {
    isLogin, repasswordOpen, logout, setRepassword,
  };
};

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { location } = props;
  const {
    isLogin, repasswordOpen, logout, setRepassword,
  } = useLoginValue(location);

  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      <AppAppBar isLogin={isLogin} logout={logout} />
      <ProductHero
        isLogin={isLogin}
        source={sources.hero}
      />
      <ProductCategories />
      <ProductHowItWorks isLogin={isLogin} />
      {/* 문의받기 섹션, 오픈베타에 추가 */
          /* <ProductCTA /> */}
      <AppFooter />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
      <BetaDialog
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
});
