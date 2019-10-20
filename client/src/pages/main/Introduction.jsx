import React, { useState, useEffect } from 'react';
import AppFooter from '../../organisms/main/layout/AppFooter';
import withRoot from '../../organisms/main/Main/withRoot';
import Introduce from '../../organisms/main/Introduction/Introduce';
import textSource from '../../organisms/main/Introduction/source/textSource';
import sources from '../../organisms/main/Main/source/sources';
import axios from '../../utils/axios';
import HOST from '../../utils/config';

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
  const { history } = props;
  const { isLogin, logout, userType } = useLoginValue(history);

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Introduce
        isLogin={isLogin}
        logout={logout}
        history={history}
        textSource={textSource}
        source={textSource.topSector}
        productsource={sources}
        userType={userType === 'marketer' ? MARKETER_TAB_NUMBER : CREATOR_TAB_NUMBER}
      />
      {/* footer layout ->/ */}
      {/* ->/ header layout */}


      <AppFooter />
    </div>
  );
});
