// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import dotenv from 'dotenv';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import history from './history';
import theme from './theme';

// PWA
import * as serviceWorker from './serviceWorker';
// 기본 global Css
import './assets/onad.css';

// Pages
import Test from './pages/Test';
import Door from './pages/main/Door';
// import CreatorDashboard from './pages/mypage/layouts/CreatorLayout';
import MarketerDashboard from './pages/mypage/layouts/MarketerLayout';


dotenv.config();

const developmentRouter = (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Door} />
      <ThemeProvider theme={theme.lightTheme}>
        {/* <Route path="/mypage/creator" component={CreatorDashboard} /> */}
        <Route path="/mypage/marketer" component={MarketerDashboard} />
      </ThemeProvider>
    </Switch>
  </Router>
);

const productionRouter = (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Door} />
      <ThemeProvider theme={theme.lightTheme}>
        <Route path="/mypage/marketer" component={MarketerDashboard} />

        {/* <Route path="/mypage/creator" component={CreatorDashboard} /> */}
      </ThemeProvider>
    </Switch>
  </Router>
);

const router = process.env.NODE_ENV === 'production' ? productionRouter : developmentRouter;
ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
