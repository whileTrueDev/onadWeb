import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  createTheme,
  MuiThemeProvider as ThemeProvider,
  responsiveFontSizes,
} from '@material-ui/core/styles';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SnackbarProvider } from 'notistack';
import Router from 'next/router';
import queryClient from '../utils/queryClient';
import theme, { OnadTheme } from '../theme';
import HeadCompo from '../components/mainpage/layout/head';
import PageChange from '../components/shared/pageChange';

// page transition start
Router.events.on('routeChangeStart', () => {
  document.body.classList.add('body-page-transition');
  ReactDOM.render(<PageChange />, document.getElementById('page-transition'));
});
Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition') as HTMLElement);
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition') as HTMLElement);
  document.body.classList.remove('body-page-transition');
});
// page transition end

enum THEME_TYPE {
  DARK = 'dark',
  LIGHT = 'light',
}

function OnadNextApp({ Component, pageProps }: AppProps): JSX.Element {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const [themeType, setTheme] = useState<THEME_TYPE>(THEME_TYPE.LIGHT);

  useEffect(() => {
    const currentTheme = localStorage.getItem('themeType') as THEME_TYPE;
    setTheme(currentTheme);
  }, [themeType]);

  const THEME = responsiveFontSizes(
    createTheme({
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
    ...THEME,
    palette: {
      ...THEME.palette,
      platform: { ...theme.platformOverrides },
    },
  };

  const layoutComponent = Component as any;
  const Layout = layoutComponent.layout || (({ children }: Element) => <>{children}</>);

  return (
    <>
      <HeadCompo />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider<OnadTheme> theme={onadTheme}>
          <SnackbarProvider
            maxSnack={2}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            preventDuplicate
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
            {/* 빌드시 자동으로 제거됨 */}
            <ReactQueryDevtools />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
export default OnadNextApp;
