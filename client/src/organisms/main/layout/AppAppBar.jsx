import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
// import { blueGrey } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Button,
  Tooltip, useScrollTrigger
} from '@material-ui/core';
import { Domain, Dashboard } from '@material-ui/icons';
import Toolbar from '../Main/components/Toolbar';
import LoginPopover from '../Main/views/Login/LoginPopover';
import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';

const styles = theme => ({
  root: {
    backgroundColor: 'rgb( 255, 255, 255, 0)',
    position: 'fixed',
    width: '100%',
    height: 70,
    zIndex: '100',
  },
  root2: {
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    height: 70,
    zIndex: '100',
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
});

function AppAppBar(props) {
  const {
    classes, isLogin, logout, tabValue,
    handleTabChange, noButtons, MainUserType
  } = props;

  const trigger = useScrollTrigger({ threshold: 100, disableHysteresis: true });

  // 대시보드로 이동 버튼 클릭
  const handleClick = useCallback((buttonType) => {
    axios.get(`${HOST}/api/dashboard/checkUserType`)
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
        history={history}
        logout={logout}
        tabValue={tabValue}
        onChange={handleTabChange}
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
          My광고
        </Button>
      );
    }
    return <LoginPopover type="회원가입" history={history} trigger={trigger} MainUserType={MainUserType} />;
  };

  /** 모바일 메뉴 ********************************************* */
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // 모바일 메뉴버튼 오픈 state
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // 모바일 메뉴버튼 오픈 닫는 핸들링 함수
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // 모바일 메뉴 컴포넌트
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Button
          className={classes.rightLink2}
          component={Link}
          to={MainUserType === 'marketer' ? ('/introMarketer') : ('/introCreator')}
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
            My광고
          </Button>
        )
          : <LoginPopover type="회원가입" mode="mobile" MainUserType={MainUserType} />
        }
      </MenuItem>

      <MenuItem>
        {isLogin ? (
          <Button className={classes.rightLink2} onClick={logout}>
              로그아웃
          </Button>
        ) : (
          <LoginPopover type="로그인" MainUserType={MainUserType} />
        )}
      </MenuItem>

    </Menu>
  );

  return (
    <div>
      <div className={!trigger ? (classes.root) : (classes.root2)} position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          { noButtons ? (
            <>
              <a href="/" className={classes.noButtonIcon}>
                <img
                  src="/pngs/logo/onad_black.png"
                  id="logo"
                  alt="OnADLogo"
                  style={{ padding: '10px 18px' }}
                />
              </a>
            </>
          ) : (
            <div>
              <a href="/" className={classes.icon}>
                <img
                  src={!trigger ? ('/pngs/logo/onad_white.png') : ('/pngs/logo/onad_black.png')}
                  id="logo"
                  alt="OnADLogo"
                  style={{ padding: '10px 18px' }}
                />
              </a>
            </div>
          )}


          {noButtons ? (
            <div className={classes.rightDesktop}>
              <Tooltip title="My광고">
                <IconButton className={classes.rightLink} onClick={handleClick}>
                  <Dashboard color="action" />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <div className={classes.rightDesktop}>
              <Button
                className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
                component={Link}
                to={MainUserType === 'marketer' ? ('/introMarketer') : ('/introCreator')}
              >
                서비스소개
              </Button>
              <RegButton history={history} logout={logout} />

              <Button
                className={!trigger ? (classes.rightLink3) : (classes.rightLink4)}
                component={Link}
                to="/creatorlist"
              >
                크리에이터 리스트
              </Button>
              <LogButton
                history={history}
                logout={logout}
              />
            </div>
          )}

          <div className={classes.rightMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="primary">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </div>
      {renderMobileMenu}
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object,
};

AppAppBar.defaultProps = {
  classes: {},
};


export default withStyles(styles)(AppAppBar);
