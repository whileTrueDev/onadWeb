import { createMuiTheme, Theme } from '@material-ui/core/styles';
import {
  blueGrey
} from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { Palette } from '@material-ui/core/styles/createPalette';

export interface OnadPalette extends Palette {
  platform: {
    afreeca: string;
    twitch: string;
    youtube: string;
    naver: string;
    kakao: string;
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
      light: '#528dff',
      main: '#2771ff',
      dark: '#174DFC',
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: defaultTheme.palette.getContrastText('#2771ff'),
    },
    secondary: {
      dark: '#B5A2FC',
      main: '#866DCA',
      light: '#533E92',
      contrastText: defaultTheme.palette.getContrastText('#866DCA'),
    },
    info: {
      light: lighten(blueGrey[400], 0.07),
      main: blueGrey[700],
      dark: darken(blueGrey[800], 0.07),
      // contrastText: will be calculated to contrast with palette.info.main
      contrastText: defaultTheme.palette.getContrastText(blueGrey[700]),
    },
    warning: defaultTheme.palette.secondary,
    error: {
      dark: '#B75736',
      main: '#FF7C62',
      light: '#FFBAA5',
      contrastText: defaultTheme.palette.getContrastText('#FF7C62'),
    },
    success: {
      dark: '#48A69E',
      main: '#8BE6E2',
      light: '#BCF0EF',
      contrastText: defaultTheme.palette.getContrastText('#8BE6E2'),
    },
  },
  typography: {
    fontFamily: '"AppleSDGothicNeo", "Roboto", "NotoSansKR-Regular", sans-serif',
    htmlFontSize: 16,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
};

const platformOverrides = {
  afreeca: '#2e6afd',
  twitch: '#9147ff',
  youtube: '#CC0000',
  naver: '#1EC800',
  kakao: '#ffe812',
};


export default { rawTheme, platformOverrides };
