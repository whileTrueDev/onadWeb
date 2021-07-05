import makeStyles from '@material-ui/core/styles/makeStyles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { OnadTheme } from '../../theme';

const useStyles = makeStyles((theme: OnadTheme) => ({
  form: { margin: theme.spacing(1, 0) },
  dialog: {
    textAlign: 'center',
    padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`,
  },
  buttonLoading: {
    backgroundColor: theme.palette.action.disabledBackground,
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: { margin: theme.spacing(1, 0, 2) },
  loginButton: {
    borderRadius: '0px',
    height: 60,
    margin: theme.spacing(0.5, 0, 0.5),
    boxShadow: theme.shadows[0],
    border: `1px solid ${theme.palette.divider}`,
  },
  socialLoginButton: {
    height: 40,
  },
  twitch: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.twitch, 0.07),
    },
  },
  afreeca: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.afreeca,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.afreeca, 0.07),
    },
  },
  kakao: {
    color: theme.palette.getContrastText(theme.palette.platform.kakao),
    backgroundColor: theme.palette.platform.kakao,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.kakao, 0.07),
    },
  },
  naver: {
    color: theme.palette.getContrastText(theme.palette.platform.naver),
    backgroundColor: theme.palette.platform.naver,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.naver, 0.07),
    },
  },
  google: {
    color: theme.palette.getContrastText(theme.palette.common.white),
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: darken(theme.palette.common.white, 0.07),
    },
  },
  socialLogo: {
    width: 35,
    height: 35,
    position: 'absolute',
    left: theme.spacing(2),
  },
}));

export default useStyles;
