import React from 'react';
import shortid from 'shortid';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// core components
import sidebarStyle from '../../assets/jss/onad/components/sidebarStyle';


const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const {
    classes, color, logo, logoText, routes,
    handleDrawerToggle, open,
  } = props;

  const links = (
    <List className={classes.list}>
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
    </List>
  );

  const brand = (
    <div className={classes.logo}>
      <a
        href="/"
        className={classNames(classes.logoLink)}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );

  return (
    <div>
      {/* 모바일 사이드바 */}
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={open}
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
          <div className={classes.logo}>
            <a
              href="/"
              className={classNames(classes.logoLink)}
            >
              <div className={classes.logoImage}>
                <img src={logo} alt="logo" className={classes.img} />
              </div>
              {logoText}
            </a>
          </div>

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
  open: PropTypes.bool,
  logo: PropTypes.string,
};

Sidebar.defaultProps = {
  color: 'info',
  logoText: 'OnAD',
  open: false,
};

export default withStyles(sidebarStyle)(Sidebar);
