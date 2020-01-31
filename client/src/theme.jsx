import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { orange, cyan } from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

const defaultTheme = createMuiTheme();

const rawTheme = createMuiTheme({
  palette: {
    primary: {
      light: lighten(cyan[600], 0.07),
      main: cyan[600],
      dark: darken(cyan[600], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText(cyan[700]),
    },
    secondary: {
      light: lighten(orange[600], 0.07),
      main: orange[600],
      dark: darken(orange[600], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText(orange[700]),
    },
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
