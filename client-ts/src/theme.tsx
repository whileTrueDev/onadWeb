import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import {
  blue, yellow, grey,
  red, cyan, blueGrey
} from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

const defaultMuiTheme = createMuiTheme();
const rawTheme = createMuiTheme({
  palette: {
    primary: {
      light: lighten(cyan[400], 0.07),
      main: cyan[600],
      dark: darken(cyan[800], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultMuiTheme.palette.getContrastText(cyan[700]),
    },
    secondary: defaultMuiTheme.palette.warning,
    info: {
      light: lighten(blueGrey[400], 0.07),
      main: blueGrey[700],
      dark: darken(blueGrey[800], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultMuiTheme.palette.getContrastText(blueGrey[700]),
    },
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

const lightTheme = responsiveFontSizes(createMuiTheme({
  ...rawTheme,
  palette: {
    type: 'light',
    ...rawTheme.palette
  }
}));
const darkTheme = responsiveFontSizes(createMuiTheme({
  ...rawTheme,
  palette: {
    type: 'dark',
    ...rawTheme.palette
  }
}));

const MainPageTheme = {
  white: '#fff',
  mainblue: blue[600],
  black: grey[900],
  mainyellow: yellow[700],
  red: red[500],
  cyan: cyan[500],
  subyellow: yellow[500],
  Mainfont: 'Noto Sans KR',
  ...defaultMuiTheme
};

export default { lightTheme, darkTheme, MainPageTheme };
