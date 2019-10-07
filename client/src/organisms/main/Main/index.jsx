import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import AppAppBar from '../../layout/AppAppBar';
import AppFooter from '../../layout/AppFooter';
import ProductHero from './views/Hero/ProductHero';
import ProductCategories from './views/Categories/ProductCategories';
import ProductHowItWorks from './views/HowItWorks/ProductHowItWorks';
import RePasswordDialog from './views/Login/RePassword';
import withRoot from './withRoot';
import HOST from '../../../utils/config';
import sources from './source/sources';
import BetaDialog from './views/Login/BetaDialog';
import history from '../../../history';

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
