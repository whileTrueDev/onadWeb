import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../components/Navbars/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import allRoutes from '../routes';
import logo from '../assets/img/main_logo.png';
import Footer from '../components/Footer/Footer';
// css
import dashboardStyle from '../assets/jss/onad/layouts/dashboardStyle';
import '../assets/css/onad.css';

const CreatorRoutes = ({ history, pannelRef }) => (
  <Switch>
    {allRoutes.creator.map(prop => (
      <Route
        path={prop.layout + prop.path}
        component={() => <prop.component history={history} pannelRef={pannelRef} />}
        key={prop.name}
      />
    ))}
  </Switch>
);

const CreatorDashboard = (props) => {
  const {
    classes, history, ...rest
  } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // main ref
  const mainPanel = useRef();

  useEffect(() => {
    mainPanel.current.scrollTop = 0;
    if (history.location.pathname === window.location.pathname) {
      if (mobileOpen) {
        setMobileOpen(false);
      }
    }
  }, [history.location, history.location.pathname, mobileOpen]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={allRoutes.creator}
        logoText="OnAD"
        color="info"
        logo={logo}
        open={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
          routes={allRoutes.creator}
          history={history} // 로그아웃을 위해 필요하다.
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <CreatorRoutes history={history} pannelRef={mainPanel} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};


CreatorRoutes.propTypes = {
  history: PropTypes.object.isRequired,
};

CreatorDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(CreatorDashboard);
