import {useEffect} from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import theme, {OnadTheme} from '../theme';
import {
  createMuiTheme,
  MuiThemeProvider as ThemeProvider,
  responsiveFontSizes,
} from '@material-ui/core/styles';
import HeadCompo from '../components/layout/head';

function OnadNextApp({ Component, pageProps }: AppProps) {

  const THEME = responsiveFontSizes(
    createMuiTheme({
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
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <HeadCompo />
      <ThemeProvider<OnadTheme> theme={onadTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default OnadNextApp
