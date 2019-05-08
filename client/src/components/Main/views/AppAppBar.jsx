import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Button,
} from '@material-ui/core';
import {
  AssignmentInd, PowerSettingsNew, Help, Domain,
} from '@material-ui/icons';
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
});

function AppAppBar(props) {
  const { classes } = props;

  // mobile, desktop 구분된 appbar 를 위해
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // 모바일 메뉴버튼 오픈 state
  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  // 모바일 메뉴버튼 오픈 닫는 핸들링 함수
  function handleMobileMenuClose() {
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
      <MenuItem>
        <Button
          className={classes.rightLink}
          color="inherit"
          underline="none"
          href="/"
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
          href="/"
        >
          <Help style={{ marginRight: 10 }} />
          {'이용 안내'}
        </Button>
      </MenuItem>
      <MenuItem>
        <LoginPopover type="로그인" />
      </MenuItem>
      <MenuItem>
        <LoginPopover type="회원가입" />
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <AppBar className={classes.root} position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Button
            color="inherit"
            className={classes.title}
            href="/"
          >
            {'OnAD'}
          </Button>
          <div className={classes.rightDesktop}>
            <Button
              color="inherit"
              className={classes.rightLink}
              href="/"
            >
              {'서비스 소개'}
            </Button>
            <Button
              underline="none"
              className={classes.rightLink}
              href="/"
            >
              {'이용 안내'}
            </Button>
            <LoginPopover type="로그인" />
            <LoginPopover type="회원가입" />
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
