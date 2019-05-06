import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Menu, MenuItem, IconButton, Link, Button,
} from '@material-ui/core';
import {
  AssignmentInd, PowerSettingsNew, Help, Domain,
} from '@material-ui/icons';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import LoginModal from './LoginModal';

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

  // 로그인 모달창 state
  const [isLoginModalOpen, setisLoginModalOpen] = React.useState(false);

  // 로그인 모달창 클릭 시
  function handleLoginClick() {
    setisLoginModalOpen(true);
  }

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
      <MenuItem className={classes.rightLink}>
        <Link
          color="inherit"
          underline="none"
          href="/"
        >
          <IconButton color="inherit">
            <Domain />
          </IconButton>
          {'서비스 소개'}
        </Link>
      </MenuItem>
      <MenuItem className={classes.rightLink}>
        <Link
          color="inherit"
          underline="none"
          href="/"
        >
          <IconButton color="inherit">
            <Help />
          </IconButton>
          {'이용 안내'}
        </Link>
      </MenuItem>
      <MenuItem
        onClick={handleLoginClick}
        className={classes.rightLink}
      >
        <IconButton
          color="inherit"
        >
          <PowerSettingsNew />
        </IconButton>
        {'로그인'}
      </MenuItem>
      <MenuItem className={clsx(classes.rightLink, classes.linkSecondary)}>
        <Link
          color="inherit"
          underline="none"
          href="/"
        >
          <IconButton color="inherit">
            <AssignmentInd />
          </IconButton>
          {'회원가입'}
        </Link>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <AppBar className={classes.root} position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            className={classes.title}
            href="/"
          >
            {'OnAD'}
          </Link>
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
            <Button
              color="inherit"
              className={classes.rightLink}
              onClick={handleLoginClick}
            >
              {'로그인'}
            </Button>
            <Button
              className={clsx(classes.rightLink, classes.linkSecondary)}
              href="/"
            >
              {'회원가입'}
            </Button>
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
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        setisLoginModalOpen={setisLoginModalOpen}
      />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.shape(PropTypes.object),
};

AppAppBar.defaultProps = {
  classes: {},
};


export default withStyles(styles)(AppAppBar);
