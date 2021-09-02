import { makeStyles, Theme } from '@material-ui/core/styles';

const useTypographyStyles = makeStyles((theme: Theme) => ({
  defaultFontStyle: {
    fontSize: '14px',
  },
  primaryText: {
    color: theme.palette.primary.main,
  },
  infoText: {
    color: theme.palette.info.main,
  },
  successText: {
    color: theme.palette.success.main,
  },
  warningText: {
    color: theme.palette.warning.main,
  },
  dangerText: {
    color: theme.palette.error.main,
  },
}));

export default useTypographyStyles;
