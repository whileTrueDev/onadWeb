import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Button,
  Tooltip, useScrollTrigger, AppBar, Toolbar
} from '@material-ui/core';
import { Domain, Dashboard } from '@material-ui/icons';
import useStyles from './style/NavTop.style';
import LoginPopover from '../main/login/LoginPopover';
import HOST from '../../../config';
import axios from '../../../utils/axios';
import history from '../../../history';
import useLoginValue from '../../../utils/hooks/useLoginValue';


interface NavTopProps {
  noButtons?: boolean;
  MainUserType?: boolean;
  logout: () => void;
  isLogin: boolean;
}

function NavTop({
  noButtons, MainUserType,
  logout, isLogin
}: NavTopProps): JSX.Element {

  const classes = useStyles();

  const trigger = useScrollTrigger({ threshold: 100, disableHysteresis: true });

  // 마이페이지 이동 핸들러
  const handleClick = useCallback((buttonType) => {
    axios.get(`${HOST}/login/check`)
      .then((res) => {
        const { userType } = res.data;
        if (userType === undefined) {
          if (buttonType) {
            alert('로그인 이후 이용하세요');
          }
        } else if (userType === 'marketer') {
          history.push('/mypage/marketer/main');
        } else if (userType === 'creator') {
          history.push('/mypage/creator/main');
        }
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  // 회원가입 버튼
  const RegButton = () => {
    if (isLogin) {
      return (
        <Button
          className={classNames(classes.tabButton, classes.coloredLink)}
          onClick={handleClick}
        >
          마이페이지
        </Button>
      );
    }
    return <LoginPopover type="회원가입" MainUserType={MainUserType} logout={logout} />;
  }

  // 로그인 버튼
  const LoginButton = () => {
    if (isLogin) {
      return (
        <Button
          className={classes.tabButton}
          color="inherit"
          onClick={logout}
        >
          로그아웃
        </Button>
      );
    }
    return (
      <LoginPopover
        type="로그인"
        MainUserType={MainUserType}
        logout={logout}
      />
    );
  };

  return (
    <>
      <AppBar position="fixed" className={classNames({[classes.root]: !trigger, [classes.rootTriger]: trigger })}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.blank} />

          <a href="/" className={classes.logo}>
            <img src="/logo/textLogo.png" alt="textlogo" className={classes.logo}/>
          </a>

          <div className={classes.tabButtonWrap}>
            {/* 이용방법 버튼 */}
            <Button
              className={classes.tabButton}
              component={Link}
              to={MainUserType ? ('/introduce/marketer') : ('/introduce/creator')}
            >
              이용방법
            </Button>

            {/* 크리에이터 리스트 버튼 */}
            {MainUserType ? (
              <div>
                <Button
                  className={classes.creatorList}
                  component={Link}
                  to="/creatorlist"
                >
                  크리에이터 리스트
                </Button>
              </div>
            ) : null}

            {/* 회원가입 버튼 */}
            <RegButton />

            {/* 로그인 버튼 */}
            <LoginButton />
            
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavTop;
