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

// Pages
import Door from './pages/main/Door';
import Main from './pages/main/Main';
import Introduction from './pages/main/Introduction';
import RegistPage from './pages/main/Regist';
import Policy from './pages/main/Policy';
import Notice from './pages/others/Notice';
import CreatorList from './pages/main/CreatorList';
import MarketerDashboard from './pages/mypage/layouts/MarketerLayout';
import ChargeDialog from './organisms/mypage/marketer/office/charge/ChargeDialog';
import CreatorDashboard from './pages/mypage/layouts/CreatorLayout';
import AdChatTracker from './pages/others/AdChatTracker';
import Adchattest from './pages/others/Adchattest';

dotenv.config();

const developmentRouter = (
  <Router history={history}>
    <Switch>
      {/* <> muts be here : All children of a <Switch> should be <Route> or <Redirect> elements. */}
      <>
        <Route exact path="/" component={Door} />
        <Route exact path="/marketer" component={Main} />
        <Route exact path="/creator" component={Main} />
        <Route exact path="/creatorlist" component={CreatorList} />
        <Route path="/regist/:platform" component={RegistPage} />
        <Route exact path="/regist" component={RegistPage} />
        <Route exact path="/introduce/:userType" component={Introduction} />
        <Route exact path="/policy" component={Policy} />
        <Route exact path="/policy/:privacy" component={Policy} />
        <Route exact path="/notice" component={Notice} />
        <Route path="/notice/:code" component={Notice} />
        <Route exact path="/adchat/" component={Adchattest} />
        <Route exact path="/adchat/:campaignId/:creatorTwitchId" component={AdChatTracker} />
        <Route exact path="/" component={Door} />
        <ThemeProvider theme={theme.lightTheme}>
          <Route path="/mypage/creator" component={CreatorDashboard} />
          <Route path="/mypage/marketer" component={MarketerDashboard} />
          <Route exact path="/marketer/charge" component={ChargeDialog} />
        </ThemeProvider>
      </>
    </Switch>
  </Router>
);

const productionRouter = (
  <Router history={history}>
    <Switch>
      <>
        <Route exact path="/" component={Door} />
        <Route exact path="/marketer" component={Main} />
        <Route exact path="/creator" component={Main} />
        <Route exact path="/creatorlist" component={CreatorList} />
        <Route path="/regist/:platform" component={RegistPage} />
        <Route exact path="/regist" component={RegistPage} />
        <Route exact path="/introduce/:userType" component={Introduction} />
        <Route exact path="/policy" component={Policy} />
        <Route exact path="/policy/:privacy" component={Policy} />
        <Route exact path="/notice" component={Notice} />
        <Route path="/notice/:code" component={Notice} />
        <Route exact path="/adchat/:campaignId/:creatorTwitchId" component={AdChatTracker} />
        <Route exact path="/" component={Door} />
        <ThemeProvider theme={theme.lightTheme}>
          <Route path="/mypage/creator" component={CreatorDashboard} />
          <Route path="/mypage/marketer" component={MarketerDashboard} />
          <Route exact path="/marketer/charge" component={ChargeDialog} />
        </ThemeProvider>
      </>
    </Switch>
  </Router>
);

const router = process.env.NODE_ENV === 'production' ? productionRouter : developmentRouter;
ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
