import { hexToRgb } from '../../assets/jss/onad';

const snackbarContentStyle = (theme) => ({
  root: {
    flexWrap: 'unset',
    position: 'relative',
    padding: '20px 15px',
    lineHeight: '20px',
    marginBottom: '20px',
    fontSize: '14px',
    backgroundColor: theme.palette.common.white,
    color: theme.palette.grey[300],
    borderRadius: '3px',
    minWidth: 'unset',
    maxWidth: 'unset',
    boxShadow:
      `0 12px 20px -10px rgba(${
        hexToRgb(theme.palette.common.white)
      }, 0.28), 0 4px 20px 0px rgba(${
        hexToRgb(theme.palette.common.black)
      }, 0.12), 0 7px 8px -5px rgba(${
        hexToRgb(theme.palette.common.white)
      }, 0.2)`,
  },
  top20: {
    top: '20px',
  },
  top40: {
    top: '40px',
  },
  info: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.common.white,
  },
  danger: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  message: {
    padding: '0',
    display: 'block',
    maxWidth: '100%',
  },
  close: {
    width: '11px',
    height: '11px',
  },
  iconButton: {
    width: '24px',
    height: '24px',
    padding: '0px',
  },
  icon: {
    display: 'block',
    left: '15px',
    position: 'absolute',
    top: '50%',
    marginTop: '-15px',
    width: '30px',
    height: '30px',
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
  successIcon: {
    color: theme.palette.success.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  dangerIcon: {
    color: theme.palette.error.main,
  },
  primaryIcon: {
    color: theme.palette.primary.main,
  },
  iconMessage: {
    paddingLeft: '50px',
    display: 'block',
  },
});

export default snackbarContentStyle;
