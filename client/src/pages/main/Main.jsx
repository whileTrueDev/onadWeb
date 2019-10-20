import React, { useState, useEffect } from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import ProductCategories from '../../organisms/main/Main/views/Categories/ProductCategories';
import ProductHowItWorks from '../../organisms/main/Main/views/HowItWorks/ProductHowItWorks';
import RePasswordDialog from '../../organisms/main/Main/views/Login/RePassword';
import withRoot from '../../organisms/main/Main/withRoot';
import sources from '../../organisms/main/Main/source/sources';
import axios from '../../utils/axios';
import HOST from '../../utils/config';

const useLoginValue = (history) => {
  const [isLogin, setisLogin] = useState(false);
  const [repasswordOpen, setRepassword] = useState(false);
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
          if (res.data.state) {
            // 임시 로그인되었습니다.
            console.log('임시로그인 되었습니다.');
            setRepassword(true);
          }
          setisLogin(true);
          setUserType(res.data.userType);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return {
    isLogin, repasswordOpen, logout, setRepassword, userType
  };
};

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { history, location } = props;
  const {
    isLogin, repasswordOpen, logout, setRepassword, userType
  } = useLoginValue(history, location);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      <AppAppBar history={history} isLogin={isLogin} logout={logout} />
      <ProductHero
        isLogin={isLogin}
        history={history}
        source={sources.hero}
        userType={userType}
      />
      <ProductCategories history={history} />
      <ProductHowItWorks history={history} isLogin={isLogin} source={sources.howitworks} />
      {/* 문의받기 섹션, 오픈베타에 추가 */
          /* <ProductCTA /> */}
      <AppFooter history={history} />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        history={history}
        logout={logout}
      />
    </div>
  );
});
