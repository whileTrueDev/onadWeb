// material-UI
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
// 내부 소스
// 프로젝트 내부 모듈
import { useState, useCallback } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import textLogo from '../../../public/logo/textLogo.png';
// 컴포넌트
import LoginPopover from '../login/loginPopover'; // 현재 여기 작업
// util 계열
import HOST from '../../../config';
import axios from '../../../utils/axios';
// 스타일
import useStyles from '../../../styles/mainpage/layout/navTop.style';

interface NavTopProps {
  MainUserType?: boolean;
  logout: () => void;
  isLogin?: boolean;
}

function NavTop({ MainUserType, logout, isLogin }: NavTopProps): JSX.Element {
  const classes = useStyles();
  const router = useRouter();
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
          router.push('/mypage/marketer/main');
        } else if (userType === 'creator') {
          router.push('/mypage/creator/main');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // 회원가입 버튼
  const RegButton = (): JSX.Element => {
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
  };

  // 로그인 버튼
  const LoginButton = (): JSX.Element => {
    if (isLogin) {
      return (
        <Button className={classes.tabButton} color="inherit" onClick={logout}>
          로그아웃
        </Button>
      );
    }
    return <LoginPopover type="로그인" MainUserType={MainUserType} logout={logout} />;
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
          <Link href={MainUserType ? '/introduction/marketer' : '/introduction/creator'}>
            {/* eslint-disable-next-line */}
            <a className={classes.mobileButton}>이용 방법</a>
          </Link>
        </MenuItem>

        {MainUserType ? (
          <MenuItem className={classes.buttonWraper}>
            <Link href="/creatorList">
              {/* eslint-disable-next-line */}
              <a className={classes.mobileButton}>방송인 목록</a>
            </Link>
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
            <LoginPopover type="회원가입" MainUserType={MainUserType} logout={logout} />
          )}
        </MenuItem>

        <MenuItem className={classes.buttonWraper}>
          {isLogin ? (
            <Button className={classes.mobileButton} onClick={logout}>
              로그아웃
            </Button>
          ) : (
            <LoginPopover type="로그인" MainUserType={MainUserType} logout={logout} />
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
            <Image src={textLogo} alt="textlogo" className={classes.logo} />
          </a>

          <div className={classes.tabButtonWrap}>
            {/* 이용방법 버튼 */}
            <div>
              <Link href={MainUserType ? '/introduction/marketer' : '/introduction/creator'}>
                {/* eslint-disable-next-line */}
                <a className={classes.tabButton}>이용방법</a>
              </Link>
            </div>

            {/* 방송인 목록 버튼 */}
            {MainUserType ? (
              <div>
                <Link href="/creatorList">
                  {/* eslint-disable-next-line */}
                  <a className={classes.creatorList}>방송인 목록</a>
                </Link>
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
