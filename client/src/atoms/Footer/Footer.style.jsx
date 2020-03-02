import { container } from '../../assets/jss/onad';

const footerStyle = (theme) => ({
  block: {
    color: 'inherit',
    padding: '15px',
    textTransform: 'uppercase',
    borderRadius: '3px',
    textDecoration: 'none',
    position: 'relative',
    display: 'block',
    fontWeight: '500',
    fontSize: '12px',
  },
  left: {
    float: 'left!important',
    display: 'block',
  },
  right: {
    padding: '15px 0',
    margin: '0',
    fontSize: '14px',
    float: 'right!important',
  },
  footer: {
    bottom: '0',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    padding: '15px 0',
  },
  container,
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
