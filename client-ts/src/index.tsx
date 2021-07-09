// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import { SnackbarProvider } from 'notistack';
import {
  createMuiTheme,
  MuiThemeProvider as ThemeProvider,
  responsiveFontSizes,
} from '@material-ui/core/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import dotenv from 'dotenv';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import ChargeDialog from './organisms/mypage/marketer/office/charge/ChargeDialog';
import CreatorList from './pages/main/CreatorList';
// Pages
import Door from './pages/main/Door';
import Introduction from './pages/main/Introduction';
import Main from './pages/main/Main';
import RegistPage from './pages/main/Regist';
import RegistCreator from './pages/main/RegistCreator';
// import NotFound from './pages/others/NotFound';
import RemotePage from './pages/mypage/creator/RemotePage';
import LoadingPage from './pages/others/LoadingPage';
import queryClient from './queryClient';
import reportWebVitals from './reportWebVitals';
import theme, { OnadTheme } from './theme';
import useOnadThemeType from './utils/hooks/useOnadThemeType';

dotenv.config();
dayjs.locale('ko'); // 글로벌로 ko locale사용

// code spliting
const CreatorDashboard = lazy(() => import('./pages/mypage/layouts/CreatorLayout'));
const MarketerDashboard = lazy(() => import('./pages/mypage/layouts/MarketerLayout'));
const Policy = lazy(() => import('./pages/main/Policy'));

const OnadIndex = (): JSX.Element => {
  // *******************************************
  // Theme Configurations
  const { themeType, handleThemeChange } = useOnadThemeType();

  const THEME = responsiveFontSizes(
    createMuiTheme({
      ...theme.rawTheme,
      palette: { ...theme.rawTheme.palette, type: themeType },
      props: {
        MuiTablePagination: {
          labelRowsPerPage: '페이지당 행',
        },
      },
    }),
  );
  const onadTheme: OnadTheme = {
    handleThemeChange,
    ...THEME,
    palette: {
      ...THEME.palette,
      platform: { ...theme.platformOverrides },
    },
  };

  return (
    <Router history={history}>
      <Switch>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider<OnadTheme> theme={onadTheme}>
            <SnackbarProvider
              maxSnack={2}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              preventDuplicate
            >
              <Route exact path="/test" component={LoadingPage} />
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
              <Suspense fallback={<LoadingPage />}>
                <Route exact path="/policy" component={Policy} />
                <Route exact path="/policy/:privacy" component={Policy} />
                <Route path="/mypage/creator" component={CreatorDashboard} />
                <Route path="/mypage/marketer" component={MarketerDashboard} />
              </Suspense>
              <Route exact path="/marketer/charge" component={ChargeDialog} />

              {/* ---- 배포시 제거필요 ----  */}
              <ReactQueryDevtools />
              {/* ---- 배포시 제거필요 ----  */}
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<OnadIndex />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
