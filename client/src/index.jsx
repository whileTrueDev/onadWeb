// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
// page
import Main from './pages/main/Main';
import Introduction from './pages/main/Introduction';
import RegistPage from './pages/main/Regist';
import CreatorDashboard from './pages/layouts/CreatorDashboardLayout';
import CreatorDashboardDoor from './pages/layouts/CreatorDashboardDoor';
import MarketerDashboard from './pages/layouts/MarketerDashboardLayout';
import NotFound from './pages/others/NotFound';
import Notice from './pages/others/Notice';
import Policy from './pages/main/Policy';
// import ShutDownCloseBeta from './pages/others/ShutDownCloseBeta';
// import KakaoPay from './pages/Common/KakaoPay';
import * as serviceWorker from './utils/serviceWorker';
import history from './history';
import theme from './theme';

dotenv.config();

const developRouter = (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/regist" component={RegistPage} />
      <Route exact path="/introduction" component={Introduction} />
      <Route exact path="/policy" component={Policy} />
      <Route exact path="/policy/:privacy" component={Policy} />
      <Route exact path="/notice" component={Notice} />
      <Route path="/notice/:code" component={Notice} />
      <ThemeProvider theme={theme}>
        <Route exact path="/dashboard/creator/door" component={CreatorDashboardDoor} />
        <Route path="/dashboard/creator" component={CreatorDashboard} />
        <Route path="/dashboard/marketer" component={MarketerDashboard} />
      </ThemeProvider>
      {/* not found page */}
      <Route component={NotFound} />
    </Switch>
  </Router>
);

const productionRouter = (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/regist" component={RegistPage} />
      <Route exact path="/introduction" component={Introduction} />
      <Route exact path="/policy" component={Policy} />
      <Route exact path="/policy/:privacy" component={Policy} />
      <Route exact path="/notice" component={Notice} />
      <Route path="/notice/:code" component={Notice} />
      <Route exact path="/dashboard/creator/door" component={CreatorDashboardDoor} />
      <Route path="/dashboard/creator" component={CreatorDashboard} />
      <Route path="/dashboard/marketer" component={MarketerDashboard} />
      {/* not found page */}
      <Route component={NotFound} />
    </Switch>
  </Router>
);

const router = process.env.NODE_ENV === 'production' ? productionRouter : developRouter;

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
