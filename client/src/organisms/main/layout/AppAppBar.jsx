import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
// import { blueGrey } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Button,
} from '@material-ui/core';
import { Domain, Dashboard } from '@material-ui/icons';
import AppBar from '../Main/components/AppBar';
import Toolbar from '../Main/components/Toolbar';
import LoginPopover from '../Main/views/Login/LoginPopover';
import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
  },
  title: {
    fontSize: 24,
  },
  toolbar: {
    justifyContent: 'space-between',
    boxShadow: '0 1px 10px gainsboro'
  },
  left: {
    flex: 0,
  },
  rightDesktop: {
    height: '100%',
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
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
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    fontSize: 16,
    borderRadius: 0,
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
  active: {
    fontWeight: theme.typography.fontWeightMedium,
    borderBottom: '1.2px solid',
    borderBottomColor: theme.palette.primary.main,
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
  },
});

function AppAppBar(props) {
  const {
    classes, isLogin, logout, tabValue,
    handleTabChange, noButtons
  } = props;


  // 앱바의 선택 여부를 파악하여 state 로 설정한다.
  const [selected, setSelected] = React.useState();
  React.useEffect(() => {
    setSelected(window.location.pathname.replace('/', ''));
  }, []); // 무한루프를 야기하지 않도록 하기 위해 두번째 인수로 빈 배열을 넣는다.

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
          className={classes.rightLink}
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
        history={history}
        logout={logout}
        tabValue={tabValue}
        onChange={handleTabChange}
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
        대시보드이동
        </Button>
      );
    }
    return <LoginPopover type="회원가입" history={history} />;
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
          className={classes.rightLink}
          component={Link}
          to="/introduction"
        >
          <Domain className={classes.buttonIcon} />
          {'서비스 소개'}
        </Button>
      </MenuItem>

      <MenuItem>
        {isLogin ? (
          <Button
            className={classNames(classes.rightLink, classes.coloredLink)}
            onClick={handleClick}
          >
            <Dashboard className={classes.buttonIcon} />
            대시보드이동
          </Button>
        )
          : <LoginPopover type="회원가입" />
        }
      </MenuItem>

      <MenuItem>
        {isLogin ? (
          <Button className={classes.rightLink} onClick={logout}>
              로그아웃
          </Button>
        ) : (
          <LoginPopover type="로그인" />
        )}
      </MenuItem>

    </Menu>
  );

  return (
    <div>
      <AppBar className={classes.root} position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <a href="/" className={classes.icon}>
            <img
              src="/pngs/logo/onad_logo_vertical_black.png"
              id="logo"
              alt="OnADLogo"
              width={100}
              height={70}
              style={{ padding: '10px 18px 10px 18px' }}
            />
          </a>

          {noButtons ? (
            <div className={classes.rightDesktop} />
          ) : (

            <div className={classes.rightDesktop}>
              <Button
                className={classNames(
                  { [classes.rightLink]: true, [classes.active]: selected === 'introduction' },
                )}
                component={Link}
                to="/introduction"
              >
                {'서비스 소개'}
              </Button>
              <RegButton history={history} logout={logout} />
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
      </AppBar>
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
