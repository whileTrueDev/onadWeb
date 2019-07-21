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
import headerStyle from '../../assets/jss/onad/components/headerStyle';
import Button from '../CustomButtons/Button';
import AdminNavbarLinks from './AdminNavbarLinks';


function Header(props) {
  const {
    routes, classes, color, handleDrawerToggle, history,
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
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks history={history} />
        </Hidden>
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
