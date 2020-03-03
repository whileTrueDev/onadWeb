import { makeStyles, Theme } from '@material-ui/core/styles';

const useFooterStyle = makeStyles((theme: Theme) => ({
  block: {
    color: 'inherit',
    padding: '15px',
    textTransform: 'uppercase',
    borderRadius: '3px',
    textDecoration: 'none',
    position: 'relative',
    display: 'block',
    fontWeight: 500,
    fontSize: '12px',
  },
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
    borderTop: `1px solid ${theme.palette.grey[300]}`,
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
    display: 'inlineBlock',
    padding: '0px',
    width: 'auto',
  },
}));
export default useFooterStyle;
