import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';
import classnames from 'classnames';
import {
  Menu, MenuItem, IconButton, Button,
} from '@material-ui/core';

import {
  Help, Domain,
} from '@material-ui/icons';

import { Link } from 'react-router-dom';
import axios from 'axios';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import LoginPopover from './LoginPopover';

const styles = theme => ({
  root: {
    backgroundColor: blueGrey[900],
  },
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 0,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  rightDesktop: {
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
    marginLeft: 0,
    fontSize: 16,
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  active: {
    fontWeight: 'bold',
  },
});

function AppAppBar(props) {
  const {
    classes, history, isLogin, setisLogin, logout,
  } = props;

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
          color="inherit"
          underline="none"
          component={Link}
          to="/introduction"
        >
          <Domain style={{ marginRight: 10 }} />
          {'서비스 소개'}
        </Button>
      </MenuItem>
      <MenuItem>
        <Button
          className={classes.rightLink}
          color="inherit"
          underline="none"
          component={Link}
          to="/manual"
        >
          <Help style={{ marginRight: 10 }} />
          {'이용 안내'}
        </Button>
      </MenuItem>
      <MenuItem>
        {isLogin ? <Button>로그아웃</Button>
          : <LoginPopover type="로그인" history={history} />
        }
      </MenuItem>
      <MenuItem>
        {isLogin ? <div />
          : <LoginPopover type="회원가입" history={history} />
        }
      </MenuItem>

    </Menu>
  );

  // 앱바의 선택 여부를 파악하여 state 로 설정한다.
  const [selected, setSelected] = React.useState();
  React.useEffect(() => {
    setSelected(window.location.pathname.replace('/', ''));
  }, []); // 무한루프를 야기하지 않도록 하기 위해 두번째 인수로 빈 배열을 넣는다.

  const LogButton = (props) => {
    const { history, logout } = props;
    if (isLogin) {
      return (
        <Button
          className={classes.rightLink}
          color="inherit"
          onClick={logout}
        >로그아웃
        </Button>
      );
    }
    return <LoginPopover type="로그인" history={history} logout={logout} />;
  };

  const RegButton = (props) => {
    const { history } = props;
    if (isLogin) {
      return <div />;
    }
    return <LoginPopover type="회원가입" history={history} />;
  };


  return (
    <div>
      <AppBar className={classes.root} position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Button
            color="inherit"
            className={classes.title}
            component={Link}
            to="/"
          >
            {'OnAD'}
          </Button>
          <div className={classes.rightDesktop}>
            {selected === 'introduction'
              ? (
                <Button
                  color="inherit"
                  className={classnames(
                    [classes.rightLink, classes.active],
                  )}
                  component={Link}
                  to="/introduction"
                >
                  {'서비스 소개'}
                </Button>
              )
              : (
                <Button
                  color="inherit"
                  className={classes.rightLink}
                  component={Link}
                  to="/introduction"
                >
                  {'서비스 소개'}
                </Button>
              )
          }
            {selected === 'manual'
              ? (
                <Button
                  underline="none"
                  className={classnames(
                    [classes.rightLink, classes.active],
                  )}
                  component={Link}
                  to="/manual"
                >
                  {'이용 안내'}
                </Button>
              )
              : (
                <Button
                  underline="none"
                  className={classes.rightLink}
                  component={Link}
                  to="/manual"
                >
                  {'이용 안내'}
                </Button>
              )
          }
            <LogButton history={history} logout={logout} />
            <RegButton history={history} logout={logout} />
          </div>
          <div className={classes.rightMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <div className={classes.placeholder} />
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
