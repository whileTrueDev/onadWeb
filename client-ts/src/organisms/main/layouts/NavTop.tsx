import { useState, useCallback, useEffect, useMemo } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu,
  MenuItem,
  IconButton,
  Button,
  useScrollTrigger,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import useStyles from './style/NavTop.style';
import LoginPopover from '../main/login/LoginPopover';
import HOST from '../../../config';
import axios from '../../../utils/axios';
import history from '../../../history';
import { useAuthStore } from '../../../store/authStore';

function NavTop(): JSX.Element {
  const { pathname } = useLocation();
  const isMarketerPage = useMemo(() => pathname.includes('/marketer'), [pathname]);
  const classes = useStyles();
  const { isLoggedIn: isLogin, logout, loginCheck } = useAuthStore();
  useEffect(() => {
    loginCheck();
  }, [loginCheck]);

  const trigger = useScrollTrigger({ threshold: 100, disableHysteresis: true });

  // 마이페이지 이동 핸들러
  const handleClick = useCallback(buttonType => {
    axios
      .get(`${HOST}/login/check`)
      .then(res => {
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
      })
      .catch(err => {
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
    return <LoginPopover type="회원가입" />;
  };

  // 로그인 버튼
  const LoginButton = () => {
    if (isLogin) {
      return (
        <Button className={classes.tabButton} color="inherit" onClick={logout}>
          로그아웃
        </Button>
      );
    }
    return <LoginPopover type="로그인" />;
  };

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // 모바일 메뉴버튼 오픈 state
  function handleMobileMenuOpen(event: React.MouseEvent<HTMLButtonElement>): void {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  // 모바일 메뉴버튼 오픈 닫는 핸들링 함수
  function handleMobileMenuClose(): void {
    setMobileMoreAnchorEl(null);
  }

  // 모바일 메뉴 컴포넌트
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <div>
        <MenuItem className={classes.buttonWraper}>
          <Button
            className={classes.mobileButton}
            component={Link}
            to={isMarketerPage ? '/introduce/marketer' : '/introduce/creator'}
          >
            이용 방법
          </Button>
        </MenuItem>

        {isMarketerPage ? (
          <MenuItem className={classes.buttonWraper}>
            <Button className={classes.mobileButton} component={Link} to="/creatorlist">
              방송인 목록
            </Button>
          </MenuItem>
        ) : null}

        <MenuItem className={classes.buttonWraper}>
          {isLogin ? (
            <Button
              className={classNames(classes.mobileButton, classes.coloredLink)}
              onClick={handleClick}
            >
              마이페이지
            </Button>
          ) : (
            <LoginPopover type="회원가입" />
          )}
        </MenuItem>

        <MenuItem className={classes.buttonWraper}>
          {isLogin ? (
            <Button className={classes.mobileButton} onClick={logout}>
              로그아웃
            </Button>
          ) : (
            <LoginPopover type="로그인" />
          )}
        </MenuItem>
      </div>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        className={classNames({ [classes.root]: !trigger, [classes.rootTriger]: trigger })}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.blank} />

          <a href="/" className={classes.logo}>
            <img src="/logo/textLogo.png" alt="textlogo" className={classes.logo} />
          </a>

          <div className={classes.tabButtonWrap}>
            {/* 이용방법 버튼 */}
            <Button
              className={classes.tabButton}
              component={Link}
              to={isMarketerPage ? '/introduce/marketer' : '/introduce/creator'}
            >
              이용방법
            </Button>

            {/* 방송인 목록 버튼 */}
            {isMarketerPage ? (
              <div>
                <Button className={classes.creatorList} component={Link} to="/creatorlist">
                  방송인 목록
                </Button>
              </div>
            ) : null}

            {/* 회원가입 버튼 */}
            <RegButton />

            {/* 로그인 버튼 */}
            <LoginButton />
          </div>

          <div className={classes.rightMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="primary">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
        {renderMobileMenu}
      </AppBar>
    </>
  );
}

export default NavTop;
