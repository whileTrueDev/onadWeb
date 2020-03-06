
const footerStyle = (theme) => ({
  left: {
    float: 'left',
    display: 'block',
  },
  right: {
    padding: '15px 0',
    margin: '0',
    fontSize: '14px',
    float: 'right',
  },
  footer: {
    bottom: '0',
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: '15px 0',
  },
  container: {
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  a: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    backgroundColor: 'transparent',
  },
  list: {
    marginBottom: '0',
    padding: '0',
    marginTop: '0',
  },
  inlineBlock: {
    display: 'inline-block',
    padding: '0px',
    width: 'auto',
  },
});
export default footerStyle;
