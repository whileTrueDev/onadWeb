import React from 'react';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
  makeStyles, Theme, createStyles
} from '@material-ui/core/styles';
import { Button, Typography, useTheme } from '@material-ui/core';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { drawerWidth } from '../../../../assets/jss/onad';
import history from '../../../../history';
import { MypageRoute } from '../../../../pages/mypage/routes';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.light,
  },
  drawerPaper: { width: drawerWidth, },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  activeLink: {
    backgroundColor: theme.palette.action.focus,
  },
  routeIcon: {
    marginRight: theme.spacing(3),
    color: theme.palette.text.secondary
  },
  activeRouteIcon: { color: theme.palette.primary.main }
}));

interface ResponsiveDrawerProps {
  routes: MypageRoute[];
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function ResponsiveDrawer(props: ResponsiveDrawerProps): JSX.Element {
  const { routes, mobileOpen, handleDrawerToggle } = props;
  const classes = useStyles();
  const theme = useTheme();

  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(routeName: string): boolean {
    return window.location.pathname.indexOf(routeName) > -1;
  }

  function handleLogoClick(): void {
    history.push('/');
  }

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Button onClick={handleLogoClick}>
          <img
            src="/pngs/logo/onad_logo_vertical_white.png"
            alt="logo"
            style={{ width: 50, margin: '0px 16px' }}
          />
        </Button>
      </div>
      <Divider />
      <List>
        {routes.map((route) => (
          <div key={route.layout + route.name}>
            <ListItem
              className={classNames({
                [classes.activeLink]: isActiveRoute(route.layout + route.path),
              })}
              button
              to={route.layout + route.path}
              component={Link}
            /**
             * 참여형 광고 긴급점검 표시를 위한 처리
             * @since 2020. 11. 03
             * @by dan, martini
             */
              style={route.name === '참여형 광고' ? { color: theme.palette.error.main } : {}}
            >
              {/**
            * 참여형 광고 긴급점검 표시를 위한 처리
            * @since 2020. 11. 03
            * @by dan, martini
            */}
              {route.name === '참여형 광고' && (
              <div style={{
                width: 50,
                backgroundColor: 'red',
                position: 'absolute',
                top: 0,
                right: 0,
              }}
              >
                <Typography variant="body2" style={{ color: 'white' }}>
                  점검중
                </Typography>
              </div>
              )}
              <route.icon
                className={classNames({
                  [classes.routeIcon]: true,
                  [classes.activeRouteIcon]: isActiveRoute(route.layout + route.path)
                })}
              /**
               * 참여형 광고 긴급점검 표시를 위한 처리
               * @since 2020. 11. 03
               * @by dan, martini
               */
                style={route.name === '참여형 광고' ? { color: theme.palette.error.main } : {}}
              />
              <ListItemText primary={route.name} />
            </ListItem>
            {route.needNextDivider && (<Divider style={{ margin: '8px 0px' }} />)}
          </div>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}
