import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Button,
  Tooltip, useScrollTrigger, AppBar, Toolbar
} from '@material-ui/core';
import { Domain, Dashboard } from '@material-ui/icons';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LoginPopover from '../main/views/login/LoginPopover';
import HOST from '../../../config';
import axios from '../../../utils/axios';
import history from '../../../history';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb( 255, 255, 255, 0)',
    position: 'fixed',
    width: '100%',
    height: 64,
    zIndex: 100,
  },
  root2: {
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    height: 64,
    zIndex: 100,
    boxShadow: '0 1px 10px gainsboro'
  },
  left: {
    [theme.breakpoints.up('sm')]: {
      width: 48,
      height: 48
    },
    [theme.breakpoints.up('xs')]: {
      width: 48,
      height: 48
    },
  },
  title: {
    fontSize: 24,
  },
  toolbar: {
    justifyContent: 'space-between',
    padding: '0px 0px'
  },
  rightDesktop: {
    height: '100%',
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  rightDesktop2: {
    height: '100%',
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  rightMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  rightLink: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    borderRadius: 0,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
    },
  },
  rightLink2: {
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    borderRadius: 0,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.black,
      marginLeft: theme.spacing(3),
    },
  },
  rightLink3: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    height: 50,
    borderRadius: 5,
    border: '1px solid white',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
    },
  },
  rightLink4: {
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    height: 50,
    borderRadius: 5,
    border: '1px solid black',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.black,
      marginLeft: theme.spacing(3),
    },
  },
  coloredLink: {
    color: theme.palette.primary.main,
  },
  buttonIcon: {
    marginRight: 10,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
    '&>img': {
      width: 160,
      height: 45
    }
  },
  noButtonIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
    '&>img': {
      width: 124,
      height: 25
    }
  }
}));
interface Props {
  isLogin?: boolean;
  logout: () => void;
  noButtons?: boolean;
  MainUserType?: string;
  noTrigger?: boolean;
}

function AppAppBar({
  isLogin, logout,
  noButtons, MainUserType,
  noTrigger
}: Props): JSX.Element {
  const classes = useStyles();

  // 스크롤 100위치에 다른 네비게이션 바 css 변경
  let trigger = useScrollTrigger({ threshold: 100, disableHysteresis: true });

  // 스크롤 트리거 사용하지 않는 네비게이션 바의 경우 사용하는 변수
  if (noTrigger) {
    trigger = true;
  }

  // 대시보드로 이동 버튼 클릭
  const handleClick = useCallback((buttonType) => {
    axios.get(`${HOST}/login/check`)
      .then((res) => {
        const { userType } = res.data;
        if (userType === undefined) {
          if (buttonType) {
            alert('로그인 이후 이용하세요');
          }
        } else if (userType === 'marketer') {
          history.push('/dashboard/marketer/main');
        } else if (userType === 'creator') {
          history.push('/dashboard/creator/main');
        }
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  const LogButton = () => {
    if (isLogin) {
      return (
        <Button
          className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
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
        trigger={trigger}
      />
    );
  };

  const RegButton = () => {
    if (isLogin) {
      return (
        <Button
          className={classNames(classes.rightLink, classes.coloredLink)}
          onClick={handleClick}
        >
          마이페이지
        </Button>
      );
    }
    return <LoginPopover type="회원가입" trigger={trigger} MainUserType={MainUserType} logout={logout} />;
  };

  /** 모바일 메뉴 ********************************************* */
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
      {noButtons ? (
        <MenuItem>
          <Button className={classes.rightLink2} onClick={handleClick}>
            <Dashboard className={classes.buttonIcon} />
            마이페이지
          </Button>
        </MenuItem>
      )
        : (
          <div>
            <MenuItem>
              <Button
                className={classes.rightLink2}
                component={Link}
                to={MainUserType === 'marketer' ? ('/introduce/marketer') : ('/introduce/creator')}
              >
                <Domain className={classes.buttonIcon} />
                서비스 소개
              </Button>
            </MenuItem>

            <MenuItem>
              {isLogin ? (
                <Button
                  className={classNames(classes.rightLink2, classes.coloredLink)}
                  onClick={handleClick}
                >
                  <Dashboard className={classes.buttonIcon} />
                  마이페이지
                </Button>
              )
                : <LoginPopover type="회원가입" mode="mobile" MainUserType={MainUserType} logout={logout} />}
            </MenuItem>

            <MenuItem>
              {isLogin ? (
                <Button className={classes.rightLink2} onClick={logout}>
                  로그아웃
                </Button>
              )
                : (
                  <LoginPopover type="로그인" MainUserType={MainUserType} logout={logout} />
                )}
            </MenuItem>
          </div>
        )}
    </Menu>
  );

  return (
    <div>
      <AppBar className={!trigger ? (classes.root) : (classes.root2)} position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          {noButtons ? (
            <a href="/" className={classes.noButtonIcon}>
              <img
                src="/pngs/logo/onad_black.png"
                id="logo"
                alt="OnADLogo"
                style={{ padding: '10px 18px' }}
              />
            </a>
          )
            : (
              <a href="/" className={classes.icon}>
                <img
                  src={!trigger ? ('/pngs/logo/onad_white.png') : ('/pngs/logo/onad_black.png')}
                  id="logo"
                  alt="OnADLogo"
                  style={{ padding: '10px 18px' }}
                />
              </a>
            )}
          {noButtons ? (
            <div className={classes.rightDesktop}>
              <Tooltip title="마이페이지">
                <IconButton className={classes.rightLink} onClick={handleClick}>
                  <Dashboard color="action" />
                </IconButton>
              </Tooltip>
            </div>
          )
            : (
              <div className={classes.rightDesktop}>
                <Button
                  className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
                  component={Link}
                  to={MainUserType === 'marketer' ? ('/introduce/marketer') : ('/introduce/creator')}
                >
                  서비스소개
                </Button>
                <RegButton />

                {MainUserType === 'marketer' ? (
                  <div>
                    <Button
                      className={!trigger ? (classes.rightLink3) : (classes.rightLink4)}
                      component={Link}
                      to="/creatorlist"
                    >
                      크리에이터 리스트
                    </Button>
                  </div>
                ) : null}
                <LogButton />
              </div>
            )}

          <div className={classes.rightMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="primary">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
}

export default AppAppBar;
