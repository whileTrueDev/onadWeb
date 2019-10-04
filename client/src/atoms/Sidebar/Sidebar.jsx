import React, { useCallback } from 'react';
import shortid from 'shortid';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Drawer, Hidden, Button, List, ListItemText, Grid,
} from '@material-ui/core';
// core components
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks';
// styles
import sidebarStyle from '../../assets/jss/onad/components/sidebarStyle';
import HOST from '../../utils/config';
import axios from '../../utils/axios';
import history from '../../history';

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const {
    classes, color, logo, routes,
    handleDrawerToggle, mobileOpen,
  } = props;

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

  const links = (
    <List className={classes.flex}>
      <div>
        {routes.map((prop, key) => {
          const listItemClasses = classNames({
            [` ${classes[color]}`]: isActiveRoute(prop.layout + prop.path),
          });
          const whiteFontClasses = classNames({
            [` ${classes.whiteFont}`]: isActiveRoute(prop.layout + prop.path),
          });
          return (
            <NavLink
              to={prop.layout + prop.path}
              // className={classes.item}
              activeClassName="active"
              key={shortid.generate()}
            >
              <Button className={classNames(classes.itemLink, listItemClasses)}>
                <Grid container direction="column">
                  <Grid item className={classes.center}>
                    <prop.icon
                      className={classNames(classes.itemIcon, whiteFontClasses)}
                    />
                  </Grid>
                  <Grid item>
                    <ListItemText
                      primary={prop.name}
                      className={classNames(classes.itemText, whiteFontClasses)}
                      disableTypography
                    />
                  </Grid>
                </Grid>
              </Button>
            </NavLink>
          );
        })}
      </div>
      <Hidden mdUp implementation="css">
        <div className={classes.NavBarLinksWrapper}>
          <AdminNavbarLinks history={history} />
        </div>
      </Hidden>
    </List>
  );

  const brand = (
    <Button
      onClick={handleClick}
      className={classes.center}
    >
      <img src={logo} alt="logo" className={classes.img} />
    </Button>

  );

  return (
    <div>
      {/* 모바일 사이드바 */}
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Grid container direction="column">
            <Grid item className={classes.mobileHead}>
              {brand}
            </Grid>
            <Grid item className={classes.sidebarWrapper}>
              {links}
            </Grid>
          </Grid>
          <div className={classes.background} />
        </Drawer>
      </Hidden>
      {/* 데스크탑 사이드바 */}
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.desktopPaper),
          }}
        >
          {/* 사이드바 Logo */}
          <Grid container direction="column">
            <Grid item className={classes.head}>
              <Button
                onClick={handleClick}
                className={classNames(classes.desktopLogo)}
              >
                <img src={logo} alt="logo" className={classes.desktopImg} />
              </Button>
            </Grid>
            <Grid item className={classes.desktopWrapper}>
              {links}
            </Grid>
          </Grid>
          {/* 사이드바 배경 */}
          <div className={classes.desktopBackground} />
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.array.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool,
  logo: PropTypes.string.isRequired,
};

Sidebar.defaultProps = {
  color: 'info',
  logoText: '',
  mobileOpen: false,
};

export default withStyles(sidebarStyle)(Sidebar);
