import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Button,
} from '@material-ui/core';
import {
  Help, Domain, Lock,
} from '@material-ui/icons';
import AppBar from '../../components/AppBar';
import Toolbar from '../../components/Toolbar';
import LoginPopover from '../Login/LoginPopover';

const styles = theme => ({
  root: {
    backgroundColor: blueGrey[900],
  },
  title: {
    fontSize: 24,
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 0,
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
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    fontSize: 16,
    borderRadius: 0,
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  active: {
    fontWeight: theme.typography.fontWeightMedium,
    borderBottom: '1.2px solid',
    borderBottomColor: theme.palette.primary.main,
  },
  buttonIcon: {
    marginRight: 10,
  },
});

function AppAppBar(props) {
  const {
    classes, history, isLogin, logout, unuse,
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
        <Link
          className={classes.rightLink}
          to="/introduction"
        >
          <Domain className={classes.buttonIcon} />
          {'서비스 소개'}
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          className={classes.rightLink}
          to="/manual"
        >
          <Help className={classes.buttonIcon} />
          {'이용 안내'}
        </Link>
      </MenuItem>

      <MenuItem>
        {isLogin ? (
          <Button onClick={logout}>
            <Lock className={classes.buttonIcon} />
              로그아웃
          </Button>
        ) : (
          <LoginPopover type="로그인" history={history} />
        )}
      </MenuItem>

      <MenuItem>
        {isLogin ? null
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
    return <LoginPopover type="로그인" history={history} logout={logout} />;
  };

  const RegButton = (prop) => {
    const { history1 } = prop;
    if (isLogin) {
      return null;
    }
    return <LoginPopover type="회원가입" history={history1} />;
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
            <Button
              className={classNames(
                { [classes.rightLink]: true, [classes.active]: selected === 'introduction' },
              )}
              component={Link}
              to="/introduction"
            >
              {'서비스 소개'}
            </Button>
            <Button
              className={classNames(
                { [classes.rightLink]: true, [classes.active]: selected === 'manual' },
              )}
              component={Link}
              to="/manual"
            >
              {'이용 안내'}
            </Button>
            {unuse
            && <LogButton history={history} logout={logout} />
            }
            {unuse
            && <RegButton history={history} logout={logout} />
            }
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
  unuse: PropTypes.bool,
};

AppAppBar.defaultProps = {
  classes: {},
  unuse: true,
};


export default withStyles(styles)(AppAppBar);
