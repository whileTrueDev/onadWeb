import React, { useCallback } from 'react';
import shortid from 'shortid';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Drawer, Hidden, Button, List, ListItem, ListItemText, Grid,
} from '@material-ui/core';
// core components
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks';
// styles
import sidebarStyle from '../../assets/jss/onad/components/sidebarStyle';
import HOST from '../../../../config';
import axios from '../../../../utils/axios';

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const {
    classes, color, logo, logoText, routes,
    handleDrawerToggle, mobileOpen, history,
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
  }, [history]);

  const links = (
    <List className={classes.list}>
      <div className={classes.linkWrapper}>
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
              className={classes.item}
              activeClassName="active"
              key={shortid.generate()}
            >
              <ListItem button className={classNames(classes.itemLink, listItemClasses)}>
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                />
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography
                />
              </ListItem>
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
    <div className={classes.logo}>
      <Button
        onClick={handleClick}
        className={classNames(classes.logoLink)}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {` ${logoText}`}
      </Button>
    </div>
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
          {brand}
          <div className={classes.sidebarWrapper}>
            {links}
          </div>
          <div className={classes.background} />
        </Drawer>
      </Hidden>
      {/* 데스크탑 사이드바 */}
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {/* 사이드바 Logo */}
          <Grid className={classes.logo} container direction="row" alignItems="center">
            <Grid item className={classes.logoImage}>
              <img src={logo} alt="logo" className={classes.img} />
            </Grid>
            <Grid item>
              <Button
                onClick={handleClick}
                className={classNames(classes.logoLink)}
              >
                {logoText}
              </Button>
            </Grid>
          </Grid>

          {/* 사이드바 라우터 링크 */}
          <div className={classes.sidebarWrapper}>{links}</div>
          {/* 사이드바 배경 */}
          <div className={classes.background} />
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
  history: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
  color: 'info',
  logoText: '',
  mobileOpen: false,
};

export default withStyles(sidebarStyle)(Sidebar);
