import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';

const rawTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: '#70ddf4',
      main: '#26c6da',
      dark: '#00acc1',
    },
    secondary: {
      light: '#9c27b0',
      main: '#ab47bc',
      dark: '#8e24aa',
    },
    blueGrey: {
      light: blueGrey[300],
      mian: blueGrey[700],
      dark: blueGrey[900],
    },
    warning: {
      main: '#ff9800',
      dark: '#ffa726',
    },
    error: {
      xLight: '#f44336',
      main: '#ef5350',
      dark: '#e53935',
    },
    success: {
      xLight: green[50],
      dark: green[700],
    },
    grey: {
      light: grey[200],
      main: grey[400],
      dark: grey[700],
    },
    card: '#FFFFFF'
  },
  typography: {
    fontFamily: '"NotoSansKR-Regular", "Sunflower", sans-serif',
  },
});

const darkRawTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#70ddf4',
      main: '#26c6da',
      dark: '#00acc1',
    },
    secondary: {
      light: '#9c27b0',
      main: '#ab47bc',
      dark: '#8e24aa',
    },
    blueGrey: {
      light: blueGrey[300],
      mian: blueGrey[700],
      dark: blueGrey[900],
    },
    warning: {
      main: '#ff9800',
      dark: '#ffa726',
    },
    error: {
      xLight: '#f44336',
      main: '#ef5350',
      dark: '#e53935',
    },
    success: {
      xLight: green[50],
      dark: green[700],
    },
    grey: {
      light: grey[200],
      main: grey[400],
      dark: grey[700],
    },
    card: '#585858'
  },
  typography: {
    fontFamily: '"NotoSansKR-Regular", "Sunflower", sans-serif',
  },
});

const fontHeader = {
  fontWeight: rawTheme.typography.fontWeightLight,
  fontFamily: rawTheme.typography.fontFamilySecondary,
  textTransform: 'uppercase',
};


const lightTheme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: rawTheme.palette.background,
      paper: '#F7F7F7'
    },
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 60,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 48,
      },
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 48,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 40,
      },
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: 42,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 34,
      },
    },
    h4: {
      ...rawTheme.typography.h4,
      ...fontHeader,
      fontSize: 36,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 28,
      },
    },
    h5: {
      ...rawTheme.typography.h5,
      ...fontHeader,
      textTransform: 'initial',
      fontSize: 26,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 18,
      },
    },
    h6: {
      ...rawTheme.typography.h6,
      ...fontHeader,
      textTransform: 'initial',
      fontSize: 18,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 13,
      },
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontSize: 18,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 16,
      },
    },
    body1: {
      ...rawTheme.typography.body2,
      fontWeight: rawTheme.typography.fontWeightRegular,
      fontSize: 16,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 14,
      },
    },
    body2: {
      ...rawTheme.typography.body1,
      fontSize: 14,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
  },
};

const darkTheme = {
  ...darkRawTheme,
  palette: {
    ...darkRawTheme.palette,
    background: {
      ...darkRawTheme.palette.background,
      default: darkRawTheme.palette.background,
    },
  },
  typography: {
    ...darkRawTheme.typography,
    fontHeader,
    h1: {
      ...darkRawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 60,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 48,
      },
    },
    h2: {
      ...darkRawTheme.typography.h2,
      ...fontHeader,
      fontSize: 48,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 40,
      },
    },
    h3: {
      ...darkRawTheme.typography.h3,
      ...fontHeader,
      fontSize: 42,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 34,
      },
    },
    h4: {
      ...darkRawTheme.typography.h4,
      ...fontHeader,
      fontSize: 36,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 28,
      },
    },
    h5: {
      ...darkRawTheme.typography.h5,
      ...fontHeader,
      fontSize: 26,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 18,
      },
    },
    h6: {
      ...darkRawTheme.typography.h6,
      ...fontHeader,
      fontSize: 18,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 13,
      },
    },
    subtitle1: {
      ...darkRawTheme.typography.subtitle1,
      fontSize: 18,
      [rawTheme.breakpoints.down('xs')]: {
        fontSize: 16,
      },
    },
    body1: {
      ...darkRawTheme.typography.body2,
      fontWeight: darkRawTheme.typography.fontWeightRegular,
      fontSize: 16,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 14,
      },
    },
    body2: {
      ...darkRawTheme.typography.body1,
      fontSize: 14,
      [darkRawTheme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
  },
};


export { lightTheme, darkTheme };
