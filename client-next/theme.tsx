import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { Palette } from '@material-ui/core/styles/createPalette';

export interface OnadPalette extends Palette {
  platform: {
    afreeca: string;
    twitch: string;
    youtube: string;
    naver: string;
    kakao: string;
    afreecaContrastText: string;
    twitchContrastText: string;
    youtubeContrastText: string;
    naverContrastText: string;
    kakaoContrastText: string;
  };
}
export interface OnadTheme extends Theme {
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
      dark: '#d3844c',
      main: '#ffc277',
      light: '#ffda9b',
      contrastText: defaultTheme.palette.getContrastText('#ffc277'),
    },
    info: {
      light: lighten(blueGrey[400], 0.07),
      main: blueGrey[700],
      dark: darken(blueGrey[800], 0.07),
      // contrastText: will be calculated to contrast with palette.info.main
      contrastText: defaultTheme.palette.getContrastText(blueGrey[700]),
    },
    error: {
      dark: '#c55024',
      main: '#f67157',
      light: '#ff9a79',
      contrastText: defaultTheme.palette.getContrastText('#f67157'),
    },
    success: {
      dark: '#36935a',
      main: '#5dc39a',
      light: '#8ee1ce',
      contrastText: defaultTheme.palette.getContrastText('#5dc39a'),
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
  afreecaContrastText: defaultTheme.palette.getContrastText('#2e6afd'),
  twitch: '#9147ff',
  twitchContrastText: defaultTheme.palette.getContrastText('#9147ff'),
  youtube: '#CC0000',
  youtubeContrastText: defaultTheme.palette.getContrastText('#CC0000'),
  naver: '#1EC800',
  naverContrastText: defaultTheme.palette.getContrastText('#1EC800'),
  kakao: '#ffe812',
  kakaoContrastText: defaultTheme.palette.getContrastText('#ffe812'),
};

export default { rawTheme, platformOverrides };
