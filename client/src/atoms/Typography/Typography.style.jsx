const typographyStyle = (theme) => ({
  defaultFontStyle: {
    fontSize: '14px',
  },
  defaultHeaderMargins: {
    marginTop: '20px',
    marginBottom: '10px',
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
});

export default typographyStyle;
