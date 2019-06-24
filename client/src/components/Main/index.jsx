import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppAppBar from './views/AppAppBar';
import AppFooter from './views/AppFooter';
import ProductHero from './views/ProductHero';
import ProductCategories from './views/ProductCategories';
import ProductHowItWorks from './views/ProductHowItWorks';
import withRoot from './withRoot';
import RePasswordDialog from './views/RePassword';
// import ProductCTA from './views/ProductCTA';

const heroInfo = {
  backImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80',
};

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { history } = props;
  const [isLogin, setisLogin] = useState(false);
  const [repasswordOpen, setRepassword] = useState(false);

  useEffect(() => {
    axios.get('/login/check')
      .then((res) => {
        if (res.data) {
          console.log('로그인 되어있습니다.');
          if (res.data.user.temporaryLogin === 1) {
            console.log('임시로그인되었습니다.');
            setRepassword(true);
          }
          setisLogin(true);
        } else {
          console.log('로그인이 되어있지 않습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });

    window.scrollTo(0, 0);
  }, [props.location]);

  const logout = () => {
    setisLogin(false);
    axios.get('/login/logout')
      .then((res) => {
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <AppAppBar history={history} isLogin={isLogin} setisLogin={setisLogin} logout={logout} />
      <ProductHero backgroundImage={heroInfo.backImage} history={history} />
      <ProductCategories />
      <ProductHowItWorks />
      {/* 문의받기 섹션, 오픈베타에 추가 */
      /* <ProductCTA /> */}
      <AppFooter />
      <RePasswordDialog repasswordOpen={repasswordOpen} setRepassword={setRepassword} history={history} logout={logout} />
    </div>
  );
});
