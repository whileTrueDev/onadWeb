import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../components/Navbars/Navbar';
import dashboardStyle from '../assets/jss/onad/layouts/dashboardStyle';
import Sidebar from '../components/Sidebar/Sidebar';
import allRoutes from '../routes';
import logo from '../assets/img/main_logo.png';
import Footer from '../components/Footer/Footer';
import '../assets/css/onad.css';

const CreatorRoutes = ({ history }) => (
  <Switch>
    {allRoutes.creator.map(prop => (
      <Route
        path={prop.layout + prop.path}
        component={() => <prop.component history={history} />}
        key={prop.name}
      />
    ))}
  </Switch>
);

const CreatorDashboard = ({
  classes, history, match, ...rest
}) => {
  useEffect(() => {
    // if (!history.location.state) {
    //   window.location.href = '/';
    // } else if (history.location.state.userType !== 'creator') {
    //   window.location.href = '/';
    // }
  });

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={allRoutes.creator}
        logoText="OnAD"
        logo={logo}
        {...rest}
      />
      <div className={classes.mainPanel}>
        {/* ref="mainPanel" */}
        <Navbar
          routes={allRoutes.creator}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <CreatorRoutes history={history} />
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
