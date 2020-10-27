import makeStyles from '@material-ui/core/styles/makeStyles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { OnadTheme } from '../../../../theme';

const useStyles = makeStyles((theme: OnadTheme) => ({
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderRadius: '50%'
  },
  dialog: {
    textAlign: 'center',
    padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`,
  },
  dialogTitle: { fontWeight: 700 },
  socialLoginButton: {
    borderRadius: '0px',
    width: '100%',
    height: 60,
    margin: `${theme.spacing(1)}px 0px`,
    boxShadow: 'none'
  },
  twitch: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.twitch, 0.07),
    }
  },
  afreeca: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.afreeca,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.afreeca, 0.07),
    }
  },
  socialLogo: {
    width: 35,
    height: 35,
    position: 'absolute',
    left: theme.spacing(2),
  }
}));

export default useStyles;
