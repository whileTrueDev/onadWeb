import { createMuiTheme, Theme } from '@material-ui/core/styles';
import {
  blue, yellow, grey,
  red, cyan, blueGrey
} from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { Palette } from '@material-ui/core/styles/createPalette';

export interface OnadPalette extends Palette {
  platform: {
    afreeca: string;
    twitch: string;
    youtube: string;
  };
}
export interface OnadTheme extends Theme {
  handleThemeChange: () => void;
  palette: OnadPalette;
}

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

const platformOverrides = {
  afreeca: '#2e6afd',
  twitch: '#9147ff',
  youtube: '#CC0000',
};


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

export default { rawTheme, MainPageTheme, platformOverrides };
