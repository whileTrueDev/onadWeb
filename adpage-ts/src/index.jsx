import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
// Pages
// import LandingPage from './pages/Landing';
// import Redirect from './pages/Redirect';
// import AdpanelRedirectToTracker from './pages/AdpanelRedirectToTracker';

import * as serviceWorker from './serviceWorker';
import CpaStop from './pages/temp/CPA-STOP';

ReactDOM.render(
  <Router history={history}>
    <Switch>
      {/**
       * 참여형 광고 긴급점검으로 인한 처리
       * @since 2020. 11. 03
       * @by dan, martini
       */}
      {/* <Route path="/:name" component={LandingPage} /> */}
      {/* <Route path="/adchat/:name" component={AdpanelRedirectToTracker} /> */}
      <Route path="/" component={CpaStop} />
    </Switch>
  </Router>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
