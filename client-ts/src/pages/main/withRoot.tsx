import React from 'react';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';

function withRoot(Component: any): React.ComponentType {
  function root(props: any): JSX.Element {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }
  return root;
}

export default withRoot;
