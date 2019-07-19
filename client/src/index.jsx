import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import RegistStepper from './components/Regist/Stepper';
import Main from './components/Main';
import CreatorDashboard from './components/Dashboard/layouts/CreatorDashboardLayout';
import CreatorDashboardDoor from './components/Dashboard/layouts/CreatorDashboardDoor';
import MarketerDashboard from './components/Dashboard/layouts/MarketerDashboardLayout';
import adminRoutes from './components/admin/routes';
import Introduction from './components/Introduction';
import Manual from './components/Manual';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

ReactDOM.render(
  // <StateStore history={history}>
  <Router history={history}>
    <Route exact path="/" component={Main} history={history} />
    <Route exact path="/regist" component={RegistStepper} />
    <Route path="/introduction" component={Introduction} />
    <Route path="/manual" component={Manual} />
    <Route path="/dashboard/creator/door" component={CreatorDashboardDoor} history={history} />
    <Switch>
      <Route path="/dashboard/creator/creatormanual/:name" component={CreatorDashboard} history={history} />
      <Route path="/dashboard/creator" component={CreatorDashboard} history={history} />
    </Switch>
    <Route path="/dashboard/marketer" component={MarketerDashboard} history={history} />
    <Route path="/admin" component={adminRoutes} />
  </Router>, // </StateStore>

  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
