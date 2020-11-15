import { makeStyles, Theme } from '@material-ui/core/styles';

const useFooterStyle = makeStyles((theme: Theme) => ({
  block: {
    color: 'inherit',
    padding: '10px',
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
    display: 'block'
  },
  right: {
    padding: '10px 0',
    margin: '0',
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
}));
export default useFooterStyle;
