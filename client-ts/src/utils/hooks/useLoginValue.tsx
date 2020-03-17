import React from 'react';
import axios from '../axios';
import HOST from '../../config';
import history from '../../history';

interface LoginCheckResponse {
  error: boolean; state?: number; userType: string;
}

const useLoginValue = (): {
  isLogin: boolean;
  repasswordOpen: boolean;
  logout: () => void;
  setRepassword: React.Dispatch<React.SetStateAction<boolean>>;
  userType: string;
} => {
  const [isLogin, setisLogin] = React.useState<boolean>(false);
  const [repasswordOpen, setRepassword] = React.useState<boolean>(false);
  const [userType, setUserType] = React.useState('');

  // logout function
  const logout = (): void => {
    // setisLogin(false);

    // ****************************************
    // ONAD API v2에서 POST요청으로 바꾸어야 한다.
    // ****************************************
    axios.get(`${HOST}/logout`)
      .then(() => {
        history.push('/');
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  React.useLayoutEffect(() => {
    axios.get<LoginCheckResponse>(`${HOST}/api/login`)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.state) {
            // 임시 로그인되었습니다.
            setRepassword(true);
          }
          setisLogin(true);
          setUserType(res.data.userType);
        } else {
          setisLogin(false);
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
