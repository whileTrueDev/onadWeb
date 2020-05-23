import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import {
  blue, yellow, grey,
  red, cyan, blueGrey
} from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

const defaultTheme = createMuiTheme();

const rawTheme = {
  palette: {
    primary: {
      light: lighten(cyan[400], 0.07),
      main: cyan[600],
      dark: darken(cyan[700], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText(cyan[700]),
    },
    secondary: defaultTheme.palette.warning,
    info: {
      light: lighten(blueGrey[400], 0.07),
      main: blueGrey[700],
      dark: darken(blueGrey[800], 0.07),
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText(blueGrey[700]),
    },
    warning: defaultTheme.palette.secondary,
  },
  typography: {
    fontFamily: '"NotoSansKR-Regular", "Sunflower", sans-serif'
  }
};

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
  mainBlue: blue[600],
  black: grey[900],
  mainYellow: yellow[700],
  red: red[500],
  cyan: cyan[500],
  subYellow: yellow[500],
  Mainfont: 'Noto Sans KR',
  ...rawTheme
};

export default { lightTheme, darkTheme, MainPageTheme };
