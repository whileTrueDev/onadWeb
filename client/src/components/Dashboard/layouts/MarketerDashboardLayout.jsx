import React, { useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../components/Navbars/Navbar';
import dashboardStyle from '../assets/jss/onad/layouts/dashboardStyle';
import Sidebar from '../components/Sidebar/Sidebar';
import allRoutes from '../routes';
import logo from '../assets/img/main_logo.png';
import Footer from '../components/Footer/Footer';

const MarketerRoutes = ({ history }) => (
  <Switch>
    {allRoutes.marketer.map(prop => (
      <Route
        path={prop.layout + prop.path}
        component={() => <prop.component history={history} />}
        key={prop.name}
      />
    ))}
  </Switch>
);

const MarketerDashboard = ({
  classes, history, ...rest
}) => {
  useEffect(() => {
    if (!history.location.state) {
      window.location.href = '/';
    } else if (history.location.state.userType !== 'marketer') {
      window.location.href = '/';
    }
  });

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={allRoutes.marketer}
        logoText="OnAD"
        logo={logo}
        {...rest}
      />
      <div className={classes.mainPanel}>
        {/* ref="mainPanel" */}
        <Navbar
          routes={allRoutes.marketer}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <MarketerRoutes history={history} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
MarketerRoutes.propTypes = {
  history: PropTypes.object,
};

MarketerRoutes.defaultProps = {
  history: {},
};

MarketerDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

MarketerDashboard.defaultProps = {
  history: {},
};

export default withStyles(dashboardStyle)(MarketerDashboard);
