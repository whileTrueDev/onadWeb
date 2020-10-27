import React from 'react';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme, { OnadTheme } from '../../theme';

function withRoot(Component: any): React.ComponentType {
  function root(props: any): JSX.Element {
    return (
      <ThemeProvider<OnadTheme> theme={theme.lightTheme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }
  return root;
}

export default withRoot;
