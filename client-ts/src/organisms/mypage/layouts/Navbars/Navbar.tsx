import React from 'react';
// @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
// @material-ui/icons
import Menu from '@material-ui/icons/Menu';
// core components
import useNavbarStyles from './Navbar.style';
import Button from '../../../../atoms/CustomButtons/Button';
import AdminNavbarLinks from './AdminNavbarLinks';
// type
import { MypageRoute as MypageRouteType } from '../../../../pages/mypage/routes';

export interface NavbarProps {
  type: 'marketer' | 'creator';
  routes: MypageRouteType[];
  handleDrawerToggle: () => void;
}

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const { type, routes, handleDrawerToggle } = props;

  function makeBrand(): string {
    let name = '';
    routes.forEach((route) => {
      const { pathname } = window.location;
      if (route.hasSubRoutes && route.subRoutes && route.subRoutes.length > 0) {
        for (let i = 0; i < route.subRoutes.length; i += 1) {
          if (route.layout + route.path + route.subRoutes[i].path === pathname) {
            name = route.subRoutes[i].name;
          }
        }
      }
      if (route.layout + route.path === pathname) {
        name = route.name;
      }
    });
    return name;
  }

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          <Hidden mdUp>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          </Hidden>
          {makeBrand() ? (
            <Button color="default" variant="text" href="#" className={classes.title}>
              {makeBrand()}
            </Button>
          ) : (null)}

        </div>
        <AdminNavbarLinks type={type} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
