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
import ShutDownCloseBeta from './components/Common/ShutDownCloseBeta';
// import KakaoPay from './components/Common/KakaoPay';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();
// history를 state drilling 없이 사용하기 위해 history를 가지는 context를 모든 컴포넌트에 래핑
// const HistoryCTX = React.createContext();

const developRouter = (
  // <HistoryCTX.Provider value={history}>
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
      <Route path="/willbeback" component={ShutDownCloseBeta} />
      <Route component={NotFound} />
    </Switch>
  </Router>
  // </HistoryCTX.Provider>
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
