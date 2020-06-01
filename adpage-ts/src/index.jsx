import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
// Pages
import LandingPage from './pages/Landing';
// import Redirect from './pages/Redirect';

import * as serviceWorker from './serviceWorker';
import AdpanelRedirectToTracker from './pages/AdpanelRedirectToTracker';

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route path="/:name" component={LandingPage} />
      <Route path="/adchat/:name" component={AdpanelRedirectToTracker} />
    </Switch>
  </Router>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
