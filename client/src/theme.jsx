import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { cyan, blueGrey } from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

const defaultTheme = createMuiTheme();

const rawTheme = createMuiTheme({
  palette: {
    primary: {
      light: lighten(cyan[400], 0.07),
      main: cyan[600],
      dark: darken(cyan[700], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText(cyan[700]),
    },
    secondary: defaultTheme.palette.warning,
    info: defaultTheme.palette.primary,
    warning: defaultTheme.palette.secondary,
    bluegrey: {
      light: lighten(blueGrey[400], 0.07),
      main: blueGrey[600],
      dark: darken(blueGrey[800], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText(blueGrey[700]),
    }
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
