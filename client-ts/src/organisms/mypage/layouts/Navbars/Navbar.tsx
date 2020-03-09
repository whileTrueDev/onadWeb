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
  routes: MypageRouteType[];
  handleDrawerToggle: () => void;
}

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const { routes, handleDrawerToggle } = props;

  function makeBrand(): string {
    let routeName = '';
    routes.forEach((route) => {
      if (route.layout + route.path === window.location.pathname) {
        const { name } = route;
        routeName = name;
      }
    });
    return routeName;
  }

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {makeBrand() ? (
            <Button color="default" variant="text" href="#" className={classes.title}>
              {makeBrand()}
            </Button>
          ) : (null)}
        </div>

        <AdminNavbarLinks />

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

export default Navbar;
