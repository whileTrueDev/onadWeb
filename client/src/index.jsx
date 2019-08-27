import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import RegistStepper from './components/Regist/Stepper';
import Main from './components/Main';
import CreatorDashboard from './components/Dashboard/layouts/CreatorDashboardLayout';
import CreatorDashboardDoor from './components/Dashboard/layouts/CreatorDashboardDoor';
import MarketerDashboard from './components/Dashboard/layouts/MarketerDashboardLayout';
import Introduction from './components/Introduction';
import Manual from './components/Manual';
import NotFound from './components/Common/NotFound';
// import KakaoPay from './components/Common/KakaoPay';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

ReactDOM.render(
  // <StateStore history={history}>
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Main} history={history} />
      <Route exact path="/regist" component={RegistStepper} />
      <Route exact path="/introduction" component={Introduction} history={history} />
      <Route exact path="/manual" component={Manual} history={history} />
      <Route exact path="/dashboard/creator/door" component={CreatorDashboardDoor} history={history} />
      <Route path="/dashboard/creator" component={CreatorDashboard} history={history} />
      <Route path="/dashboard/marketer" component={MarketerDashboard} history={history} />


      {/* 페이 연습 페이지 */}
      {/* <Route exact path="/pay" component={KakaoPay} /> */}
      {/* not found page */}
      <Route component={NotFound} />
    </Switch>
  </Router>, // </StateStore>

  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
