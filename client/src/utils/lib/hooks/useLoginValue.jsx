import React from 'react';
import axios from '../../axios';
import HOST from '../../config';
import history from '../../../history';

const useLoginValue = () => {
  const [isLogin, setisLogin] = React.useState(false);
  const [repasswordOpen, setRepassword] = React.useState(false);
  const [userType, setUserType] = React.useState('');

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

  React.useLayoutEffect(() => {
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

export default useLoginValue;
