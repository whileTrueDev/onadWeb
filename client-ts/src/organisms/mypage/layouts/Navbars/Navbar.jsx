import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
// @material-ui/icons
import Menu from '@material-ui/icons/Menu';
// core components
import headerStyle from './Navbar.style';
import Button from '../../../../atoms/CustomButtons/Button';
import AdminNavbarLinks from './AdminNavbarLinks';
//
import useFetchData from '../../../../utils/hooks/useFetchData';

function Header(props) {
  const {
    routes, classes, color, handleDrawerToggle
  } = props;

  function makeBrand() {
    let routeName;
    routes.forEach((route) => {
      if (route.layout + route.path === props.location.pathname) {
        const { name } = route;
        routeName = name;
      }
    });
    return routeName;
  }

  const appBarClasses = classNames({
    [` ${classes[color]}`]: color,
  });
  const userType = window.location.pathname.split('/')[2];
  const noticeReadState = useFetchData('/api/dashboard/noticereadstate', { type: userType });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {makeBrand() ? (
            <Button color="default" variant="text" href="#" className={classes.title}>
              {makeBrand()}
            </Button>
          ) : (
            null
          )}

        </div>
        {!noticeReadState.loading && noticeReadState.payload
          ? (
            <AdminNavbarLinks
              noticeReadState={noticeReadState.payload.noticeReadState}
            />
          ) : (
            <AdminNavbarLinks
              noticeReadState
            />
          )}

        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.array,
};

export default withStyles(headerStyle)(Header);
