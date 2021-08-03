import { useEffect } from 'react';
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
import queryClient from '../utils/queryClient';
import theme, { OnadTheme } from '../theme';
import HeadCompo from '../components/layout/head';

function OnadNextApp({ Component, pageProps }: AppProps): JSX.Element {
  const THEME = responsiveFontSizes(
    createTheme({
      ...theme.rawTheme,
      palette: { ...theme.rawTheme.palette, type: 'light' },
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

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

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
            <Component {...pageProps} />
            {/* 빌드시 자동으로 제거됨 */}
            <ReactQueryDevtools />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
export default OnadNextApp;
