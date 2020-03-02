import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { cyan } from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

const defaultMuiTheme = createMuiTheme();
const rawTheme = createMuiTheme({
  palette: {
    primary: {
      light: lighten(cyan[600], 0.07),
      main: cyan[600],
      dark: darken(cyan[600], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultMuiTheme.palette.getContrastText(cyan[700]),
    },
    secondary: defaultMuiTheme.palette.warning,
    info: defaultMuiTheme.palette.primary,
    warning: defaultMuiTheme.palette.secondary,
  },
  // typography: {
  //   fontFamily: [
  //     'Roboto',
  //     '"Helvetica Neue"',
  //     '-apple-system',
  //     'BlinkMacSystemFont',
  //     '"Segoe UI"',
  //     'Arial',
  //     'sans-serif',
  //     '"Apple Color Emoji"',
  //     '"Segoe UI Emoji"',
  //     '"Segoe UI Symbol"',
  //   ].join(','),
  // }
});

const theme = responsiveFontSizes(rawTheme);

export default theme;
