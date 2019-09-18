import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../components/Navbars/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import allRoutes from '../routes';
import Footer from '../components/Footer/Footer';
// css
import dashboardStyle from '../assets/jss/onad/layouts/dashboardStyle';
import '../assets/css/onad.css';
import history from '../../../history';

const CreatorRoutes = ({ pannelRef }) => (
  <Switch>
    {allRoutes.creator.map(prop => (
      <Route
        path={prop.layout + prop.path}
        component={() => <prop.component pannelRef={pannelRef} />}
        key={prop.name}
      />
    ))}
  </Switch>
);

const CreatorDashboard = (props) => {
  const {
    classes, ...rest
  } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // main ref
  const mainPanel = useRef();

  useEffect(() => {
    document.title = '온애드 | 대시보드';
    mainPanel.current.scrollTop = 0;
    return () => {
      if (history.location.pathname === window.location.pathname) {
        if (mobileOpen) {
          setMobileOpen(false);
        }
      }
    };
  }, [mobileOpen]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={allRoutes.creator}
        logoText="OnAD"
        color="info"
        logo="/pngs/logo/onad_logo_vertical.png"
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
          routes={allRoutes.creator}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <CreatorRoutes pannelRef={mainPanel} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};


CreatorDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(CreatorDashboard);
