import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
// page
import Main from './pages/main/Main';
import Manual from './pages/main/Manual';
import Introduction from './pages/main/Introduction';
import RegistPage from './pages/main/Regist';
import CreatorDashboard from './pages/layouts/CreatorDashboardLayout';
import CreatorDashboardDoor from './pages/layouts/CreatorDashboardDoor';
import MarketerDashboard from './pages/layouts/MarketerDashboardLayout';
import NotFound from './pages/others/NotFound';
import Notice from './pages/others/Notice';
import ShutDownCloseBeta from './pages/others/ShutDownCloseBeta';
// import KakaoPay from './pages/Common/KakaoPay';
import * as serviceWorker from './utils/serviceWorker';
import history from './history';

const developRouter = (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/regist" component={RegistPage} />
      <Route exact path="/introduction" component={Introduction} />
      <Route exact path="/manual" component={Manual} />
      <Route exact path="/notice" component={Notice} />
      <Route exact path="/dashboard/creator/door" component={CreatorDashboardDoor} />
      <Route path="/dashboard/creator" component={CreatorDashboard} />
      <Route path="/dashboard/marketer" component={MarketerDashboard} />
      {/* 페이 연습 페이지 */}
      {/* <Route exact path="/pay" component={KakaoPay} /> */}
      {/* not found page */}
      <Route component={NotFound} />
    </Switch>
  </Router>
);

const productionRouter = (
  <Router history={history}>
    <Switch>
      {/* closebeta shutdown notification */}
      <Route path="/willbeback" component={ShutDownCloseBeta} />
      <Route component={ShutDownCloseBeta} />
    </Switch>
  </Router>
);

const router = process.env.NODE_ENV === 'production' ? productionRouter : developRouter;

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
