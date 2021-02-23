// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import 'moment/locale/ko';
import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import {
  createMuiTheme, MuiThemeProvider as ThemeProvider, responsiveFontSizes
} from '@material-ui/core/styles';
import history from './history';
import theme, { OnadTheme } from './theme';
import useOnadThemeType from './utils/hooks/useOnadThemeType';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// Pages
import Door from './pages/main/Door';
import Main from './pages/main/Main';
import Introduction from './pages/main/Introduction';
import RegistPage from './pages/main/Regist';
import Policy from './pages/main/Policy';
import CreatorList from './pages/main/CreatorList';
import MarketerDashboard from './pages/mypage/layouts/MarketerLayout';
import ChargeDialog from './organisms/mypage/marketer/office/charge/ChargeDialog';
import CreatorDashboard from './pages/mypage/layouts/CreatorLayout';
// import NotFound from './pages/others/NotFound';
import RemotePage from './pages/mypage/creator/RemotePage';
import RegistCreator from './pages/main/RegistCreator';

dotenv.config();
const OnadIndex = (): JSX.Element => {
  // *******************************************
  // Theme Configurations
  const { themeType, handleThemeChange } = useOnadThemeType();
  const THEME = responsiveFontSizes(createMuiTheme({
    ...theme.rawTheme, palette: { ...theme.rawTheme.palette, type: themeType },
  }));
  const onadTheme: OnadTheme = {
    handleThemeChange,
    ...THEME,
    palette: {
      ...THEME.palette,
      platform: { ...theme.platformOverrides },
    }
  };

  return (
    <Router history={history}>
      <Switch>
        <ThemeProvider<OnadTheme> theme={onadTheme}>
          <Route exact path="/" component={Door} />
          <Route exact path="/marketer" component={Main} />
          <Route exact path="/creator" component={Main} />
          <Route path="/creator/remote/:id" component={RemotePage} />
          <Route exact path="/creator/signup" component={RegistCreator} />
          <Route exact path="/creator/signup/complete" component={RegistCreator} />
          <Route exact path="/creator/signup/pre-user" component={RegistCreator} />
          <Route exact path="/creatorlist" component={CreatorList} />
          <Route path="/regist/:platform" component={RegistPage} />
          <Route exact path="/regist" component={RegistPage} />
          <Route exact path="/introduce/:userType" component={Introduction} />
          <Route exact path="/policy" component={Policy} />
          <Route exact path="/policy/:privacy" component={Policy} />
          <Route path="/mypage/creator" component={CreatorDashboard} />
          <Route path="/mypage/marketer" component={MarketerDashboard} />
          <Route exact path="/marketer/charge" component={ChargeDialog} />
        </ThemeProvider>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<OnadIndex />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
