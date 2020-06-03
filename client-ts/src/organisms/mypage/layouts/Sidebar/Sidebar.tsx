import React from 'react';
import shortid from 'shortid';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import {
  Drawer, Hidden, Button, List, ListItemText, Grid,
} from '@material-ui/core';
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks';
import { MypageRoute } from '../../../../pages/mypage/routes';
// styles
import useSiedebarStyles from './Sidebar.style';
// utils
import history from '../../../../history';

interface SidebarProps {
  logo: string;
  routes: MypageRoute[];
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

const Sidebar = ({
  logo,
  routes,
  handleDrawerToggle,
  mobileOpen
}: SidebarProps): JSX.Element => {
  const classes = useSiedebarStyles();

  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(routeName: string): boolean {
    return window.location.pathname.indexOf(routeName) > -1;
  }

  function handleLogoClick(): void {
    history.push(`/mypage/${window.location.pathname.split('/')[2]}/main`);
  }

  const links = (
    <List className={classes.flex}>
      <div>
        {routes.map((prop) => {
          const listItemClasses = classNames({
            [` ${classes.activeLink}`]: isActiveRoute(prop.layout + prop.path),
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
          <AdminNavbarLinks />
        </div>
      </Hidden>
    </List>
  );

  const brand = (
    <Button
      onClick={handleLogoClick}
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
          classes={{ paper: classNames(classes.desktopPaper) }}
          PaperProps={{ elevation: 10 }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {/* 사이드바 Logo */}
          <Grid container direction="column">
            <Grid item className={classes.head}>
              <Button
                onClick={handleLogoClick}
                className={classNames(classes.desktopLogo)}
              >
                <img src={logo} alt="logo" className={classes.desktopImg} />
              </Button>
            </Grid>
            <Grid item className={classes.desktopWrapper}>
              {links}
            </Grid>
          </Grid>
        </Drawer>
      </Hidden>
    </div>
  );
};

export default Sidebar;
